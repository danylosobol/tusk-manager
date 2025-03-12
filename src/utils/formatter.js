export const formatter = {
  enum: (value) =>
    value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/, (char) => char.toUpperCase()),
  localTimeToUTC: (localTime) => new Date(localTime).toISOString(),
  UTCtoLocalTime: (UTC) => new Date(UTC).toLocaleString(),
}
