import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { contentType } from "https://deno.land/std@0.224.0/media_types/mod.ts";
import { join, resolve } from "https://deno.land/std@0.224.0/path/mod.ts";

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  let pathname = url.pathname;

  // Serve index.html for root or directory requests
  if (pathname === "/" || pathname.endsWith("/")) {
    pathname = join(pathname, "index.html");
  }

  // Resolve file path to prevent directory traversal
  const filePath = resolve(join(Deno.cwd(), pathname));

  try {
    // Check if the path is a file
    const stats = await Deno.stat(filePath);
    if (stats.isDirectory) {
      return new Response("Not Found", { status: 404 });
    }

    // Read the file asynchronously
    const file = await Deno.readFile(filePath);

    // Determine MIME type based on file extension
    const ext = filePath.split(".").pop()?.toLowerCase() || "";
    const mimeType = contentType(ext) || "application/octet-stream";

    // Ensure .js files use application/javascript
    const finalMimeType = ext === "js" ? "application/javascript" : mimeType;

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": finalMimeType,
        "Cache-Control": "no-cache", // Prevent caching issues during development
      },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response("Not Found", { status: 404 });
    }
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

console.log("Server running at http://localhost:8000");
await serve(handler, { port: 8000 });
