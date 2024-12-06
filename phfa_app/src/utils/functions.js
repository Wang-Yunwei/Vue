import _ from 'lodash'
export const mergeObjArr = (arr1, arr2, key) => {
  const map2 = _.keyBy(arr2, key)
  const r = _(arr1)
    .map(m => _.merge({}, m, map2[m[key]]))
    .concat(_.differenceBy(arr2, arr1, key))
    .value()
  return r
}

/**
 * 躲避监听,callback内执行的操作不会触发watch,用于临时避免副作用
 * @param callback 回调函数(同步),勿在内部执行异步操作
 */
export function preventWatch(callback) {
  if (typeof callback === 'function') {
    const watchers = this._watchers || this._scope?.effects || []
    watchers.forEach(w => {
      if (w.user && w.active) {
        w._blind = true
        w._tempSync = w.sync
        w._tempCb = w.cb
        w.cb = () => { }
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

// 清除对象中的null
export function clearNull(obj) {
  const newObj = {}
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    Object.keys(obj).forEach(k => {
      if (obj[k] !== null) {
        newObj[k] = obj[k]
      }
    })
  }
  return newObj
}
