const formatter = new Intl.DateTimeFormat("en-US", { timeStyle: 'short', dateStyle: 'short' });
export const formatDateTime = (timestamp: string | number) => {
  const date = new Date(timestamp);

  return formatter.format(date)
}
