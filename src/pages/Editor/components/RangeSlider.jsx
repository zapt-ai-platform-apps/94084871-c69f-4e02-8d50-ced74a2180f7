import React, { useState } from 'react';

const RangeSlider = ({ label, value, min, max, step = 1, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value);
  
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setCurrentValue(newValue);
    onChange(newValue);
  };
  
  // Calculate the percentage for styling
  const percentage = ((currentValue - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm text-gray-500">{currentValue}</span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="w-full cursor-pointer"
        style={{
          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
};

export default RangeSlider;