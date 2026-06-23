- making change to trigger vercel deployment

# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

### Algolia indexes

Algolia index names are centralized in `app/lib/algolia-indexes.ts`.
Set `ALGOLIA_INDEX_ENV` to choose which environment prefix is used:

- `ALGOLIA_INDEX_ENV=dev` resolves indexes as `dev_webv3_*`
- `ALGOLIA_INDEX_ENV=prod` resolves indexes as `prod_webv3_*`
- Missing or unrecognized values default to `dev`

The current web v3 convention is `{env}_webv3_{Name}`, for example
`prod_webv3_ContentItems`. Algolia search keys must be scoped to the matching
`dev_webv3_*` and `prod_webv3_*` index patterns. Legacy indexes such as
`dev_contentItems`, `dev_Groups`, and similar old names are not modified or
deleted by this app change.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
