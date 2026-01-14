export const formatPrice = (price, currencySymbol = "$") => {
  const formatted = new Intl.NumberFormat().format(price);
  return `${currencySymbol} ${formatted}`;
};
