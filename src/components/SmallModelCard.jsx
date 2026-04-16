import React from 'react';
import { motion } from 'framer-motion';

const SmallModelCard = ({ name, description, icon: Icon, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-lg border transition-all flex flex-col gap-2 ${
        isActive 
          ? 'bg-white/5 border-apis-amber/50 ring-1 ring-apis-amber/20' 
          : 'bg-[#1a1a1a] border-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`${isActive ? 'text-apis-amber' : 'text-white/30'}`}>
          <Icon size={16} />
        </div>
        <span className={`font-headline font-bold text-xs tracking-tight ${
          isActive ? 'text-apis-amber' : 'text-white/70'
        }`}>
          {name}
        </span>
      </div>
      <p className="text-[10px] text-white/30 leading-tight">
        {description}
      </p>
    </button>
  );
};

export default SmallModelCard;
