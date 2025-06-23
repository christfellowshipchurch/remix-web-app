import React from "react";
import { Form } from "react-router-dom";
import type { VolunteerFormData } from "../types";

interface Props {
  data: VolunteerFormData;
  onFinish: () => void;
}

export const VolunteerFormConfirmationPartial: React.FC<Props> = ({
  data,
  onFinish,
}) => (
  <section className="flex flex-col items-center justify-center p-8 bg-white rounded shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
    <p className="mb-6 text-center">
      We are thrilled to have you join our team. [Persons Name and title] from
      your home [Campus] will contact you within [timeframe, e.g., 3-5 business
      days] to discuss potential volunteer opportunities and next steps. In the
      meantime, you can sign up for the Journey if you haven't taken it yet it
      as it is the first step for volunteering.
    </p>
    <div className="w-full mb-6">
      <h3 className="font-semibold mb-2">Personal Info</h3>
      <ul className="mb-2">
        <li>
          <strong>Name:</strong> {data.personalInfo.firstName}{" "}
          {data.personalInfo.lastName}
        </li>
        <li>
          <strong>Email:</strong> {data.personalInfo.email}
        </li>
        {data.personalInfo.phone && (
          <li>
            <strong>Phone:</strong> {data.personalInfo.phone}
          </li>
        )}
      </ul>
      <h3 className="font-semibold mb-2">Availability</h3>
      <ul className="mb-2">
        <li>
          <strong>Days:</strong> {data.availability.daysAvailable.join(", ")}
        </li>
        <li>
          <strong>Times:</strong> {data.availability.timesAvailable.join(", ")}
        </li>
      </ul>
      <h3 className="font-semibold mb-2">Preferences</h3>
      <ul className="mb-2">
        <li>
          <strong>Interests:</strong> {data.interests.interests.join(", ")}
        </li>
        {data.interests.comments && (
          <li>
            <strong>Comments:</strong> {data.interests.comments}
          </li>
        )}
      </ul>
    </div>
    <Form method="post">
      <button
        type="submit"
        className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors"
        aria-label="Finish Volunteer Form"
      >
        Finish
      </button>
    </Form>
  </section>
);

export default VolunteerFormConfirmationPartial;
