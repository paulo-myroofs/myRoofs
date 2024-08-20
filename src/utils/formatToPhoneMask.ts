export default function formatToPhoneMask(phoneNumber: string) {
  const areaCode = phoneNumber.slice(0, 2);
  const firstPart = phoneNumber.slice(2, 7);
  const secondPart = phoneNumber.slice(7);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
}
