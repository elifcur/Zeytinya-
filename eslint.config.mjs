import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** Next.js 16 ships a flat config directly, so FlatCompat is not needed. */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'supabase/**',
    ],
  },

  ...coreWebVitals,
  ...typescript,

  {
    rules: {
      'no-warning-comments': [
        'warn',
        {
          terms: ['TODO', 'FIXME', 'HACK'],
          location: 'anywhere',
        },
      ],
    },
  },
];

export default eslintConfig;