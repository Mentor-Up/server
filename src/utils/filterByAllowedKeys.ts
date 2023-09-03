// Record is Typescript utility type
// Record<string, any> limits to object with any number of string keys with any value type

export function filterByAllowedKeys(
  input: Record<string, any>,
  allowedKeys: string[]
): { updateData: Record<string, any>; invalidKeys: string[] } {
  const updateData: Record<string, any> = {};
  const invalidKeys: string[] = [];

  for (let key in input) {
    if (allowedKeys.includes(key)) {
      updateData[key] = input[key];
    } else {
      invalidKeys.push(key);
    }
  }

  return { updateData, invalidKeys };
}
