const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export function resolveMediaUrl(url?: string | null): string {
  if (!url) {
    return "/diamond.png";
  }

  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }

  if (url.startsWith("/storage/")) {
    return `${API_ORIGIN}${url}`;
  }

  return url;
}
