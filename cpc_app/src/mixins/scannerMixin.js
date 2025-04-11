/**
 * 摄像头扫码，OCR识别
 * 1:二维码或条形码,2:身份证,3:医保卡
 * 1返回json格式
 * {
 *     "type": "1",
 *     "words_result":
 *     {
 *         "text": "扫码结果"
 *     },
 *     "image": "无"
 * }
 */
export default {
  methods: {
    /**
     * 解析二维码或条形码的扫码结果
     * @param data
     * @returns {string|*|string}
     */
    parseScanQrOrBar(data) {
      if (!data) return ''
      const result = JSON.parse(data)
      const code = result.words_result?.text || ''
      return code
    }
  }
}
