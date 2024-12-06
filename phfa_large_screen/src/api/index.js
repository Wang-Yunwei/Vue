/**
 * 全局通用Api
 */
import request from "@/utils/request";

const api = {
  queryPatientList24h: "/BigScreenController/v1/patientList24h",
  timeAxis: "/BigScreenController/v1/timeAxis",
  mobilityTrace: "/BigScreenController/v1/mobilityTrace",
  firstAidDetails: '/OtherController/v1/firstAidDetails',
  getDictByCodes: '/DataDictionaryController/v1/getDictByCodes',
  getAuthToken: '/CommonController/v1/login/getAuthToken',
};

// 权限登入
export function getAuthToken(params) {
  return request({
    url: '/CommonController/v1/login/getAuthToken',
    method: 'post',
    data: params
  })
}

//24小时患者列表
export function queryPatientList24h(params) {
  return request({
    url: api.queryPatientList24h,
    method: "post",
    data: params,
  });
}

//时间轴
export function timeAxis(hospitalArea) {
  return request({
    url: `${api.timeAxis}/${hospitalArea}`,
    method: "get",
  });
}

// 急救公告大屏 - 移动轨迹
export function mobilityTrace(params) {
  return request({
    url: api.mobilityTrace,
    method: "post",
    data: params
  });
}

// 指挥调度 - 获取任务详情
export function firstAidDetails(params) {
  return request({
    url: api.firstAidDetails,
    method: "post",
    data: params,
  });
}

// 字典
export const getDictByCodes = params => {
  return request({
    url: api.getDictByCodes,
    method: 'post',
    data: params
  })
}

// 急救站 - 分页列表
export const escPageList = params => {
  return request({
    url: '/pc/EmergencyStationController/v1/escPageList',
    method: 'post',
    data: params
  })
}

// 获取医院
export const getHospitals = () => {
  return request({
    url: '/CommonController/v1/getHospitals',
    method: 'get'
  })
}
