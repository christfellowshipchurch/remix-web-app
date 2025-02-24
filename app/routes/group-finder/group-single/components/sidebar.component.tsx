import { useLoaderData } from "react-router";
import Icon from "~/primitives/icon";
import { Button } from "~/primitives/button/button.primitive";
import type { LoaderReturnType } from "../loader";

export function GroupSingleSidebar() {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col gap-2 pt-6 bg-[#F3F5FA] min-w-[324px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 px-6">
          <div className="flex gap-2">
            {data.leaders?.map((leader, i) => (
              <img
                key={i}
                src={leader.photo}
                alt={leader.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
            ))}
          </div>
          <h2 className="text-sm font-semibold text-[#666666]">Hosted by</h2>
          <div className="font-bold">
            {data.leaders?.map((leader) => leader.name).join(" & ")}
          </div>
        </div>

        <div className="flex flex-col mt-2">
          <div className="flex items-center gap-2 border-t p-6 border-[#6E6E6E]">
            <Icon name="calendarAlt" color="#0092BC" size={24} />
            <span>Thursdays, Weekly</span>
          </div>
          <div className="flex items-center gap-2 border-t p-6 border-[#6E6E6E]">
            <Icon name="alarm" size={24} color="#0092BC" />
            <span>4:30 PM EST</span>
          </div>
          <div className="flex items-center gap-2 border-t p-6 border-[#6E6E6E]">
            <Icon name="map" size={24} color="#0092BC" />
            <div className="flex flex-col">
              <span>In-person</span>
              <span>Palm Beach Gardens</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-dark-navy flex flex-col gap-6 py-8 px-6">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">More Information</h3>
            <p className="text-[#CCCCCC]">
              If you need any help, please feel free to contact us.
            </p>
          </div>
          <a
            href="mailto:groups@christfellowship.church"
            className="text-white underline hover:cursor-pointer"
          >
            groups@christfellowship.church
          </a>
        </div>

        <Button
          intent="primary"
          className="w-full hover:!bg-white hover:text-navy"
        >
          Join Group
        </Button>
        <Button
          intent="primary"
          className="w-full hover:!bg-white hover:text-navy"
        >
          Message Leader
        </Button>
      </div>
    </div>
  );
}
