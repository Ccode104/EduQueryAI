import { HfInference } from '@huggingface/inference';

let hf: HfInference | null = null;

export function initializeHuggingFace(apiKey?: string) {
  if (apiKey) {
    hf = new HfInference(apiKey);
  }
}

export async function generateAIResponse(
  query: string,
  context: string[],
  model: string = 'mistralai/Mistral-7B-Instruct-v0.2'
): Promise<string> {
  if (!hf) {
    // Fallback response if API key not configured
    return generateFallbackResponse(query, context);
  }

  try {
    const contextText = context.join('\n\n');
    const prompt = `Context from course materials:
${contextText}

Student Question: ${query}

Based on the context provided above, please answer the student's question clearly and concisely. If the context doesn't contain relevant information, say so.

Answer:`;

    const response = await hf.textGeneration({
      model,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error('HuggingFace API error:', error);
    return generateFallbackResponse(query, context);
  }
}

function generateFallbackResponse(query: string, context: string[]): string {
  // Simple fallback that uses the context
  if (context.length === 0) {
    return "I don't have enough information in the uploaded course materials to answer this question. Please upload relevant documents first.";
  }

  // Return a helpful message with context snippets
  const relevantSnippets = context.slice(0, 2).map((c, i) => `${i + 1}. ${c.substring(0, 200)}...`).join('\n\n');
  
  return `Based on your course materials, here are the most relevant sections I found:

${relevantSnippets}

Note: For more accurate AI-generated responses, please configure the Hugging Face API key in your environment variables (HF_API_KEY).`;
}
