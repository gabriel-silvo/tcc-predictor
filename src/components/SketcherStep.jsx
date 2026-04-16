import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowLeft, FlaskConical, Loader, AlertCircle } from 'lucide-react';

const AMBER  = '#FFBF00';
const BG_IN  = '#1a1a1a';
const BORDER = '1px solid rgba(255,255,255,0.07)';

/**
 * KetcherFrame
 * Embeds the Ketcher standalone app (public/ketcher/standalone/index.html)
 * in a same-origin iframe and polls for SMILES on every structure change.
 */
function KetcherFrame({ onSmilesChange }) {
  const iframeRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const pollRef = useRef(null);

  // Poll the iframe for changed SMILES every 800 ms once it's ready
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow?.ketcher) return;
        const smiles = await iframe.contentWindow.ketcher.getSmiles();
        if (smiles) onSmilesChange(smiles);
      } catch {
        // Ketcher not yet ready or empty canvas — ignore
      }
    }, 800);
  }, [onSmilesChange]);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleLoad = () => {
    setStatus('ready');
    startPolling();
  };

  const handleError = () => setStatus('error');

  return (
    <div style={{ position:'relative', width:'100%', borderRadius:8, overflow:'hidden', border:BORDER }}>
      {status === 'loading' && (
        <div style={{ position:'absolute', inset:0, background:BG_IN, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, zIndex:10 }}>
          <Loader size={28} color={AMBER} style={{ animation:'spin 1s linear infinite' }} />
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:10, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.2em' }}>
            Carregando Editor Molecular…
          </span>
        </div>
      )}
      {status === 'error' && (
        <div style={{ background:BG_IN, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:40 }}>
          <AlertCircle size={28} color="#f87171" />
          <span style={{ fontFamily:'Manrope, sans-serif', fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            Falha ao carregar o editor. Verifique se o servidor está rodando.
          </span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/ketcher/standalone/index.html"
        title="Ketcher Molecular Editor"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width:'100%',
          height:460,
          border:'none',
          display: status === 'error' ? 'none' : 'block',
          background:'#fff',
          borderRadius:8,
        }}
        allow="clipboard-read; clipboard-write"
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/**
 * SketcherStep — the full draw view inside the ConfigStep flow
 */
export default function SketcherStep({
  moleculeData,
  setMoleculeData,
  ModelDropdown,   // shared dropdown component passed from ConfigStep
  onBack,
  onNext,
  mobile,
}) {
  const [localSmiles, setLocalSmiles] = useState(moleculeData.smiles || '');

  const handleSmilesChange = useCallback((smiles) => {
    setLocalSmiles(smiles);
    setMoleculeData(p => ({ ...p, smiles }));
  }, [setMoleculeData]);

  const canAnalyze = localSmiles.trim().length > 0;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.06)', paddingBottom:14 }}>
        <button
          onClick={onBack}
          style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase' }}
          onMouseEnter={e => e.currentTarget.style.color = AMBER}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          <ArrowLeft size={13} /> Mudar Método
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <FlaskConical size={13} color={AMBER} />
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, color:AMBER, letterSpacing:'0.2em', textTransform:'uppercase' }}>
            Laboratório de Desenho — Ketcher
          </span>
        </div>
      </div>

      {/* Ketcher editor */}
      <KetcherFrame onSmilesChange={handleSmilesChange} />

      {/* SMILES readout */}
      <div style={{ background:'#0a0a0a', border:BORDER, borderRadius:8, padding:'12px 18px' }}>
        <div style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:6 }}>
          SMILES Detectado
        </div>
        <div style={{ fontFamily:'monospace', fontSize: mobile ? 12 : 15, color: localSmiles ? AMBER : 'rgba(255,255,255,0.15)', wordBreak:'break-all', minHeight:20 }}>
          {localSmiles || 'Desenhe uma molécula no editor acima…'}
        </div>
      </div>

      {/* Model selector */}
      <ModelDropdown
        value={moleculeData.selectedModel}
        onChange={id => setMoleculeData(p => ({ ...p, selectedModel: id }))}
      />

      {/* Analyze button */}
      <div style={{ display:'flex', justifyContent:'center', paddingTop:4 }}>
        <button
          onClick={onNext}
          disabled={!canAnalyze}
          style={{
            background: AMBER, color:'#111', border:'none',
            cursor: canAnalyze ? 'pointer' : 'not-allowed',
            padding: mobile ? '14px 40px' : '16px 64px',
            borderRadius:6, fontFamily:'Space Grotesk, sans-serif',
            fontWeight:700, fontSize:13, letterSpacing:'0.18em',
            textTransform:'uppercase', opacity: canAnalyze ? 1 : 0.35,
            transition:'filter 0.15s',
          }}
          onMouseEnter={e => { if (canAnalyze) e.currentTarget.style.filter = 'brightness(1.1)'; }}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          Analisar Molécula
        </button>
      </div>
    </div>
  );
}
