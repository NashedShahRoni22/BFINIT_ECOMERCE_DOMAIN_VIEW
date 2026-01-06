export const getDiscountPercent = (price, discount) => {
  const priceNum = Number(price);
  const discountNum = Number(discount);

  if (!priceNum || !discountNum || priceNum > discountNum) {
    return null;
  }

  const percent = ((discountNum - priceNum) / discountNum) * 100;

  return Math.round(percent);
};
