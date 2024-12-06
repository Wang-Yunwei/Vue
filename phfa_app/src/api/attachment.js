import http from '@utils/http'

// 附件 - 保存
export function attSave(data) {
  // 拼接最终图片路径
  const fileName = data?.get('file')?.name
  if (fileName) {
    const realFileUrl = GLOBAL_APP_API_BASE_URL + "/getAttachment/" + fileName;
    data.append('requestPath', realFileUrl)
  }
  return http({
    method: 'post',
    url: '/AttachmentController/v1/attSave',
    data: data
  })
}
// 附件 - 删除
export function attDelete(data) {
  return http({
    method: 'post',
    url: '/AttachmentController/v1/attDelete',
    data: data
  })
}
// 附件 - 列表或详情
export function attListOrDetail(data) {
  return http({
    method: 'post',
    url: '/AttachmentController/v1/attListOrDetail',
    data: data
  })
}
// 文件下载
export function download(url, method, data, fileName) {
  http({
    url: url,
    method: method,
    data: data,
    responseType: 'blob',
  }).then(res => {
    // 新建一个Blob对象
    const blob = new Blob([res])
    // 创建一个URL对象，指向Blob对象
    const url = window.URL.createObjectURL(blob)
    // 创建一个隐藏的a标签
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    // a.setAttribute('download', fileName)
    // 将a标签添加到文档中，但不显示它
    // document.body.appendChild(a)
    // 模拟点击a标签来触发下载
    a.click()
    // 清理: 从文档中移除a标签,并释放URL对象
    // document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  })
}