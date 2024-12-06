import http from '@/utils/request'

// 体格检查删除
export const genRemove = params => {
  return http({
    url: '/GeneralInspectionsController/v1/genRemove',
    method: 'post',
    data: params
  })
}
