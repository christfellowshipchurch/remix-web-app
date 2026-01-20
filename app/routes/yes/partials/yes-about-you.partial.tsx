import React, { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router-dom";

import { Button } from "~/primitives/button/button.primitive";
import TextFieldInput from "~/primitives/inputs/text-field";
import DateInput from "~/primitives/inputs/date-input/date-input.primitive";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { YesFormPersonalInfo } from "../types";
import { ConnectCardLoaderReturnType } from "~/routes/connect-card/types";

interface Props {
  data: YesFormPersonalInfo;
}

const YesFormPersonalInfoPartial: React.FC<Props> = ({ data }) => {
  const [formData, setFormData] = useState<YesFormPersonalInfo>(data);
  const [error, setError] = useState<string | null>(null);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [formFieldData, setFormFieldData] =
    useState<ConnectCardLoaderReturnType>({
      campuses: [],
      allThatApplies: [],
    });

  // Effect for initial data loading
  useEffect(() => {
    fetcher.load("/connect-card");
  }, []);

  // Effect for handling form data and submissions
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if ("campuses" in fetcher.data && "allThatApplies" in fetcher.data) {
        // This was the initial data load
        setFormFieldData(fetcher.data as ConnectCardLoaderReturnType);
      } else if ("error" in fetcher.data) {
        // This was a failed form submission
        setError(fetcher.data.error || "An unexpected error occurred");
      } else {
        // This was a successful form submission (not initial load, not error)
        setError(null);
        navigate("/yes/devotional");
      }
    }

    if (fetcher.state === "submitting") {
      setError(null);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const loading = fetcher.state === "submitting" || fetcher.state === "loading";

  const handleChange = (field: keyof YesFormPersonalInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataObj = new FormData(event.currentTarget);

    try {
      fetcher.submit(formDataObj, {
        method: "post",
        action: "/connect-card",
      });
    } catch {
      setError(
        "An error occurred while submitting the form. Please try again."
      );
    }
  };

  const { campuses } = formFieldData;

  return (
    <form onSubmit={handleSubmit} className="w-full content-padding">
      <div className="mx-auto flex flex-col gap-4 p-8 w-full max-w-lg bg-white rounded-[1rem] shadow-md mt-16 mb-28 lg:mt-32 lg:mb-50 xl:mt-48 xl:mb-82">
        <h2 className="heading-h4 mb-2 text-pretty">Tell us about yourself!</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4 w-full">
            <div className="flex-1">
              <TextFieldInput
                name="firstName"
                className=""
                value={formData.firstName}
                error={null}
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
                error={null}
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
          error={null}
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
          error={null}
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
          error={null}
          setValue={(val) => handleChange("dateOfBirth", val)}
          setError={() => {}}
          label="Date of Birth"
          isRequired
          max={new Date().toISOString().split("T")[0]}
        />
        <div className="flex flex-col gap-1 w-full">
          <label className="font-bold text-text-primary mb-1">
            <span className="text-ocean mr-1">{"*"}</span>
            Campus
            <span className="font-normal text-text-secondary ml-1 italic">
              {"(required)"}
            </span>
          </label>
          {campuses && campuses.length > 0 && (
            <select
              name="campus"
              className={`appearance-none ${defaultTextInputStyles}`}
              required
              style={{
                backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                backgroundSize: "24px",
                backgroundPosition: "calc(100% - 2%) center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <option value={""}>Select a Campus</option>
              {campuses.map(({ guid, name }, index) => (
                <option key={index} value={guid}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Hidden decision checkbox - marked as checked */}
        <input
          type="checkbox"
          name="decision"
          value="I made a decision to follow Christ today."
          defaultChecked
          style={{ display: "none" }}
        />
        {error && <p className="text-alert text-center">{error}</p>}
        <div className="flex justify-between mt-4 w-full">
          <Button
            type="submit"
            size="md"
            intent="primary"
            className="w-full font-normal"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default YesFormPersonalInfoPartial;
