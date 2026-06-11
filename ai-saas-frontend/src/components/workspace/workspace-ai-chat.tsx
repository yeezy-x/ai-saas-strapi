"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

export type WorkspaceChatMode = "chat" | "code";

type ChatMessageMetadata = {
  conversationId?: string;
};

type WorkspaceAiChatProps = {
  title: string;
  badge: string;
  mode: WorkspaceChatMode;
  emptyState: {
    icon: ReactNode;
    title: string;
    description: string;
  };
  placeholder: string;
};

export default function WorkspaceAiChat({
  title,
  badge,
  mode,
  emptyState,
  placeholder,
}: WorkspaceAiChatProps) {
  const [input, setInput] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("c");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            conversationId: conversationId ?? undefined,
            mode,
          },
        }),
      }),
    [mode, conversationId]
  );

  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onFinish: ({ message }) => {
      const metadata = message.metadata as ChatMessageMetadata;

      if (metadata?.conversationId && !conversationId) {
        router.replace(`/dashboard/chat?c=${metadata.conversationId}`);
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text) return;

    sendMessage({ text });
    setInput("");
  };

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="mx-auto flex h-[calc(100dvh-7rem)] max-w-3xl flex-col gap-3 md:h-[calc(100dvh-4rem)] md:gap-4">
      {/* Header Section */}
      <header className="shrink-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            <span className="text-xs text-muted-foreground">
              {badge}
            </span>
          </div>
        </div>
      </header>

      {/* Conversation Thread */}
      <Conversation className="min-h-0 flex-1 rounded-lg border border-border/60 bg-card/30">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={emptyState.icon}
              title={emptyState.title}
              description={emptyState.description}
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <MessageResponse key={`${message.id}-${index}`}>
                          {part.text}
                        </MessageResponse>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input Form */}
      <PromptInput onSubmit={handleSubmit} className="relative shrink-0 rounded-2xl">
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder={placeholder}
          className="pr-12"
        />
        <PromptInputSubmit
          status={status}
          onStop={stop}
          disabled={!isBusy && !input.trim()}
          className="absolute right-2 bottom-2"
        />
      </PromptInput>
    </div>
  );
}