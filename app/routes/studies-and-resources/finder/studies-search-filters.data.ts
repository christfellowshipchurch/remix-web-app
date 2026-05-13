import type { SearchFilterDesktopItem } from '~/components/finders/search-filters';

export const STUDIES_FINDER_MORE_POPUP_TITLE = 'All filters';

export const STUDIES_FINDER_DESKTOP_FILTERS = [
  {
    id: 'duration',
    label: 'Duration',
    popupTitle: 'Duration',
    data: {
      showFooter: true,
      content: [{ attribute: 'duration' }],
    },
  },
  {
    id: 'audience',
    label: 'Audience',
    popupTitle: 'Audience',
    data: {
      showFooter: true,
      content: [{ attribute: 'audience' }],
    },
  },
  {
    id: 'source',
    label: 'Source',
    popupTitle: 'Source',
    data: {
      showFooter: true,
      content: [{ attribute: 'source' }],
    },
  },
  {
    id: 'topic',
    label: 'Topic',
    popupTitle: 'Topic',
    data: {
      showFooter: true,
      content: [{ attribute: 'topic' }],
    },
  },
  {
    id: 'format',
    label: 'Format',
    popupTitle: 'Format',
    data: {
      showFooter: true,
      content: [{ attribute: 'format' }],
    },
  },
] satisfies SearchFilterDesktopItem[];
