/**
 * Returns a GraphQL query string by interpolating variables into a template string.
 * @param {TemplateStringsArray} raw - The template string.
 * @param {...string} keys - The variables to interpolate.
 * @returns {string} The interpolated GraphQL query string.
 */
export function gql(raw: TemplateStringsArray, ...keys: string[]): string {
  return keys.length === 0 ? raw[0]! : String.raw({ raw }, ...keys)
}
