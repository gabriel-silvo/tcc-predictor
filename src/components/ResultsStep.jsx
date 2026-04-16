import React, { useState, useEffect } from 'react';
import { RefreshCcw, Activity, AlertTriangle, CheckCircle, Info, Zap, FlaskConical, ImageOff } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const AMBER  = '#FFBF00';
const GREEN  = '#4ADE80';
const RED    = '#FF4B2B'; // Vibrant red that fits the palette
const BG_IN  = '#1a1a1a';
const BORDER = '1px solid rgba(255,255,255,0.07)';

/* ── Mobile hook ─────────────────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

/* ── Detect base64 image format from magic bytes ── */
function dataUriFromB64(b64) {
  if (!b64) return null;
  if (b64.startsWith('iVBOR')) return `data:image/png;base64,${b64}`;
  if (b64.startsWith('/9j/'))  return `data:image/jpeg;base64,${b64}`;
  if (b64.startsWith('PHN2') || b64.startsWith('PD94')) return `data:image/svg+xml;base64,${b64}`;
  // Unknown — default to PNG
  return `data:image/png;base64,${b64}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA EXTRACTION
   GNN  shape: { prediction: 0|1, probability: 0.12, explanation: { image_base64 } }
   QSAR shape: { results: [{ input_smiles, canonical_smiles, prediction, probability }] }
   ═══════════════════════════════════════════════════════════════════════════ */
function parse(apiResponse) {
  const raw = apiResponse?.result ?? apiResponse ?? null;
  if (!raw) return {};

  // GNN: top-level probability field
  if (typeof raw.probability === 'number') {
    return {
      probability:    raw.probability,
      predictedClass: raw.prediction ?? null,
      imageB64:       raw.explanation?.image_base64 ?? null,
    };
  }

  // QSAR: results array
  const hit = raw.results?.[0];
  if (hit) {
    return {
      probability:     hit.probability ?? null,
      predictedClass:  hit.prediction  ?? null,
      inputSmiles:     hit.input_smiles     ?? null,
      canonicalSmiles: hit.canonical_smiles ?? null,
    };
  }

  return {};
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function Card({ accent = AMBER, icon: Icon, label, children, style = {} }) {
  return (
    <div style={{ background: BG_IN, border: BORDER, borderRadius:12, padding:20, position:'relative', overflow:'hidden', ...style }}>
      <div style={{ position:'absolute', left:0, top:12, bottom:12, width:2, background:accent, opacity:0.6, borderRadius:2 }} />
      {label && (
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          {Icon && <Icon size={13} color="rgba(255,255,255,0.25)" />}
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.2em' }}>
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Semi-circle gauge ── */
function Gauge({ prob, mobile }) {
  if (prob === null || prob === undefined) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.3)', padding:'12px 0' }}>
        <Info size={16} />
        <span style={{ fontFamily:'Manrope, sans-serif', fontSize:13 }}>Probabilidade não disponível neste modelo.</span>
      </div>
    );
  }

  const pct   = Math.round(prob * 100);
  const color = pct >= 75 ? RED : pct >= 50 ? AMBER : GREEN;
  const label = pct >= 75 ? 'Extrema Toxicidade Prevista' : pct >= 50 ? 'Alta Toxicidade Prevista' : 'Baixa Toxicidade Prevista';

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
      <div style={{ width:'100%', maxWidth: mobile ? 220 : 280, aspectRatio:'2/1', position:'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[{ value: pct }, { value: 100 - pct }]}
              cx="50%" cy="100%"
              startAngle={180} endAngle={0}
              innerRadius={mobile ? 56 : 68} outerRadius={mobile ? 80 : 98}
              dataKey="value" paddingAngle={0}
            >
              <Cell fill={color} />
              <Cell fill="rgba(255,255,255,0.04)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position:'absolute', bottom:2, left:'50%', transform:'translateX(-50%)', textAlign:'center', whiteSpace:'nowrap' }}>
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize: mobile ? 38 : 52, color, fontStyle:'italic', letterSpacing:'-0.04em', lineHeight:1 }}>{pct}%</span>
        </div>
      </div>

      <div style={{ background: pct >= 75 ? 'rgba(255,75,43,0.08)' : pct >= 50 ? 'rgba(255,191,0,0.08)' : 'rgba(74,222,128,0.08)', border:`1px solid ${pct >= 75 ? 'rgba(255,75,43,0.25)' : pct >= 50 ? 'rgba(255,191,0,0.25)' : 'rgba(74,222,128,0.25)'}`, borderRadius:8, padding:'10px 18px', display:'flex', alignItems:'center', gap:10 }}>
        {pct >= 50 ? <AlertTriangle size={16} color={pct >= 75 ? RED : AMBER} /> : <CheckCircle size={16} color={GREEN} />}
        <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize: mobile ? 11 : 13, color:'#fff' }}>{label}</span>
      </div>
    </div>
  );
}

/* ── Explanation Image ── */
function ExplainImage({ imageB64 }) {
  const [err, setErr] = useState(false);
  const src = dataUriFromB64(imageB64);

  if (!src || err) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'32px 0', color:'rgba(255,255,255,0.2)' }}>
        <ImageOff size={28} />
        <span style={{ fontFamily:'Manrope, sans-serif', fontSize:12 }}>Imagem não disponível neste formato.</span>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', justifyContent:'center', background:'#0a0a0a', borderRadius:8, padding:12, border:BORDER }}>
      <img
        src={src}
        alt="Mapa de atenção GNN"
        onError={() => setErr(true)}
        style={{ maxWidth:'100%', maxHeight:360, objectFit:'contain', borderRadius:4 }}
      />
    </div>
  );
}

/* ── Raw JSON viewer ── */
function JsonViewer({ data }) {
  let text;
  try { text = JSON.stringify(data, null, 2); }
  catch { text = String(data); }

  return (
    <div style={{ background:'#0a0a0a', border:BORDER, borderRadius:8, padding:'14px 18px', maxHeight:260, overflowY:'auto' }}>
      <pre style={{ margin:0, fontFamily:'monospace', fontSize:11, color:'rgba(255,255,255,0.55)', lineHeight:1.75, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
        {text}
      </pre>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ResultsStep({ moleculeData, onRestart }) {
  const mobile = useIsMobile();
  const { smiles = '', selectedModel = '', apiResponse } = moleculeData;
  const { probability, predictedClass, imageB64, inputSmiles, canonicalSmiles } = parse(apiResponse);
  const rawResult = apiResponse?.result ?? apiResponse ?? null;

  // Color based on probability tiers
  const pct = Math.round((probability ?? 0) * 100);
  const color = pct >= 75 ? RED : pct >= 50 ? AMBER : GREEN;

  // Binary class label
  const classLabel = predictedClass === null ? null
    : predictedClass === 1 ? { text: 'Tóxico', color: pct >= 75 ? RED : AMBER }
    : { text: 'Não Tóxico', color: GREEN };

  // Bar chart data
  const barData = [];
  if (probability !== null && probability !== undefined)
    barData.push({ name: 'Probabilidade', value: +(probability * 100).toFixed(1) });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, width:'100%' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', flexDirection: mobile ? 'column' : 'row', justifyContent:'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:16, gap:12 }}>
        <div>
          <h2 style={{ margin:0, fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize: mobile ? 22 : 26, color:AMBER, fontStyle:'italic', letterSpacing:'-0.03em' }}>
            Relatório de Resultados
          </h2>
          <p style={{ margin:'6px 0 0', fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.18em', lineHeight:1.8 }}>
            Modelo:&nbsp;<span style={{ color:'rgba(255,255,255,0.5)' }}>{selectedModel}</span>&nbsp;|
            &nbsp;SMILES:&nbsp;<span style={{ color:'rgba(255,255,255,0.5)', fontFamily:'monospace', textTransform:'none' }}>{smiles}</span>
          </p>
        </div>
        <button
          onClick={onRestart}
          style={{ display:'flex', alignItems:'center', gap:6, background:AMBER, color:'#111', border:'none', cursor:'pointer', padding:'10px 18px', borderRadius:6, fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', flexShrink:0, alignSelf: mobile ? 'flex-start' : 'auto' }}
        >
          <RefreshCcw size={12} /> Nova Análise
        </button>
      </div>

      {/* ── Row 1: Gauge + Bar ── */}
      <div style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : (barData.length > 0 ? '1fr 1fr' : '1fr'), gap:14 }}>

        {/* Gauge */}
        <Card label="Probabilidade de Toxicidade" icon={Activity}>
          <Gauge prob={probability} mobile={mobile} />

          {/* Binary class — explained clearly */}
          {classLabel && (
            <div style={{ marginTop:16, background:'rgba(255,255,255,0.03)', border:BORDER, borderRadius:8, padding:'12px 16px' }}>
              <div style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>
                Classificação Binária do Modelo
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:28, color:classLabel.color, fontStyle:'italic' }}>
                  {predictedClass}
                </span>
                <div>
                  <div style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:13, color:classLabel.color }}>
                    {classLabel.text}
                  </div>
                  <div style={{ fontFamily:'Manrope, sans-serif', fontSize:10, color:'rgba(255,255,255,0.3)' }}>
                    0 = Não Tóxico · 1 = Tóxico
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Bar chart */}
        {barData.length > 0 && (
          <Card label="Score de Probabilidade" icon={Zap} accent="#00DCFF">
            <p style={{ margin:'0 0 14px', fontFamily:'Manrope, sans-serif', fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.6 }}>
              Score de probabilidade bruto retornado pelo modelo. Valores acima de 50% indicam toxicidade prevista.
            </p>
            <div style={{ width:'100%', height: mobile ? 160 : 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top:8, right:16, bottom:8, left:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill:'rgba(255,255,255,0.35)', fontSize:10 }} />
                  <YAxis tick={{ fill:'rgba(255,255,255,0.35)', fontSize:10 }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{ background:'#1e1e1e', border:BORDER, fontSize:11 }}
                    labelStyle={{ color:'#fff' }}
                    formatter={(v) => [`${v}%`, 'Probabilidade']}
                    cursor={{ fill:'rgba(255,255,255,0.03)' }}
                  />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {barData.map((_, i) => <Cell key={i} fill={color} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* ── GNN Explanation Image ── */}
      {imageB64 && (
        <Card label="Explicação Visual — Mapa de Atenção GNN" icon={FlaskConical} accent="#00DCFF">
          <p style={{ margin:'0 0 14px', fontFamily:'Manrope, sans-serif', fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.6 }}>
            Visualização de importância dos átomos gerada pela GNN. Cores mais quentes indicam os átomos que mais contribuíram para a predição de toxicidade (técnica de explicabilidade por gradiente).
          </p>
          <ExplainImage imageB64={imageB64} />
        </Card>
      )}

      {/* ── QSAR Molecule Info ── */}
      {(inputSmiles || canonicalSmiles) && (
        <Card label="Dados da Molécula Processada" icon={FlaskConical} accent="#00DCFF">
          <div style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap:10 }}>
            {[
              { label:'SMILES de Entrada', value: inputSmiles },
              { label:'SMILES Canônico (RDKit)', value: canonicalSmiles },
            ].filter(r => r.value).map(row => (
              <div key={row.label} style={{ background:'#0a0a0a', border:BORDER, borderRadius:8, padding:'12px 14px' }}>
                <div style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:9, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>
                  {row.label}
                </div>
                <div style={{ fontFamily:'monospace', fontSize:13, color:AMBER, wordBreak:'break-all' }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Raw JSON ── */}
      <Card label={`Resposta Completa da API — ${apiResponse?.api ?? ''} / ${selectedModel}`} icon={Info} accent="rgba(255,255,255,0.1)">
        <JsonViewer data={rawResult} />
      </Card>

    </div>
  );
}
