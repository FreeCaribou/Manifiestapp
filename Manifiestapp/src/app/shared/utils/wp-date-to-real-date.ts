// TODO Unit Test
export function wpDateToRealDate(rawValue: string): Date {
  return parseFloat(rawValue) ? new Date(parseFloat(rawValue) * 1000) : null;
}