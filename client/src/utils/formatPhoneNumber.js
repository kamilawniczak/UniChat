export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return "";
  }
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  const hasCountryCode = cleanedNumber.length > 9;

  const countryCode = hasCountryCode ? `+${cleanedNumber.slice(0, -9)}` : "";
  const localNumber = cleanedNumber.slice(-9);

  const formattedNumber = localNumber.replace(
    /(\d{3})(\d{3})(\d{3})/,
    "$1-$2-$3"
  );

  return hasCountryCode ? `${countryCode} ${formattedNumber}` : formattedNumber;
}
