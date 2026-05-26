import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import * as Avatar from '@radix-ui/react-avatar';

import { CircleLoader } from '~/primitives/loading-states/circle-loader.primitive';

import type { AuthorProps } from '../partials/hero.partial';

const DEFAULT_AUTHOR_PATHNAME = 'christ-fellowship-team';
const TODD_AND_JULIE_AUTHOR_PATHNAME = 'todd-julie-mullins';
const TODD_AUTHOR_PATHNAME = 'todd-mullins';
const JULIE_AUTHOR_PATHNAME = 'julie-mullins';

function getAuthorPathname(author: AuthorProps) {
  if (
    author?.authorAttributes?.pathname &&
    author?.authorAttributes?.pathname !== 'undefined'
  ) {
    return author.authorAttributes.pathname;
  }

  if (
    author?.authorAttributes?.authorId &&
    author?.authorAttributes?.authorId !== 'undefined'
  ) {
    return author.authorAttributes.authorId;
  }

  return DEFAULT_AUTHOR_PATHNAME;
}

function isToddAndJulieAuthor(author: AuthorProps, authorPathname: string) {
  const normalizedFullName = author.fullName.trim().toLowerCase();

  return (
    authorPathname === TODD_AND_JULIE_AUTHOR_PATHNAME ||
    normalizedFullName === 'todd and julie mullins'
  );
}

function AuthorNameLink({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  return (
    <Link
      to={`/author/${pathname}`}
      prefetch='intent'
      className='underline hover:text-text-secondary'
    >
      {children}
    </Link>
  );
}

export default function ArticleAuthor({
  author,
  publishDate,
  readTime,
}: {
  author: AuthorProps;
  publishDate: string;
  readTime: number;
}) {
  const authorPathname = getAuthorPathname(author);
  const isToddAndJulie = isToddAndJulieAuthor(author, authorPathname);
  const avatarAuthorPathname = isToddAndJulie
    ? TODD_AUTHOR_PATHNAME
    : authorPathname;

  return (
    <div className='flex'>
      <Link prefetch='intent' to={`/author/${avatarAuthorPathname}`}>
        <Avatar.Root className='flex cursor-pointer duration-300 hover:scale-105'>
          <Avatar.Image
            className='size-16 rounded-full'
            src={
              author?.photo?.uri ||
              'http://cloudfront.christfellowship.church/GetImage.ashx?guid=A62B2B1C-FDFF-44B6-A26E-F1E213285153'
            }
            alt={author?.fullName || 'Christ Fellowship Church'}
          />
          <Avatar.Fallback className='flex size-full'>
            <CircleLoader size={20} />
          </Avatar.Fallback>
        </Avatar.Root>
      </Link>

      <div className='ml-4 flex flex-col justify-center'>
        <h2 className='semibold mb-2'>
          Authored by{' '}
          {isToddAndJulie ? (
            <>
              <AuthorNameLink pathname={TODD_AUTHOR_PATHNAME}>
                Todd
              </AuthorNameLink>{' '}
              and{' '}
              <AuthorNameLink pathname={JULIE_AUTHOR_PATHNAME}>
                Julie
              </AuthorNameLink>{' '}
              Mullins
            </>
          ) : (
            <AuthorNameLink pathname={authorPathname}>
              {author?.fullName || 'Christ Fellowship Church'}
            </AuthorNameLink>
          )}
        </h2>
        <div className='flex text-neutral-500 font-normal'>
          {publishDate && (
            <p>
              {publishDate}
              <span className='mx-2'>•</span>
            </p>
          )}
          {readTime && <p>{readTime} min read</p>}
        </div>
      </div>
    </div>
  );
}
