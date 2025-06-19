import React from "react";
import type { VolunteerFormAvailability } from "../types";
import { Button } from "~/primitives/button/button.primitive";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const TIMES = ["Morning", "Afternoon", "Evening"];

interface Props {
  data: VolunteerFormAvailability;
  onChange: (field: keyof VolunteerFormAvailability, value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VolunteerFormAvailabilityPartial: React.FC<Props> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const handleCheckbox = (
    field: keyof VolunteerFormAvailability,
    value: string
  ) => {
    const arr = data[field] ?? [];
    if (arr.includes(value)) {
      onChange(
        field,
        arr.filter((v) => v !== value)
      );
    } else {
      onChange(field, [...arr, value]);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 p-8 bg-white rounded shadow-md w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className="text-xl font-semibold mb-2">
        When are you available to volunteer?
      </h2>
      <div>
        <label className="font-medium">Days:</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {DAYS.map((day) => (
            <label key={day} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={data.daysAvailable.includes(day)}
                onChange={() => handleCheckbox("daysAvailable", day)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="font-medium">Times:</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {TIMES.map((time) => (
            <label key={time} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={data.timesAvailable.includes(time)}
                onChange={() => handleCheckbox("timesAvailable", time)}
              />
              {time}
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button type="button" intent="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" intent="primary">
          Next
        </Button>
      </div>
    </form>
  );
};

export default VolunteerFormAvailabilityPartial;
