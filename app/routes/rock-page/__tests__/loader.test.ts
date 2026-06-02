import { describe, expect, it } from 'vitest';
import { loader } from '../loader';
import { buildChurchOpportunityApplicationUrl } from '../rock-page.data';

function makeLoaderArgs(search = ''): Parameters<typeof loader>[0] {
  return {
    request: new Request(`http://localhost/rock-page${search}`),
    params: {},
    context: {},
  };
}

function expectResponse(error: unknown, status: number): void {
  expect(error).toBeInstanceOf(Response);
  expect((error as Response).status).toBe(status);
}

describe('buildChurchOpportunityApplicationUrl', () => {
  it('builds the Rock church opportunity application URL', () => {
    expect(buildChurchOpportunityApplicationUrl('abc-123')).toBe(
      'https://rock.christfellowship.church/page/5886?OpportunityId=abc-123',
    );
  });

  it('encodes opportunity IDs as query parameter values', () => {
    expect(buildChurchOpportunityApplicationUrl('abc 123?x=y')).toBe(
      'https://rock.christfellowship.church/page/5886?OpportunityId=abc+123%3Fx%3Dy',
    );
  });
});

describe('rock-page loader', () => {
  it('returns a validated Rock URL for opportunityId links', async () => {
    const result = await loader(makeLoaderArgs('?opportunityId=abc-123'));

    expect(result).toEqual({
      url: 'https://rock.christfellowship.church/page/5886?OpportunityId=abc-123',
    });
  });

  it('trims opportunityId values before building the Rock URL', async () => {
    const result = await loader(makeLoaderArgs('?opportunityId=%20abc-123%20'));

    expect(result.url).toBe(
      'https://rock.christfellowship.church/page/5886?OpportunityId=abc-123',
    );
  });

  it('keeps supporting legacy encoded url links', async () => {
    const rockUrl =
      'https://rock.christfellowship.church/page/5886?OpportunityId=abc-123';
    const searchParams = new URLSearchParams({ url: rockUrl });

    const result = await loader(makeLoaderArgs(`?${searchParams.toString()}`));

    expect(result).toEqual({ url: rockUrl });
  });

  it('rejects blank opportunityId values instead of falling back to url', async () => {
    const rockUrl = 'https://rock.christfellowship.church/page/5886';
    const searchParams = new URLSearchParams({
      opportunityId: ' ',
      url: rockUrl,
    });

    try {
      await loader(makeLoaderArgs(`?${searchParams.toString()}`));
      throw new Error('Expected loader to throw');
    } catch (error) {
      expectResponse(error, 400);
    }
  });

  it('keeps rejecting wrong-host legacy urls', async () => {
    const searchParams = new URLSearchParams({
      url: 'https://example.com/page/5886',
    });

    try {
      await loader(makeLoaderArgs(`?${searchParams.toString()}`));
      throw new Error('Expected loader to throw');
    } catch (error) {
      expectResponse(error, 403);
    }
  });

  it('keeps rejecting requests without a supported Rock URL parameter', async () => {
    try {
      await loader(makeLoaderArgs());
      throw new Error('Expected loader to throw');
    } catch (error) {
      expectResponse(error, 400);
    }
  });
});
