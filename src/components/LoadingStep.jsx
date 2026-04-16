import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, FlaskConical } from 'lucide-react';

const LoadingStep = ({ model }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 animate-pulse">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="text-apis-amber"
        >
          <Hexagon size={120} strokeWidth={1} />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center text-apis-amber">
          <FlaskConical size={40} />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="font-headline font-bold text-2xl uppercase tracking-widest text-apis-amber">
          Processando Molécula
        </h3>
        <p className="text-white/40 font-medium tracking-tight">
          Utilizando o motor {model} para calcular matrizes de toxicidade...
        </p>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-apis-amber rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingStep;
