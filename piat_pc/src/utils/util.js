

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function() {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = s => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
export function scorePassword(pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += variations[check] === true ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score)
}

// 辅助方法,转换汉字的节内权位
const sectionToChinese = section => {
  var chnNumChar = '零一二三四五六七八九'
  var chnUnitChar = ['', '十', '百', '千']
  let strIns = ''
  let chnStr = ''
  let unitPos = 0
  let zero = true
  while (section > 0) {
    const v = section % 10
    if (v === 0) {
      if (!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos++
    section = Math.floor(section / 10)
  }
  return chnStr === '一十' ? '十' : chnStr
}

// 数字转汉字
export const numberToChinese = (num = 0) => {
  var chnNumChar = '零一二三四五六七八九'
  var chnUnitSection = ['', '万', '亿', '万亿', '亿亿']

  let unitPos = 0
  let strIns = ''
  let chnStr = ''
  let needZero = false

  if (num === 0) {
    return chnNumChar[0]
  }

  while (num > 0) {
    const section = num % 10000
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr
    }
    strIns = sectionToChinese(section)
    strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0]
    chnStr = strIns + chnStr
    needZero = section < 1000 && section > 0
    num = Math.floor(num / 10000)
    unitPos++
  }
  return chnStr
}

// 汉字转数字
export const chineseToNumber = (chnStr = '') => {
  const chnNumChar = {
    零: 0,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9
  }
  const chnNameValue = {
    十: { value: 10, secUnit: false },
    百: { value: 100, secUnit: false },
    千: { value: 1000, secUnit: false },
    万: { value: 10000, secUnit: true },
    亿: { value: 100000000, secUnit: true }
  }
  let rtn = 0
  let section = 0
  let number = 0
  let secUnit = false
  const str = chnStr.split('')

  for (let i = 0; i < str.length; i++) {
    const num = chnNumChar[str[i]]
    if (typeof num !== 'undefined') {
      number = num
      if (i === str.length - 1) {
        section += number
      }
    } else {
      const unit = chnNameValue[str[i]].value
      secUnit = chnNameValue[str[i]].secUnit
      if (secUnit) {
        section = (section + number) * unit
        rtn += section
        section = 0
      } else {
        section += number * unit
      }
      number = 0
    }
  }
  return rtn + section
}
