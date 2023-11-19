# github-schema

GitHub's GraphQL Schema

## 📦 Installation

```sh
npm install github-schema
```

## 📚 Usage

```ts
import { gql, gqlTyped } from "github-schema";

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

> [!NOTE]
> If you want to use `gql` with return type of `DocumentNode` you can do something like this:

```ts
import { gqlTyped } from "github-schema";
```

## Editor Autocompletion

> [!NOTE]
> You will need to have [GraphQL LSP](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) installed, and have a `.graphqlrc.yaml` file in your project root.  
> If you also want nice colors, i would recommend [GraphQL Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax) installed.

```yaml
# .graphqlrc.yaml
schema: node_modules/github-schema/schema.graphql
```

## 📄 License

Published under [MIT License](./LICENSE).
