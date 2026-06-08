import { HelpMeFindAGroupModal } from '~/components/modals';
import { Button } from '~/primitives/button/button.primitive';
import { GroupSearch } from './partials/group-search.partial';
import { FinderHero } from '../../components/finders/hero';

const leadGroupUrl =
  'https://rock.christfellowship.church/dreamteam/locations/opportunities/ministries?AreaId=2030&SetContext=Rock.Model.Campus2&CampusId=2';

export function GroupFinderPage() {
  return (
    <div className='flex flex-col min-h-svh'>
      <div className='flex-none'>
        <div className='w-full hidden md:block'>
          <FinderHero
            bgColor='navy'
            bgImage='/assets/images/groups-hero.webp'
            sectionTitle='life together'
            sectionTitleColor='#0092BC'
            title={`Find Your Group <span className="hidden md:inline">Today</span>`}
            mobileDescription=' Find a group today that will help you live the full life God intended for you.'
            desktopDescription='No matter where you are in life or your journey with God, Groups connect you with people who encourage you, support you, and help you grow. Find a group today that will help you live the full life God intended for you.'
            ctas={[
              {
                key: 'help-me-find-a-group',
                render: () => (
                  <HelpMeFindAGroupModal>
                    <Button
                      intent='secondaryWhite'
                      className='text-base font-normal'
                    >
                      Help me find a group
                    </Button>
                  </HelpMeFindAGroupModal>
                ),
              },
              {
                href: leadGroupUrl,
                title: 'Lead a group',
                intent: 'primary',
                className:
                  'text-base font-normal hover:bg-white! hover:text-ocean!',
              },
            ]}
          />
        </div>
        <div className='w-full md:hidden'>
          <FinderHero
            bgColor='navy'
            bgImage='/assets/images/groups-hero.webp'
            sectionTitle='life together'
            sectionTitleColor='#0092BC'
            title={`Find Your Group <span className="hidden md:inline">Today</span>`}
            mobileDescription=' Find a group today that will help you live the full life God intended for you.'
            desktopDescription='No matter where you are in life or your journey with God, Groups connect you with people who encourage you, support you, and help you grow. Find a group today that will help you live the full life God intended for you.'
            ctas={[
              {
                key: 'help-me-find-a-group',
                render: () => (
                  <HelpMeFindAGroupModal>
                    <Button intent='white' className='text-base font-normal'>
                      Help me find a group
                    </Button>
                  </HelpMeFindAGroupModal>
                ),
              },
              {
                href: leadGroupUrl,
                title: 'Lead a group',
                intent: 'primary',
                className:
                  'text-base font-normal hover:bg-white! hover:text-ocean!',
              },
            ]}
          />
        </div>
      </div>
      <div className='flex flex-col flex-1 w-full'>
        <GroupSearch />
      </div>
    </div>
  );
}
