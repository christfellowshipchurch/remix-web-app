import { describe, expect, it } from 'vitest';
import {
  validateRockUrl,
  validateRockUrlString,
} from '../.server/validate-rock-url';

function requestWithTargetUrl(targetUrl?: string): Request {
  const url = new URL('http://localhost/rock-proxy');
  if (targetUrl !== undefined) {
    url.searchParams.set('url', targetUrl);
  }
  return new Request(url);
}

function expectResponse(error: unknown, status: number): void {
  expect(error).toBeInstanceOf(Response);
  expect((error as Response).status).toBe(status);
}

describe('validateRockUrl', () => {
  it('accepts an encoded Rock URL from the url query parameter', () => {
    const targetUrl =
      'https://rock.christfellowship.church/page/5886?OpportunityId=abc-123';

    expect(validateRockUrl(requestWithTargetUrl(targetUrl))).toBe(targetUrl);
  });

  it('requires a url query parameter', () => {
    try {
      validateRockUrl(requestWithTargetUrl());
      throw new Error('Expected validateRockUrl to throw');
    } catch (error) {
      expectResponse(error, 400);
    }
  });

  it('rejects malformed URLs', () => {
    try {
      validateRockUrlString('not-a-url');
      throw new Error('Expected validateRockUrlString to throw');
    } catch (error) {
      expectResponse(error, 400);
    }
  });

  it('rejects non-HTTPS Rock URLs', () => {
    try {
      validateRockUrlString('http://rock.christfellowship.church/page/5886');
      throw new Error('Expected validateRockUrlString to throw');
    } catch (error) {
      expectResponse(error, 400);
    }
  });

  it('rejects URLs on other hosts', () => {
    try {
      validateRockUrlString('https://example.com/page/5886');
      throw new Error('Expected validateRockUrlString to throw');
    } catch (error) {
      expectResponse(error, 403);
    }
  });
});
