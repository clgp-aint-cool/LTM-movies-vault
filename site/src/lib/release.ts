/** 00:00 Vietnam time (UTC+7) on `date` (YYYY-MM-DD), as a timestamp */
export function releaseTimestamp(date: string) {
  return new Date(`${date}T00:00:00+07:00`).getTime();
}
