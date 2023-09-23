# github-schema

> GitHub's GraphQL Schema

## 📦 Installation

```sh
npm install github-schema
```

## 📚 Usage
```ts
import { gql } from "github-schema";

// we are also exporting a ton of types from the graphql schema.

const REPOSITORY_QUERY = gql`
  query getRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      nameWithOwner
      description
      pushedAt
      url
      defaultBranchRef {
        name
      }
      languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
        nodes {
          name
          color
        }
      }
    }
  }
`;
```

```yaml
# .graphqlrc.yaml
schema: node_modules/github-schema/schema.graphql
```

Published under [MIT License](./LICENCE).
