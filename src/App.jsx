import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Hexagon } from 'lucide-react';
import ConfigStep from './components/ConfigStep';
import ResultsStep from './components/ResultsStep';
import LoadingStep from './components/LoadingStep';
import { runPrediction } from './services/apiService';

const AMBER = '#FFBF00';

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

export default function App() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moleculeData, setMoleculeData] = useState({
    smiles: '',
    selectedModel: 'GNN',
    apiResponse: null,
  });

  const mobile = useIsMobile();

  const handleStartAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const t0 = Date.now();
      const data = await runPrediction(moleculeData.selectedModel, moleculeData.smiles);
      const elapsed = Date.now() - t0;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
      setMoleculeData(p => ({ ...p, apiResponse: data }));
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Falha na comunicação com a API.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Manrope, sans-serif', position: 'relative', overflowX: 'hidden' }}>

      {/* decorative hex */}
      <div style={{ position: 'absolute', top: '-8%', right: '-4%', opacity: 0.08, transform: 'rotate(12deg)', pointerEvents: 'none', zIndex: 0 }}>
        <Hexagon size={600} color={AMBER} strokeWidth={0.4} />
      </div>

      {/* Nav */}
      <nav style={{ width: '100%', maxWidth: 900, padding: mobile ? '16px 20px' : '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Beaker size={18} color={AMBER} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: mobile ? 8 : 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            EcoTox-Bee <span style={{ color: `${AMBER}55` }}>Lab</span>
          </span>
        </div>
        {step === 3 && (
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: AMBER, borderBottom: `1px solid ${AMBER}44` }}>
            Reset
          </button>
        )}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, width: '100%', maxWidth: 900, padding: mobile ? '0 16px 40px' : '0 32px 64px', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Title — only on step 1 */}
        <AnimatePresence>
          {step === 1 && !isLoading && (
            <motion.div key="title" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} style={{ textAlign: 'center', marginBottom: mobile ? 28 : 40 }}>
              <motion.h1
                animate={{ textShadow: ['0 0 0px rgba(255,191,0,0)', '0 0 28px rgba(255,191,0,0.35)', '0 0 0px rgba(255,191,0,0)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: mobile ? 'clamp(36px,10vw,52px)' : 'clamp(40px,8vw,80px)', color: AMBER, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                ECOTOX<span style={{ color: '#fff' }}>-BEE</span>
              </motion.h1>
              <p style={{ marginTop: 8, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: mobile ? 8 : 10, letterSpacing: mobile ? '0.3em' : '0.55em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                ANÁLISE ECOTOXICOLÓGICA
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error banner */}
        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>✕</button>
          </div>
        )}

        {/* Lab Board */}
        <div style={{
          width: '100%',
          background: '#1e1e1e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: mobile ? 12 : 16,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          padding: mobile ? '20px 16px' : '36px 40px',
        }}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoadingStep model={moleculeData.selectedModel} />
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                {step === 1 && (
                  <ConfigStep moleculeData={moleculeData} setMoleculeData={setMoleculeData} onNext={handleStartAnalysis} />
                )}
                {step === 3 && (
                  <ResultsStep moleculeData={moleculeData} onRestart={() => setStep(1)} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer style={{ padding: '24px 0', color: 'rgba(255,255,255,0.1)', fontSize: 9, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase', textAlign: 'center' }}>
        © 2026 Gabriel de Oliveira Silva • Ecotoxicological Prediction API
      </footer>
    </div>
  );
}
