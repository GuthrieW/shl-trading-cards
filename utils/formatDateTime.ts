export const formatDateTime = (
  datetime?: string,
  dateOnly?: boolean,
): string => {
  const utcDate = datetime ? new Date(datetime) : new Date();

  const formattedDate = `${utcDate.getMonth() + 1}/${utcDate.getDate()}/${
    utcDate.getFullYear() % 100
  }`;

  let hours = utcDate.getHours();
  const minutes = utcDate.getMinutes();
  const amPm = hours >= 12 ? 'pm' : 'am';

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, '0')}${amPm}`;

  return `${formattedDate}${dateOnly ? '' : ` at ${formattedTime}`}`;
};