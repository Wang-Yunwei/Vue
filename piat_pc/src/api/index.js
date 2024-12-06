/**
 * 全局通用Api
 */
import request from '@utils/http/request'

const api = {
  // queryByCodeList: '/dic/base/dictionary/queryByCodeList',
  queryByCodeList: '/piat/DataDictionaryController/v1/getDictByCodes',
  // queryScoreList: '/dic/base/ratingscaleItem/queryList',
  queryScoreList: '/piat/DataDictionaryController/v1/ratingsTemplate'
}
export default api

const dicCodeMap = {
  'checkDoctorId': 'PIAT_0015', //就诊医生
  'consciousness': 'PIAT_0007', //意识
  'departmentId': 'PIAT_0014', //就诊科室
  'ERR_TYPE': 'PIAT_0017',  // 错误类型
  'eventProperty': 'PIAT_0012', //事件性质
  'gender': 'PIAT_0001', //性别
  'greenChannel': 'PIAT_0005', //绿色通道
  'idcardType': 'PIAT_0002', //证件类型
  'job': 'PIAT_0006', //职业
  'lowerRightCorner': 'PIAT_0010', //个人登记页右下角菜单按钮
  'modifyreason': 'PIAT_0011', // 修改分诊分级理由
  'nation': 'PIAT_0003', //民族
  'otherList': 'PIAT_0016', //其他
  'resetLevel': 'PIAT_0009', //分诊级别
  'slefReport': '', //主诉
  'status': 'PIAT_0013', //状态
  'toHospitalWayGroup': '', // (群体)来院方式
  'turnResult': 'PIAT_0008', //去向
  'toHospitalWay': 'PIAT_0004', //来院方式
}

//字典表参数请求
export async function queryByCodeList(params) {
  const { hospitalId = '', codeList = [] } = (params || {})
  const res = await request({
    url: api.queryByCodeList,
    method: 'post',
    data: {
      hospitalId,
      code: codeList.map(c => dicCodeMap[c] || c) // 别名映射到真实的code
    }
  })
  const result = {}
  Object.keys(res.body).forEach(k => {
    let aliasKey = k;
    Object.keys(dicCodeMap).forEach(dicKey => dicCodeMap[dicKey] === k && (aliasKey = dicKey))
    result[aliasKey] = res.body[k]  // code到别名的反向映射
  })
  return { ...res, result }
}

//字典表参数请求(score/modal)
export function queryScoreList(params) {
  return request({
    url: api.queryScoreList,
    method: 'get',
  })
}
