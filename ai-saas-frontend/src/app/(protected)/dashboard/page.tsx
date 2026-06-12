"use client";

import { useEffect, useState } from "react";
import { Loader, VideoIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

type GalleryItem = {
  documentId: string;
  prompt: string | null;
  videoUrl: string | null;
};

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadGallery() {
      try {
        if (gallery.length === 0) {
          setIsLoadingGallery(true);
        }

        const res = await fetch("/api/video", {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401) return;
          throw new Error("Failed to load gallery");
        }

        const data = await res.json();

        if (mounted) {
          setGallery(data.images ?? []);
        }
      } catch {
        toast.error("Could not load your videos");
      } finally {
        if (mounted) {
          setIsLoadingGallery(false);
        }
      }
    }

    loadGallery();

    return () => {
      mounted = false;
    };
  }, [gallery.length]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGenerating) return;

    const text = prompt.trim();
    if (!text) return;

    setIsGenerating(true);
    setPreview(null);

    try {
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      setPreview(data.videoUrl);
      setGallery((prev) => [
        {
          documentId: data.documentId,
          prompt: data.prompt,
          videoUrl: data.videoUrl,
        },
        ...prev,
      ]);

      setPrompt("");
      toast.success("Video generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-8">
      {/* Header */}
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Video
            </h1>
            <p className="text-xs text-muted-foreground">
              MiniMax Video • Fal AI
            </p>
          </div>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Generate AI videos using MiniMax Video through Fal AI. Videos are
          stored in your Strapi collection and streamed directly from the Fal CDN.
        </p>
      </header>

      {/* Generation Form */}
      <form
        onSubmit={handleGenerate}
        className="rounded-xl border border-border/60 bg-card/30 p-4"
      >
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Prompt
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. A red panda reading a book in a cozy library, soft lighting, cinematic drone shot..."
              disabled={isGenerating}
              className="min-h-28"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="gap-2"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Video"
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Preview Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">Latest Result</h2>
        <div className="relative h-105 w-full max-w-md overflow-hidden rounded-xl border border-border/60 bg-card/30">
          {isGenerating && (
            <>
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
                <Loader className="size-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Generating your video...
                </p>
              </div>
            </>
          )}

          {!isGenerating && !preview && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <VideoIcon className="size-10 opacity-50" />
              <p className="text-sm">Your new video will show here.</p>
            </div>
          )}

          {!isGenerating && preview && (
            <video
              controls
              className="h-full w-full object-contain"
              src={preview}
            />
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">Recent Generations</h2>

        {!isLoadingGallery && gallery.length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No videos generated yet.
          </div>
        )}

        {isLoadingGallery ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-video w-full rounded-lg" />
            ))}
          </div>
        ) : (
          gallery.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {gallery.map((item) => (
                <li
                  key={item.documentId}
                  className="overflow-hidden rounded-lg border border-border/60 bg-card/20"
                >
                  {item.videoUrl ? (
                    <video
                      controls
                      src={item.videoUrl}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-muted text-xs text-muted-foreground">
                      No Preview
                    </div>
                  )}

                  {item.prompt && (
                    <div className="line-clamp-2 border-t bg-background/80 p-2 text-xs text-muted-foreground">
                      {item.prompt}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </section>
    </div>
  );
}