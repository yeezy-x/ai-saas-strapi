import { Code } from "lucide-react";
import WorkspaceAiChat from "@/components/workspace/workspace-ai-chat";

export default function CodePage() {
  return (
    <WorkspaceAiChat
      mode="code"
      title="Code"
      badge="Code Assistant • Gemini 2.5 Flash"
      placeholder="Describe your coding problem or ask for code suggestions..."
      emptyState={{
        icon: (
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Code className="size-6" />
          </span>
        ),
        title: "Pair on Code with AI",
        description:
          "Get refactors, reviews, and debugging help — same streaming UI as Chat, tuned for software work.",
      }}
    />
  );
}