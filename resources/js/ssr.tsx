import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { Page } from '@inertiajs/core';
import { route } from 'ziggy-js';

export default createServer((page: Page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) =>
      resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob('./Pages/**/*.tsx')
      ),
    setup: ({ App, props }) => {
      // Make Ziggy's route() available globally in the SSR Node.js context.
      // The Ziggy config is shared as an Inertia prop by HandleInertiaRequests.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).route = (
        name: string,
        params?: any,
        absolute?: boolean
      ) => route(name, params, absolute, page.props.ziggy as any);

      return <App {...props} />;
    },
  })
);
