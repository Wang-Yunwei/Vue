<template>
  <div class="med-sign">
    <div
      :class="{ image: true, signed: value && !disabled }"
      :src="value"
      @click="onSign"
    >
      <img v-if="value" :key="randomKey" :src="value" alt="签名">
      <center v-else-if="!disabled">点击签名</center>
    </div>
    <el-dialog
      width="920px"
      title="签名"
      :visible.sync="visible"
      append-to-body
      :close-on-click-modal="false"
    >
      <vue-esign ref="canvas" :width="900" :height="420" class="sign-area" />
      <div slot="footer" class="dialog-footer">
        <el-button style="float: left" @click="onClear">清 空</el-button>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueEsign from 'vue-esign'
import { getUUID } from '@/api'
import { attSave } from '@/api/attachment'
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'

export default {
  components: {
    VueEsign
  },
  props: {
    businessId: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    fileName: {
      required: true,
      type: String,
      default: '签名'
    },
    fileType: {
      type: Number,
      default: void 0
    }
  },
  data() {
    return {
      dic,
      randomKey: 1,
      visible: false
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    fileTypeMap() {
      const map = {}
      const list = this.dictionary[this.dic.fileType] || []
      list.forEach((item) => {
        map[item.value] = item.label
      })
      return map
    }
  },
  methods: {
    // 将base64转换为blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    onCancel() {
      this.visible = false
      this.onClear()
    },
    onClear() {
      this.$refs.canvas.reset()
    },
    onSign() {
      if (!this.disabled) {
        this.visible = true
      }
    },
    onConfirm() {
      this.$refs.canvas
        .generate()
        .then(async(data) => {
          const blob = this.dataURLtoBlob(data)
          const file = new window.File([blob], `${this.fileName}.png`, {
            type: 'image/png'
          })

          const formData = new FormData()
          formData.append('file', file)
          if (this.fileType) {
            formData.append('fileType', this.fileType)
            formData.append('remark', this.fileTypeMap[this.fileType])
          }
          let id = this.businessId
          if (!id) {
            // 获取uuid
            const { body } = await getUUID()
            id = body
          }
          formData.append('businessId', id)

          const res = await attSave(formData)
          this.$emit('update:businessId', id)
          this.$emit('input', res.body)
          this.$emit('change', res.body)
          this.randomKey += 1 // 图片变化后url不会变,无法自动更新,这里使用key强制更新

          this.onCancel()
        })
        .catch(() => {
          this.$message.error({
            title: '提示',
            message: '请书写签名！'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.med-sign {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  .image {
    border: 1px solid #eee;
    width: 150px;
    height: 70px;
    color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    &.signed:hover {
      &:after {
        background-color: rgba(0, 0, 0, 0.7);
        content: '点击重签';
        position: absolute;
        width: 100%;
        height: 100%;
        padding-top: 16px;
        text-align: center;
      }
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.sign-area {
  cursor: crosshair;
  border: 1px solid #ddd;
}
</style>
