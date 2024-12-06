<template>
  <div class="past-history-wrapper">
    <van-field
      label="既往史"
      readonly
      placeholder="既往史"
      right-icon="arrow"
      @click="showPop"
      :value="value"
    ></van-field>
    <van-popup position="right" v-model="popupVisible" get-container="body">
      <transition name="moveR" :duration="500">
        <div class="past-history-popup" v-if="popupVisible">
          <med-header title="既往史" @backClick="popupVisible = false" />
          <div class="past-history-main">
            <ul class="past-history-selected">
              <li
                class="past-history-selected-item"
                v-for="item in transedValue"
                :key="item"
              >
                {{ item }}
                <i class="iconfont iconicon1-461" @click="removeItem(item)"></i>
              </li>
            </ul>
            <!-- <van-cell
            center
            clearable
            placeholder="请输入其他既往史"
            style="padding:0"
          >
            <div @keydown.enter="handleOk">
              <IAutoComplete
                v-model="inputVal"
                transfer
                placeholder="输入或选择"
                transfer-class-name="autocomplete-list"
                :data="options.map(el => el.label)"
                class="auto-complete"
                :filter-method="filterOpts"
                @on-select="handleSelect"
              ></IAutoComplete>
            </div>
            <template #right-icon>
              <van-button
                :disabled="!inputVal"
                size="small"
                type="primary"
                @click="handleOk"
                >添加</van-button
              >
            </template>
          </van-cell> -->
            <van-field
              v-model="inputVal"
              center
              clearable
              placeholder="自定义既往史"
              class="custom-input"
            >
              <template #button>
                <van-button
                  size="small"
                  type="primary"
                  class="add-btn"
                  @click="handleOk"
                >
                  添加
                </van-button>
              </template>
            </van-field>
            <van-cell-group>
              <van-cell
                clickable
                size="small"
                :key="opt.label"
                v-for="opt in options"
                :value="opt.label"
                @click="handleSelect(opt.label)"
              />
            </van-cell-group>
          </div>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PastHistory',
  props: ['value', 'input', 'options'],
  data: function() {
    return {
      popupVisible: false,
      selected: [],
      inputed: '',
      inputVal: ''
    }
  },
  computed: {
    ...mapGetters(['medicalStatus']),
    transedValue() {
      const str = this.value || ''
      return str ? str.split(',') : []
    },
    canEdit() {
      console.log(this.medicalStatus)
      return this.medicalStatus === '01'
    }
  },
  methods: {
    showPop() {
      if (this.canEdit) this.popupVisible = true
    },
    handleOk() {
      if (!(this.inputVal || '').trim()) {
        this.$toast('请输入有效值')
        return
      }
      let newValue = this.value || '' ? (this.value || '').split(',') : []
      if (newValue.includes(this.inputVal)) {
        this.$toast(this.inputVal + '已存在,请勿重复添加')
        this.$nextTick(() => {
          this.inputVal = ''
        })
        return
      }
      if (['无', '不详'].includes(this.inputVal)) {
        newValue = [this.inputVal]
      } else {
        newValue = newValue.filter(str => !['无', '不详'].includes(str))
        newValue.push(this.inputVal)
      }

      this.$emit('input', newValue.join())
      this.$nextTick(() => {
        this.inputVal = ''
      })
    },
    removeItem(item) {
      const newValue = (this.value || '')
        .split(',')
        .filter(ele => ele !== item)
      this.$emit('input', newValue.join())
    },
    filterOpts(val, opt) {
      return (opt || '').includes(val)
    },
    handleSelect(val) {
      this.inputVal = val
      this.handleOk()
    }
  }
}
</script>

<style lang="less">
.past-history-wrapper {
  .van-field:only-child::after {
    display: block;
  }
}
.past-history-main {
  padding: 0.4rem;
}
.past-history-popup {
  height: 100vh;
  width: 100vw;
}
.past-history-selected {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.2rem;
  margin-bottom: 0.4rem;
  // justify-content: space-between;
  &-item {
    flex: 0 0 auto;
    margin: 0.14rem 0.14rem 0.14rem 0;
    font-size: 0.34rem;
    padding: 0.15rem 0.24rem 0.15rem 0.3rem;
    border-radius: 0.4rem;
    color: #5e74fe;
    background-color: #eaecff;
    .iconicon1-461 {
      font-size: 0.4rem;
    }
  }
}
.autocomplete-list {
  z-index: 9999 !important;
}
.custom-input {
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  border: 1px solid #ddd;
}
.add-btn {
  width: 130px;
}
</style>
