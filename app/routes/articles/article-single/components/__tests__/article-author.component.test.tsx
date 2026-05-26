import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ArticleAuthor from '../article-author.component';
import type { AuthorProps } from '../../partials/hero.partial';

const toddAndJulieAuthor: AuthorProps = {
  fullName: 'Todd and Julie Mullins',
  authorAttributes: {
    authorId: '123',
    pathname: 'todd-julie-mullins',
  },
};

function renderArticleAuthor(author: AuthorProps) {
  return render(
    <MemoryRouter>
      <ArticleAuthor
        author={author}
        publishDate='January 22, 2025'
        readTime={4}
      />
    </MemoryRouter>,
  );
}

describe('ArticleAuthor', () => {
  it('splits Todd and Julie byline links into individual author pages', () => {
    renderArticleAuthor(toddAndJulieAuthor);

    expect(screen.getByRole('link', { name: 'Todd' })).toHaveAttribute(
      'href',
      '/author/todd-mullins',
    );
    expect(screen.getByRole('link', { name: 'Julie' })).toHaveAttribute(
      'href',
      '/author/julie-mullins',
    );
    expect(screen.getByText(/Authored by/i)).toHaveTextContent(
      'Authored by Todd and Julie Mullins',
    );
  });

  it('does not link Todd and Julie content to the combined author page', () => {
    renderArticleAuthor(toddAndJulieAuthor);

    const links = screen.getAllByRole('link');
    expect(
      links.some(
        (link) => link.getAttribute('href') === '/author/todd-julie-mullins',
      ),
    ).toBe(false);
  });
});
