import { cn } from "~/lib/utils";
import { icons } from "~/lib/icons";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

export const AdditionalInfo = ({
  type,
}: {
  type: "contact" | "resource" | "resource-list";
}) => {
  return (
    <div className="w-full">
      {type === "contact" && <EventContact />}
      {type === "resource" && <EventResource />}
      {type === "resource-list" && <EventResourceList />}
    </div>
  );
};

const HeaderSection = ({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof icons;
}) => {
  return (
    <div className="flex gap-5">
      <Icon name={icon} color="#0092BC" size={40} />
      <div className="flex flex-col">
        <p className="text-coconut text-sm">{title}</p>
        <p className="text-white text-lg font-semibold">{subtitle}</p>
      </div>
    </div>
  );
};

const ContactDivider = ({ className }: { className?: string }) => {
  return (
    <div className={cn("bg-white opacity-30 h-[1px] w-full", className)} />
  );
};

const ContactMoreInfo = () => {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-extrabold font-lg text-white">More Information</h4>
      <p className="text-neutral-lighter">
        If you need any help, please feel free to contact us.
      </p>
      <a href="mailto:freedom@christfellowship.church" className="text-white">
        freedom@christfellowship.church
      </a>
    </div>
  );
};

const EventContact = () => {
  return (
    <div className="px-6 py-8 bg-dark-navy w-full gap-6 flex flex-col">
      <div className="flex flex-col gap-2">
        <h3 className="text-white text-2xl font-extrabold">Contact</h3>
        <p className="text-neutral-lighter">
          Flibberty floo, donk wizzle to our splat team for zibbity zaps!
        </p>
      </div>
      <ContactDivider />
      <div className="flex flex-col md:flex-row lg:flex-col gap-6">
        <div className="flex flex-col gap-6 md:w-full">
          <HeaderSection
            title="Example Info"
            subtitle="Example Info"
            icon="smartphone"
          />
          <ContactDivider className="md:hidden" />
          <HeaderSection
            title="Example Info"
            subtitle="Example Info"
            icon="map"
          />
          <ContactDivider className="md:hidden" />
          <HeaderSection
            title="Example Info"
            subtitle="Example Info"
            icon="envelope"
          />
          <ContactDivider className="md:hidden" />
        </div>

        <div className="flex flex-col gap-6 md:w-full">
          <ContactMoreInfo />
          <ContactDivider className="md:hidden" />
          <Button intent="primary">Call to Action</Button>
        </div>
      </div>
    </div>
  );
};

const EventResource = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 md:gap-6 border-neutral-lighter border-1 py-8 px-6">
        <h4 className="font-extrabold text-2xl text-text-primary leading-none">
          Event Resource
        </h4>
        <p className="text-text-secondary md:max-w-[240px]">
          Flibberty floo, donk wizzle to our splat team for zibbity zaps!
        </p>
      </div>
      <img
        src="/assets/images/events/temp-resource.jpg"
        className="md:max-h-[324px] bg-center bg-cover object-cover"
      />
      <Button
        href="#cta"
        intent="primary"
        className="rounded-none w-full underline"
      >
        Call to Action
      </Button>
    </div>
  );
};

const EventResourceList = () => {
  return (
    <div className="px-6 py-8 gap-2 flex flex-col lg:bg-gray">
      <h4 className="text-navy text-2xl font-extrabold">Resource List</h4>
      {/* TODO: Figure out Resource List from Rock */}
      <div className="flex flex-col gap-4 lg:gap-0 md:grid grid-cols-2 lg:flex lg:flex-col lg:pl-4 ">
        {["Test 1", "Test 2", "Test 3"].map((text) => (
          <div
            key={text}
            className="marker:ocean flex justify-between bg-gray lg:bg-transparent"
          >
            <div className="flex items-center gap-1 py-3 px-2 ">
              <div className="size-1 bg-ocean" />
              <h4 className="font-bold text-[16px]">{text}</h4>
            </div>
            <Icon name="chevronRight" color="black" />
          </div>
        ))}
      </div>
    </div>
  );
};
