import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { createConversation, createMessage, getConversation, StrapiError } from "@/lib/strapi";

const MODEL_ID = "gemini-2.5-flash";
const TITLE_MAX_LENGTH = 60;

const SYSTEM_PROMPTS = {
  chat: `
You are a helpful, concise AI assistant.
Reply in plain markdown.
`,
  code: `
You are an expert software engineer and pair programmer.

Help with:
- Code
- Debugging
- Architecture
- Tooling

Prefer modern best practices.
Use fenced code blocks for code.
Reply in markdown.
`,
} as const;

type ChatMode = keyof typeof SYSTEM_PROMPTS;
type ChatRequestBody = {
  messages: UIMessage[];
  conversationId?: string;
  mode?: ChatMode;
};

function getMessageText(message: UIMessage | undefined): string {
  if (!message) return "";
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => "text" in part ? part.text : "")
    .join("")
    .trim();
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const jwt = await getAuthToken();
  const user = await getCurrentUser();

  if (!jwt || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lastMessage = body.messages.at(-1);
  if (!lastMessage) {
    return Response.json({ error: "No messages supplied." }, { status: 400 });
  }
  if (lastMessage.role !== "user") {
    return Response.json({ error: "The last message must be from the user." }, { status: 400 });
  }

  const userText = getMessageText(lastMessage);
  if (!userText) {
    return Response.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  let conversationDocumentId = body.conversationId;

  try {
    if (conversationDocumentId) {
      await getConversation(jwt, conversationDocumentId);
    } else {
      const title = userText.length > TITLE_MAX_LENGTH ? `${userText.slice(0, TITLE_MAX_LENGTH)}...` : userText;
      const conversation = await createConversation(jwt, { title: title || "Untitled" });
      conversationDocumentId = conversation.documentId;
    }

    await createMessage(jwt, {
      content: userText,
      role: "user",
      conversationDocumentId: conversationDocumentId!,
    });

    const result = streamText({
      model: google(MODEL_ID),
      system: SYSTEM_PROMPTS[body.mode ?? "chat"],
      messages: await convertToModelMessages(body.messages),
      async onFinish({ text }) {
        try {
          await createMessage(jwt, {
            content: text,
            role: "assistant",
            conversationDocumentId: conversationDocumentId!,
          });
        } catch (error) {
          console.error("Failed to save assistant message", error);
        }
      },
    });

    return result.toUIMessageStreamResponse({
      messageMetadata:()=>({
        conversationId: conversationDocumentId!
      })
    });
  } catch (error) {
    console.error("Chat route error:", error);
    if (error instanceof StrapiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}