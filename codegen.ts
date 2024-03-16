import type { CodegenConfig } from '@graphql-codegen/cli'

const config = {
  schema: './github-schema.graphql',
  overwrite: true,
  generates: {
    './src/github-schema.ts': {
      plugins: [
        {
          add: {
            content: '/* eslint-disable eslint-comments/no-unlimited-disable */\n/* eslint-disable */',
          },
        },
        'typescript',
      ],
      config: {
        enumsAsTypes: true,
        useImplementingTypes: true,
      },
    },
  },
} satisfies CodegenConfig

export default config
