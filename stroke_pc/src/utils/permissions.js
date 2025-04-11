import storage from 'store'
import { SET_INFO } from '@/store/mutation-types'

const _permission = (key) => {
  const obj = storage.get(SET_INFO)
  if (obj) {
    const pObj = JSON.parse(obj)
    if (key) {
      return pObj[key]
    }
    return pObj
  }
  return {}
}

export { _permission }
