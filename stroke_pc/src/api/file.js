import http from '@/utils/request'

// 上传文件
export const uploadFile = (params) => {
  const url = `/ecg/upload`
  return http({
    url: url,
    method: 'post',
    data: params,
    headers: {
      AppId: 'stroke'
    }
  })
}
