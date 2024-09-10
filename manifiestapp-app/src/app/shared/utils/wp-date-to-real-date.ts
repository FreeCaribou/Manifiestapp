// TODO-refactor Unit Test
export function wpDateToRealDate(rawValue: string, unixtime = true): Date {
  if (!rawValue || rawValue === "") {
    return null;
  }
  return unixtime ? new Date(parseFloat(rawValue) * 1000) : new Date(rawValue) || null;
}