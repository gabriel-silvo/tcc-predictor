import React from 'react';
import { motion } from 'framer-motion';

const ModeCard = ({
  title,
  subtitle,
  description,
  icon: Icon,
  onClick,
  isActive,
  isActionable = true,
  size = 'default', // 'default' | 'compact'
}) => {
  const isCompact = size === 'compact';

  return (
    <motion.button
      whileHover={isActionable ? { y: -2, backgroundColor: 'rgba(255,191,0,0.02)' } : {}}
      whileTap={isActionable ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative w-full text-left bg-[#1a1a1a] border border-white/5 transition-all group overflow-hidden ${
        isActive ? 'ring-1 ring-apis-amber/50' : ''
      } ${!isActionable ? 'cursor-default' : 'cursor-pointer hover:border-white/10'} ${
        isCompact ? 'rounded-lg p-4 min-h-[118px]' : 'rounded-xl p-5'
      }`}
    >
      {/* Precision Left Border */}
      <div className={`absolute left-0 w-[2px] bg-[#664d00] group-hover:bg-[#FFBF00] transition-colors ${isCompact ? 'top-2 bottom-2' : 'top-3 bottom-3'}`} />

      <div className={`flex items-start ${isCompact ? 'gap-4' : 'gap-5'}`}>
        {/* Precise Icon Box (Image 4 style) */}
        <div className={`flex-shrink-0 bg-[#3d2e00] rounded-md flex items-center justify-center text-[#FFBF00] shadow-inner ${isCompact ? 'w-11 h-11' : 'w-14 h-14'}`}>
          <Icon size={isCompact ? 22 : 28} strokeWidth={1.5} />
        </div>

        <div className="flex-1 space-y-0.5 pt-0.5">
          <h3 className={`font-headline font-bold text-white group-hover:text-[#FFBF00] transition-colors tracking-tight ${isCompact ? 'text-sm md:text-base' : 'text-lg'}`}>
            {title}
          </h3>
          <p className={`font-bold uppercase tracking-[0.2em] text-white/30 ${isCompact ? 'text-[8px]' : 'text-[9px]'}`}>
            {subtitle}
          </p>
        </div>
      </div>

      <p className={`text-white/40 leading-relaxed font-body ${isCompact ? 'mt-3 text-[11px]' : 'mt-4 text-[13px]'}`}>
        {description}
      </p>

      {/* Subtle bottom detail */}
      <div className={`absolute opacity-0 group-hover:opacity-20 transition-opacity ${isCompact ? 'right-3 bottom-3' : 'right-4 bottom-4'}`}>
        <Icon size={isCompact ? 10 : 12} className="text-[#FFBF00]" />
      </div>
    </motion.button>
  );
};

export default ModeCard;
