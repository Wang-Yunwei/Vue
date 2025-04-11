<template>
  <div class="med-part-select-wrapper">
    <med-hint-field
      @click="onFieldClick"
      readonly
      v-bind="$props"
      v-model="fieldValue"
    >
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
      <template #input-part v-if="labelList && labelList.length > 0">
        <div class="med-list-label-wapper">
          <div
            :class="['med-select-label-item', { 'item-disable': disabled }]"
            v-for="(item, index) in labelList"
            :key="'med-list-label-' + index"
          >
            {{ item }}
          </div>
        </div>
      </template>
    </med-hint-field>
    <!-- <van-list class="down-list">
      <van-cell v-for="label in labelList" :key="label" :disabled="disabled">
        <span :style="disabled ? { color: '#c8c9cc' } : {}">{{ label }}</span>
        <template #right-icon>
          <van-button
            size="mini"
            round
            style="border:none"
            :readonly="readonly"
            :disabled="disabled"
          >
            <van-icon
              name="delete-o"
              :color="disabled ? '#c8c9cc' : 'red'"
              @click="removeItem(label)"
            />
          </van-button>
        </template>
      </van-cell>
    </van-list> -->
    <med-popup-container
      v-model="show"
      :title="label"
      get-container="body"
      position="right"
      @return="onReturnClick"
    >
      <div class="part-select-options-image">
        <van-checkbox-group v-model="selectedOptions">
          <van-cell-group>
            <part-checkbox name="01" class="one" no="1" />
            <!-- <van-checkbox name="01" class="one"  /> -->
            <part-checkbox name="02" class="two" no="2" />
            <part-checkbox name="03" class="three" no="3" />
            <part-checkbox name="04" class="four" no="4" />
            <part-checkbox name="05" class="five" no="5" />
            <part-checkbox name="06" class="six" no="6" />
            <part-checkbox name="07" class="seven" no="7" />
            <part-checkbox name="08" class="eight" no="8" />
            <part-checkbox name="09" class="nine" no="9" />
            <part-checkbox name="10" class="ten" no="10" />
            <part-checkbox name="11" class="eleven" no="11" />
            <part-checkbox name="12" class="twelve" no="12" />
            <part-checkbox name="13" class="thirteen" no="13" />
            <part-checkbox name="14" class="fourteen" no="14" />
            <part-checkbox name="15" class="fifteen-1" no="15" />
            <part-checkbox name="15" class="fifteen-2" no="15" />
          </van-cell-group>
        </van-checkbox-group>
        <!-- <div class="part-select-options-image">
          <van-icon name="circle" class="one" />
          <van-icon name="circle" class="two" />
          <van-icon name="circle" class="three" />
          <van-icon name="circle" class="four" />
          <van-icon name="circle" class="five" />
          <van-icon name="circle" class="six" />
          <van-icon name="circle" class="seven" />
          <van-icon name="circle" class="eight" />
          <van-icon name="circle" class="nine" />
          <van-icon name="circle" class="ten" />
          <van-icon name="circle" class="eleven" />
          <van-icon name="circle" class="twelve" />
          <van-icon name="circle" class="thirteen" />
          <van-icon name="circle" class="fourteen" />
          <van-icon name="circle" class="fifteen-1" />
          <van-icon name="circle" class="fifteen-2" />
        </div> -->
        <van-image :src="require('@assets/image/pci.png')" class="pci-image">
        </van-image>
        <div @click.stop class="pci-part">
          <van-checkbox-group v-model="selectedOptions">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in selectOptions"
                :key="item.value"
                :value="item.label"
                clickable
                @click="toggle(item, index)"
              >
                <template #right-icon>
                  <van-checkbox ref="checkboxes" :name="item.value" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
    </med-popup-container>
  </div>
</template>

<script>
import MedHintField from '@/components/common/MedHintField/index.jsx'
import partCheckbox from './partCheckbox.vue'
export default {
  components: { partCheckbox },
  name: 'MedPartSelectField',
  data() {
    return {
      show: false,
      fieldValue: ''
    }
  },
  comments: [partCheckbox],
  props: {
    ...MedHintField.props,
    selectOptions: {
      require: true,
      default: () => []
    },
    value: {
      type: [Array, String],
      default: ''
    }
  },
  computed: {
    labelMap() {
      const map = {}
      this.selectOptions.forEach(opt => {
        map[opt.value] = opt.label
      })
      return map
    },
    valueList() {
      let valueArr = []
      if (this.value) {
        if (Array.isArray(this.value)) {
          valueArr = this.value
        } else valueArr = this.value.split(',')
      }
      return valueArr
    },
    labelList() {
      let labelArr = []
      if (this.value) {
        labelArr = this.valueList
          .filter(v => v !== '99') // 隐藏'其他'项
          .map(val => this.labelMap[val])
          .filter(el => el)
      }
      return labelArr
    },
    selectedOptions: {
      get() {
        return this.valueList
      },
      set(value) {
        value.sort((a, b) => {
          const matchedA = this.selectOptions.findIndex(opt => opt.value === a)
          const matchedB = this.selectOptions.findIndex(opt => opt.value === b)
          return matchedA - matchedB
        })
        this.$emit('input', value.join())
      }
    }
  },
  methods: {
    setFieldValue(value) {
      if (!value || value.length === 0) {
        this.fieldValue = ''
        return
      }
      const result = value.filter(m => {
        return m && m !== ''
      })
      if (result.length === 0) {
        this.fieldValue = ''
        return
      }
      this.fieldValue = JSON.stringify(value)
    },
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    onReturnClick() {
      this.show = false
      this.$emit('confirm', {
        selectedOptions: this.selectedOptions
      })
    },
    removeItem(label) {
      if (this.readonly || this.disabled) return
      const matchedValue = (
        this.selectOptions.find(item => item.label === label) || {}
      ).value
      const newVal = this.valueList
        .filter(item => item !== matchedValue)
        .join()
      this.$emit('input', newVal)
      this.$emit('confirm', {
        selectedOptions: newVal
      })
    },
    backClick() {
      this.$emit('backClick')
    },
    toggle(item, index) {
      this.$refs.checkboxes[index].toggle()
    }
  },
  watch: {
    selectedOptions: {
      immediate: true,
      handler(val) {
        this.setFieldValue(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.down-list {
  background: #fff;
  padding-left: 0.3rem;
}
.pci-image {
  padding: 16px;
}
.pci-part {
  overflow-y: auto;
  height: calc(100vh - 724px);
}
.med-part-select-wrapper {
  width: 100vw;
  .med-list-label-wapper {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    .med-select-label-item {
      background-color: rgb(228, 232, 255);
      color: #5e74fe;
      border-radius: 0.3rem;
      padding: 0 0.22rem;
      margin: 2px 0;
      flex: 0 1 auto;
      &:not(:last-child),
      &:only-child {
        margin-right: 0.1rem;
      }
    }
    .item-disable {
      background-color: #c8c9cc;
      color: #ffffff;
    }
  }
}
.part-select-options {
  display: flex;
  flex-direction: column;
  &-image {
    // width: 100%;
    // background-image: url('~@/assets/image/pci.png') no-repeat;
    // background-size: cover;
    margin-top: 8px;
    position: fixed;
    z-index: 1;
    .one,
    .two,
    .three,
    .four,
    .five,
    .six,
    .seven,
    .eight,
    .nine,
    .ten,
    .eleven,
    .twelve,
    .thirteen,
    .fourteen,
    .fifteen-1,
    .fifteen-2 {
      position: absolute;
      z-index: 1;
      font-size: 46px;
      padding: 24px;
    }
    .one {
      left: 132px;
      top: 92px;
    }
    .two {
      left: 50px;
      top: 250px;
    }
    .three {
      left: 130px;
      top: 400px;
    }

    .four {
      left: 196px;
      top: 480px;
    }

    .five {
      left: 390px;
      top: 36px;
    }

    .six {
      left: 504px;
      top: 104px;
    }

    .seven {
      left: 580px;
      top: 254px;
    }
    .eight {
      left: 566px;
      top: 422px;
    }

    .nine {
      left: 616px;
      top: 160px;
    }

    .ten {
      left: 638px;
      top: 320px;
    }

    .eleven {
      left: 350px;
      top: 128px;
    }

    .twelve {
      left: 416px;
      top: 204px;
    }

    .thirteen {
      left: 310px;
      top: 270px;
    }

    .fourteen {
      left: 412px;
      top: 308px;
    }

    .fifteen-1 {
      left: 334px;
      top: 392px;
    }
    .fifteen-2 {
      left: 266px;
      top: 400px;
    }
  }
}
</style>
