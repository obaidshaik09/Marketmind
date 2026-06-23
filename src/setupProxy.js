const { createProxyMiddleware } = require('http-proxy-middleware');

// Only proxy /api/* to the backend — NOT hot-reload or static files.
module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
