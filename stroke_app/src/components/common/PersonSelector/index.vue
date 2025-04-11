<template>
  <div class="person-selector">
    <van-field
      :value="value"
      :label="label"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="onChange"
    >
      <template #right-icon>
        <i class="iconfont iconicon1-191 maxstyle" @click="changePicker(1)" />
      </template>
    </van-field>
    <van-popup
      v-model="showPicker"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <!--接诊医生选择器的 弹窗 -->
      <van-search :placeholder="`请输入${label}名称`" v-model="personSearch" />
      <van-picker
        cancel-button-text="取消"
        value-key="title"
        show-toolbar
        item-height="1rem"
        :columns="personsSearchResult"
        @confirm="onConfirmPicker"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

/**
 * 人员选择
 */
export default {
  name: 'personSelector',
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    dicKey: {
      type: String,
      default: 'doctorOpts'
    },
    maxlength: {
      type: [String, Number],
      default: '20'
    }
  },
  created() {
    this.getPersons()
  },
  data() {
    return {
      persons: [],
      personSearch: '',
      showPicker: false
    }
  },
  computed: {
    ...mapGetters(['dicData']),
    // 根据输入过滤医生
    personsSearchResult() {
      // 获取接诊医生的选择项
      const ret = []
      this.persons.forEach(item => {
        // 搜索根据医生姓名搜索
        if (this.personSearch) {
          if (item.name.indexOf(this.personSearch) > -1) {
            // item.name  接诊医生的name中文属性
            ret.push(item.name)
          }
        } else {
          ret.push(item.name) // 没有搜索显示全部
        }
      })
      return ret
    }
  },
  methods: {
    // 获取人员列表
    getPersons() {
      if (
        !this.dicData[this.dicKey] ||
        this.dicData[this.dicKey].length === 0
      ) {
        return
      }
      this.persons = this.dicData[this.dicKey].map(d => {
        return { name: d.label }
      })
    },
    changePicker(flag) {
      if (flag === 1) {
        this.personSearch = ''
      }
      this.showPicker = true
    },
    onChange(val) {
      this.$emit('input', val)
    },
    onConfirmPicker(value) {
      this.$emit('input', value)
      this.showPicker = false
    }
  }
}
</script>

<style lang="less">
.person-selector > .van-cell::after {
  display: block;
}
</style>
