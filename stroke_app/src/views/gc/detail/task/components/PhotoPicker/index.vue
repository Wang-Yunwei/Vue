<template>
  <div class="photo-picker">
    <van-field :label="label" @click="show = true" readonly>
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
    </van-field>
    <van-image
      class="image-field"
      v-if="photoUrlList.length > 0"
      :src="photoUrlList[0]"
      fit="contain"
      width="100"
      height="100"
      @click="preview(photoUrlList, 0)"
    />
    <med-popup-container v-model="show" :title="title">
      <div class="main-body">
        <div class="image-grid">
          <div class="uploader-title">上传文件</div>
          <van-uploader
            class="uploader"
            :after-read="arg => afterRead(arg, '图片')"
            :max-size="8 * 1024 * 1024"
            :max-count="1"
          />
          <van-grid :border="false" :column-num="3">
            <van-grid-item
              v-for="(item, i) in attachList"
              :key="item.attachPath"
            >
              <div style="position: relative">
                <van-image
                  :src="item.attachPath"
                  fit="contain"
                  @click="preview(photoUrlList, i)"
                  width="100"
                  height="100"
                />
                <div class="close-icon" @click.stop="handleRemove(item)">
                  <van-icon name="cross" />
                </div>
              </div>
            </van-grid-item>
          </van-grid>
        </div>
        <van-button
          class="save-btn"
          block
          round
          type="info"
          icon-position="left"
          size="normal"
          @click="submit"
        >
          保存
        </van-button>
      </div>
    </med-popup-container>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { ImagePreview } from 'vant'
import * as types from '@store/mutations/mutations-types'
import { Attach } from '@model/commonModel'

export default {
  name: 'PhotoPicker',
  props: {
    label: {
      type: String,
      default: '选择图片'
    },
    title: {
      type: String,
      default: '选择图片'
    },
    attachUse: {
      type: String,
      default: ''
    },
    maxPhotoNum: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      show: false,
      registId: this.$route.query.registId,
      picture: '',
      attachList: [],
      attach: this.emptyAttach()
    }
  },
  // 钩子方法
  created() {
    this.init()
  },
  computed: {
    photoList() {
      if (this.attachList.length > 0) {
        return this.attachList
          .map(item => ({
            url: item.attachPath,
            isImage: true
          }))
          .filter(el => el.url)
      } else {
        return []
      }
    },
    photoUrlList() {
      if (this.attachList.length > 0) {
        return this.attachList.map(item => item.attachPath)
      } else {
        return []
      }
    }
  },
  methods: {
    ...mapMutations(types),
    handleRemove(item) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认要删除吗？',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          // 删除页面用来显示的图片
          const index = this.attachList.findIndex(
            e => e.attachPath === item.attachPath
          )
          this.attachList.splice(index, 1)
          // 删除数据库中已有的图片
          if (item.id) {
            this.$api.attach.deleteOne(item.id)
          }
        })
        .catch(() => {})
    },
    init() {
      this.getAttachList()
    },
    // 调用后台接口
    getAttachList() {
      this.$api.attach
        .getAttachList(this.registId, this.attachUse)
        .then(({ result }) => {
          this.attachList = result
          this.$forceUpdate()
        })
    },
    emptyAttach() {
      return {
        ...Attach(),
        businessId: this.$route.query.registId,
        attachUse: this.attachUse
      }
    },
    // 删除图片
    // beforeDelete(params) {
    //   this.photoUrlList = this.photoUrlList.filter(
    //     el => el.url !== params.url
    //   )
    //   // 删除picture字符串数据,重新给EcgFile赋值
    //   this.deleteEcgFile(params)
    // },
    afterRead({ file }, type) {
      if (file.name.length > 80) {
        this.$toast(`文件名过长`)
        return
      }
      if (this.attachList.length >= this.maxPhotoNum) {
        this.$toast(`最多上传${this.maxPhotoNum}张图片`)
        return
      }
      // 此时可以自行将文件上传至服务器
      const formData = new FormData()
      formData.append('file', file)
      this.$api.ecg.upload(formData).then(({ result }) => {
        const attach = this.emptyAttach()
        attach.attachPath = result
        attach.attachName = file.name
        if (file.type) {
          attach.attachType = file.type
        }
        this.attachList.push(attach)
        this.$forceUpdate()
      })
    },
    // 保存
    submit() {
      this.$api.attach
        .saveAttachList(this.registId, this.attachList)
        .then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
            // 调用查询接口
            this.getAttachList()
            // 刷新页面
            this.$forceUpdate()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    },
    backClick() {
      this.$emit('backClick')
    },
    /**
     * 预览图片
     * @param item
     */
    preview(items, startPosition) {
      ImagePreview({
        images: items,
        startPosition: startPosition
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
