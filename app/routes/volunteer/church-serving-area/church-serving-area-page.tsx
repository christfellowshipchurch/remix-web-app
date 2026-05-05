import { useLoaderData, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { useCopyPagePath } from '~/hooks/use-copy-page-path';
import { Button } from '~/primitives/button/button.primitive';

import { VolunteerDetailNav } from '../components/volunteer-detail/volunteer-detail-nav.component';
import { VolunteerDetailHero } from '../components/volunteer-detail/volunteer-detail-hero.component';
import { ChurchSidebarShell } from './components/church-sidebar-shell.component';
import { ChurchRoleSelector } from './components/church-role-selector.component';
import {
  ChurchIntro,
  ChurchNotSureLink,
  ChurchMobileContinueBar,
} from './partials/church-serving-area-partials.partial';
import type { LoaderReturnType } from './loader';

export function ChurchServingAreaPage() {
  const { bucket, roles } = useLoaderData<LoaderReturnType>();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const { copyPath, copied } = useCopyPagePath();

  const onBack = useCallback(() => {
    navigate('/volunteer#church');
  }, [navigate]);

  const onContinue = useCallback(() => {
    navigate('/volunteer#community');
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isVisible ? 'animate-fadeIn duration-400' : 'opacity-0'
      }`}
    >
      <article className='min-h-screen bg-white md:pb-24 flex flex-col'>
        <VolunteerDetailNav
          copied={copied}
          onCopyPath={copyPath}
          onBack={onBack}
        />

        <VolunteerDetailHero
          title={bucket.name}
          coverImage={bucket.image}
          onBack={onBack}
        />

        <div className='shrink-0 content-padding mx-auto w-full max-w-screen-content py-8 pb-0 md:py-12'>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-14 px-5 md:px-10'>
            <div className='min-w-0 space-y-6'>
              <ChurchIntro
                name={bucket.name}
                tag={bucket.tag}
                description={
                  "Take a look at the options below, pick the one that excites you the most, and then hit 'Continue' to complete your application."
                }
              />
              <ChurchNotSureLink />

              {/* Role selector — visible below intro on mobile */}
              <div className='md:hidden pb-24'>
                <ChurchRoleSelector
                  roles={roles}
                  selectedRoleId={selectedRoleId}
                  onSelect={setSelectedRoleId}
                />
              </div>
            </div>

            {/* Desktop role selector + Continue in sidebar */}
            <div className='hidden md:block'>
              <ChurchSidebarShell>
                <ChurchRoleSelector
                  roles={roles}
                  selectedRoleId={selectedRoleId}
                  onSelect={setSelectedRoleId}
                />
                <Button
                  intent='primary'
                  type='button'
                  onClick={onContinue}
                  disabled={!selectedRoleId}
                  className='w-full rounded-full min-h-12 text-base font-bold'
                >
                  Continue
                </Button>
              </ChurchSidebarShell>
            </div>
          </div>
        </div>

        <ChurchMobileContinueBar
          selectedRoleId={selectedRoleId}
          onContinue={onContinue}
        />
      </article>
    </div>
  );
}
