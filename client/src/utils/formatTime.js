export function formatTimeDifference(timestamp) {
  const now = Date.now();
  const timeDifference = now - new Date(timestamp);
  const seconds = Math.floor(timeDifference / 1000);

  if (timeDifference < 24 * 60 * 60 * 1000) {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    return formatter.format(new Date(timestamp));
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
  } else if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return `${days}d`;
  } else if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months}m`;
  } else {
    const years = Math.floor(seconds / 31536000);
    return `${years}y`;
  }
}
