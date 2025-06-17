import React from "react";
import type { VolunteerFormAvailability } from "../types";
import { Button } from "~/primitives/button/button.primitive";
import RadioButtons from "~/primitives/inputs/radio-buttons";
import { Checkbox } from "~/primitives/inputs/checkbox/checkbox.primitive";

const DAYS = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
const TIMES = ["Morning", "Afternoon", "Evening"];
const FREQUENCY_OPTIONS = [
  { value: "Weekly", label: "Weekly" },
  { value: "Bi-Weekly", label: "Bi-Weekly" },
  { value: "Monthly", label: "Monthly" },
];
const HOURS_OPTIONS = [
  { value: "1-2", label: "1-2 hours" },
  { value: "2-4", label: "2-4 hours" },
  { value: "4+", label: "4+ hours" },
];

interface Props {
  data: VolunteerFormAvailability & {
    frequency?: string;
    hoursPerWeek?: string;
  };
  onChange: (
    field: keyof VolunteerFormAvailability | "frequency" | "hoursPerWeek",
    value: string[] | string
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VolunteerFormAvailabilityPartial: React.FC<Props> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const handleToggle = (
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
      className="flex flex-col gap-8 p-12 py-10 w-full max-w-[725px] mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className="text-2xl font-bold mb-6">
        Please tell us when you&apos;re typically available to volunteer
      </h2>
      <div className="flex flex-col gap-8">
        <div>
          <label className="font-bold mb-7 block">
            Which days of the week are you available to volunteer?
          </label>
          <div className="grid grid-cols-7 gap-6 mt-2">
            {DAYS.map((day) => (
              <div className="flex flex-col gap-2">
                <span className="text-text-primary">{day}</span>
                <Checkbox
                  key={day}
                  checked={data.daysAvailable.includes(day)}
                  onChange={() => handleToggle("daysAvailable", day)}
                  label={""}
                  className="ml-[2px]"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="font-bold mb-6 block">
            What times are you typically available?
          </label>
          <div className="flex flex-row gap-4 mt-2">
            {TIMES.map((time) => (
              <Button
                key={time}
                type="button"
                intent={
                  data.timesAvailable.includes(time) ? "primary" : "white"
                }
                size="sm"
                className={`border-1 border-ocean font-normal text-text-primary ${
                  data.timesAvailable.includes(time)
                    ? "border-ocean text-white bg-ocean"
                    : "border-ocean/40 text-text-primary"
                } px-6 py-2 min-w-0`}
                onClick={() => handleToggle("timesAvailable", time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="font-bold mb-4 block">
            How frequently would you like to serve?
          </label>
          <RadioButtons
            options={FREQUENCY_OPTIONS}
            selectedOption={data.frequency ?? "Weekly"}
            onChange={(val) => onChange("frequency", val)}
            orientation="horizontal"
          />
        </div>
        <div>
          <label className="font-bold mb-4 block">
            How many hours a week can you volunteer?
          </label>
          <RadioButtons
            options={HOURS_OPTIONS}
            selectedOption={data.hoursPerWeek ?? "1-2"}
            onChange={(val) => onChange("hoursPerWeek", val)}
            orientation="horizontal"
          />
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-10">
        <Button
          type="button"
          intent="secondary"
          onClick={onBack}
          size="md"
          className="font-normal"
        >
          Previous: About You
        </Button>
        <Button
          type="submit"
          intent="primary"
          size="md"
          className="font-normal"
        >
          Next: Interests
        </Button>
      </div>
    </form>
  );
};

export default VolunteerFormAvailabilityPartial;
