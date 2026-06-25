const currencyLocaleMap = {
  INR: "en-IN",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "de-DE",
  JPY: "ja-JP",
  AUD: "en-AU",
  CAD: "en-CA",
  AED: "ar-AE",
  SGD: "en-SG",
  KRW: "ko-KR",
  MXN: "es-MX",
  BRL: "pt-BR",
  CNY: "zh-CN",
};

export function formatSalary(amount, currency = "INR") {
  const locale = currencyLocaleMap[currency] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
