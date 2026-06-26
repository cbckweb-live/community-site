export type PdfCompressOptions = {
  maxBytes?: number;
};

export async function compressPdfFile(
  file: File,
  opts: PdfCompressOptions = {},
): Promise<File> {
  if (!file.type || !file.type.toLowerCase().includes("pdf")) return file;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/compress-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Server-side PDF compression failed:", response.status, errorText);
      return file;
    }

    const compressedBlob = await response.blob();

    if (opts.maxBytes && compressedBlob.size > opts.maxBytes) {
      console.warn(`Compressed PDF (${compressedBlob.size} bytes) still exceeds maxBytes (${opts.maxBytes}). Returning original.`);
      return file;
    }

    if (compressedBlob.size >= file.size) {
      return file;
    }

    const base = file.name.replace(/\.[^/.]+$/, "");
    return new File([compressedBlob], `${base}-compressed.pdf`, { type: "application/pdf" });
  } catch (error) {
    console.warn("Client-side PDF compression fallback to original:", error);
    return file;
  }
}
