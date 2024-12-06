<template>
  <el-row>
    <el-col :span="14">
      <el-input-number
        v-model="age"
        :size="size"
        :controls="false"
        :max="200"
        :disabled="!['01', '02', '03'].includes(ageExtend)"
        style="min-width: 115px"
        :class="{ readonly }"
      />
    </el-col>
    <el-col :span="10">
      <med-select
        :size="size"
        :value="ageExtend"
        :readonly="readonly"
        placeholder="请选择"
        :options="extendList"
        :default-first-option="true"
        @change="onAgeExtendChange"
      />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'

export default {
  name: 'AgeInput',
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: undefined
    },
    ageExtend: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dic
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    extendList() {
      return this.dictionary[this.dic.ageType]
    },
    age: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  methods: {
    onAgeExtendChange(v) {
      if (!['01', '02', '03'].includes(v)) {
        this.$emit('input', undefined)
      }
      this.$emit('update:ageExtend', v)
      this.$emit('ageExtendChange', v)
    }
  }
}
</script>

<style lang="scss" scoped>
.readonly {
  pointer-events: none;

  ::v-deep * {
    pointer-events: none;
  }
}
</style>
