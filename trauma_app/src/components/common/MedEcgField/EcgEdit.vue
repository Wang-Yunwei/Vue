<template>
  <div class="med-ecg-edit-wrapper">
    <div class="uploader">
      <h3 :class="disabled ? 'title_disabled' : ''">
        {{ disabled ? "点击查看图片" : "点击上传图片" }}
      </h3>
      <van-uploader ref="upload" class="med-ecg-uploader" v-model="ecg.uploadList" :deletable="!disabled && !readonly" :after-read="afterRead" :before-delete="beforeDelete" :maxSize="20 * 1024 * 1024" maxCount="1" multiple capture="camera" accept="image/*" :disabled="disabled" @click-preview="openPreview" @close-preview="closePreview" @click-upload="clickUpload" />
    </div>
    <div>
      <van-form @submit="onSaveRecord">
        <div class="med-ecg-uploader-info">
          <med-date-picker label="完成时间" v-model="ecg.checkTime" :disabled="disabled" />
          <med-date-picker label="诊断时间" v-model="ecg.diagnosisTime" :disabled="disabled" />
        </div>
        <div class="med-ecg-uploader-btn">
          <van-button v-if="!disabled && !readonly" :disabled="isuploading" native-type="submit" block round type="info" size="normal">
            保存
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import * as types from '@/store/mutations-types'
export default {
  name: 'MedEcgEdit',
  props: {
    ecg: {
      type: Object,
      default: () => { }
    },
    uploadUrl: {
      // 前缀 字符串
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    enabledReason: {
      type: Boolean,
      default: false
    },
    uploadImage: {
      // 上传方法 接受formdata,返回 filePath,thumbFilePath
      type: Function,
      required: true
    },
    updateRecord: {
      // 保存心电图记录
      type: Function,
      required: true
    }
  },
  model: {
    prop: 'records',
    event: '_change'
  },
  data() {
    return {
      quality: 0.85,
      picture: '',
      isuploading: false,
      resultOptions: [
        { label: '正常', name: '心电图检查结果', value: '1' },
        { label: '异常', name: '心电图检查结果', value: '0' }
      ],
      exceptionOptions: storage.get(types.SET_DICTIONARY)?.ecgExceptionOpts
    }
  },
  mounted() {
    this.$bridge.takePhotoCallback(res => {
      this.takePhotoCallback(res)
    })
  },
  computed: {
    getIos() {
      var ua = navigator.userAgent.toLowerCase()
      if (ua.match(/iPhone\sOS/i)) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    clickUpload() {
      this.$bridge.takePhoto()
    },
    takePhotoCallback(base64Data) {
      const file = this.base64ToFile(
        'data:image/jpeg;base64,' + base64Data,
        'ecg.png'
      )
      this.doUploadFile(file)
    },
    // 将base64转换为blob
    base64ToFile(urlData, fileName) {
      const arr = urlData.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bytes = atob(arr[1]) // 解码base64
      let n = bytes.length
      const ia = new Uint8Array(n)
      while (n--) {
        ia[n] = bytes.charCodeAt(n)
      }
      return new File([ia], fileName, { type: mime })
    },
    async onSaveRecord() {
      this.isuploading = true
      if (!this.ecg.ecgFile) {
        this.$notify({ type: 'warning', message: '请上传图片！' })
        this.isuploading = false
        return
      }
      // if (!this.ecg.ecgTime) {
      //   this.$notify({ type: 'warning', message: '请填写心电图完成时间！' })
      //   return
      // }
      // if (!this.ecg.diagTime) {
      //   this.$notify({ type: 'warning', message: '请填写心电图诊断时间！' })
      //   return
      // }
      if (this.enabledReason) {
        // if (this.ecg.ecgDiagnosis === '0' && !this.ecg.ecgException) {
        //   this.$notify({ type: 'warning', message: '请填写异常原因！' })
        //   return
        // }
        // if (
        //   this.ecg.ecgDiagnosis === '0' &&
        //   this.ecg.ecgException.indexOf('99') &&
        //   !this.ecg.ecgExceptionOther
        // ) {
        //   this.$notify({ type: 'warning', message: '请填写其他原因！' })
        //   return
        // }
      }
      try {
        const res = await this.updateRecord(this.ecg)
        this.isuploading = false
        // if (!res) {
        //   debugger
        //   this.$notify({ type: 'warning', message: '心电图保存失败！' })
        // }
      } catch (e) {
        this.isuploading = false
        this.$notify({ type: 'warning', message: e.message })
      }
    },
    async afterRead(file, detail) {
      this.imagePreview(file, detail)
      return true
    },
    async doUploadFile(file) {
      this.isuploading = true
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await this.uploadImage(formData)
        if (res) {
          this.picture = res.filePath
          this.ecg.ecgFile = this.uploadUrl
            ? this.uploadUrl + this.picture
            : this.picture
          this.ecg.uploadList = this.ecg.ecgFile
            .split(';')
            .map(item => ({
              url: item,
              isImage: true
            }))
            .filter(el => el.url)
          this.ecg.uploadUrl = this.uploadUrl
          this.ecg.path = this.picture
          this.ecg.thumb = res.thumbFilePath
          this.isuploading = false
        } else {
          this.isuploading = false
          throw new Error(
            `心电图上传失败，原因：${res ? res.message : '未知错误'}`
          )
        }
      } catch (err) {
        this.isuploading = false
        this.ecg.uploadList = []
        this.ecg.ecgFile = null
        this.$notify({ type: 'warning', message: err.message })
      }
    },
    beforeRead(file, detail) {
      return true
    },
    imagePreview(_file, detail) {
      if (!_file || !_file.file || !window.FileReader) return
      const file = _file.file
      const size = file.size / 1024
      if (/^image/.test(file.type) && size >= 1024) {
        const self = this
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function () {
          const result = this.result
          const img = new Image()
          img.src = result
          img.onload = function () {
            const data = self.doCompress(img, file.name, file.type)
            _file.content = data.base64
            _file.file = data.fileData
            // self.$notify({ type: 'warning', message: _file.file.size })
            self.doUploadFile(_file.file)
          }
        }
      } else {
        this.doUploadFile(_file.file)
      }
    },
    doCompress(img, name, type) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const tCanvas = document.createElement('canvas')
      const tctx = tCanvas.getContext('2d')
      let width = img.width
      let height = img.height

      let ratio = (width * height) / 4000000
      if (ratio > 1) {
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      let count = (width * height) / 896000
      if (count > 1) {
        count = ~~(Math.sqrt(count) + 1)
        const nw = ~~(width / count)
        const nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            )
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      const ndata = canvas.toDataURL('image/jpeg', this.quality)
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return { base64: ndata, fileData: this.dataUrlToFile(ndata, name, type) }
    },
    dataUrlToFile(dataurl, name, type) {
      name = name || '图片'
      type = type || 'jpg'
      var arr = dataurl.split(',')
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], name, {
        type: type
      })
    },
    splitContent(content) {
      if (!content) return content
      const segments = content.split('base64,')
      const formatSegment = segments[0].split('data:')[1]
      return {
        format: formatSegment.split(';')[0],
        data: segments[1]
      }
    },
    compress(format, content, width, callback) {
      const maxSize = 1024 * 1024
      if (content.length < maxSize) {
        callback(content)
        return
      }
      var newImage = new Image()
      var quality = 0.8 // 压缩系数0-1之间
      newImage.src = content
      newImage.setAttribute('crossOrigin', 'Anonymous') // url为外域时需要
      var imgWidth, imgHeight
      newImage.onload = function () {
        imgWidth = this.width
        imgHeight = this.height
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        if (Math.max(imgWidth, imgHeight) > width) {
          if (imgWidth > imgHeight) {
            canvas.width = width
            canvas.height = (width * imgHeight) / imgWidth
          } else {
            canvas.height = width
            canvas.width = (width * imgWidth) / imgHeight
          }
        } else {
          canvas.width = imgWidth
          canvas.height = imgHeight
          quality = 0.8
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
        var base64 = canvas.toDataURL(format, quality) // 压缩语句
        // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
        while (base64.length > maxSize) {
          quality -= 0.01
          base64 = canvas.toDataURL(format, quality)
        }
        // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
        // while (base64.length / 1024 < 50) {
        // 	quality += 0.001;
        // 	base64 = canvas.toDataURL("image/jpeg", quality);
        // }
        callback(base64) // 必须通过回调函数返回，否则无法及时拿到该值
      }
    },
    beforeDelete(params) {
      // this.ecg.uploadList = this.ecg.uploadList.filter(
      //   el => el.url !== params.url
      // )
      // const pictures = this.picture ? this.picture.split(';') : []
      // const newPics = pictures.filter(ele => ele !== params.url)
      // this.picture = newPics.join(';')
      // this.ecg.ecgFile = this.picture
      this.ecg.uploadList = []
      this.ecg.ecgFile = null
    },
    openPreview() {
      this.$backhelper.push(() => {
        this.$refs.upload.closeImagePreview()
      })
    },
    closePreview() {
      this.$backhelper.pop()
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.med-ecg-edit-wrapper {
  .uploader {
    padding: 32px 32px 0 32px;
  }

  h3 {
    font-size: 30px;
  }

  .title_disabled {
    color: #c8c9cc;
  }

  .med-ecg-uploader {
    margin-top: 20px;
    width: 100%;

    .van-uploader__wrapper {
      width: 100%;

      .van-uploader__upload {
        width: 100%;
        margin: 0;
      }
    }
  }

  .med-ecg-uploader-info {
    // margin-top: 16px;
  }

  .med-ecg-uploader-btn {
    padding: 32px 32px 0 32px;
    margin-top: 30px;

    .van-button {
      background-color: #333bd2;
      border-color: #333bd2;
    }
  }
}
</style>
