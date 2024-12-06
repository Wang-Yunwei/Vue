<template>
  <div class="picture-list">
    <el-upload
      ref="upload"
      action=""
      list-type="picture-card"
      :http-request="handleUpload"
      :file-list="value"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <i class="el-icon-plus" />
      <div slot="file" slot-scope="{ file }" class="flex-c-c">
        <img
          v-if="!isVideo(file.url)"
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
      append-to-body
      :title="`查看${isVideo(dialogImageUrl) ? '视频' : '图片'}`"
      :visible.sync="dialogVisible"
    >
      <template v-if="dialogVisible">
        <img
          v-if="!isVideo(dialogImageUrl)"
          width="100%"
          :src="dialogImageUrl"
          alt=""
        >
        <video
          v-if="isVideo(dialogImageUrl)"
          autoplay
          loop
          width="100%"
          :src="dialogImageUrl"
        />
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 附件列表控件,用于上传心电图、现场照片、现场视频等
import { attSave, attDelete } from '@/api/attachment'
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'

export default {
  name: 'PictureList',
  props: {
    disabled: {
      type: Boolean,
      default: false
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
      type: Number,
      default: void 0 // (0-心电图,1-现场照片,2-现场视频,3-医生签名,4-护士签名,5-医护签名,6-患者签名,7-委托人签名,8-流调人员签名)
    }
  },
  data() {
    return {
      dic,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    typeNameMap() {
      const map = {}
      const list = this.dictionary[this.dic.fileType] || []
      list.forEach((el) => (map[el.value] = el.label))
      return map
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
      formData.append('businessId', this.businessId)
      if (this.type !== void 0) {
        formData.append('remark', this.typeNameMap[this.type])
        formData.append('fileType', this.type)
      }

      //   if (type === '现场照片') {
      //     formData.append('remark', 'ScenePhoto')
      //   } else if (type === '现场视频') {
      //     formData.append('remark', 'SceneVideo')
      //   } else if (type === '心电图') {
      //     formData.append('remark', 'Ecg')
      //   }
      const res = await attSave(formData)
      if (res.message === 'SUCCESS') {
        // 保存心电图、现场照片、现场视频等
        // const newValue = (this.value || []).concat([{ url: res.body }])
        // this.$emit('input', newValue)
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
    async handleRemove(file, fileList) {
      await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      const { code } = await attDelete([file.id])
      if (code === '000000') {
        this.$message.success('删除成功!')
        this.$emit('refresh')
        return true
      }
      return Promise.reject('')
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
    ul.is-disabled + div.el-upload {
      display: none;
    }
  }

  .video-thumb {
    min-height: 146px;
    background: #000;
  }
}
</style>
