import path from "node:path";
import { readFile } from "node:fs/promises";
import { CATALOGUE_FILE, verifyDownloadToken } from "@/lib/catalogueDownload";

export const runtime = "nodejs";

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  let verified;
  try {
    verified = verifyDownloadToken(token);
  } catch (error) {
    console.error("[catalogue/download]", error.message);
    return Response.json({ success: false, message: "Catalogue downloads are not configured." }, { status: 503 });
  }
  if (!verified) {
    return Response.json({ success: false, message: "This download link is invalid or has expired." }, { status: 401 });
  }

  try {
    const file = await readFile(path.join(process.cwd(), "public", "assets", "productProfile", CATALOGUE_FILE));
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${CATALOGUE_FILE}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[catalogue/download]", error.message);
    return Response.json({ success: false, message: "The catalogue file is temporarily unavailable." }, { status: 404 });
  }
}
