"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

type GalleryItem = {
  documentId: string;
  prompt: string | null;
  imageUrl: string | null;
};

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "1:1 - Square" },
  { value: "16:9", label: "16:9 - Wide" },
  { value: "9:16", label: "9:16 - Tall" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
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

        const res = await fetch("/api/image", {
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
        toast.error("Could not load your images");
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
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGenerating) {
      return;
    }

    const text = prompt.trim();
    if (!text) {
      return;
    }

    setIsGenerating(true);
    setPreview(null);

    try {
      const res = await fetch("/api/image/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
          aspectRatio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      setPreview(data.imageUrl);
      setGallery((prev) => [
        {
          documentId: data.documentId,
          prompt: data.prompt,
          imageUrl: data.imageUrl,
        },
        ...prev,
      ]);

      setPrompt("");
      toast.success("Image generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-8">
      <header>
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Image
            </h1>
            <p className="text-xs text-muted-foreground">
              Gemini 2.5 Flash Image Preview
            </p>
          </div>
        </div>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Describe a scene; images are generated with the AI SDK{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            generateImage
          </code>{" "}
          and saved to your Strapi collection.
        </p>
      </header>

      <form
        onSubmit={handleGenerate}
        className="rounded-xl border border-border/60 bg-card/30 p-4"
      >
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="prompt">Prompt</label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. A red panda reading a book in a cozy library, soft lighting..."
              disabled={isGenerating}
              className="min-h-28"
            />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-2">
              <label htmlFor="aspect">Aspect Ratio</label>
              <select
                id="aspect"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                disabled={isGenerating}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {ASPECT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

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
                <>
                  <Sparkles className="size-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Latest Result</h2>

        <div className="relative h-105 w-full max-w-md overflow-hidden rounded-xl border border-border/60 bg-card/30">
          {isGenerating && (
            <>
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
                <Loader className="size-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Generating your image...
                </p>
              </div>
            </>
          )}

          {!isGenerating && !preview && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <ImageIcon className="size-10 opacity-50" />
              <p className="text-sm">Your new image will show here.</p>
            </div>
          )}

          {!isGenerating && preview && (
            <Image
              src={preview}
              alt="Generated Image"
              fill
              className="object-contain p-4"
            />
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Recent Generations</h2>

        {!isLoadingGallery && gallery.length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No images generated yet.
          </div>
        )}

        {isLoadingGallery ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square" />
            ))}
          </div>
        ) : (
          gallery.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {gallery.map((item) => (
                <li
                  key={item.documentId}
                  className="group overflow-hidden rounded-lg border border-border/60"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.prompt ?? ""}
                      width={500}
                      height={500}
                      className="aspect-square w-full object-cover transition group-hover:opacity-90"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-muted text-xs text-muted-foreground">
                      No Preview
                    </div>
                  )}

                  {item.prompt && (
                    <div className="border-t bg-background/80 p-2 text-xs text-muted-foreground">
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