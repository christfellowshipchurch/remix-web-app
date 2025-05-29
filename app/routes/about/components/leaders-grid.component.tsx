import { useLoaderData } from "react-router";
import { useState } from "react";
import { cn } from "~/lib/utils";

import { Leader, leaders } from "./leaders-data";
import { Author } from "~/routes/author/loader";
import { loader } from "~/routes/home/loader";
import { LeadersModal } from "~/components/modals/leaders";

import { Icon } from "~/primitives/icon/icon";
import Modal from "~/primitives/Modal";

export type LeaderModalItem = {
  authorData: Author; // Rock API author data
  leaderData: Leader; // Local leader data
};

export function LeaderGrid() {
  const { authors } = useLoaderData<typeof loader>();

  const leaderModalItems: LeaderModalItem[] = authors.map((author) => ({
    authorData: author,
    leaderData: leaders.find(
      (leader) => leader.pathname === author.authorAttributes.pathname
    ) as Leader,
  }));

  return (
    <div className="flex items-start lg:items-end gap-3">
      {leaderModalItems.map((leaderModalItem, index) => (
        <LeaderCard key={index} index={index} leader={leaderModalItem} />
      ))}
    </div>
  );
}

const LeaderCard = ({
  leader,
  index,
}: {
  leader: LeaderModalItem;
  index: number;
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      key={leader.authorData.authorAttributes.pathname}
    >
      <Modal.Button
        className={cn(
          "group w-full",
          "md:w-[50%]",
          "lg:w-[25%]",
          index === 0 && "lg:w-[28%]",
          "cursor-pointer"
        )}
        onClick={() => setOpenModal(true)}
      >
        <div className="relative mb-6">
          <div className="relative overflow-hidden rounded-[8px]">
            <img
              src={leader.leaderData.imagePath}
              alt={leader.leaderData.name}
              className={cn(
                "w-full aspect-[32/46] object-cover",
                "transform transition-transform duration-300 group-hover:scale-105"
              )}
            />
            <div className="absolute size-[212px]">
              {/* TODO: Update logo to be the correct size */}
              <Icon
                name="cfLogo"
                className="opacity-75 absolute bototm-0 -left-16 object-contain size-full text-ocean group-hover:text-white transform transition-all duration-300 group-hover:-translate-y-36"
              />
            </div>
          </div>
          <div
            className="absolute right-2 -bottom-4 w-10 h-10 bg-white group-hover:bg-ocean group-hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            aria-label={`Learn more about ${leader.leaderData.name}`}
          >
            <span className="text-2xl font-light">+</span>
          </div>
        </div>

        <div>
          <p className="text-gray-600 uppercase tracking-wider text-sm mb-1 text-start">
            {leader.leaderData.role}
          </p>
          <h4 className="text-2xl font-bold text-gray-900 text-start">
            {leader.leaderData.name}
          </h4>
        </div>
      </Modal.Button>
      <Modal.Content background="bg-gray">
        <LeadersModal author={leader.authorData} />
      </Modal.Content>
    </Modal>
  );
};
