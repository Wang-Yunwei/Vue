<template>
  <div :class="['picture-list', size, isFull ? 'is-full' : '']">
    <el-upload ref="upload" action="#" list-type="picture-card" :http-request="handleUpload" :file-list="value" :disabled="disabled" :limit="limit" v-bind="$attrs">
      <i class="el-icon-plus" />
      <div slot="file" slot-scope="{ file }" class="flex-c-c">
        <img v-if="file.url && !isVideo(file.url)" class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <video v-if="isVideo(file.url)" :autoplay="false" class="el-upload-list__item-thumbnail video-thumb" :src="file.url" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in" />
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :title="`查看${isVideo(dialogImageUrl) ? '视频' : '图片'}`" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <template v-if="dialogVisible">
        <img v-if="!isVideo(dialogImageUrl)" width="100%" :src="dialogImageUrl" alt="">
        <video v-if="isVideo(dialogImageUrl)" autoplay loop width="100%" :src="dialogImageUrl" />
      </template>
    </el-dialog>
  </div>
</template>

<script>
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
        this.fileList = this.fileList
          .filter((ele) => newValue.some((item) => item.id === ele.id))
          .concat(
            newValue.filter((item) =>
              this.fileList.every((ele) => ele.id !== item.id)
            )
          )
      }
    }
  },
  methods: {
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
      const res = await this.$api.fileApi(formData)
      if (res.code === '000000') {
        // 保存心电图、现场照片、现场视频等
        const newValue = (this.value || []).concat([
          { name: file.name, url: res.body.filePath }
        ])
        this.$emit('input', newValue)
        this.$emit('refresh')
      }
    },
    async handleRemove(file, fileList) {
      await this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.fileList = this.fileList.filter((ele) => ele.url !== file.url)
      console.log(this.fileList, file)
      this.$emit('input', this.fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
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
