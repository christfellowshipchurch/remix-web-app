import type { EntryContext } from 'react-router';
import {
  handleRequest as vercelHandleRequest,
  streamTimeout,
} from '@vercel/react-router/entry.server';

export { streamTimeout };

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
 * Pass the root-loader nonce into ServerRouter + renderToPipeableStream.
 * Without this, React Router's streamController.enqueue/close scripts render
 * without a nonce and are blocked by our script-src CSP — breaking hydration.
 *
 * @see https://reactrouter.com/how-to/security
 */
export default function handleRequest(
  ...args: Parameters<typeof vercelHandleRequest>
) {
  const [request, responseStatusCode, responseHeaders, routerContext, loadContext] =
    args;
  const nonce = getRootNonce(routerContext);

  return vercelHandleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    routerContext,
    loadContext,
    nonce ? { nonce } : undefined,
  );
}
