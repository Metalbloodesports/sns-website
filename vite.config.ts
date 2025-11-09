import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-handler-plugin',
      configureServer(server) {
        server.middlewares.use('/api/generateDescription', async (req, res, next) => {
            try {
                // Dynamically import the handler on each request for hot-reloading.
                const { default: apiHandler } = await server.ssrLoadModule('./api/generateDescription.ts');
                // FIX: The API handler expects 2 arguments (req, res), but was being called with 3.
                // This corrects the call to match the handler's signature.
                await (apiHandler as (req: IncomingMessage, res: ServerResponse) => Promise<void>)(req, res);
            } catch (error) {
                console.error("API handler error:", error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Server error in API handler.' }));
            }
        });
      },
    },
  ],
})
