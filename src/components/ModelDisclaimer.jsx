import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const AMBER = '#FFBF00';

export default function ModelDisclaimer({ mobile }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'rgba(255, 191, 0, 0.04)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${AMBER}22`,
        borderRadius: 12,
        padding: mobile ? '12px 14px' : '16px 20px',
        display: 'flex',
        gap: mobile ? 10 : 16,
        alignItems: 'flex-start',
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <div style={{
        backgroundColor: `${AMBER}15`,
        padding: 6,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2
      }}>
        <Info size={16} color={AMBER} />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.15em',
          color: AMBER,
          textTransform: 'uppercase'
        }}>
          Domínio de Aplicabilidade
        </span>
        <p style={{
          margin: 0,
          fontFamily: 'Manrope, sans-serif',
          fontSize: mobile ? 10.5 : 12,
          lineHeight: 1.6,
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: 400
        }}>
          Estes modelos foram treinados com dados do <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>ApisTox</strong> e apresentam maior confiabilidade para compostos <span style={{ color: AMBER }}>agroquímicos/pesticidas</span>, especialmente subclasses como inseticidas, fungicidas e herbicidas. Para outras classes químicas, o uso deve ser feito com maior cautela.
        </p>
      </div>
    </motion.div>
  );
}
