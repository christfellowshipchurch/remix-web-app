import Modal from "~/primitives/Modal";
import { leaders } from "./leaders-data";
import { cn } from "~/lib/utils";
import { LeadersModal } from "~/components/modals/leaders";
import { Author } from "~/routes/author/loader";
import { useState, useEffect } from "react";
import { useFetcher } from "react-router";

export function LeaderScroll() {
  const seniorLeaders = leaders.slice(0, 1)[0];
  const otherLeaders = leaders.slice(1, leaders.length);

  const [openModal, setOpenModal] = useState(false);
  const [author, setAuthor] = useState<Author | null>(null);
  const fetcher = useFetcher();
  const formData = new FormData();
  formData.append("id", seniorLeaders.id);

  useEffect(() => {
    try {
      fetcher.submit(formData, {
        method: "post",
        action: "/home",
      });
    } catch (error) {
      console.log("Fetching error: ", error);
    }
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setAuthor(fetcher.data as Author);
    }
  }, [fetcher.data]);

  return (
    <div className="ml-4 md:ml-12">
      {/* Senior Leaders Card*/}
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        key={seniorLeaders.name}
      >
        <Modal.Button onClick={() => setOpenModal(true)}>
          <div
            key={seniorLeaders.name}
            className="relative min-w-[200px] mb-6 mr-4 md:mr-12"
          >
            <div className="relative mb-6">
              <img
                src="/assets/images/about/todd-julie.webp"
                alt={seniorLeaders.name}
                className="w-full aspect-[3/2] sm:aspect-[16/9] md:aspect-[16/7] object-cover object-top rounded-[8px]"
              />
              <div
                className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                aria-label={`Learn more about ${seniorLeaders.name}`}
              >
                <span className="text-2xl font-light">+</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 uppercase tracking-wider text-sm mb-1 text-start">
                {seniorLeaders.role}
              </p>
              <h4 className="text-2xl font-bold text-gray-900 text-start">
                {seniorLeaders.name}
              </h4>
            </div>
          </div>
        </Modal.Button>

        <Modal.Content background="bg-gray">
          <LeadersModal author={author} />
        </Modal.Content>
      </Modal>

      {/* Other Leaders */}
      <div className="flex items-start lg:items-end gap-3 overflow-scroll sm:mr-4 md:mr-12 pr-4">
        {otherLeaders.map((leader, index) => (
          <MobileLeaderCard key={index} leader={leader} />
        ))}
      </div>
    </div>
  );
}

const MobileLeaderCard = ({ leader }: { leader: any }) => {
  const [openModal, setOpenModal] = useState(false);
  const [author, setAuthor] = useState<Author | null>(null);
  const fetcher = useFetcher();
  const formData = new FormData();
  formData.append("id", leader.id);

  useEffect(() => {
    try {
      fetcher.submit(formData, {
        method: "post",
        action: "/home",
      });
    } catch (error) {
      console.log("Fetching error: ", error);
    }
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setAuthor(fetcher.data as Author);
    }
  }, [fetcher.data]);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal} key={leader.name}>
      <Modal.Button onClick={() => setOpenModal(true)}>
        <div
          key={leader.name}
          className={cn(
            `group min-w-[220px] sm:min-w-none`
            // index === otherLeaders.length - 1 && "pr-4 lg:pr-0"
          )}
        >
          <div className="relative mb-6">
            <div className="overflow-hidden rounded-[8px]">
              <img
                src={leader.imagePath}
                alt={leader.name}
                className={cn(
                  "w-full aspect-[32/46] object-cover",
                  "transform transition-transform duration-300 group-hover:scale-105"
                )}
              />
            </div>
            <div
              className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
              aria-label={`Learn more about ${leader.name}`}
            >
              <span className="text-2xl font-light">+</span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 uppercase tracking-wider text-sm mb-1 text-start">
              {leader.role}
            </p>
            <h4 className="text-2xl font-bold text-gray-900 text-start">
              {leader.name}
            </h4>
          </div>
        </div>
      </Modal.Button>
      <Modal.Content background="bg-gray">
        <LeadersModal author={author} />
      </Modal.Content>
    </Modal>
  );
};
