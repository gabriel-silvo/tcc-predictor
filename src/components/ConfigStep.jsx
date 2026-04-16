import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, PenTool, ArrowLeft, ChevronDown } from 'lucide-react';
import SketcherStep from './SketcherStep';

const AMBER = '#FFBF00';
const BG_DEEP = '#111111';
const BG_INNER = '#1a1a1a';
const BORDER = '1px solid rgba(255,255,255,0.07)';

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

// ── Model catalogue ─────────────────────────────────────────────────────────
// GNN lives on API 1. Everything else lives on API 2 (QSAR).
// We group the QSAR models for display purposes.
const MODEL_GROUPS = [
  {
    label: 'GNN',
    models: [
      { id: 'GNN', name: 'GNN', desc: 'Graph Neural Network — análise topológica de grafos moleculares.' },
    ],
  },
  {
    label: 'Embedding — MLP',
    unstable: true,
    models: [
      { id: 'embedding_mlp_1', name: 'MLP-E 1', desc: 'MLP com embedding molecular #1.' },
      { id: 'embedding_mlp_2', name: 'MLP-E 2', desc: 'MLP com embedding molecular #2.' },
      { id: 'embedding_mlp_3', name: 'MLP-E 3', desc: 'MLP com embedding molecular #3.' },
      { id: 'embedding_mlp_4', name: 'MLP-E 4', desc: 'MLP com embedding molecular #4.' },
      { id: 'embedding_mlp_5', name: 'MLP-E 5', desc: 'MLP com embedding molecular #5.' },
    ],
  },
  {
    label: 'Embedding — RF',
    unstable: true,
    models: [
      { id: 'embedding_rf_1', name: 'RF-E 1', desc: 'Random Forest com embedding #1.' },
      { id: 'embedding_rf_2', name: 'RF-E 2', desc: 'Random Forest com embedding #2.' },
      { id: 'embedding_rf_3', name: 'RF-E 3', desc: 'Random Forest com embedding #3.' },
      { id: 'embedding_rf_4', name: 'RF-E 4', desc: 'Random Forest com embedding #4.' },
      { id: 'embedding_rf_5', name: 'RF-E 5', desc: 'Random Forest com embedding #5.' },
    ],
  },
  {
    label: 'Embedding — SVM',
    unstable: true,
    models: [
      { id: 'embedding_svm_1', name: 'SVM-E 1', desc: 'SVM com embedding molecular #1.' },
      { id: 'embedding_svm_2', name: 'SVM-E 2', desc: 'SVM com embedding molecular #2.' },
      { id: 'embedding_svm_3', name: 'SVM-E 3', desc: 'SVM com embedding molecular #3.' },
      { id: 'embedding_svm_4', name: 'SVM-E 4', desc: 'SVM com embedding molecular #4.' },
      { id: 'embedding_svm_5', name: 'SVM-E 5', desc: 'SVM com embedding molecular #5.' },
    ],
  },
  {
    label: 'Fingerprint — MLP',
    models: [
      { id: 'fingerprint_mlp_1', name: 'MLP-F 1', desc: 'MLP com fingerprint molecular #1.' },
      { id: 'fingerprint_mlp_2', name: 'MLP-F 2', desc: 'MLP com fingerprint molecular #2.' },
      { id: 'fingerprint_mlp_3', name: 'MLP-F 3', desc: 'MLP com fingerprint molecular #3.' },
      { id: 'fingerprint_mlp_4', name: 'MLP-F 4', desc: 'MLP com fingerprint molecular #4.' },
      { id: 'fingerprint_mlp_5', name: 'MLP-F 5', desc: 'MLP com fingerprint molecular #5.' },
    ],
  },
  {
    label: 'Fingerprint — RF',
    models: [
      { id: 'fingerprint_rf_1', name: 'RF-F 1', desc: 'Random Forest com fingerprint #1.' },
      { id: 'fingerprint_rf_2', name: 'RF-F 2', desc: 'Random Forest com fingerprint #2.' },
      { id: 'fingerprint_rf_3', name: 'RF-F 3', desc: 'Random Forest com fingerprint #3.' },
      { id: 'fingerprint_rf_4', name: 'RF-F 4', desc: 'Random Forest com fingerprint #4.' },
      { id: 'fingerprint_rf_5', name: 'RF-F 5', desc: 'Random Forest com fingerprint #5.' },
    ],
  },
  {
    label: 'Fingerprint — SVM',
    models: [
      { id: 'fingerprint_svm_1', name: 'SVM-F 1', desc: 'SVM com fingerprint molecular #1.' },
      { id: 'fingerprint_svm_2', name: 'SVM-F 2', desc: 'SVM com fingerprint molecular #2.' },
      { id: 'fingerprint_svm_3', name: 'SVM-F 3', desc: 'SVM com fingerprint molecular #3.' },
      { id: 'fingerprint_svm_4', name: 'SVM-F 4', desc: 'SVM com fingerprint molecular #4.' },
      { id: 'fingerprint_svm_5', name: 'SVM-F 5', desc: 'SVM com fingerprint molecular #5.' },
    ],
  },
];

const ALL_MODELS = MODEL_GROUPS.flatMap(g => g.models);

// ── Compact dropdown for 31 models ─────────────────────────────────────────
function ModelDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const active = ALL_MODELS.find(m => m.id === value) || ALL_MODELS[0];

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', color: AMBER, textTransform: 'uppercase', marginBottom: 8 }}>
        Modelo Analítico
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: BG_INNER, border: open ? `1px solid ${AMBER}` : BORDER,
          borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', cursor: 'pointer', color: '#fff',
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
        }}
      >
        <span>{active.name} <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>— {active.desc}</span></span>
        <ChevronDown size={16} color="rgba(255,255,255,0.3)" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
              background: '#1e1e1e', border: BORDER, borderRadius: 10,
              boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
              maxHeight: 300, overflowY: 'auto',
            }}
          >
            {MODEL_GROUPS.map(group => (
              <div key={group.label}>
                <div style={{ padding: '8px 14px 4px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 8, letterSpacing: '0.2em', color: group.unstable ? 'rgba(255,191,0,0.4)' : 'rgba(255,255,255,0.2)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {group.unstable && <span title="Modelos com instabilidade reportada no servidor" style={{ fontSize: 10 }}>⚠</span>}
                  {group.label}
                </div>
                {group.models.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { onChange(m.id); setOpen(false); }}
                    style={{
                      width: '100%', background: value === m.id ? 'rgba(255,191,0,0.08)' : 'transparent',
                      border: 'none', padding: '9px 14px', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', gap: 8, alignItems: 'baseline',
                      borderLeft: value === m.id ? `2px solid ${AMBER}` : '2px solid transparent',
                    }}
                  >
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: value === m.id ? AMBER : 'rgba(255,255,255,0.7)' }}>{m.name}</span>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{m.desc}</span>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Method Option Card ──────────────────────────────────────────────────────
function MethodCard({ title, subtitle, desc, icon: Icon, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 0', minWidth: 0, background: BG_INNER,
        border: hovered ? `1px solid ${AMBER}` : BORDER,
        borderRadius: 12, padding: '22px 24px', cursor: 'pointer',
        textAlign: 'left', position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 8, background: '#3d2e00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: AMBER, flexShrink: 0 }}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: hovered ? AMBER : '#fff', letterSpacing: '-0.02em', transition: 'color 0.2s' }}>{title}</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 3 }}>{subtitle}</div>
        </div>
      </div>
      <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </button>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function ConfigStep({ moleculeData, setMoleculeData, onNext }) {
  const [view, setView] = useState('choice');
  const mobile = useIsMobile();

  const canAnalyze = view === 'draw' || (view === 'text' && moleculeData.smiles.trim().length > 0);

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">

        {/* ── CHOICE ── */}
        {view === 'choice' && (
          <motion.div key="choice" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.25em', color: AMBER, textTransform: 'uppercase', marginBottom: 20, textAlign: 'center' }}>
              Selecione o método de análise
            </p>
            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 16 }}>
              <MethodCard title="Entrada via Texto" subtitle="Formato SMILES" desc="Insira diretamente a sequência SMILES da molécula para análise instantânea." icon={Type} onClick={() => setView('text')} />
              <MethodCard title="Laboratório de Desenho" subtitle="Sketcher Molecular" desc="Esboce a estrutura química no editor integrado e converta para SMILES automaticamente." icon={PenTool} onClick={() => setView('draw')} />
            </div>
          </motion.div>
        )}

        {/* ── ACTIVE: TEXT ── */}
        {view === 'text' && (
          <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
              <button onClick={() => setView('choice')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}
                onMouseEnter={e => e.currentTarget.style.color = AMBER} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                <ArrowLeft size={13} /> Mudar Método
              </button>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: AMBER, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Modo SMILES</span>
            </div>

            {/* SMILES input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', color: AMBER, textTransform: 'uppercase' }}>Assinatura Química (SMILES)</label>
              <div style={{ background: BG_DEEP, border: BORDER, borderRadius: 8 }}>
                <input
                  type="text"
                  placeholder="Ex.: CCO, C1CCCCC1, ClC1=C(C=N1)CN2..."
                  value={moleculeData.smiles}
                  onChange={e => setMoleculeData(p => ({ ...p, smiles: e.target.value }))}
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: mobile ? '12px 14px' : '16px 20px', fontFamily: 'monospace', fontSize: mobile ? 14 : 17, color: 'rgba(255,255,255,0.85)', caretColor: AMBER, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Model selector dropdown */}
            <ModelDropdown value={moleculeData.selectedModel} onChange={id => setMoleculeData(p => ({ ...p, selectedModel: id }))} />

            {/* CTA */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
              <button
                onClick={onNext}
                disabled={!canAnalyze}
                style={{ background: AMBER, color: '#111', border: 'none', cursor: canAnalyze ? 'pointer' : 'not-allowed', padding: mobile ? '14px 40px' : '16px 64px', borderRadius: 6, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: canAnalyze ? 1 : 0.35, transition: 'filter 0.15s' }}
                onMouseEnter={e => { if (canAnalyze) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
              >
                Iniciar Análise
              </button>
            </div>
          </motion.div>
        )}

        {/* ── ACTIVE: DRAW (Ketcher) ── */}
        {view === 'draw' && (
          <motion.div key="draw" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SketcherStep
              moleculeData={moleculeData}
              setMoleculeData={setMoleculeData}
              ModelDropdown={ModelDropdown}
              onBack={() => setView('choice')}
              onNext={onNext}
              mobile={mobile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
