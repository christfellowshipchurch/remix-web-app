import type { Config } from '@react-router/dev/config';

const presets: Config['presets'] = [];

if (process.env.VERCEL) {
  const { vercelPreset } = await import('@vercel/react-router/vite');
  presets.push(vercelPreset());
}

export default {
  ssr: true,
  presets,
} satisfies Config;
