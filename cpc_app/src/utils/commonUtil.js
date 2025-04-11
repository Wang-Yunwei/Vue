/**
 * 删除参数中空的对象
 * @param rootObj 根对象
 * @param objArr 属性数组
 */
function removeIfEmpty(rootObj, objArr) {
  if (!objArr || objArr.length === 0) {
    return
  }
  for (let i = 0; i < objArr.length; i++) {
    const obj = objArr[i]
    if (rootObj[obj]) {
      const arr = Object.values(rootObj[obj]).filter(function(item) {
        if (item !== '' && item !== null && item !== undefined) {
          return true
        }
      })
      if (arr.length === 0) {
        delete rootObj[obj]
      }
    }
  }
}

/**
 * 躲避监听,callback内执行的操作不会触发watch,用于临时避免副作用
 * @param callback 回调函数(同步),勿在内部执行异步操作
 */
function preventWatch(callback) {
  if (typeof callback === 'function') {
    const watchers = this._watchers || this._scope?.effects || []
    watchers.forEach(w => {
      if (w.user && w.active) {
        w._blind = true
        w._tempSync = w.sync
        w._tempCb = w.cb
        w.cb = () => {}
        w.sync = true
      }
    })
    try {
      callback()
    } catch (err) {
      console.error(err)
    }
    watchers.forEach(w => {
      if (w._blind) {
        w.sync = w._tempSync
        w.cb = w._tempCb
        delete w._blind
        delete w._tempSync
        delete w._tempCb
        w.get() // 重新get,防止对象替换导致watch失效
      }
    })
  } else {
    console.warn('你没有传正确的函数给preventWatch')
  }
}

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
const toMgPerDl = function(value) {
  if (!value || isNaN(value)) return ''
  return parseFloat(value) / 88.4
}

const exactVoice = function(str) {
  let age = ''
  let gender = ''
  let name = ''
  let birdthDay = ''
  // let str = '姓名朱建文性别男年龄35岁'

  const agePattern = /年龄\d+岁?/i
  var res = agePattern.exec(str)
  if (res && res.length > 0) {
    age = res[0].replace('年龄', '').replace('岁', '')
    str = str.replace(res[0], '')
  }

  const sexPattern = /性别[男女]/i
  res = sexPattern.exec(str)
  if (res && res.length > 0) {
    gender = res[0].replace('性别', '')
    str = str.replace(res[0], '')
  }

  const birthdayPattern = /出生日期\d{4}年\d{1,2}月\d{1,2}日/i
  res = birthdayPattern.exec(str)
  if (res && res.length > 0) {
    birdthDay = res[0]
      .replace('出生日期', '')
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
    str = str.replace(res[0], '')
  }

  const namePattern = /姓名\W{1,4}/i
  res = namePattern.exec(str)
  if (res && res.length > 0) {
    name = res[0]
      .replace('姓名', '')
      .replaceAll(',', '')
      .replaceAll('，', '')
    str = str.replace(res[0], '')
  }

  return {
    age,
    gender,
    name,
    birdthDay
  }
  // console.log(res, age, gender, name)
}

export {
  removeIfEmpty,
  preventWatch,
  isIdcard,
  getBirthday,
  getSex,
  toMgPerDl,
  exactVoice
}
