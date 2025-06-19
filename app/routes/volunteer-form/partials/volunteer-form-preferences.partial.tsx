import React from "react";
import { INTERESTS, STRENGTHS, VolunteerFormPreferences } from "../types";
import { Button } from "~/primitives/button/button.primitive";
import Slider from "~/primitives/inputs/slider/slider.primitive";
import { Checkbox } from "~/primitives/inputs/checkbox/checkbox.primitive";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import SecureTextField from "~/primitives/inputs/text-field/secure-text-field.primitive";

interface Props {
  data: VolunteerFormPreferences;
  onChange: (
    field: keyof VolunteerFormPreferences,
    value: string[] | string | boolean
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
  const [ssnError, setSsnError] = React.useState<string | null>(null);

  const handleToggle = (field: "strengths" | "interests", value: string) => {
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
      className="flex flex-col gap-10 p-12 pt-10 mb-20 w-full max-w-[750px] mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className="heading-h4 mb-6">
        Let&apos;s explore your talents and passions to find the right fit.
      </h2>
      <div className="flex flex-col gap-8">
        <span className="text-text-primary font-bold">
          How would you describe your personality?{" "}
        </span>
        <Slider
          leftLabel="Outgoing"
          rightLabel="Reserved"
          value={data.personality ?? 50}
          min={0}
          max={100}
          onValueChange={(value) => onChange("personality", value.toString())}
        />
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-text-primary font-bold">
          How would you describe your personality?{" "}
        </span>
        <Slider
          leftLabel="People-Oriented"
          rightLabel="Task-Oriented"
          value={data.taskOriented ?? 50}
          min={0}
          max={100}
          onValueChange={(value) => onChange("taskOriented", value.toString())}
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-text-primary font-bold">
          Are you comfortable:{" "}
        </span>
        {STRENGTHS.map((strength) => (
          <Checkbox
            key={strength}
            label={strength}
            checked={data.strengths?.includes(strength) ?? false}
            onChange={() => handleToggle("strengths", strength)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-bold">What are you passionate about?</label>
        <textarea
          className={defaultTextInputStyles}
          value={""}
          rows={5}
          onChange={(e) => onChange("comments", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-bold">
          <span className="text-ocean">*</span> Which areas are you most
          interested in?{" "}
          <span className="text-text-secondary font-normal italic">
            (required)
          </span>{" "}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INTERESTS.map((interest) => (
            <Checkbox
              key={interest}
              label={interest}
              checked={data.interests?.includes(interest) ?? false}
              onChange={() => handleToggle("interests", interest)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-bold">
          <span className="text-ocean">*</span> Background Check{" "}
          <span className="text-text-secondary font-normal italic">
            (required)
          </span>{" "}
        </label>
        <div className="flex flex-col gap-3 text-text-secondary">
          <p>
            To ensure the safety of children and vulnerable individuals in our
            care, we are required to conduct a background check. This process
            requires your Social Security Number. Your information will be
            encrypted and securely transmitted to our background check partner.
            We take your privacy seriously.
          </p>
          <Checkbox
            key={"backgroundCheck"}
            label={
              "I consent to a confidential background check, and I understand that the results will be used solely for volunteer screening purposes."
            }
            checked={data.backgroundCheck ?? false}
            onChange={() => onChange("backgroundCheck", !data.backgroundCheck)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 text-text-secondary w-64">
        <SecureTextField
          value={data.ssn ?? ""}
          error={ssnError}
          setValue={(val) => onChange("ssn", val)}
          setError={setSsnError}
          label="Social Security Number"
          isRequired
          placeholder="###-##-0000"
        />
      </div>
      <div className="flex justify-center gap-4 py-18">
        <Button
          type="button"
          intent="secondary"
          className="font-normal"
          onClick={onBack}
        >
          Previous: Availability
        </Button>
        <Button type="submit" intent="primary" className="font-normal">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default VolunteerFormPreferencesPartial;
