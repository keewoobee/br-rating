import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { menuData } from "./src/data.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // Helper to get dynamic redirect URI
  const getRedirectUri = (req: express.Request, provider: string) => {
    const host = req.headers["x-forwarded-host"] || req.get("host") || "";
    // Force https unless it's localhost
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}/auth/callback/${provider}`;
  };

  // --- Google OAuth ---
  app.get("/api/auth/google/url", (req, res) => {
    const redirectUri = getRedirectUri(req, "google");
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ url: authUrl });
  });

  app.get(["/auth/callback/google", "/auth/callback/google/"], async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("No code provided");

    try {
      const redirectUri = getRedirectUri(req, "google");
      
      // Exchange code for token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });
      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        throw new Error("Failed to get access token");
      }

      // Get user info
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const userData = await userResponse.json();

      const payload = {
        name: userData.name || "구글 유저",
        avatar: userData.picture || "👤",
        idToken: tokenData.id_token || null,
      };

      const payloadJson = JSON.stringify(payload).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', payload: ${payloadJson} }, '*');
                window.close();
              } else {
                sessionStorage.setItem('oauth_payload', '${Buffer.from(JSON.stringify(payload)).toString('base64')}');
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. Redirecting...</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Google OAuth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/analyze-data", (req, res) => {
    const totalCount = menuData.length;
    const nameCounts: Record<string, number> = {};
    menuData.forEach((item: any) => {
      nameCounts[item.name] = (nameCounts[item.name] || 0) + 1;
    });
    const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1);
    const tagIssues: string[] = [];
    menuData.forEach((item: any) => {
      const years = item.tags.filter((tag: string) => tag.match(/^\d{4}$/));
      const yearNyeons = item.tags.filter((tag: string) => tag.match(/^\d{4}년$/));
      years.forEach((year: string) => {
        if (yearNyeons.includes(`${year}년`)) {
          tagIssues.push(`Item ID ${item.id} (${item.name}) has both "${year}" and "${year}년"`);
        }
      });
    });
    res.json({ totalCount, duplicates, tagIssues });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
