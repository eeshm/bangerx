import React from 'react';
import { cn } from '@/lib/utils'; // Assuming your cn utility is here

// Define the type for the component's props
interface StyledSliderProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const StyledSlider: React.FC<StyledSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}) => {
  const progress = ((value - min) / (max - min)) * 100;

  // Define the dynamic style for the track's filled portion
  const sliderStyle = {
    background: `linear-gradient(to right, #0a0a0a ${progress}%, #e5e5e5 ${progress}%)`,
  };

  return (
    <input
      type="range"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      style={sliderStyle}
      className={cn(
        // Base and track styles
        "w-full h-1 cursor-pointer appearance-none rounded-lg",
        // Thumb styles
        "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-neutral-300",
        // Active/dragged state for the thumb
        "active:[&::-webkit-slider-thumb]:bg-neutral-950",
        // Allow passing additional classes
        className
      )}
    />
  );
};

export default StyledSlider;