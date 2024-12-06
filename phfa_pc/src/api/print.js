import http from '@/utils/request'

// 病历打印
export const pdfMedicalRecord = patientId => {
  return http({
    url: `/pc/PdfController/v1/pdfMedicalRecord/${patientId}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 交接单打印
export const pdfDeliveryFrom = patientId => {
  return http({
    url: `/pc/PdfController/v1/pdfDeliveryFrom/${patientId}`,
    method: 'get',
    responseType: 'blob'
  })
}
