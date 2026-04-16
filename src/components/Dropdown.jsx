import React, { useState } from 'react';
import { ChevronDown, Cpu, Database, Microscope, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const models = [
  { id: 'GNN', name: 'GNN (Graph)', icon: Database },
  { id: 'MLP', name: 'MLP (Deep)', icon: Cpu },
  { id: 'RF', name: 'RF (Random Forest)', icon: Microscope },
  { id: 'SVM', name: 'SVM (Kernel)', icon: FlaskConical },
];

const Dropdown = ({ value, onChange, label = 'Motor de Predição (IA)' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeModel = models.find(m => m.id === value) || models[0];

  return (
    <div className="relative w-full">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 flex items-center justify-between group hover:border-apis-amber transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-apis-amber bg-[#4e3d11]/50 p-2 rounded-md">
            <activeModel.icon size={18} />
          </div>
          <span className="font-headline font-bold text-white uppercase tracking-tight text-sm">
            {activeModel.name}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-2xl backdrop-blur-xl"
          >
            {models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  onChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-apis-amber/10 transition-colors border-b border-white/5 last:border-none ${
                   value === model.id ? 'bg-apis-amber/5' : ''
                }`}
              >
                <div className={`${value === model.id ? 'text-apis-amber' : 'text-white/30'}`}>
                  <model.icon size={18} />
                </div>
                <span className={`font-headline font-bold text-sm tracking-tight ${
                  value === model.id ? 'text-apis-amber' : 'text-white/70'
                }`}>
                  {model.name}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
