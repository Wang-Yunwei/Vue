<template>
  <div class="med-lab-result-wrapper">
    <med-text-field
      v-model="fValue.value"
      v-bind="$props"
      @change="change"
    >
      <template v-slot:append>
        <med-select
          v-model="fValue.unit"
          :select-options="unitOptions"
          class="tn-field-select"
          @change="change"
        />
      </template>
    </med-text-field></div>
</template>

<script>
import TextField from './TextField.vue'
export default {
  name: 'MedLabResultField',
  components: {

  },
  model: {
    prop: 'fValue',
    event: 'input'
  },
  props: {
    ...TextField.props,
    unitOptions: {
      type: Array,
      default: () => []
    },
    fValue: {
      type: Object,
      default: () => ({
        value: '',
        unit: ''
      })
    }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {
  },
  mounted() {
  },
  methods: {
    change() {
      this.$emit('input', this.fValue)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss">
.tn-field-select {
  width: 55px;
}

.med-lab-result-wrapper {
  .med-text-field-wrapper {
  .el-input {
    input {
  min-width: 60px;
    }
  }
  }
}
</style>
