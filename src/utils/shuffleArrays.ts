export default function shuffleArrays<T>(array1: T[], array2: T[]): T[] {
  const combinedArray: T[] = [];
  const maxLength = Math.max(array1.length, array2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < array1.length) {
      combinedArray.push(array1[i]);
    }
    if (i < array2.length) {
      combinedArray.push(array2[i]);
    }
  }

  return combinedArray;
}
