import _ from 'lodash'

export function mergeObjArr(arr1, arr2, key) {
  const map2 = _.keyBy(arr2, key)
  const r = _(arr1)
    .map(m => _.merge({}, m, map2[m[key]]))
    .concat(_.differenceBy(arr2, arr1, key))
    .value()
  return r
}
