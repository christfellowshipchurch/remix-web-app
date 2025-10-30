import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { MoreEpisodesSearch } from "../more-episodes-search";

// Mock react-instantsearch components
vi.mock("react-instantsearch", () => ({
  InstantSearch: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="instant-search">{children}</div>
  ),
  Hits: ({
    hitComponent: HitComponent,
    classNames,
  }: {
    hitComponent: React.ComponentType<{ hit: unknown }>;
    classNames: { list: string };
  }) => (
    <div data-testid="hits" className={classNames.list}>
      <HitComponent
        hit={{
          title: "Test Episode",
          coverImage: { sources: [{ uri: "/test-image.jpg" }] },
          podcastSeason: "Season 1",
          podcastEpisodeNumber: 2,
          routing: { pathname: "/test-episode" },
        }}
      />
    </div>
  ),
  Configure: () => <div data-testid="configure" />,
}));

// Mock algoliasearch
vi.mock("algoliasearch/lite", () => ({
  liteClient: vi.fn(() => ({})),
}));

describe("MoreEpisodesSearch", () => {
  const defaultProps = {
    ALGOLIA_APP_ID: "test-app-id",
    ALGOLIA_SEARCH_API_KEY: "test-api-key",
    podcastShow: "Test Show",
    podcastSeason: "Season 1",
    currentEpisodeTitle: "Current Episode",
  };

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it("renders without crashing", () => {
    renderWithRouter(<MoreEpisodesSearch {...defaultProps} />);

    expect(screen.getByTestId("instant-search")).toBeInTheDocument();
    expect(screen.getByTestId("hits")).toBeInTheDocument();
    expect(screen.getByTestId("configure")).toBeInTheDocument();
  });

  it("renders episode title correctly", () => {
    renderWithRouter(<MoreEpisodesSearch {...defaultProps} />);

    expect(screen.getByText("Test Episode")).toBeInTheDocument();
  });

  it("renders season and episode information", () => {
    renderWithRouter(<MoreEpisodesSearch {...defaultProps} />);

    expect(screen.getByText("Season 1 | Episode 2")).toBeInTheDocument();
  });

  it("renders without current episode title", () => {
    const propsWithoutCurrentEpisode = {
      ...defaultProps,
      currentEpisodeTitle: undefined,
    };

    renderWithRouter(<MoreEpisodesSearch {...propsWithoutCurrentEpisode} />);

    expect(screen.getByTestId("instant-search")).toBeInTheDocument();
  });
});
