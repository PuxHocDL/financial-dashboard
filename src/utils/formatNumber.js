export const formatNumber = (num, isPercent = false) => {
  if (num === null || isNaN(num)) return '0';

  if (isPercent) {
    return `${(num * 100).toFixed(2)}%`;
  }

  return num.toFixed(2);
};