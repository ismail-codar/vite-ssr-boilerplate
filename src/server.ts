import express from 'express';
import { createPageRenderer } from 'vite-plugin-ssr';
import vite from 'vite';

// https://github.com/brillout/vite-plugin-ssr/blob/master/boilerplates/boilerplate-vue/server/index.js

const isProduction = process.env.NODE_ENV === 'production';
const root = `${__dirname}/..`;

async function startServer() {
  const app = express();

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  // Serve storybook production bundle
  app.use('/storybook', express.static('dist/storybook'));

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root });
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      url,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { statusCode, body } = httpResponse;
    res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 3001;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

startServer();
