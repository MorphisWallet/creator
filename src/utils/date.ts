import dayjs from 'dayjs'

export const formatDate = (date: Date, format = 'DD MMMM YYYY') => {
  return dayjs(date).format(format)
}
