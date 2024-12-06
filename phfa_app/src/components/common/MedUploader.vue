<template>
  <div class="med-uploader">
    <van-uploader :file-list="value" multiple readonly :max-count="maxCount" @click-upload="onClickUpload" @click-preview="onClickPreview" @delete="onDelete">
      <template v-slot:preview-cover="item">
        <video v-if="isVideo(item.url)" :src="item.url" class="video-thumb" />
      </template>
    </van-uploader>

    <!-- ↓测试用↓ -->
    <!-- <van-uploader
      :after-read="fakeAfterRead"
      multiple
      style="border:3px dashed red"
    /> -->
    <!-- ↑测试用↑ -->

    <van-popup v-model="previewVideoVisible">
      <video v-if="previewVideoVisible" class="video-play" :src="previewVideoUrl" loop controls />
    </van-popup>
  </div>
</template>

<script>
import { attSave, attDelete } from '@/api/attachment'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    fileType: {
      type: Number,
      default: undefined // 心电图0, 现场照片1,现场视频2
    },
    remark: {
      type: String,
      default: ''
    },
    getBusinessId: {
      // 业务ID获取方法,可以是异步函数
      required: true,
      type: Function,
      default: undefined
    },
    maxCount: {
      type: Number,
      default: undefined // 最大上传数量限制
    }
  },
  data() {
    return {
      previewVideoVisible: false,
      previewVideoUrl: ''
    }
  },
  methods: {
    async fakeAfterRead({ file }) {
      this.doUploadFile(file)
    },
    isVideo(url) {
      const path = (url || '').toLowerCase()
      return /\.(mp4|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv)/.test(path)
    },
    isImage(url) {
      const path = (url || '').toLowerCase()
      return /\.(xbm|tif|pjp|svgz|jpg|jpeg|ico|tiff|gif|svg|jfif|webp|png|bmp|pjpeg|avif)/.test(
        path
      )
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
    onClickUpload() {
      this.$bridge.takePhoto({}, base64Data => {
        const file = this.base64ToFile(
          'data:image/jpeg;base64,' + base64Data,
          'ecg.png'
        )
        this.doUploadFile(file)
      })
    },
    async doUploadFile(file) {
      // 此时可以自行将文件上传至服务器
      var formData = new FormData()
      formData.append('file', file)
      let businessId
      if (typeof this.getBusinessId === 'function') {
        businessId = await this.getBusinessId()
        formData.append('businessId', businessId)
      }
      if (this.remark) {
        formData.append('remark', this.remark)
      }
      if (typeof this.fileType === 'number') {
        formData.append('fileType', this.fileType)
      }
      // 保存心电图、现场照片、现场视频等
      const res = await attSave(formData)
      if (res.message === 'SUCCESS') {
        const url = res.body
        const newValue = [...(this.value || []), { url }]
        this.$emit('input', newValue)
        this.$emit('change', newValue, businessId)
      } else {
        this.$notify({ type: 'danger', message: '上传失败! ' + res.message })
      }
    },
    viewVideo(file) {
      this.previewVideoVisible = true
      this.previewVideoUrl = file.url
    },
    onClickPreview(item) {
      if (this.isVideo(item.url)) {
        this.viewVideo(item)
      }
    },
    async onDelete(item) {
      try {
        await this.$dialog.confirm({
          title: '确定删除吗?'
        })
        attDelete([item.id]).then(res => {
          if (res.message === 'SUCCESS') {
            const newValue = (this.value || []).filter(el => el.id !== item.id)
            this.$emit('input', newValue)
            this.$emit('change', newValue)
          } else {
            this.$notify({
              type: 'danger',
              message: '删除失败! ' + res.message
            })
          }
        })
      } catch (error) { }
    }
  }
}
</script>

<style lang="less" scoped>
.video-thumb {
  width: 100%;
  height: 100%;
  background-color: #000;
  pointer-events: none;
}

.video-play {
  width: 10rem;
  background-color: #000;
  object-fit: scale-down;
}
</style>
