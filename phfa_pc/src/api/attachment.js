import http from '@/utils/request'

// 附件新增
export const attSave = formData => {
  // 拼接最终图片路径
  const fileName = formData?.get('file')?.name
  if (fileName) {
    // eslint-disable-next-line
    const realFileUrl = GLOBAL_APP_API_BASE_URL + '/getAttachment/' + fileName
    formData.append('requestPath', realFileUrl)
  }
  return http({
    url: '/AttachmentController/v1/attSave',
    method: 'post',
    data: formData
  })
}

// 附件删除
export const attDelete = params => {
  return http({
    url: '/AttachmentController/v1/attDelete',
    method: 'post',
    data: params
  })
}
