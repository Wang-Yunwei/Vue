<template>
  <div>
    <med-view-container
      class="med-ecg-wrapper"
      @return="onBackClick"
      title="心电图列表"
      scroll
    >
      <template #right v-if="!readonly">
        <div @click.stop>
          <i class="iconfont iconicon1-441" @click="addElectrocardiogram"></i>
        </div>
      </template>
      <div class="task-electrocardiogram-uploaded">
        <van-swipe-cell
          v-for="item in recordList"
          :key="item.id"
          :disabled="readonly"
        >
          <van-cell class="card-item">
            <span class="pin" :class="{ spec: item.ecgDiagnosis == '0' }">
              {{
                item.ecgDiagnosis == "0"
                  ? "异常"
                  : item.ecgDiagnosis == "1"
                  ? "正常"
                  : "未知"
              }}
            </span>
            <van-image
              v-for="url in item.ecgFile ? item.ecgFile.split(';') : []"
              :key="url"
              :src="url"
              @click="preview(item.ecgFile ? item.ecgFile.split(';') : [])"
              fit="contain"
            />
            <div class="info flex-c-b">
              <div class="infoTime">
                <van-icon name="clock-o" />
                <span> {{ item.ecgTime }}</span>
              </div>

              <span class="infoE">
                {{ exceptionReason(item.ecgException) }}
              </span>

              <van-button
                v-if="!readonly"
                round
                size="mini"
                type="default"
                @click="updateElectrocardiogram(item)"
                >编辑
              </van-button>
            </div>
          </van-cell>
          <template #right>
            <div class="del-icon flex-c-c" @click="deletePicture(item)">
              <van-icon name="delete-o" />
            </div>
          </template>
        </van-swipe-cell>
        <van-empty
          :image="require('@assets/image/empty.png')"
          description="暂无数据"
          v-if="!recordList || !recordList.length"
        />
      </div>
    </med-view-container>
    <med-popup-container hideHeader v-model="previewVideoVisible">
      <video class="video-play" :src="previewVideoUrl" loop controls />
    </med-popup-container>
    <med-popup-container hideHeader v-model="ecgShow">
      <addElectrocardiogram
        @backClick="handleBackClick"
        :ecgType="ecgTypeValue"
        :registId="registId"
        :medswmecgvol="medswmecgvo"
      />
    </med-popup-container>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
import { Ecg } from '@model/commonModel'
import loadingMixin from '@mixins/loadingMixin'
import addElectrocardiogram from '@views/gc/addElectrocardiogram'
import { mapGetters } from 'vuex'

export default {
  name: 'Electrocardiogram',
  components: { addElectrocardiogram },
  mixins: [loadingMixin],

  data() {
    return {
      attachPrefix: window.GLOBAL_ATTACH_PREFIX,
      previewVideoVisible: false,
      ecgShow: false,
      registId: this.$route.query.registId,
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
      medswmecgvo: { ...Ecg(), registId: this.$route.query.registId }
    }
  },
  props: {
    ecgType: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getEcgList()
  },
  computed: {
    ...mapGetters(['dicData']),
    // 是否只读
    readonly() {
      return !!this.$route.query.readonly
    },
    showByEcgDiagnosis() {
      return this.medswmecgvo.ecgDiagnosis === '0'
    },
    // 心电图类型，没有值表示所有类型
    ecgTypeValue() {
      const ecgTypeFromRoute = this.$route.query.ecgType
      return this.ecgType || ecgTypeFromRoute
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
    getEcgList() {
      this.loading()
      this.$api.ecg
        .getEcg(this.registId, this.ecgTypeValue)
        .then(({ result }) => {
          this.recordList = result
          this.recordList.forEach(item => {
            item.ecgFile = this.attachPrefix + item.ecgFile
          })
          this.$forceUpdate()
        })
        .finally(() => this.hideLoading())
    },
    // 删除图片
    beforeDelete(params) {
      this.electrocardiogramUrlList = this.electrocardiogramUrlList.filter(
        el => el.url !== params.url
      )
      // 删除picture字符串数据,重新给EcgFile赋值
      this.deleteEcgFile(params)
    },
    // afterRead({ file }, type) {
    //   // 此时可以自行将文件上传至服务器
    //   const formData = new FormData()
    //   formData.append('file', file)
    //   this.$api.ecg.upload(formData).then(({ result }) => {
    //     this.picture += this.picture
    //       ? `;${window.GLOBAL_APP_API_DIC_URL}/base${result}`
    //       : `${window.GLOBAL_APP_API_DIC_URL}/base${result}`
    //     this.electrocardiogramUrlList = this.picture
    //       .split(';')
    //       .map(item => ({
    //         url: item,
    //         isImage: true
    //       }))
    //       .filter(el => el.url)
    //     this.$forceUpdate()
    //   })
    // },
    // 删除picture字符串数据,重新给EcgFile赋值
    deleteEcgFile(item) {
      const pictures = this.picture ? this.picture.split(';') : []
      const newPics = pictures.filter(ele => ele !== item.url)
      this.picture = newPics.join(';')
    },
    // 删除心电图
    deletePicture(item) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认要删除吗？',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          this.$api.ecg.deleteEcg(item.id).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '删除成功' })
              // 调用查询接口
              this.getEcgList()
              // 清空上次实体内容
              this.clearContent()
              // 刷新页面
              this.$forceUpdate()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
          })
        })
        .catch(() => {})
    },
    // 返回跳转
    onBackClick(item) {
      /* if (this.$route.path === '/gc/electrocardiogram') {
        this.$router.push({
          path: '/gc'
        })
      } else {
        this.$router.push({
          path: '/gc/detail/task'
        })
      }
*/
      if (this.onBackClick) {
        this.$emit('backClick')
      }
      if (this.$route.path === '/gc/electrocardiogram') {
        this.$router.go(-1)
      }
    },
    // 清除实体内容
    clearContent() {
      this.medswmecgvo.ecgFile = ''
      this.medswmecgvo.ecgDiagnosis = ''
      this.medswmecgvo.ecgException = ''
      this.medswmecgvo.ecgTime = ''
      this.medswmecgvo.ecgExceptionOther = ''
      // 清空回显数据
      this.electrocardiogramUrlList = []
      // 清空拼接路径
      this.picture = ''
    },
    // 添加心电图
    addElectrocardiogram() {
      if (!this.ecgTypeValue) {
        this.$toast('缺少心电图类型')
        return
      }
      //  this.clearContent()
      this.ecgShow = true
    },
    // 修改心电图
    updateElectrocardiogram(item) {
      this.medswmecgvo = item
      this.ecgShow = true
    },
    // 弹窗心电图
    handleBackClick() {
      this.ecgShow = false
      // 调用心电图
      this.getEcgList()
      // 清空对象
      this.medswmecgvo = {}
    }
  },
  watch: {
    'medswmecgvo.ecgDiagnosis': {
      handler(newVal, oldVal) {
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
