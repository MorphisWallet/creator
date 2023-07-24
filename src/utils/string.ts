export const pascalToNormal = (str: string): string =>
  str
    // Insert a space before all found uppercase letters.
    .replace(/([A-Z])/g, ' $1')
    // Remove any leading spaces.
    .trim()
