<template>
  <div>
    <el-input
      v-model="privateValue"
      :size="size"
      :readonly="readonly"
      placeholder="请输入"
    >
      <el-button
        slot="append"
        :disabled="readonly"
        icon="el-icon-notebook-2"
        v-bind="$attrs"
        @click="showModal"
      />
    </el-input>
    <el-dialog title="初步诊断" :visible.sync="visible" append-to-body>
      <el-collapse
        ref="collapse"
        v-model="activePanel"
        accordion
        class="collapse"
      >
        <el-collapse-item
          v-for="item in list"
          :key="item.title"
          :title="item.title"
          :name="item.title"
        >
          <med-radio
            v-model="privateValue"
            border
            :options="item.details"
            @change="onChange"
          />
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
export default {
  name: 'DiagnosisInput',
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: { type: String, default: '' },
    size: { type: String, default: '' }
  },
  data() {
    return {
      dic,
      visible: false,
      activePanel: ''
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    list() {
      const arr = this.dictionary[this.dic.preliminaryDiagnosis] || []
      const groupMap = {}
      arr.forEach((ele) => {
        if (groupMap[ele.describe]) {
          groupMap[ele.describe].push(ele)
        } else {
          groupMap[ele.describe] = [ele]
        }
      })
      return Object.keys(groupMap).map((key) => {
        return {
          title: key,
          value: key,
          details: (groupMap[key] || []).map((ele) => {
            return {
              ...ele,
              value: ele.describe + '-' + ele.label
            }
          })
        }
      })
    },
    privateValue: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  methods: {
    onChange(v) {
      this.$emit('input', v)
    },
    showModal() {
      this.visible = true
      if (this.privateValue) {
        this.activePanel = this.privateValue.split('-')[0]
        this.$nextTick(() => {
          const activeEle =
            this.$refs.collapse?.$el?.querySelector('.is-active')
          if (activeEle) {
            activeEle.scrollIntoView()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse {
  max-height: 560px;
  overflow: auto;
}
::v-deep .el-dialog__body {
  padding-top: 0px;
}
</style>
