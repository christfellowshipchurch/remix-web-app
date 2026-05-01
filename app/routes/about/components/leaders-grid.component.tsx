import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { cn } from '~/lib/utils';
import { LeadersModal } from '~/components/modals/leaders';
import { Icon } from '~/primitives/icon/icon';
import Modal from '~/primitives/Modal';
import type { LeaderProfile } from './leaders-data';
import type { HomeLoaderData } from '~/routes/home/loader';

export function LeaderGrid() {
  const { leaders } = useLoaderData<HomeLoaderData>();

  return (
    <div className="flex items-start lg:items-end gap-3">
      {leaders.map((leader, index) => (
        <LeaderCard key={leader.id} index={index} leader={leader} />
      ))}
    </div>
  );
}

const LeaderCard = ({ leader, index }: { leader: LeaderProfile; index: number }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      key={leader.pathname}
    >
      <Modal.Button
        className={cn(
          'group w-full',
          'md:w-[50%]',
          'lg:w-[25%]',
          index === 0 && 'lg:w-[28%]',
          'cursor-pointer',
        )}
        onClick={() => setOpenModal(true)}
        data-leader-name={leader.fullName}
      >
        <div className="relative mb-6">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={leader.profilePhoto}
              alt={leader.fullName}
              width={320}
              height={460}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={cn(
                'w-full aspect-32/46 object-cover',
                'transform transition-transform duration-300 group-hover:scale-105',
              )}
            />
            <div className="absolute size-[212px]">
              {/* TODO: Update logo to be the correct size */}
              <Icon
                name="cfLogo"
                className="opacity-75 absolute bottom-0 -left-16 object-contain size-full text-ocean group-hover:text-white transform transition-all duration-300 group-hover:-translate-y-36"
              />
            </div>
          </div>
          <div
            className="absolute right-2 -bottom-4 w-10 h-10 bg-white group-hover:bg-ocean group-hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            aria-label={`Learn more about ${leader.fullName}`}
          >
            <span className="text-2xl font-light">+</span>
          </div>
        </div>

        <div>
          <p className="text-gray-600 uppercase tracking-wider text-sm mb-1 text-start">
            {leader.jobTitle}
          </p>
          <h4 className="text-2xl font-bold text-gray-900 text-start">
            {leader.fullName}
          </h4>
        </div>
      </Modal.Button>
      <Modal.Content background="bg-gray">
        <LeadersModal leader={leader} />
      </Modal.Content>
    </Modal>
  );
};
