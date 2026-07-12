import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@/utils/supabase/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get the latest message from the user
  const latestMessage = messages[messages.length - 1];

  // Save user message to database
  if (sessionId) {
    await supabase.from('ai_chat_messages').insert({
      session_id: sessionId,
      role: latestMessage.role,
      content: latestMessage.content
    });
  }

  // Call the language model
  const result = streamText({
    model: google('gemini-1.5-pro'),
    system: "You are an expert AI Study Tutor designed for an educational platform in Nepal. You help students understand complex topics, generate examples, create MCQs, flashcards, and study planners. You can explain topics in both English and Nepali. Be encouraging, precise, and educational. Format your responses with clear Markdown.",
    messages,
    onFinish: async ({ text }) => {
      // Save AI response to database
      if (sessionId) {
        await supabase.from('ai_chat_messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: text
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
