import { renderSection } from '~/routes/page-builder/page-builder-page';
import { getCarouselCollectionBackgrounds } from '~/routes/page-builder/components/builder-utils';
import {
  familiesMappedChildren,
  spanishFamiliesMappedChildren,
} from './tabs.data';

export const ForFamilies = ({ isSpanish }: { isSpanish?: boolean }) => {
  const children = isSpanish ? spanishFamiliesMappedChildren : familiesMappedChildren;
  const backgrounds = getCarouselCollectionBackgrounds(children);

  return (
    <div className='flex flex-col w-full rounded-t-[24px] md:rounded-none bg-gray pt-20 md:pt-24'>
      {children.map((section) =>
        renderSection(section, {
          collectionBackground: backgrounds.get(section.id),
        }),
      )}
    </div>
  );
};
