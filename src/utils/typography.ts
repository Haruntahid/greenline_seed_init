
const BENGALI_UNICODE_RANGE = /[\u0980-\u09FF]/

export function getTextFontClass(value: string | undefined): string {
  return value && BENGALI_UNICODE_RANGE.test(value)
    ? 'font-bengali'
    : ''
}
