import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type RefObject,
  type ReactNode,
} from 'react';
import { useFetcher, useLoaderData } from 'react-router-dom';
import type { Author } from '~/routes/author/types';
import type { HomeLoaderData } from '~/routes/home/loader';

type LeadersArticlesContextValue = {
  leadersWithArticles: Author[];
  isArticlesLoading: boolean;
};

const LeadersArticlesContext =
  createContext<LeadersArticlesContextValue | null>(null);

export function LeadersArticlesProvider({
  children,
  sectionRef,
}: {
  children: ReactNode;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const initial = useLoaderData<HomeLoaderData>();
  const fetcher = useFetcher<{ leadersWithArticles: Author[] }>();
  const hasRequestedRef = useRef(false);
  const loadRef = useRef(fetcher.load);
  loadRef.current = fetcher.load;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasRequestedRef.current) {
          return;
        }
        hasRequestedRef.current = true;
        loadRef.current('/home-leaders-articles');
      },
      { rootMargin: '400px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionRef]);

  const leadersWithArticles =
    fetcher.data?.leadersWithArticles ?? initial.leadersWithArticles;
  const isArticlesLoading =
    fetcher.state === 'loading' && fetcher.data === undefined;

  const value: LeadersArticlesContextValue = {
    leadersWithArticles,
    isArticlesLoading,
  };

  return (
    <LeadersArticlesContext.Provider value={value}>
      {children}
    </LeadersArticlesContext.Provider>
  );
}

export function useLeadersWithArticles(): LeadersArticlesContextValue {
  const ctx = useContext(LeadersArticlesContext);
  const loaderData = useLoaderData<HomeLoaderData>();
  if (!ctx) {
    return {
      leadersWithArticles: loaderData.leadersWithArticles,
      isArticlesLoading: false,
    };
  }
  return ctx;
}
