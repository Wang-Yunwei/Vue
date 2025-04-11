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

const getDate = function(source) {
  if (!source) return null
  let birth = null
  if (source.length === 18) {
    birth = source.substr(6, 8)
  } else if (source.length === 15) {
    birth = '19' + source.substr(6, 6)
  }
  if (!birth) return null
  return {
    full: birth,
    year: birth.substr(0, 4),
    month: birth.substr(4, 2),
    day: birth.substr(6, 2)
  }
}

const toIdcard = function(source) {
  const idcard = {
    ok: true,
    message: '',
    birthday: {}
  }
  try {
    if (!source) {
      idcard.ok = false
      idcard.message = '身份证为空'
      return idcard
    }
    if (source.length !== 18 && source.length !== 15) {
      idcard.ok = false
      idcard.message = '身份证长度不正确'
      return idcard
    }
    const birth = getDate(source)
    if (!birth) {
      idcard.ok = false
      idcard.message = '身份证出生日期错误'
      return idcard
    }
    const tempYear = new Date().getFullYear()
    if (tempYear - 250 > birth.year) {
      idcard.ok = false
      idcard.message = '身份证出生年份错误'
      return idcard
    }
    if (parseInt(birth.month) > 12 || parseInt(birth.month) < 1) {
      idcard.ok = false
      idcard.message = '身份证出生月份错误'
      return idcard
    }

    if (parseInt(birth.day) > 31 || parseInt(birth.day) < 1) {
      idcard.ok = false
      idcard.message = '身份证出生日错误'
      return idcard
    }

    idcard.birthday = toBirthday(birth.full)
    idcard.age = calcAge(idcard.birthday)
    if (idcard.age > 250 || idcard.age < 0) {
      idcard.ok = false
      idcard.message = '身份证年龄错误'
      return idcard
    }
    idcard.sex = toSex(source)
    return idcard
  } catch (e) {
    idcard.ok = false
    idcard.message = e.message
    return idcard
  }
}

const toSex = function(source) {
  if (!source) return ''
  if (source.length !== 18 && source.length !== 15) return ''
  let sex = '3'
  if (source.length === 18) sex = source.substr(16, 1)
  if (source.length === 15) sex = source.substr(14, 1)
  if (parseInt(sex) % 2 === 1) {
    return '1'
  }
  return '2'
}
const toBirthday = function(birth) {
  if (!birth || birth.length < 8) return null
  try {
    const year = birth.substr(0, 4)
    const month = birth.substr(4, 2)
    const day = birth.substr(6, 2)
    return new Date(year, parseInt(month) - 1, day)
  } catch (exception) {
    return null
  }
}

export default {
  formatter,
  calcAge,
  toSex,
  toBirthday,
  toIdcard
}
