'use client';

import { useState } from "react";

type SharePostButtonsProps = {
  title: string;
  url: string;
  compact?: boolean;
};

function buildShareUrl(platform: "x" | "whatsapp" | "facebook" | "linkedin", url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default:
      return url;
  }
}

export default function SharePostButtons({ title, url, compact = false }: SharePostButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareTitle = title.trim();
  const pageUrl = url.trim();

  async function handleShare() {
    const currentUrl = pageUrl;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: currentUrl });
        return;
      } catch {
        // Fall back to copy link below.
      }
    }

    await handleCopyLink(currentUrl);
  }

  async function handleCopyLink(currentUrl: string = pageUrl) {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!pageUrl) return null;

  if (compact) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full border border-[#231F1E]/15 px-3 py-1.5 text-xs font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
        >
          Share
          <span className="text-[10px] text-[#231F1E]/50">{open ? "−" : "+"}</span>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-10 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-[#231F1E]/10 bg-white p-3 shadow-lg">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B1F2A]">
              Share this post
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-[#6B1F2A] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#571824]"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => void handleCopyLink()}
                className="rounded-full border border-[#231F1E]/15 px-3 py-1.5 text-xs font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={buildShareUrl("x", pageUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#231F1E]/15 px-3 py-1.5 text-xs font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
              >
                X
              </a>
              <a
                href={buildShareUrl("whatsapp", pageUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#231F1E]/15 px-3 py-1.5 text-xs font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
              >
                WhatsApp
              </a>
              <a
                href={buildShareUrl("facebook", pageUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#231F1E]/15 px-3 py-1.5 text-xs font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
              >
                Facebook
              </a>
              <a
                href={buildShareUrl("linkedin", pageUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#231F1E]/15 px-3 py-1.5 text-xs font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
              >
                LinkedIn
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-[#231F1E]/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#231F1E]">Share this post</p>
          <p className="text-sm text-[#231F1E]/60">
            Send this article to friends or save the link for later.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-[#6B1F2A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#571824]"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => void handleCopyLink()}
            className="rounded-full border border-[#231F1E]/15 px-4 py-2 text-sm font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          <a
            href={buildShareUrl("x", pageUrl, shareTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#231F1E]/15 px-4 py-2 text-sm font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
          >
            X
          </a>
          <a
            href={buildShareUrl("whatsapp", pageUrl, shareTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#231F1E]/15 px-4 py-2 text-sm font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
          >
            WhatsApp
          </a>
          <a
            href={buildShareUrl("facebook", pageUrl, shareTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#231F1E]/15 px-4 py-2 text-sm font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
          >
            Facebook
          </a>
          <a
            href={buildShareUrl("linkedin", pageUrl, shareTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#231F1E]/15 px-4 py-2 text-sm font-medium text-[#231F1E] transition-colors hover:bg-[#231F1E]/5"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}