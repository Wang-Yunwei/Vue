import axios from '@utils/http/api'

// 保存心电图信息
const saveQrTime = params => {
  const url = `/qr/time`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

// 默认全部倒出
export default {
  saveQrTime
}
