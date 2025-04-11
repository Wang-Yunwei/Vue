import axios from '@utils/http/api'
// 数据采集服务
const getUnboundTag = params => {
  return axios({
    url: '/dataCollection/list/unboundTag',
    method: 'get',
    params: params
  })
}

const getwristbandList = hospitalId => {
  return axios({
    url: `gc/thirdParty/getwristbandList?hospitalId=${hospitalId}`,
    method: 'post'
  })
}
// 默认全部倒出
export default {
  getUnboundTag,
  getwristbandList
}
