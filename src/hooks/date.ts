import { parseISO, format } from 'date-fns'

function formatDateTime(date: string) {
  return date ? format(parseISO(date), 'yyyy-MM-dd HH:mm:ss') : ''
}

function formatDate(date: string) {
  return date ? format(parseISO(date), 'yyyy-MM-dd') : ''
}

export function useDateFns() {
  return {
    formatDate,
    formatDateTime
  }
}
