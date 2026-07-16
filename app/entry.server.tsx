import { PassThrough } from 'node:stream';

import type { AppLoadContext, EntryContext } from 'react-router';
import { createReadableStreamFromReadable } from '@react-router/node';
import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';

export const streamTimeout = 5_000;

interface RootLoaderData {
  nonce?: string;
}

function getRootNonce(routerContext: EntryContext): string | undefined {
  const rootData = routerContext.staticHandlerContext.loaderData?.root as
    | RootLoaderData
    | undefined;
  return rootData?.nonce;
}

/**
 * Custom entry.server so we can pass the root-loader CSP nonce into
 * ServerRouter + renderToPipeableStream. Without that, React Router's
 * streamController.enqueue/close scripts omit the nonce and are blocked.
 *
 * Implemented here (not via `@vercel/react-router/entry.server`) so
 * ServerRouter shares the app's React/react-router instances. Importing the
 * Vercel package leaves it externalized and splits context, which crashes
 * Layout with "useRouteLoaderData must be used within a data router".
 *
 * @see https://reactrouter.com/how-to/security
 */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  if (request.method.toUpperCase() === 'HEAD') {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  const nonce = getRootNonce(routerContext);

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? 'onAllReady'
        : 'onShellReady';

    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => abort(),
      streamTimeout + 1000,
    );

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={routerContext}
        url={request.url}
        nonce={nonce}
      />,
      {
        nonce,
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = undefined;
              callback();
            },
          });
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          if (
            process.env.VERCEL_SKEW_PROTECTION_ENABLED === '1' &&
            process.env.VERCEL_DEPLOYMENT_ID
          ) {
            responseHeaders.append(
              'Set-Cookie',
              `__vdpl=${process.env.VERCEL_DEPLOYMENT_ID}; HttpOnly`,
            );
          }

          pipe(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );
  });
}
