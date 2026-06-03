const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Proxy /uv/* to cineby
app.use('/uv', createProxyMiddleware({
  target: 'https://www.cineby.sc',
  changeOrigin: true,
  pathRewrite: { '^/uv': '' },
  on: {
    proxyRes: (proxyRes) => {
      // Remove headers that block iframe embedding
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['x-content-type-options'];
      proxyRes.headers['access-control-allow-origin'] = '*';
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
