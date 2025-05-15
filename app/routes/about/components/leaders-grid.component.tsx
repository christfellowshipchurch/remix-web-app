import { Icon } from "~/primitives/icon/icon";
import { leaders } from "./leaders-data";
import { cn } from "~/lib/utils";
import Modal from "~/primitives/Modal";
import { useEffect, useState } from "react";
import { LeadersModal } from "~/components/modals/leaders";
import { Author } from "~/routes/author/loader";
import { useFetcher } from "react-router";

export function LeaderGrid() {
  return (
    <div className="flex items-start lg:items-end gap-3">
      {leaders.map((leader, index) => (
        <LeaderCard key={index} index={index} leader={leader} />
      ))}
    </div>
  );
}

const LeaderCard = ({ leader, index }: { leader: any; index: number }) => {
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
              src={leader.imagePath}
              alt={leader.name}
              className={cn(
                "w-full aspect-[32/46] object-cover",
                "transform transition-transform duration-300 group-hover:scale-105"
              )}
            />
            <div className="absolute size-[212px]">
              {/* TOOD: Update logo to be the correct size */}
              <Icon
                name="cfLogo"
                className="opacity-75 absolute bototm-0 -left-16 object-contain size-full text-ocean group-hover:text-white transform transition-all duration-300 group-hover:-translate-y-36"
              />
            </div>
          </div>
          <div
            className="absolute right-2 -bottom-4 w-10 h-10 bg-white group-hover:bg-ocean group-hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
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
      </Modal.Button>
      <Modal.Content background="bg-gray">
        <LeadersModal author={author} />
      </Modal.Content>
    </Modal>
  );
};
