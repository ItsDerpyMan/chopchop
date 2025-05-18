// server.ts
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const handler = (req: Request) => {
    const url = new URL(req.url);
    let filePath = "." + url.pathname;
    if (filePath === "./") filePath = "./index.html";
    try {
        const file = Deno.readFileSync(filePath);
        return new Response(file, { status: 200 });
    } catch {
        return new Response("Not Found", { status: 404 });
    }
};

console.log("Server running at http://localhost:8000");
serve(handler, { port: 8000 });
