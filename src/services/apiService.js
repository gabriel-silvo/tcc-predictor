import axios from 'axios';

// ── Endpoints ──────────────────────────────────────────────────────────────
// During dev, requests hit the Vite proxy (bypasses CORS).
// Paths are rewritten: /api-gnn/predict → blueberry.../predict
const GNN_BASE  = '/api-gnn';
const QSAR_BASE = '/api-qsar';

// Timeout: 30 s max — prevents the UI from hanging on a sleeping Heroku dyno.
const TIMEOUT_MS = 30_000;

// ── API 1: GNN ─────────────────────────────────────────────────────────────
// POST /predict  Body: { "smiles": "<string>" }
export const predictGNN = async (smiles) => {
  const res = await axios.post(
    `${GNN_BASE}/predict`,
    { smiles },
    { headers: { 'Content-Type': 'application/json' }, timeout: TIMEOUT_MS }
  );
  return res.data;
};

// ── API 2: QSAR Inference ──────────────────────────────────────────────────
// POST /predict  Body: { "model_id": "<string>", "smiles": ["<string>"] }
// smiles is sent as a single-element array to keep the payload minimal.
export const predictQSAR = async (modelId, smiles) => {
  const res = await axios.post(
    `${QSAR_BASE}/predict`,
    {
      model_id: modelId,
      smiles: [smiles],          // minimum payload — 1 molecule
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: TIMEOUT_MS }
  );
  return res.data;
};

// ── Dispatcher ─────────────────────────────────────────────────────────────
export const runPrediction = async (selectedModel, smiles) => {
  if (selectedModel === 'GNN') {
    const result = await predictGNN(smiles);
    return { api: 'GNN', result };
  }
  const result = await predictQSAR(selectedModel, smiles);
  return { api: 'QSAR', modelId: selectedModel, result };
};
