<template>
  <div class="pre-exam-grade-wrapper">
    <med-s-card class="container-card">
      <div class="flex-c-b">
        <med-s-sticker
          class="level-pin level-pin-sys"
          layout="left"
          title="系统分级"
          titleColor="#444FDB"
          bodyFontSize="24px"
        >
          <h4 :style="{ color: levels[syslevel - 1].color }">
            {{ levels[syslevel - 1].title }}
          </h4>
          <div :style="{ color: levels[syslevel - 1].color }">
            {{ levels[syslevel - 1].text }}
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
import sharedData from './../../selfReg/sharedData'

const { levelColor } = sharedData

export default {
  name: 'PreExamGrade',
  props: {
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
      resetLevel: '4', // 护士分诊的级别
      sharedData
    }
  },
  computed: {
    // 系统分级
    syslevel() {
      const { sysLevel } = this.sharedData
      const knowledgeLv = Number(sysLevel.knowledge) || 4
      const datasLv = Number(sysLevel.datas) || 4
      const finalLv = Math.min(knowledgeLv, datasLv)
      return finalLv
    }
  },
  methods: {
    handleResetLevel(val) {
      this.resetLevel = val + ''
    },
    async formSubmit() {
      return {
        syslevel: '0' + parseInt(this.syslevel),
        resetLevel: '0' + parseInt(this.resetLevel)
      }
    },
    //数据回显
    regDetails() {
      this.resetLevel = this.detailInfo.resetlevel
    },
    //重置标志
    resetSigns() {
      this.resetLevel = '4'
    }
  },
  watch: {
    detailInfo() {
      if (this.detailInfo?.id) {
        this.regDetails()
      }
    },
    syslevel(val) {
      this.resetLevel = val + ''
    }
  }
}
</script>

<style lang="less" scoped>
.container-card {
  height: 110px;
  background-color: transparent;
  box-shadow: none !important;

  /deep/ .ant-card-body {
    padding-top: 16px;
  }
}

.flex-c-b {
  max-width: 946px;

  .level-pin {
    height: 80px;
    width: 179px;

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
        display: block;
        width: 100%;
        margin-bottom: 10px;
        font-size: 24px;
        line-height: 24px;
      }

      div {
        font-size: 14px;
        line-height: 14px;
      }
    }
  }
}
</style>
