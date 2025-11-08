import { HfInference } from '@huggingface/inference';

let hf: HfInference | null = null;

export function initializeHuggingFace(apiKey?: string) {
  if (apiKey) {
    hf = new HfInference(apiKey);
  }
}

const MAX_CONTEXT_TOKENS = 2000; // Approx 1500 words to stay under token limits

export async function generateAIResponse(
  query: string,
  context: string[],
  model: string = 'microsoft/Phi-3-mini-4k-instruct'
): Promise<string> {
  if (!hf) {
    // Fallback response if API key not configured
    return generateFallbackResponse(query, context);
  }

  try {
    // Budget tokens: limit context length to prevent expensive prompts
    let contextText = context.join('\n\n');
    const approxTokens = contextText.split(/\s+/).length * 1.3; // Rough estimate
    
    if (approxTokens > MAX_CONTEXT_TOKENS) {
      // Truncate context to fit within budget
      const words = contextText.split(/\s+/);
      const targetWords = Math.floor(MAX_CONTEXT_TOKENS / 1.3);
      contextText = words.slice(0, targetWords).join(' ') + '...';
    }

    const prompt = `<|system|>
You are a helpful AI tutor assistant for BTech students. Answer questions based on the provided course materials.<|end|>
<|user|>
Context from course materials:
${contextText}

Question: ${query}<|end|>
<|assistant|>`;

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
