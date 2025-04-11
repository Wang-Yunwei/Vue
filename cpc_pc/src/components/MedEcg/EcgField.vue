<template>
  <div class="med-ecg-field-wrapper">
    <el-row :gutter="24" style="display: flex; align-items: center;">
      <el-col :span="3">
        <div :class="['small', isFull ? 'is-full' : '']">
          <el-form-item
            prop="uploadList"
            label="心电图图片"
            :rules="[{ validator: imgValiator, trigger: 'blur' }]"
          >
            <el-upload
              :action="uploadUrl"
              :limit="1"
              accept="image/*"
              list-type="picture-card"
              :file-list="ecg.uploadList"
              :auto-upload="true"
              :http-request="imagePreview"
              :on-exceed="exceed"
              :disabled="disabled"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
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
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="9" style="padding-right: 50px;">
        <med-datetime-field
          v-model="ecg.ecgTime"
          label="完成时间"
          required
          :disabled="disabled"
          :form-prop="`${ruleName}.checkTime`"
          :rules="[
            { required: true, message: '请填写完成时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="9" style="padding-right: 50px;">
        <med-datetime-field
          v-model="ecg.diagTime"
          label="诊断时间"
          required
          :disabled="disabled"
          :form-prop="`${ruleName}.diagnosisTime`"
          :rules="[
            { required: true, message: '请填写诊断时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="3">
        <div style="line-height: 88px;">
          <el-button type="danger" plain icon="el-icon-delete" :disabled="disabled" @click="removeRecord">删除</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog width="fit-content" :visible.sync="dialogVisible">
      <div class="view-box">
        <template v-if="dialogVisible">
          <img :src="dialogImageUrl" alt="">
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import MedText from '../MedText/Text.vue'
import { upload } from '@/api/patient/edit'
import { mapGetters } from 'vuex'
export default {
  name: 'MedEcgField',
  components: {
    // MedText
  },
  props: {
    ecg: {
      type: Object,
      default: () => { return { uploadList: [] } }
    },
    uploadUrl: {
      type: String,
      required: false,
      default: '#'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    enabledReason: {
      type: Boolean,
      default: false
    },
    ruleName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,

      fileList: [],
      picture: '',
      resultOptions: [
        { label: '正常', name: '心电图检查结果', value: '1' },
        { label: '异常', name: '心电图检查结果', value: '0' }
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    exceptionOptions() {
      return this.dictionary.ecgExceptionOpts
    },
    isFull() {
      return this.ecg.uploadList?.length >= 1
    }
  },
  watch: {
    ecg: {
      handler: function() {
        this.ecgChanged()
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    imgValiator(rules, value, callback) {
      if (this.isFull) {
        callback()
      } else {
        callback(new Error('心电图图片未上传'))
      }
    },
    imagePreview(_file, detail) {
      if (!_file || !_file.file || !window.FileReader) return
      const file = _file.file
      const size = file.size / 1024
      if (/^image/.test(file.type) && size >= 1024) {
        const self = this
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function() {
          const result = this.result
          const img = new Image()
          img.src = result
          img.onload = function() {
            const data = self.doCompress(img, file.name, file.type)
            _file.content = data.base64
            _file.file = data.fileData
            // self.$notify({ type: 'warning', message: _file.file.size })
            self.upload(_file)
          }
        }
      } else {
        this.upload(_file)
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
    async upload({ file }) {
      // 判断文件是否超出大小限制 todo

      this.isuploading = true
      const formData = new FormData()
      formData.append('file', file)
      try {
        // 上传至服务器
        const { result } = await upload(formData)
        if (result) {
          this.picture = result
          this.ecg.uploadList = (this.uploadUrl ? this.uploadUrl + result : result)
            .split(';')
            .map(item => ({
              url: item,
              isImage: true
            }))
            .filter(el => el.url)
          this.ecg.uploadUrl = this.uploadUrl
          this.ecg.path = result
          this.ecg.ecgFile = result
          this.isuploading = false
        } else {
          this.isuploading = false
          throw new Error(
            `心电图上传失败，原因：${result ? result.message : '未知错误'}`
          )
        }
      } catch (err) {
        this.isuploading = false
      }
    },
    exceed() {
      this.$message({
        message: '只能上传一张心电图。',
        type: 'error',
        duration: 2000
      })
    },
    handleRemove(file) {
      this.ecg.uploadList = this.ecg.uploadList.filter(
        el => el.url !== file.url
      )
      const pictures = this.picture ? this.picture.split(';') : []
      const newPics = pictures.filter(ele => ele !== file.url)
      this.picture = newPics.join(';')
      this.ecg.ecgFile = this.picture
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    ecgChanged() {
      this.$emit('change')
    },
    removeRecord() {
      this.$emit('removeRecord')
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

.med-ecg-field-wrapper {
  ::v-deep {
    .el-upload-list__item {
      transition-duration: 0s;
    }
  }

  .video-thumb {
    min-height: 146px;
    background: #000;
  }

  .small {
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

  .is-full {
    ::v-deep .el-upload {
      display: none;
    }
  }
}
</style>
