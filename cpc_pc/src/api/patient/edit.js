import http from '@/utils/request'

export const getPatientInfo = (params) => {
  return http({
    url: 'regist/getFillInfoAggregate',
    method: 'get',
    params
  })
}

export const save = (params) => {
  return http({
    url: 'globle/regist/save',
    method: 'post',
    data: params
  })
}

export const submit = (params) => {
  return http({
    url: '/regist/submitAudit',
    method: 'post',
    data: params
  })
}

export const withdrawAudit = params => {
  return http({
    url: '/regist/withdrawAudit',
    method: 'post',
    data: params
  })
}

export const passAudit = params => {
  return http({
    url: '/regist/passAudit',
    method: 'post',
    data: params
  })
}

export const archive = params => {
  return http({
    url: '/regist/archive',
    method: 'post',
    data: params
  })
}

export const rejectAudit = params => {
  return http({
    url: '/regist/rejectAudit',
    method: 'post',
    data: params
  })
}

export const rejectArchive = params => {
  return http({
    url: '/regist/rejectArchive',
    method: 'post',
    data: params
  })
}

export const getEcg = (registId, flag) => {
  return http({
    url: `/MedCpcEcg/getEcg/?registid=${registId}&flag=${flag}`,
    method: 'get'
  })
}

export const deleteEcg = id => {
  return http({
    url: `/MedCpcEcg/delete?id=${id}`,
    method: 'get'
  })
}

export const upload = params => {
  return http({
    headers: {
      AppId: 'chestpain'
    },
    method: 'post',
    url: '/files/base/file/upload',
    data: params
  })
}

/*
 * 绑定
 * @param params
 * @returns {*}
 */
export const bindPatient = params => {
  // const query = {
  //   ...params,
  //   hospitalArea: store.getters.curHospitalArea,
  //   hospitalId: store.getters.hospitalId
  // }
  const url = '/regist/bindPatient'
  return http({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 关联急诊救门诊住院信息
 * @param params
 * @returns {*}
 */
export const relationPatient = params => {
  // const query = {
  //   ...params,
  //   hospitalArea: store.getters.curHospitalArea,
  //   hospitalId: store.getters.hospitalId
  // }
  const url = '/regist/relationPatient'
  return http({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 同步患者信息
 * @param params
 * @returns {*}
 */
export const syncPatient = params => {
  // const query = {
  //   ...params,
  //   hospitalArea: store.getters.curHospitalArea,
  //   hospitalId: store.getters.hospitalId
  // }
  const url = '/regist/syncPatient'
  return http({
    url: url,
    method: 'post',
    data: params
  })
}
