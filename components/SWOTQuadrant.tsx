import React from 'react';

interface SWOTQuadrantProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  color: string;
  placeholder: string;
}

const SWOTQuadrant: React.FC<SWOTQuadrantProps> = ({ title, value, onChange, color, placeholder }) => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-md p-6 h-full">
      <h2 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h2>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-grow w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none text-gray-700"
        rows={8}
      />
      <p className="text-xs text-gray-400 mt-2">Introduce cada punto en una nueva línea.</p>
    </div>
  );
};

export default SWOTQuadrant;