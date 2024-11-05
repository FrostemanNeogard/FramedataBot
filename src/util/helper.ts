export function generateInputString(input: string, name: string) {
  return name?.length > 0 ? `${input} (${name})` : input;
}
