const isIdcard = function(idcard) {
  if (idcard === '') return false
  if (idcard.length !== 15 && idcard.length !== 18) return false
  if (idcard.match(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/) == null) return false
  return true
}

const getBirthday = function(idcard) {
  if (!isIdcard(idcard)) return null
  if (idcard.length === 18) {
    // 处理18位的身份证号码从号码中得到生日和性别代码
    return (
      idcard.substr(6, 4) +
      '/' +
      idcard.substr(10, 2) +
      '/' +
      idcard.substr(12, 2)
    )
  }
  return (
    '19' +
    idcard.substr(6, 2) +
    '/' +
    idcard.substr(8, 2) +
    '/' +
    idcard.substr(10, 2)
  )
}

const getSex = function(idcard) {
  if (!isIdcard(idcard)) return null
  const flag = idcard.slice(idcard.length - 2, idcard.length - 1)
  return parseInt(flag) % 2 === 0 ? '2' : '1'
}

export { isIdcard, getBirthday, getSex }
