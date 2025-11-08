import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import * as pdfParse from "pdf-parse";
import { createWorker } from "tesseract.js";
import { chunkText, generateSimpleEmbedding } from "./utils/textProcessing";
import { generateAIResponse, initializeHuggingFace } from "./utils/aiService";
import { z } from "zod";
import { insertDocumentSchema, insertConversationSchema, insertMessageSchema } from "@shared/schema";

// Initialize Hugging Face with API key if available
const HF_API_KEY = process.env.HF_API_KEY;
if (HF_API_KEY) {
  initializeHuggingFace(HF_API_KEY);
}

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const { course } = req.query;
      const documents = course 
        ? await storage.getDocumentsByCourse(course as string)
        : await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { course, type } = req.body;
      
      if (!course || !type) {
        return res.status(400).json({ error: "Course and type are required" });
      }

      // Create document record
      const document = await storage.createDocument({
        name: req.file.originalname,
        type,
        course,
        fileSize: req.file.size,
        processingStatus: "processing",
        extractedText: null,
      });

      // Process PDF in background
      processPDF(document.id, req.file.buffer, type).catch(console.error);

      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDocument(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Conversation routes
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Message routes
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { content, course } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      // Store user message
      const userMessage = await storage.createMessage({
        conversationId: id,
        role: "user",
        content,
        sources: null,
      });

      // Generate embedding for the query
      const queryEmbedding = generateSimpleEmbedding(content);

      // Search for relevant chunks
      const relevantChunks = await storage.searchSimilarChunks(
        queryEmbedding,
        5,
        course
      );

      // Get source document names
      const sourceDocIds = Array.from(new Set(relevantChunks.map(c => c.documentId)));
      const sourceNames: string[] = [];
      
      for (const docId of sourceDocIds) {
        const doc = await storage.getDocument(docId);
        if (doc) {
          sourceNames.push(doc.name);
        }
      }

      // Generate AI response
      const contextTexts = relevantChunks.map(chunk => chunk.text);
      const aiResponseText = await generateAIResponse(content, contextTexts);

      // Store AI message
      const aiMessage = await storage.createMessage({
        conversationId: id,
        role: "assistant",
        content: aiResponseText,
        sources: sourceNames.length > 0 ? sourceNames : null,
      });

      res.json({
        userMessage,
        aiMessage,
      });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Get processing status
  app.get("/api/documents/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      res.json({
        status: document.processingStatus,
        hasText: !!document.extractedText,
      });
    } catch (error) {
      console.error("Error fetching document status:", error);
      res.status(500).json({ error: "Failed to fetch status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function processPDF(documentId: string, buffer: Buffer, type: string) {
  try {
    let extractedText = "";

    if (type === "book") {
      // For digital books, try direct text extraction first
      try {
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } catch (error) {
        console.log("Direct PDF extraction failed, falling back to OCR");
      }
    }

    // If no text extracted or it's notes/pyq, use OCR
    if (!extractedText || type === "notes" || type === "pyq") {
      extractedText = await extractTextWithOCR(buffer);
    }

    // Update document with extracted text
    await storage.updateDocument(documentId, {
      extractedText,
      processingStatus: "completed",
    });

    // Chunk the text and create embeddings
    if (extractedText) {
      const chunks = chunkText(extractedText, 500, 50);
      
      for (const chunkText of chunks) {
        const embedding = generateSimpleEmbedding(chunkText);
        await storage.storeDocumentChunk({
          documentId,
          text: chunkText,
          embedding,
        });
      }
    }
  } catch (error) {
    console.error("Error processing PDF:", error);
    await storage.updateDocument(documentId, {
      processingStatus: "failed",
    });
  }
}

async function extractTextWithOCR(buffer: Buffer): Promise<string> {
  const worker = await createWorker('eng');
  
  try {
    // For simplicity, we'll just extract text from the first page
    // In production, you'd convert each PDF page to an image and process them all
    const { data: { text } } = await worker.recognize(buffer);
    return text;
  } finally {
    await worker.terminate();
  }
}
