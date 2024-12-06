<template>
  <div class="med-input-wrapper">
    <el-input
      v-model="textValue"
      size="mini"
      v-bind="$attrs"
      @change="onInputChanged"
    >
      <template v-if="!$scopedSlots.length" slot="append">
        <div v-if="append && append !== ''">{{ append }}</div>
      </template>

      <template v-for="(_, slot) of $scopedSlots" :slot="slot">
        <slot :name="slot" />
      </template>

    </el-input>
  </div>
</template>

<script>
import Vue from 'vue'
import { Input } from 'element-ui'
Vue.use(Input)

export default {
  name: 'MedText',
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    ...Input.props,
    append: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      textValue: this.value
    }
  },
  computed: {

  },
  watch: {
    value(val) {
      this.textValue = val
    }
  },
  mounted() {
    this.textValue = this.value
    this.$forceUpdate()
  },
  methods: {
    onInputChanged() {
      this.$emit('_change', this.textValue)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.med-input-wrapper {
  width: 100%;
}
</style>
