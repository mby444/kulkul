import React from 'react';

type CheckboxGridProps = {
  options: string[];
  selectedOptions: string[];
  onChange: (option: string) => void;
};

export const CheckboxGrid: React.FC<CheckboxGridProps> = ({ options, selectedOptions, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-3 cursor-pointer p-3 border border-border bg-white rounded-xl hover:bg-black/5 transition-colors">
          <input 
            type="checkbox" 
            className="w-5 h-5 accent-primary rounded-md border-border cursor-pointer"
            checked={selectedOptions.includes(option)}
            onChange={() => onChange(option)}
          />
          <span className="text-sm font-medium text-text-main">{option}</span>
        </label>
      ))}
    </div>
  );
};
