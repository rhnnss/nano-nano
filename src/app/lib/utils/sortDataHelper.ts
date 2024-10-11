interface DataItem {
  [key: string]: unknown;
}

/**
 * Sorts an array of objects putting objects with a specific property value first.
 * @param data Array of objects to sort.
 * @param propertyName Name of the property to check.
 * @param targetValue The value that should appear first in the sorted array.
 * @returns A new array sorted according to the specified criteria.
 */
export const prioritizeData = <T extends DataItem, K extends keyof T>(
  data: T[],
  propertyName: K,
  targetValue: T[K],
): T[] => {
  return data?.sort((a, b) => {
    if (a[propertyName] === targetValue) {
      return -1; // A moves to the front if it matches the target value
    } else if (b[propertyName] === targetValue) {
      return 1; // B moves to the front if it matches the target value
    }
    return 0; // No change in order for other cases
  });
};
