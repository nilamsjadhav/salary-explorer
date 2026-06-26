function formatRangeLabel(min, max, isLast) {
  const format = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };
  return isLast ? `${format(min)}+` : `${format(min)}-${format(max)}`;
}

module.exports = { formatRangeLabel };
