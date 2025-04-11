<template>
  <div>
    <med-view-container
      class="med-upload-wrapper"
      @return="onBackClick"
      title="新增心电图"
    >
      <div class="scroll-view">
        <van-form ref="form">
          <div class="uploadfile">上传文件</div>
          <van-uploader
            class="uploader"
            :after-read="arg => afterRead(arg, '心电图')"
            :before-delete="beforeDelete"
            v-model="electrocardiogramUrlList"
            :max-size="8 * 1024 * 1024"
            :max-count="1"
            multiple
            capture="camera"
            accept="image/*"
          />
          <med-date-picker
            required
            v-model="medswmecgvo.ecgTime"
            label="心电图完成时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <van-field
            required
            label="心电图检查结果"
            :value="medswmecgvo.ecgDiagnosis"
            :rules="[{ required: true, message: '必填' }]"
          >
            <template #input>
              <van-radio-group
                class="flex-c-e radio-btn-type"
                v-model="medswmecgvo.ecgDiagnosis"
              >
                <van-radio
                  v-for="item in genderList"
                  :key="item.value"
                  :name="item.value"
                >
                  {{ item.label }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <multi-select
            v-show="showByEcgDiagnosis"
            label="心电图异常"
            :options="dicData.ecgExceptionOpts"
            v-model="medswmecgvo.ecgException"
            :other.sync="medswmecgvo.ecgExceptionOther"
            title="心电图异常"
          />
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
        </van-form>
      </div>
    </med-view-container>
    <med-popup-container v-model="previewVideoVisible" hideHeader>
      <video class="video-play" :src="previewVideoUrl" loop controls />
    </med-popup-container>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
import { Ecg } from '@model/commonModel'
import { mapGetters } from 'vuex'

export default {
  name: 'Electrocardiogram',
  capture: ['camera'],
  data() {
    return {
      previewVideoVisible: false,
      previewVideoUrl: '',
      electrocardiogramUrlList: [],
      picture: '',
      dateField: '',
      show: false,
      recordList: [],
      genderList: [
        { label: '正常', name: '心电图检查结果', value: '1' },
        { label: '异常', name: '心电图检查结果', value: '0' }
      ],
      medswmecgvo: { ...Ecg(), registId: this.registId }
    }
  },
  props: {
    ecgType: {
      type: String,
      default: ''
    },
    registId: {
      type: String,
      default: ''
    },
    medswmecgvol: {
      type: Object,
      default: () => []
    }
  },
  created() {
    // 判断是否修改
    if (this.medswmecgvol.id) {
      this.edit(this.medswmecgvol)
    }
  },
  computed: {
    ...mapGetters(['dicData']),
    showByEcgDiagnosis() {
      return this.medswmecgvo.ecgDiagnosis === '0'
    }
  },
  methods: {
    exceptionReason(str) {
      const arrValues = str ? str.split(',') : []
      const labels = arrValues.map(val => {
        const matched = this.dicData.ecgExceptionOpts.find(
          item => item.value === val
        )
        return matched?.label
      })
      return labels.join(' ; ')
    },
    /**
     * 预览图片
     * @param item
     */
    preview(item) {
      ImagePreview(item)
    },
    // 调用后台接口
    getSupDetails() {
      this.$api.electrocardiogram
        .getElectrocardiogram(this.medswmecgvo.registId, this.ecgType)
        .then(res => {
          this.recordList = res.result
          this.$forceUpdate()
        })
    },
    // 删除图片
    beforeDelete(params) {
      this.electrocardiogramUrlList = this.electrocardiogramUrlList.filter(
        el => el.url !== params.url
      )
      // 删除picture字符串数据,重新给EcgFile赋值
      this.deleteEcgFile(params)
    },
    clickUpload() {},
    afterRead({ file }, type) {
      // 此时可以自行将文件上传至服务器
      const formData = new FormData()
      formData.append('file', file)
      this.$api.ecg
        .upload(formData)
        .then(({ result }) => {
          this.picture = result
          this.electrocardiogramUrlList = this.picture
            .split(';')
            .map(item => ({
              url: item,
              isImage: true
            }))
            .filter(el => el.url)
          this.$forceUpdate()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除picture字符串数据,重新给EcgFile赋值
    deleteEcgFile(item) {
      const pictures = this.picture ? this.picture.split(';') : []
      const newPics = pictures.filter(ele => ele !== item.url)
      this.picture = newPics.join(';')
    },
    // 删除心电图
    deletepicture(item) {
      this.$api.electrocardiogram.supRemove(item.id).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '删除成功' })
          // 调用查询接口
          this.getSupDetails()
          // 清空上次实体内容
          this.clearContent()
          // 刷新页面
          this.$forceUpdate()
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    // 编辑按钮
    edit(item) {
      this.medswmecgvo = { ...item }
      if (this.medswmecgvo.ecgFile) {
        this.electrocardiogramUrlList = item.ecgFile
          .split(';')
          .map(item => ({ url: item, isImage: true }))
          .filter(el => el.url)
        this.picture = this.electrocardiogramUrlList[0].url
      }
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form
          .validate()
          .then(r => resolve(r))
          .catch(e => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('新增心电图')
          })
      })
    },
    // 保存
    submit() {
      if (this.picture === '') {
        this.$toast(`请选择图片`)
        return
      }
      const promise = this.validate()
      Promise.all([promise])
        .then(res => {
          this.save()
        })
        .catch(err => {
          this.$toast(`请填写${err}`)
        })
    },
    save() {
      this.medswmecgvo.ecgFile = this.picture
      this.medswmecgvo.ecgType = this.ecgType
      this.$api.electrocardiogram
        .saveElectrocardiogram(this.medswmecgvo)
        .then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
            // 调用查询接口
            this.getSupDetails()
            // 清空上次实体内容
            this.clearContent()
            // 刷新页面
            // this.$forceUpdate()
            this.onBackClick()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    },
    // 返回跳转
    onBackClick(item) {
      this.$emit('backClick')
    },
    // 清除实体内容
    clearContent() {
      this.medswmecgvo.ecgFile = ''
      this.medswmecgvo.id = ''
      this.medswmecgvo.ecgDiagnosis = ''
      this.medswmecgvo.ecgException = ''
      this.medswmecgvo.ecgTime = ''
      this.medswmecgvo.ecgExceptionOther = ''
      // 清空回显数据
      this.electrocardiogramUrlList = []
      // 清空拼接路径
      this.picture = ''
    }
  },
  watch: {
    medswmecgvol: {
      handler(newVal, oldVal) {
        if (newVal.id) {
          this.medswmecgvo = { ...newVal }
          this.edit(this.medswmecgvo)
        } else {
          // this.medswmecgvo = newVal
          this.clearContent()
        }
      },
      deep: true
    },
    'medswmecgvo.ecgDiagnosis': {
      handler() {
        if (this.medswmecgvo.ecgDiagnosis === '1') {
          this.$set(this.medswmecgvo, 'ecgException', '')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
