import React from "react";
import type { VolunteerFormPersonalInfo } from "../types";
import { Button } from "~/primitives/button/button.primitive";
import TextFieldInput from "~/primitives/inputs/text-field";
import SelectInput from "~/primitives/inputs/select-input/select-input.primitive";
import DateInput from "~/primitives/inputs/date-input/date-input.primitive";

interface Props {
  data: VolunteerFormPersonalInfo;
  onChange: (field: keyof VolunteerFormPersonalInfo, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VolunteerFormPersonalInfoPartial: React.FC<Props> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [firstNameError, setFirstNameError] = React.useState<string | null>(
    null
  );
  const [lastNameError, setLastNameError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [campusError, setCampusError] = React.useState<string | null>(null);
  const [dobError, setDobError] = React.useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-4 p-8 w-full max-w-lg mt-12"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className="heading-h4 mb-8 text-center text-pretty">
        First things first, tell us about yourself
      </h2>
      <div className="flex flex-col gap-4">
        {/* Campus Select */}
        <SelectInput
          value={data.campus ?? ""}
          error={campusError}
          setValue={(val) => onChange("campus", val)}
          setError={setCampusError}
          options={[
            { value: "", label: "Select one..." },
            { value: "Campus 1", label: "Campus 1" },
            { value: "Campus 2", label: "Campus 2" },
          ]}
          isRequired
          label="Where do you attend Christ Fellowship?"
        />
        <label className="font-bold text-text-primary text-sm -mb-2">
          <span className="text-ocean mr-1">{"*"}</span>
          Name{" "}
          <span className="font-normal italic text-text-secondary">
            (required)
          </span>
        </label>
        <div className="flex gap-4">
          <TextFieldInput
            className=""
            value={data.firstName}
            error={firstNameError}
            setValue={(val) => onChange("firstName", val)}
            setError={setFirstNameError}
            placeholder="First Name"
            isRequired
          />
          <TextFieldInput
            className=""
            value={data.lastName}
            error={lastNameError}
            setValue={(val) => onChange("lastName", val)}
            setError={setLastNameError}
            placeholder="Last Name"
            isRequired
          />
        </div>
      </div>
      <TextFieldInput
        className=""
        value={data.email}
        error={emailError}
        setValue={(val) => onChange("email", val)}
        setError={setEmailError}
        type="email"
        label="Email"
        placeholder="Example@gmail.com"
        isRequired
      />
      <TextFieldInput
        className=""
        value={data.phone ?? ""}
        error={phoneError}
        setValue={(val) => onChange("phone", val)}
        setError={setPhoneError}
        type="tel"
        label="Phone Number"
        placeholder="xxx-xxx-xxxx"
        isRequired
      />
      <DateInput
        className=""
        value={data.dateOfBirth ?? ""}
        error={dobError}
        setValue={(val) => onChange("dateOfBirth", val)}
        setError={setDobError}
        label="Date of Birth"
        isRequired
        max={new Date().toISOString().split("T")[0]}
      />
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

export default VolunteerFormPersonalInfoPartial;
