import React from "react";
import type { VolunteerFormPersonalInfo } from "../types";
import { Button } from "~/primitives/button/button.primitive";

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
}) => (
  <form
    className="flex flex-col gap-4 p-8 bg-white rounded shadow-md w-full max-w-md"
    onSubmit={(e) => {
      e.preventDefault();
      onNext();
    }}
  >
    <h2 className="text-xl font-semibold mb-2">Tell us about yourself</h2>
    <input
      className="border rounded px-3 py-2"
      type="text"
      placeholder="First Name"
      value={data.firstName}
      onChange={(e) => onChange("firstName", e.target.value)}
      required
    />
    <input
      className="border rounded px-3 py-2"
      type="text"
      placeholder="Last Name"
      value={data.lastName}
      onChange={(e) => onChange("lastName", e.target.value)}
      required
    />
    <input
      className="border rounded px-3 py-2"
      type="email"
      placeholder="Email"
      value={data.email}
      onChange={(e) => onChange("email", e.target.value)}
      required
    />
    <input
      className="border rounded px-3 py-2"
      type="tel"
      placeholder="Phone (optional)"
      value={data.phone ?? ""}
      onChange={(e) => onChange("phone", e.target.value)}
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

export default VolunteerFormPersonalInfoPartial;
