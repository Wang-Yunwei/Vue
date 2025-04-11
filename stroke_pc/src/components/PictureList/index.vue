<template>
  <div :class="['picture-list', size, isFull ? 'is-full' : '']">
    <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      :http-request="handleUpload"
      :file-list="fileList"
      :disabled="disabled"
      :limit="limit"
      v-bind="$attrs"
    >
      <i class="el-icon-plus" />
      <div slot="file" slot-scope="{ file }" class="flex-c-c">
        <img
          v-if="file.url && !isVideo(file.url)"
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        >
        <video
          v-if="isVideo(file.url)"
          :autoplay="false"
          class="el-upload-list__item-thumbnail video-thumb"
          :src="file.url"
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog
      width="fit-content"
      :title="`查看${isVideo(dialogImageUrl) ? '视频' : '图片'}`"
      :visible.sync="dialogVisible"
    ><div class="view-box">
      <template v-if="dialogVisible">
        <img v-if="!isVideo(dialogImageUrl)" :src="dialogImageUrl" alt="">
        <video
          v-if="isVideo(dialogImageUrl)"
          autoplay
          loop
          :src="dialogImageUrl"
        />
      </template>
    </div>
    </el-dialog>
  </div>
</template>

<script>
// 附件列表控件,用于上传心电图、现场照片、现场视频等
import { uploadFile } from '@/api/file'

export default {
  name: 'PictureList',
  props: {
    limit: {
      type: Number,
      default: 10
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small' // small | medium
    },
    value: {
      // 列表
      type: Array,
      default: () => []
    },
    businessId: {
      // 业务id
      type: String,
      default: ''
    },
    type: {
      // 上传类型
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    isFull() {
      return this.value?.length >= this.limit
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        const newValue = v || []
        this.fileList = newValue.map((el) => {
          // 重用旧项,是为了减少列表在更新时的闪烁
          const oldItem = this.fileList.find((item) => item.id === el.id)
          return {
            ...el,
            ...oldItem,
            ecgFile: this.addPrefix(el.ecgFile),
            url: this.addPrefix(el.url)
          }
        })
        // this.fileList = this.fileList
        //   .filter((ele) => newValue.some((item) => item.id === ele.id))
        //   .concat(
        //     newValue.filter((item) =>
        //       this.fileList.every((ele) => ele.id !== item.id)
        //     )
        //   )
        //   .map((el) => {
        //     return {
        //       ...el,
        //       ecgFile: this.addPrefix(el.ecgFile),
        //       url: this.addPrefix(el.url)
        //     }
        //   })
      }
    }
  },
  methods: {
    // 添加心电图前缀
    addPrefix(url) {
      const prefix = window.GLOBAL_ATTACH_PREFIX
      let result = url || ''
      const isFullUrl = /^http[s]*\:/.test(result)
      if (url && !isFullUrl) {
        result = prefix + result
      }
      return result
    },
    isVideo(url) {
      return /\.(mp4|wmv|asf|asx|rm|rmvb|3gp|mov|m4v|avi|dat|mkv|flv|vob)$/i.test(
        url
      )
    },
    async handleUpload({ file }) {
      // 此时可以自行将文件上传至服务器
      var formData = new FormData()
      formData.append('file', file)
      if (this.businessId) formData.append('businessId', this.businessId)
      if (this.type) formData.append('remark', this.type)

      //   if (type === '现场照片') {
      //     formData.append('remark', 'ScenePhoto')
      //   } else if (type === '现场视频') {
      //     formData.append('remark', 'SceneVideo')
      //   } else if (type === '心电图') {
      //     formData.append('remark', 'Ecg')
      //   }
      const res = await uploadFile(formData)
      if (res.status === 200) {
        // 保存心电图、现场照片、现场视频等
        const newValue = (this.value || []).concat([
          { name: file.name, url: res.result, ecgFile: res.result }
        ])
        this.$emit('input', newValue)
        this.$emit('refresh')

        //   const payload = {
        //     businessId: this.businessId
        //   }
        //   this.$api.supplementaryExamination
        //     .supSaveOrUpdate(payload)
        //     .then((res) => {
        //       this.getSupDetails()
        //     })
      }
    },
    async handleRemove(file) {
      await this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.fileList = this.fileList.filter((ele) => ele.url !== file.url)
      this.$emit('input', this.fileList)
      // const { code } = await removeFile(file.id)
      // if (code === '000000') {
      //   this.$message.success('删除成功!')
      //   this.$emit('refresh')
      //   return true
      // }
      // return Promise.reject('')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.view-box {
  overflow: hidden;
  text-align: center;
  min-width: 400px;
  min-height: 200px;
  img,
  video {
    max-height: 70vh;
    max-width: 90vw;
  }
}
.picture-list {
  ::v-deep {
    .el-upload-list__item {
      transition-duration: 0s;
    }
  }
  .video-thumb {
    min-height: 146px;
    background: #000;
  }
  &.small {
    ::v-deep .el-upload--picture-card {
      width: 88px;
      height: 88px;
      line-height: 100px;
    }
    ::v-deep .el-upload-list--picture-card .el-upload-list__item {
      width: 88px;
      height: 88px;
    }
  }
  &.is-full {
    ::v-deep .el-upload {
      display: none;
    }
  }
}
</style>
