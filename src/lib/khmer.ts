const KHMER_DIGITS = ['០','១','២','៣','៤','៥','៦','៧','៨','៩']

export function toKhmerDigits(input?: string | number | null): string | null {
  if (input === undefined || input === null) return null
  return String(input).replace(/\d/g, (d) => KHMER_DIGITS[Number(d)])
}

export function formatDateToDDMMYYYYKhmer(dateInput?: string | Date | null): string | null {
  if (!dateInput) return null
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (Number.isNaN(d.getTime())) return null
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = String(d.getFullYear())
  return toKhmerDigits(`${dd}/${mm}/${yyyy}`)
}
