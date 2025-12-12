import { Icon } from "~/primitives/icon/icon";
import { Button } from "~/primitives/button/button.primitive";
import { Link } from "react-router-dom";
import { MinistryService } from "../../page-builder/types";
import { Modal } from "~/primitives/Modal/modal.primitive";
import { useState } from "react";
import { getMinistryPhotoPath } from "../utils";
import TextFieldInput from "~/primitives/inputs/text-field";

const PlanMyVisitButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild>
        <Button intent="primary" size="md" className="w-full flex-1">
          Plan My Visit
        </Button>
      </Modal.Button>
      <Modal.Content>
        <div className="p-8 w-[90vw] max-w-sm">
          <h2 className="text-2xl font-bold text-center">Plan My Visit</h2>
          <p className="text-center text-neutral-400 my-6">
            We're excited to have you join us for a service at Christ Fellowship
            Church! Please fill out the form below to plan your visit.
          </p>
          <form className="flex flex-col gap-4">
            <TextFieldInput
              label="Name"
              placeholder="Name"
              value={"John Doe"}
              setValue={() => {}}
              setError={() => {}}
              error={null}
            />
            <TextFieldInput
              label="Email"
              placeholder="Email"
              value={"john.doe@example.com"}
              setValue={() => {}}
              setError={() => {}}
              error={null}
            />
          </form>
          <Button intent="primary" size="md" className="w-full mt-4">
            Submit
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

/**
 * Service Card Component
 */
export const ServiceCard = ({ service }: { service: MinistryService }) => {
  const photoPath = getMinistryPhotoPath(service.ministryType);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 w-[280px]">
      {/* Ministry Photo/Logo */}
      <div className="flex justify-center">
        <img
          src={photoPath}
          alt={service.ministryType}
          className="h-[120px] w-auto object-contain"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      {/* Schedule Information */}
      <div className="flex flex-col gap-3">
        {/* Days of Week */}
        <div className="flex items-start gap-2">
          <Icon
            name="calendarAlt"
            className="text-ocean flex-shrink-0 mt-1"
            size={20}
          />
          <p className="text-neutral-400 font-medium">{service.daysOfWeek}</p>
        </div>

        {/* Service Times */}
        <div className="flex items-start gap-2">
          <Icon
            name="timeFive"
            className="text-ocean flex-shrink-0 mt-1"
            size={20}
          />
          <p className="text-neutral-400 font-medium">{service.times}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2 ">
        {/* Primary Action Button */}
        {service.planYourVisit ? (
          <PlanMyVisitButton />
        ) : (
          <Button
            href={service.learnMoreLink}
            intent="primary"
            size="md"
            className="w-full"
            linkClassName="flex-1"
          >
            Learn More
          </Button>
        )}

        {/* Secondary Location Pin Button */}
        <Link
          to={`/locations/${service.location.pathname}`}
          className="flex items-center justify-center w-11 h-11 bg-ocean text-white rounded-md hover:bg-navy transition-colors"
          aria-label={`View ${service.location.name} location`}
        >
          <Icon name="mapFilled" className="text-white" size={20} />
        </Link>
      </div>
    </div>
  );
};
