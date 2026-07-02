export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    const normalizedUrl = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(normalizedUrl);
    let videoId: string | null = null;
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || null;
    } else if (hostname.endsWith("youtube.com") || hostname.endsWith("youtube-nocookie.com")) {
      videoId = parsed.searchParams.get("v");

      if (!videoId) {
        const segments = parsed.pathname.split("/").filter(Boolean);
        const supportedPaths = new Set(["embed", "shorts", "live", "v"]);
        if (segments.length >= 2 && supportedPaths.has(segments[0])) {
          videoId = segments[1] || null;
        }
      }
    }

    if (parsed.pathname.includes("/embed/") && videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export function decodeHtmlEntities(value: string): string {
  if (!value) return "";

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
