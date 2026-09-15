import { createMcpHandler } from "mcp-handler";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const FACTS = fs.readFileSync(path.join(process.cwd(), "content", "chatbot-facts.md"), "utf-8");

const handler = createMcpHandler(
  (server) => {
    server.registerResource(
      "rene-facts",
      "rene://facts",
      {
        title: "Rene Marino — facts",
        description:
          "Public facts about Rene Marino: experience, education, and his own answers to common questions about how he works. The same source the site's chat assistant is grounded in.",
        mimeType: "text/markdown",
      },
      async (uri) => ({
        contents: [{ uri: uri.href, mimeType: "text/markdown", text: FACTS }],
      }),
    );
  },
  { serverInfo: { name: "rene-marino-portfolio", version: "1.0.0" } },
);

export { handler as GET, handler as POST };
