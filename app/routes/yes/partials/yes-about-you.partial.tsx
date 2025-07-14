import React, { useState } from "react";
import { Form, Link, useActionData } from "react-router-dom";

import { Button } from "~/primitives/button/button.primitive";
import TextFieldInput from "~/primitives/inputs/text-field";
import DateInput from "~/primitives/inputs/date-input/date-input.primitive";
import { YesFormPersonalInfo } from "../types";

interface Props {
  data: YesFormPersonalInfo;
}

const YesFormPersonalInfoPartial: React.FC<Props> = ({ data }) => {
  const actionData = useActionData<{
    errors?: Partial<Record<keyof YesFormPersonalInfo, string>>;
    defaultValues?: YesFormPersonalInfo;
  }>();

  const [formData, setFormData] = useState<YesFormPersonalInfo>(
    actionData?.defaultValues ?? data
  );

  const errors = actionData?.errors ?? {};

  const handleChange = (field: keyof YesFormPersonalInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Form
      method="post"
      action="/yes/about-you"
      className="w-full content-padding"
    >
      <div className="mx-auto flex flex-col gap-4 p-8 w-full max-w-lg bg-white rounded-[1rem] shadow-md mt-16 mb-28 lg:mt-32 lg:mb-50 xl:mt-48 xl:mb-82">
        <h2 className="heading-h4 mb-2 text-pretty">Tell us about yourself!</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4 w-full">
            <div className="flex-1">
              <TextFieldInput
                name="firstName"
                className=""
                value={formData.firstName}
                error={errors.firstName ?? null}
                setValue={(val) => handleChange("firstName", val)}
                setError={() => {}}
                label="Name"
                placeholder="First Name"
                isRequired
              />
            </div>
            <div className="flex-1">
              <TextFieldInput
                name="lastName"
                className=""
                value={formData.lastName}
                error={errors.lastName ?? null}
                setValue={(val) => handleChange("lastName", val)}
                setError={() => {}}
                placeholder="Last Name"
                isRequired
              />
            </div>
          </div>
        </div>
        <TextFieldInput
          name="email"
          className=""
          value={formData.email}
          error={errors.email ?? null}
          setValue={(val) => handleChange("email", val)}
          setError={() => {}}
          type="email"
          label="Email"
          placeholder="Example@gmail.com"
          isRequired
        />
        <TextFieldInput
          name="phone"
          className=""
          value={formData.phone ?? ""}
          error={errors.phone ?? null}
          setValue={(val) => handleChange("phone", val)}
          setError={() => {}}
          type="tel"
          label="Phone Number"
          placeholder="xxx-xxx-xxxx"
          isRequired
        />
        <DateInput
          name="dateOfBirth"
          className=""
          value={formData.dateOfBirth ?? ""}
          error={errors.dateOfBirth ?? null}
          setValue={(val) => handleChange("dateOfBirth", val)}
          setError={() => {}}
          label="Date of Birth"
          isRequired
          max={new Date().toISOString().split("T")[0]}
        />
        <div className="flex justify-between mt-4 w-full">
          <Button
            type="submit"
            size="md"
            intent="primary"
            className="w-full font-normal"
            prefetch="viewport"
          >
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default YesFormPersonalInfoPartial;
