import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const pdfDoc = await PDFDocument.load(originalBuffer, {
      ignoreEncryption: true,
    });

    // pdf-lib v1.17.x typings do not include `compressObjects`.
    // Object stream usage typically provides most of the size benefit.
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const compressedBuffer = Buffer.from(compressedBytes);

    return new NextResponse(compressedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, "")}-compressed.pdf"`,
        "Content-Length": compressedBuffer.length.toString(),
        "X-Original-Size": originalBuffer.length.toString(),
        "X-Compressed-Size": compressedBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF compression failed:", error);
    return NextResponse.json(
      { error: "Failed to compress PDF" },
      { status: 500 }
    );
  }
}
