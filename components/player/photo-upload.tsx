"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadSimple, X, Spinner } from "@phosphor-icons/react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function PhotoUpload({
  name = "primaryPhotoUrl",
  defaultValue,
}: {
  name?: string;
  defaultValue?: string | null;
}) {
  // Stores the blob's pathname (not a directly-fetchable URL, since photos
  // are private -- viewing one always goes through /api/blob/photo so we
  // can enforce the same auth rules as the rest of a player's profile).
  const [pathname, setPathname] = useState<string | null>(defaultValue ?? null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewSrc = pathname
    ? `/api/blob/photo?pathname=${encodeURIComponent(pathname)}`
    : null;

  async function handleFile(file: File) {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await new Promise<{ pathname: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/blob/upload");
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.responseText));
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.send(formData);
      });

      setPathname(result.pathname);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={pathname ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {previewSrc ? (
        <div className="relative flex items-center gap-4 rounded-lg border border-border/60 bg-card/40 p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={previewSrc}
              alt="Player photo preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-sm text-muted-foreground">Photo uploaded.</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPathname(null)}>
                <X className="h-4 w-4" aria-hidden />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !uploading) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragging
              ? "border-gold bg-gold/5"
              : "border-border/60 hover:border-foreground/30 hover:bg-muted/30"
          } ${uploading ? "pointer-events-none opacity-70" : ""}`}
        >
          {uploading ? (
            <>
              <Spinner className="h-6 w-6 animate-spin text-gold" aria-hidden />
              <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
            </>
          ) : (
            <>
              <UploadSimple className="h-6 w-6 text-muted-foreground" aria-hidden />
              <p className="text-sm text-foreground/90">
                Drag & drop a photo here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, or GIF, up to 5MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
