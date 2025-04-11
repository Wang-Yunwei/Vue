import moment from 'moment'

function formatter(type, val) {
  if (type === 'year') {
    return `${val}年`
  } else if (type === 'month') {
    return `${val}月`
  } else if (type === 'day') {
    return `${val}日`
  } else if (type === 'hour') {
    return `${val}时`
  } else if (type === 'minute') {
    return `${val}分`
  }
  return val
}

const calcAge = function(source) {
  if (!source) return null
  const current = moment()
  const months = current.diff(source, 'months')
  const birthSpan = {
    year: Math.floor(months / 12),
    month: Math.floor(months) % 12,
    day: Math.round((months % 1) * current.daysInMonth(), 0)
  }
  let age = birthSpan.year - 1
  if (birthSpan.month >= 0 || birthSpan.day >= 0) age++
  return age
}

const toBirthday = function(source) {
  if (!source || source.length < 8) return null
  try {
    const year = source.substr(0, 4)
    const month = source.substr(4, 2)
    const day = source.substr(6, 2)
    return new Date(year, parseInt(month) - 1, day)
  } catch (exception) {
    return null
  }
}

export default {
  formatter,
  calcAge,
  toBirthday
}
