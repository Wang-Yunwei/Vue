<template>
  <div class="multi-select-wrapper">
    <van-field :label="label" @click="show = true" readonly>
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
    </van-field>
    <van-list class="down-list">
      <van-cell v-for="label in labelList" :key="label">
        {{ label }}
        <template #right-icon>
          <van-button size="mini" round style="border:none">
            <van-icon name="delete-o" color="red" @click="removeItem(label)" />
          </van-button>
        </template>
      </van-cell>
    </van-list>
    <van-popup
      v-model="show"
      get-container="body"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <div class="multi-select-page-wrapper" @click.stop>
        <med-view-container :title="title" @return="onReturn" scroll>
          <van-checkbox-group v-model="selectedOptions" ref="checkboxGroup">
            <van-cell-group>
              <template v-for="(item, index) in options">
                <van-cell
                  :value="item.label"
                  clickable
                  @click="toggle(item, index)"
                  :key="item.value"
                >
                  <template #right-icon>
                    <van-checkbox ref="checkboxes" :name="item.value" />
                  </template>
                </van-cell>
                <van-field
                  :key="item.value"
                  v-if="item.value === '99' && showOther"
                  v-model="otherContent"
                  label="其他内容"
                  maxlength="66"
                  placeholder="请填写"
                />
              </template>
            </van-cell-group>
          </van-checkbox-group>
        </med-view-container>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  data() {
    return {
      show: false
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    options: {
      require: true,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    },
    other: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '请选择'
    }
  },
  computed: {
    labelMap() {
      const map = {}
      this.options.forEach(opt => {
        map[opt.value] = opt.label
      })
      return map
    },
    valueList() {
      let valueArr = []
      if (this.value) {
        valueArr = this.value.split(',')
      }
      return valueArr
    },
    labelList() {
      let labelArr = []
      let otherArr = []
      if (this.value) {
        labelArr = this.value
          .split(',')
          .filter(v => v !== '99') // 隐藏'其他'项
          .map(val => this.labelMap[val])
          .filter(el => el)
      }
      if (this.other) {
        otherArr = [this.other]
      }
      return labelArr.concat(otherArr)
    },
    selectedOptions: {
      get() {
        return this.valueList
      },
      set(value) {
        value.sort((a, b) => {
          const matchedA = this.options.findIndex(opt => opt.value === a)
          const matchedB = this.options.findIndex(opt => opt.value === b)
          return matchedA - matchedB
        })
        this.$emit('input', value.join())
      }
    },
    otherContent: {
      get() {
        return this.other
      },
      set(value) {
        this.$emit('update:other', value)
      }
    },
    showOther() {
      const otherOpt = this.options.find(ele => ele.value === '99')
      if (otherOpt && this.valueList.includes(otherOpt.value)) {
        return true
      }
      return false
    }
  },
  methods: {
    onReturn() {
      this.show = false
      this.backClick()
    },
    removeItem(label) {
      if (this.other === label) {
        // 删除'其他'的内容时,一并取消'其他'项的选中状态
        const matchedValue = (
          this.options.find(item => item.value === '99') || {}
        ).value
        const newVal = this.valueList
          .filter(item => item !== matchedValue)
          .join()
        this.$emit('input', newVal)
        this.$emit('update:other', '')
      } else {
        const matchedValue = (
          this.options.find(item => item.label === label) || {}
        ).value
        const newVal = this.valueList
          .filter(item => item !== matchedValue)
          .join()
        this.$emit('input', newVal)
      }
    },
    backClick() {
      this.$emit('backClick')
    },
    toggle(item, index) {
      const curCheckboxEle = this.$refs.checkboxes[index]
      if (curCheckboxEle) {
        if (item.value === '98') {
          // 选中“无”，清空其他
          if (!curCheckboxEle.checked) {
            this.$refs.checkboxGroup.toggleAll(false)
            curCheckboxEle.toggle(true)
            this.otherContent = ''
          }
        } else {
          curCheckboxEle.toggle()
          if (item.value === '99') {
            // 其他
            this.otherContent = ''
          }
          if (!curCheckboxEle.checked) {
            const nullOptionIdx = this.options.findIndex(o => o.value === '98')
            if (nullOptionIdx >= 0 && this.$refs.checkboxes[nullOptionIdx]) {
              // 存在‘无’的选项，要清空‘无’
              this.$refs.checkboxes[nullOptionIdx].toggle(false)
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.multi-select-wrapper {
  .van-field::after {
    border-bottom: 0.04rem solid #dadada;
  }
}
.down-list {
  padding-left: 0.3rem;

  // .van-cell__value:before {
  //   content: "";
  //   display: none;
  //   margin-right: 0.2rem;
  //   background-color: #666;
  //   width: 0.15rem;
  //   height: 0.15rem;
  //   border-radius: 100%;
  // }
}

.multi-select-page-wrapper {
  height: 100vh;
  width: 100vw;

  .main-body {
    padding-top: 0.3rem;
    max-height: calc(100vh - 110px);
    overflow: auto;
  }
}
</style>
