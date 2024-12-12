interface RadioButtonsProps {
  options: { value: string; label: string }[];
  orientation?: "vertical" | "horizontal";
  selectedOption: string;
  onChange: (value: string) => void;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({
  options,
  orientation = "horizontal",
  selectedOption,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div
      className={
        orientation === "horizontal"
          ? "flex flex-row space-x-4"
          : "flex flex-col space-y-2"
      }
    >
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            name="option"
            value={option.value}
            className="hidden"
            checked={selectedOption === option.value}
            onChange={handleChange}
            id={`option-${option.value}`}
          />
          <span
            className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-ocean bg-white transition duration-200`}
          >
            <span
              className={`h-3 w-3 rounded-full bg-ocean ${
                selectedOption === option.value ? "" : "hidden"
              }`}
            />
          </span>
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioButtons;
