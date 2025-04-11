<template>
  <div
    :class="{ [$style.patientInfoWrapper]: true, [$style.small]: scrolling }"
  >
    <div :class="$style.patientInfoCard" @click="onEdit">
      <div class="flex-c-b">
        <div :class="$style.title">
          <div :class="$style.name">{{ name }}</div>
          <div v-if="gender" :class="genderClass(gender)"></div>
          <div v-if="age" :class="$style.age">{{ age }}岁</div>
          <div v-if="symptom" :class="$style.badge">
            {{ conversionOne(symptom, dicData.diagOpts) }}
          </div>
          <div
            v-if="parseComingType(comingType)"
            :class="[$style.badge, $style.comingType]"
          >
            {{ parseComingType(comingType) }}
          </div>
        </div>
        <van-button
          v-if="status === '0'"
          :class="$style.button"
          @click.stop="openRfTag"
        >
          <template #icon>
            <i class="iconfont iconicon1-56"></i>
          </template>
          <span :class="$style.rfIdName">{{ rfIdName }}</span>
        </van-button>
        <div v-else :class="$style.badge">{{ getCurStatusName(status) }}</div>
      </div>
      <div :class="$style.secondLeft">
        <p>门诊号：{{ outpatientNo }}</p>
        <p>住院号：{{ inpatientNo }}</p>
      </div>
      <div class="flex-c-b">
        <div :class="$style.thirdLeft">
          <slot name="thirdLeft">
            <div :class="$style.time">
              <i class="iconfont iconicon1-41"></i>
              {{ leftTime }}
            </div>
            <div :class="$style.time">
              <i class="iconfont iconicon1-41"></i>
              {{ rightTime }}
            </div>
          </slot>
        </div>
      </div>
    </div>

    <med-popup-container
      v-model="rfTagShow"
      title="绑定腕带"
      position="right"
      class="filelist-pop-right"
      @return="rfTagShow = false"
      @opened="onWristbindShow"
    >
      <!-- <template #right-part>
        <div @click.stop>
          <i class="iconfont iconicon1-13" @click="onRfIdScan" />
        </div>
      </template> -->
      <wristbind-binding
        ref="wristbind"
        :name="name"
        :registId="registId"
        @selected="onWristbindSelected"
      />
    </med-popup-container>

    <med-popup-container
      :class="$style.pop"
      v-model="popShow"
      :duration="0.12"
      hideHeader
    >
      <basic-info
        @backClick="popShow = false"
        @saved="onSaved"
        :class="modeClass"
        :view-mode="!!modeClass"
        :dic="dic"
      />
    </med-popup-container>
  </div>
</template>

<script>
import dateMixin from '@mixins/dateMixin'
import hospitalMixin from '@mixins/hospitalMixin'
import BasicInfo from '@views/gc/detail/task/parts/BasicInfo'
import RfTagList from '@views/gc/detail/task/components/RfTagList'
import WristbindBinding from './wristbindBinding.vue'
import { mapGetters } from 'vuex'

export default {
  mixins: [dateMixin, hospitalMixin],
  components: { BasicInfo, RfTagList, WristbindBinding },
  props: [
    'viewMode',
    'dic',
    'name',
    'gender',
    'age',
    'symptom',
    'outpatientNo',
    'inpatientNo',
    'diseaseTime',
    'lastHealthyTime',
    'arriveTime',
    'rfTagId',
    'bindBtn',
    'scrolling',
    'status'
  ],

  data() {
    return {
      rfTagList: [],
      popShow: false,
      // 腕带号列表页面
      rfTagShow: false,
      tagId: '',
      registId: this.$route.query.registId
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'curHospitalArea', 'dicData', 'comingType']),
    leftTime() {
      let leftTime
      if (this.diseaseTime) {
        leftTime = `发病：${this.formatMMDDHHmm(this.diseaseTime)}`
      } else if (this.lastHealthyTime) {
        leftTime = `清醒：${this.formatMMDDHHmm(this.lastHealthyTime)}`
      } else {
        leftTime = '发病：--'
      }
      return leftTime
    },
    rightTime() {
      return this.arriveTime
        ? `到院：${this.formatMMDDHHmm(this.arriveTime)}`
        : '到院：--'
    },
    modeClass() {
      return this.$route.query?.viewMode || this.viewMode ? 'view-mode' : ''
    },
    rfIdName() {
      if (!this.rfTagId) return '未绑'
      return this.rfTagId
    }
  },
  created() {
    // this.getUnboundTag()
  },
  methods: {
    getUnboundTag() {
      this.$api.dataCollection
        .getwristbandList(this.hospitalAndArea())
        .then(({ result }) => {
          this.rfTagList = result
        })
    },
    onSaved() {
      this.$emit('changed')
    },
    onEdit() {
      this.popShow = true
    },
    /**
     * 打开腕带号列表页面
     */
    openRfTag() {
      if (this.modeClass) {
        return
      }
      this.rfTagShow = true
    },
    genderClass(sex) {
      let className = this.$style.gender
      switch (sex) {
        case '1':
          className += ` ${this.$style.male} iconfont`
          break
        case '2':
          className += ` ${this.$style.female} iconfont`
          break
        default:
          break
      }
      return className
    },
    // value转换汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    wristband(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.tagId === str)
        return matched?.tagName
      }
    },
    /**
     * 来院方式简称
     * @param type
     * @returns {string}
     */
    parseComingType(type) {
      if (
        !this.dic ||
        !this.dic.comingTypeShortOpts ||
        this.dic.comingTypeShortOpts.length === 0
      ) {
        return undefined
      }
      const comingType = this.dic.comingTypeShortOpts.find(
        e => e.value === type
      )
      return comingType ? comingType.label : undefined
    },

    /**
     * 关闭腕带采集对话框
     * @param rfTagId
     */
    closeRfTagPopup(rfTagId) {
      this.rfTagShow = false
      if (rfTagId) {
        this.$emit('rfTagIdChange', rfTagId)
      }
    },
    onWristbindShow() {
      this.$refs.wristbind.init(this.tagId)
    },
    /**
     * 关闭腕带采集对话框
     * @param rfTagId
     */
    onWristbindSelected(item) {
      this.rfTagShow = false
      this.tagId = item.value
      this.$emit('rfTagIdChange', item.value)
      // 更新患者卡信息
    },
    onRfIdScan() {
      this.$refs.wristbind.onRfIdScan()
    },
    getCurStatusName(status) {
      var statusName = ''
      switch (status) {
        case '1':
          statusName = '待审核'
          break
        case '2':
          statusName = '待存档'
          break
        case '3':
          statusName = '已存档'
          break
      }
      return statusName
    }
  },
  watch: {
    rfTagId(newVal) {
      this.tagId = newVal
    }
  }
}
</script>

<style lang="less" module>
@import "./index.less";
</style>
