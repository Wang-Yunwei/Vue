<template>
  <div>
    <van-empty v-if="!list || !list.length" description="暂无数据" />
    <div
      v-for="(item, index) in list"
      :key="index"
      class="card-item-wrapper"
      @click="goBind(item)"
    >
      <div class="card-tem">
        <div class="center">
          <div>
            <p class="flex-c-s">
              <span class="name">{{ item.name }}</span>
              <span :class="genderClass(item.gender)" ></span>
              <span class="age" v-if="item.age">{{ item.age }}岁</span>
              <span class="badge" v-if="item.diagnosis">
                {{ convert(item.diagnosis, dictionary.diagnosisCode) }}
              </span>
            </p>
          </div>
        </div>
        <div class="bottom flex-c-b">
          <span>{{ conversionOne(type, timeNameList) }}：{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'addCard',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      timeNameList: [
        { label: '呼救时间', value: '1' },
        { label: '分诊时间', value: '2' },
        { label: '门诊时间', value: '3' },
        { label: '入院时间', value: '4' }
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  watch: {
    list: {
      handler() {
        if (this.list.length < 6) {
          this.result = []
        }
      }
    }
  },
  methods: {
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    goAddPatientView(item) {
      this.$router.replace({
        name: 'addPatient',
        params: { followupItem: item },
        query: {
          replace: true
        }
      })
    },
    parseBg(type) {
      switch (type) {
        case '1': // 120
          return '#F86359'
        case '2': // "转院"
          return '#5E74FD'
        case '3': // "自行来院"
          return '#52b029'
        case '4': // "院内发病"
          return '#FA9723'
        default:
          return '#7210b2'
      }
    },
    genderClass(sex) {
      let className = 'gender'
      switch (sex) {
        case '1':
          className += ' male iconfont'
          break
        case '2':
          className += ' female iconfont'
          break
        default:
          break
      }
      return className
    },
    convert(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find(v => v.value === value) || { label: '' }).label
    },
    async goBind(item) {
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="less" scoped>
.card-item-wrapper {
  margin: 20px;
  border-radius: 15px;
  overflow: hidden;
}

.card-tem {
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #e4e4e4;
  padding:10px 0;
  .flex-c-s {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .flex-c-b {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .top {
    font-size: 26px;
    background: #f7f7f7;
    border-radius: 15px 15px 0 0px;

    span {
      padding: 14px 30px;
      color: #696969;

      &:nth-of-type(1) {
        font-size: 32px;
        line-height: 2.3;
        background: #52b029;
        border-radius: 15px 0px 15px 0px;
        color: #fff;
      }
    }
  }
  .gender {
      &:before {
        content: '未知';
      }

      &.male:before {
        content: '\e63d';
        font-size: 26px;
        font-weight: 800;
        color: #2b65f8;
      }

      &.female:before {
        content: '\e63a';
        font-size: 26px;
        font-weight: 800;
        color: #f86359;
      }
    }
  .badge {
      font-size: 32px;
      line-height: 42px;
      padding: 0 15px;
      border-radius: 21px;
      background: rgba(94, 116, 253, 0.1);
      color: #5e74fe;
      white-space: nowrap;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  .center {
    div {
      padding: 10px 0;
      font-size: 28px;
      margin: 0 20px;

      .diagnosis {
        background: #eff1ff;
        color: #5e74fe;
        padding: 0 12px;
        line-height: 42px;
        border-radius: 28px;
      }

      p {
        &:nth-of-type(1) {
          line-height: 1;

          span {
            margin-right: 20px;
            font-size: 32px;

            &.name {
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }
            &.age {
              font-size: 30px;
            }

            &.gender {
              .icon-male {
                font-size: 0.38rem;
                color: #5e74fe;
              }

              .icon-female {
                font-size: 0.38rem;
                color: #f86359;
              }
            }

            &:nth-of-type(1) {
              margin-left: 0;
              font-size: 36px;
              color: #202020;
              max-width: 165px;
            }
          }
        }

        &:nth-of-type(2) {
          line-height: 2;
          span {
            color: #b5b5b5;
            margin-right: 20px;
          }
        }
      }
    }
  }

  .bottom {
    font-size: 22px;
    padding: 0 0;
    margin: 0 20px;
    color: #c0c0c0;
    line-height: 2.3;
    .btns {
      .van-button {
        font-size: 20px;
        height: auto;
        padding: 10px 30px;
        margin-left: 20px;
        color: #5e74fe;
        border-color: #5e74fe;
      }
    }
  }
}
</style>
