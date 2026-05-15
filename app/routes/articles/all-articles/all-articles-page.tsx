import { DynamicHero } from '~/components';
import { AllArticles } from './partials/all-articles.partial';
import { getImageUrl } from '~/lib/utils';

export const ALL_ARTICLES_INDEX_NAME = 'dev_contentItems' as const;
export const ALL_ARTICLES_TYPE_FILTER = 'contentType:"Article"' as const;
export const ALL_ARTICLES_CATEGORY_FACET = 'articlePrimaryCategories' as const;

export function AllArticlesPage() {
  return (
    <div className='flex flex-col'>
      <div className='flex-none'>
        <DynamicHero
          customTitle='Articles'
          overlay='full'
          imagePath={getImageUrl('3143898')}
        />
      </div>
      <AllArticles />
    </div>
  );
}
