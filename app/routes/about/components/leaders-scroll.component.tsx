import { useState } from "react";
import { cn } from "~/lib/utils";

import { Author } from "~/routes/author/types";
import { LeadersModal } from "~/components/modals/leaders";
import Modal from "~/primitives/Modal";
import { useLoaderData } from "react-router-dom";
import { loader } from "~/routes/home/loader";

export function LeaderScroll() {
  const { leadersWithArticles } = useLoaderData<typeof loader>();
  const [openModal, setOpenModal] = useState(false);

  const seniorLeaderItem = leadersWithArticles[0];
  const otherLeaderItems = leadersWithArticles.slice(
    1,
    leadersWithArticles.length
  );

  return (
    <div className="md:ml-8">
      {/* Senior Leaders Card*/}
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        key={seniorLeaderItem.authorAttributes.pathname}
      >
        <Modal.Button onClick={() => setOpenModal(true)}>
          <div
            key={seniorLeaderItem.fullName}
            className="relative min-w-[200px] mb-6 mr-4 md:mr-12"
          >
            <div className="relative mb-6 ml-4">
              <img
                src={seniorLeaderItem.profilePhoto}
                alt={seniorLeaderItem.fullName}
                className="w-full aspect-[3/2] sm:aspect-[16/9] md:aspect-[16/7] object-cover object-top rounded-lg"
              />
              <div
                className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                aria-label={`Learn more about ${seniorLeaderItem.fullName}`}
              >
                <span className="text-2xl font-light">+</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-gray-600 uppercase tracking-wider text-sm mb-1 text-start">
                {seniorLeaderItem.authorAttributes.jobTitle}
              </p>
              <h4 className="text-2xl font-bold text-gray-900 text-start">
                {seniorLeaderItem.fullName}
              </h4>
            </div>
          </div>
        </Modal.Button>

        <Modal.Content background="bg-gray">
          <LeadersModal author={seniorLeaderItem} />
        </Modal.Content>
      </Modal>

      {/* Other Leaders */}
      <div className="flex items-start lg:items-end gap-3 overflow-scroll sm:mr-4 md:mr-12 pr-4">
        {otherLeaderItems.map((leader, index) => (
          <MobileLeaderCard key={leader.id} leader={leader} index={index} />
        ))}
      </div>
    </div>
  );
}

const MobileLeaderCard = ({
  leader,
  index,
}: {
  leader: Author;
  index: number;
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      key={leader.authorAttributes.pathname}
    >
      <Modal.Button onClick={() => setOpenModal(true)}>
        <div
          key={leader.fullName}
          className={cn(
            "group min-w-[220px]",
            index === 0 && "ml-4",
            "sm:min-w-none"
          )}
        >
          <div className="relative mb-6">
            <div className="overflow-hidden rounded-lg">
              <img
                src={leader.profilePhoto}
                alt={leader.fullName}
                className={cn(
                  "w-full aspect-[32/46] object-cover",
                  "transform transition-transform duration-300 group-hover:scale-105"
                )}
              />
            </div>
            <div
              className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
              aria-label={`Learn more about ${leader.fullName}`}
            >
              <span className="text-2xl font-light">+</span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 uppercase tracking-wider text-sm mb-1 text-start">
              {leader.authorAttributes.jobTitle}
            </p>
            <h4 className="text-2xl font-bold text-gray-900 text-start">
              {leader.fullName}
            </h4>
          </div>
        </div>
      </Modal.Button>
      <Modal.Content background="bg-gray">
        <LeadersModal author={leader} />
      </Modal.Content>
    </Modal>
  );
};
