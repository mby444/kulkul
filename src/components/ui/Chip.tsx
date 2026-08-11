import React from 'react';
import { X } from 'lucide-react';

type ChipProps = {
  label: string;
  onRemove?: () => void;
  className?: string;
};

export const Chip: React.FC<ChipProps> = ({ label, onRemove, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 bg-secondary text-white px-3 py-1.5 rounded-full text-sm font-inter font-medium ${className}`}>
      <span>{label}</span>
      {onRemove && (
        <button 
          onClick={onRemove}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
