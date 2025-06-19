import * as React from "react";
import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  "aria-label"?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  leftLabel = "Small",
  rightLabel = "Large",
  "aria-label": ariaLabel = "Slider",
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <RadixSlider.Root
        className="relative flex items-center select-none touch-none w-full h-3"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        aria-label={ariaLabel}
      >
        <RadixSlider.Track className="bg-ocean/20 relative grow rounded-full h-1">
          <RadixSlider.Range className="absolute bg-ocean rounded-full h-1" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block w-4 h-4 border-1 border-black/20 bg-white shadow-md rounded-full focus:outline-none focus:ring-1 focus:ring-ocean/10 transition" />
      </RadixSlider.Root>
      <div className="flex justify-between text-lg font-normal my-4">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default Slider;
