import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { cn } from "~/lib/utils";

import { Leader, leaders } from "./leaders-data";
import { loader } from "~/routes/home/loader";
import { LeaderModalItem } from "./leaders-grid.component";
import { LeadersModal } from "~/components/modals/leaders";
import Modal from "~/primitives/Modal";

export function LeaderScroll() {
  const [openModal, setOpenModal] = useState(false);
  const { authors } = useLoaderData<typeof loader>();

  const leaderItems: LeaderModalItem[] = authors.map((author) => ({
    authorData: author,
    leaderData: leaders.find(
      (leader) => leader.pathname === author.authorAttributes.pathname
    ) as Leader,
  }));

  const seniorLeaderItem = leaderItems[0];
  const otherLeaderItems = leaderItems.slice(1, leaderItems.length);

  return (
    <div className="ml-4 md:ml-12">
      {/* Senior Leaders Card*/}
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        key={seniorLeaderItem.leaderData.name}
      >
        <Modal.Button onClick={() => setOpenModal(true)}>
          <div
            key={seniorLeaderItem.leaderData.name}
            className="relative min-w-[200px] mb-6 mr-4 md:mr-12"
          >
            <div className="relative mb-6">
              <img
                src="/assets/images/about/todd-julie.webp"
                alt={seniorLeaderItem.leaderData.name}
                className="w-full aspect-[3/2] sm:aspect-[16/9] md:aspect-[16/7] object-cover object-top rounded-[8px]"
              />
              <div
                className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                aria-label={`Learn more about ${seniorLeaderItem.leaderData.name}`}
              >
                <span className="text-2xl font-light">+</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 uppercase tracking-wider text-sm mb-1 text-start">
                {seniorLeaderItem.leaderData.role}
              </p>
              <h4 className="text-2xl font-bold text-gray-900 text-start">
                {seniorLeaderItem.leaderData.name}
              </h4>
            </div>
          </div>
        </Modal.Button>

        <Modal.Content background="bg-gray">
          <LeadersModal author={seniorLeaderItem.authorData} />
        </Modal.Content>
      </Modal>

      {/* Other Leaders */}
      <div className="flex items-start lg:items-end gap-3 overflow-scroll sm:mr-4 md:mr-12 pr-4">
        {otherLeaderItems.map((leaderModalItem, index) => (
          <MobileLeaderCard
            key={index}
            leader={leaderModalItem}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

const MobileLeaderCard = ({
  leader,
}: {
  leader: LeaderModalItem;
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      key={leader.leaderData.name}
    >
      <Modal.Button onClick={() => setOpenModal(true)}>
        <div
          key={leader.leaderData.name}
          className={cn(`group min-w-[220px] sm:min-w-none`)}
        >
          <div className="relative mb-6">
            <div className="overflow-hidden rounded-[8px]">
              <img
                src={leader.leaderData.imagePath}
                alt={leader.leaderData.name}
                className={cn(
                  "w-full aspect-[32/46] object-cover",
                  "transform transition-transform duration-300 group-hover:scale-105"
                )}
              />
            </div>
            <div
              className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
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
        </div>
      </Modal.Button>
      <Modal.Content background="bg-gray">
        <LeadersModal author={leader.authorData} />
      </Modal.Content>
    </Modal>
  );
};
