import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── Proxies ────────────────────────────────────────────────────────────────
// Espelhando o comportamento do vite.config.js para produção.

app.use('/api-gnn', createProxyMiddleware({
  target: 'https://blueberry-tiramisu-73294-90d4af1cd778.herokuapp.com',
  changeOrigin: true,
  pathRewrite: { '^/api-gnn': '' },
}));

app.use('/api-qsar', createProxyMiddleware({
  target: 'https://cherry-tart-93383-f1cbb0ac50b6.herokuapp.com',
  changeOrigin: true,
  pathRewrite: { '^/api-qsar': '' },
}));

// ── Static Files ───────────────────────────────────────────────────────────
// Serve a pasta de build do Vite.
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback para o index.html (suporte a roteamento SPA se adicionado no futuro)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});
