<template>
  <div class="pre-exam-grade-wrapper">
    <med-s-card title="分级" class="container-card">
      <div class="flex-c-b">
        <med-s-sticker
          class="level-pin level-pin-sys"
          layout="left"
          title="系统分级"
          titleColor="#444FDB"
          bodyFontSize="24px"
        >
          <h4 :style="{ color: curSysLevel.color }">
            {{ curSysLevel.title }}
          </h4>
          <div :style="{ color: curSysLevel.color }">
            {{ curSysLevel.text }}
          </div>
        </med-s-sticker>
        <med-s-sticker
          v-for="(level, idx) in levels"
          :key="level.text"
          class="level-pin"
          layout="bottom"
          :checked="resetLevel == idx + 1"
          :titleBg="level.color"
          :titleColor="resetLevel == idx + 1 ? 'white' : level.color"
          :title="level.text"
          @click="handleResetLevel(idx + 1)"
        >
          <h4 :style="{ color: resetLevel == idx + 1 ? level.color : '#999999 ' }">
            {{ level.title }}
          </h4>
        </med-s-sticker>
      </div>
    </med-s-card>
  </div>
</template>
<script>
import sharedData from '../sharedData'

const { levelColor } = sharedData

export default {
  name: 'PreExamGrade',
  props: {
    regId: { type: String, default: '' },
    detailInfo: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      levels: [
        {
          title: '一级',
          text: '濒危病人',
          color: levelColor[1]
        },
        {
          title: '二级',
          text: '重症病人',
          color: levelColor[2]
        },
        {
          title: '三级',
          text: '急症病人',
          color: levelColor[3]
        },
        {
          title: '四级',
          text: '次急症病人',
          color: levelColor[4]
        }
      ],
      resetLevel: '', // 护士分诊的级别
      sharedData
    }
  },
  computed: {
    // 系统分级
    syslevel() {
      const { sysLevel } = this.sharedData
      let finalLv = 0
      Object.keys(sysLevel).forEach(key => {
        const LvNum = Number(sysLevel[key]) || 0
        if (LvNum > 0 && (!finalLv || LvNum < finalLv)) {
          finalLv = LvNum
        }
      })
      return finalLv
    },
    curSysLevel() {
      return this.levels[this.syslevel - 1] || { color: '#ddd', title: '- -' }
    }
  },
  methods: {
    handleResetLevel(val) {
      this.resetLevel = val + ''
    },
    async formSubmit() {
      const syslevel = parseInt(this.syslevel) || ''
      const resetLevel = parseInt(this.resetLevel) || ''
      return {
        syslevel: syslevel ? '0' + syslevel : '',
        resetLevel: resetLevel ? '0' + resetLevel : ''
      }
    },
    // 获取信息回显
    regDetails() {
      this.resetLevel = (parseInt(this.detailInfo?.grade?.resetLevel) || '') + ''
      this.$nextTick(() => {
        this.sharedData.ready = true
      })
    }
  },
  watch: {
    syslevel(val) {
      this.resetLevel = val + ''
    },
    detailInfo() {
      if (this.detailInfo?.grade) {
        this.regDetails()
      }
    },
    resetLevel(level) {
      this.sharedData.resetLevel = level
    }
  },
  created() {
    if (this.sharedData?.sysLevel) {
      this.sharedData.sysLevel.knowledge = 0
      this.sharedData.sysLevel.datas = 0
      this.sharedData.sysLevel.score = 0
    }
  }
}
</script>

<style lang="less" scoped>
.container-card {
  height: 170px;
}
.flex-c-b {
  max-width: 750px;
  .level-pin {
    height: 80px;
    width: 130px;

    &-sys {
      width: 156px;
    }
    &-active {
      /deep/ .ant-card-head {
        color: #fff;
      }
    }
    &.layoutLeft {
      /deep/ .ant-card-head {
        padding: 0 10px;
        &-title {
          font-size: 14px;
          letter-spacing: 1px !important;
          line-height: 14px;
        }
      }
    }
    &.layoutBottom {
      /deep/ .ant-card-head {
        padding: 0 10px;
        height: 30px;
        &-title {
          line-height: 24px;
          font-size: 14px;
          letter-spacing: 2px;
        }
      }
    }
    /deep/ .ant-card-body {
      padding: 12px 0;
      flex-wrap: wrap;
      h4 {
        margin-bottom: 10px;
        font-size: 24px;
        line-height: 24px;
      }
      div {
        font-size: 14px;
        line-height: 14px;
        min-width: 100px;
      }
    }
  }
}
</style>
