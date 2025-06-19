import React from "react";
import type { VolunteerFormPreferences } from "../types";
import { Button } from "~/primitives/button/button.primitive";

const INTERESTS = [
  "Children",
  "Youth",
  "Music",
  "Hospitality",
  "Tech",
  "Outreach",
  "Other",
];

interface Props {
  data: VolunteerFormPreferences;
  onChange: (
    field: keyof VolunteerFormPreferences,
    value: string[] | string
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VolunteerFormPreferencesPartial: React.FC<Props> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const handleCheckbox = (interest: string) => {
    const arr = data.interests ?? [];
    if (arr.includes(interest)) {
      onChange(
        "interests",
        arr.filter((v) => v !== interest)
      );
    } else {
      onChange("interests", [...arr, interest]);
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
      <h2 className="text-xl font-semibold mb-2">What are your interests?</h2>
      <div>
        <label className="font-medium">Areas you'd like to serve:</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {INTERESTS.map((interest) => (
            <label key={interest} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={data.interests.includes(interest)}
                onChange={() => handleCheckbox(interest)}
              />
              {interest}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="font-medium">Comments:</label>
        <textarea
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="Anything else you want us to know?"
          value={data.comments ?? ""}
          onChange={(e) => onChange("comments", e.target.value)}
        />
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

export default VolunteerFormPreferencesPartial;
