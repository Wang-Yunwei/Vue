/**
 * 删除参数中空的对象
 * @param rootObj 根对象
 * @param objArr 属性数组
 */
const removeIfEmpty = (rootObj, objArr) => {
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
 * 避开监听,callback内执行的操作不会触发watch,用于临时避免副作用
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

export { removeIfEmpty, preventWatch }
