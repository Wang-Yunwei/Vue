import axios from 'axios'
export default {
  methods: {
    //导出excel
    async downFile(url, param, fileName) {
      if (!url) return
      const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
      const downUrl = window.GLOBAL_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL
      axios({
        method: 'post',
        url: downUrl,
        responseType: 'blob',
        data: param
      }).then(res => {
        this.handleExport(res.data, fileName)
      })
    },
    //导出功能
    handleExport(data, fileName) {
      if (!data) return
      const blob = new Blob([data], { type: 'application/octet-stream' })
      if ('download' in document.createElement('a')) {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        window.navigator.msSaveBlob(blob, fileName)
      }
    }
  }
}
