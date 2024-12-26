export default function formatCurrency(value: number): string {
  // Convert the number to an integer
  let integerPart = Math.floor(value).toString();

  // Format the integer part with dots every three digits
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Concatenate the formatted integer part with the currency symbol
  const formattedValue = `R$ ${integerPart}`;

  return formattedValue;
}
