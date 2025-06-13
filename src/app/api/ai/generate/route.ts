// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/generate
 * -------------------------------------------------------
 * Body: { 
 *   currentMarkdown?: string; 
 *   replaceMode?: boolean;
 *   userPrompt?: string;
 * }
 * -------------------------------------------------------
 * - If replaceMode === true and currentMarkdown exists,
 *   the model will revise / expand the given markdown.
 * - userPrompt can provide specific instructions for improvement.
 * - Otherwise it will create a brand-new markdown document.
 * - Returns streaming response for real-time content generation.
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      currentMarkdown = '', 
      replaceMode = false,
      userPrompt = ''
    } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in the environment.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-05-20',
    });

    /* ------------------------- Prompt Construction ------------------------ */
    const prompt = replaceMode && currentMarkdown.trim()
      ? `You are a skilled technical writer.

Revise AND expand the following Markdown while preserving its original structure. 
– Make the content clearer, richer, and more actionable.  
– Do NOT add greetings, meta-comments, or redundant Markdown fences.  
– Return ONLY the improved Markdown.

${userPrompt.trim() ? `Additional instructions: ${userPrompt}\n` : ''}
${currentMarkdown}`
      : `${userPrompt.trim() ? `Create a concise Markdown document about: ${userPrompt}` : 'Create a well-structured Markdown document'}

Keep it brief and focused. Use appropriate headings, lists, and formatting. Aim for 200-500 words maximum unless user prompt is provided. Return only clean Markdown content.`;

    /* -------------------------- Streaming Response -------------------------- */
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await model.generateContentStream(prompt);
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              const data = `data: ${JSON.stringify({ content: chunkText })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          
          // Send completion signal
          const endData = `data: ${JSON.stringify({ done: true })}\n\n`;
          controller.enqueue(encoder.encode(endData));
          controller.close();
        } catch (error) {
          console.error('Error during streaming generation:', error);
          const errorData = `data: ${JSON.stringify({ 
            error: 'An error occurred while generating content with Gemini.' 
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error during AI generation:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating content with Gemini.' },
      { status: 500 }
    );
  }
}