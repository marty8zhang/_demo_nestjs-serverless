export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-AU',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
