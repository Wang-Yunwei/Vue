<template>
  <div class="med-address-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp" :rules="rules">
      <el-cascader
        v-model="selectedOptions"
        v-bind="$props"
        size="mini"
        :props="{ expandTrigger: 'click', emitPath: false }"
        :options="addrOptions"
        @change="handleChange"
      />
    </el-form-item>
  </div>
</template>

<script>
import { Cascader } from 'element-ui'
import { areaList } from '@vant/area-data'
export default {
  name: '',
  props: {
    ...Cascader.props,
    label: {
      type: String,
      default: ''
    },
    formProp: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedOptions: ''
    }
  },
  computed: {
    addrOptions() {
      const counties = {}
      Object.keys(areaList.county_list).forEach(county => {
        const k = county.substr(0, 4) + '00'
        if (k in counties) {
          counties[k].push({ value: county, label: areaList.county_list[county] })
        } else {
          counties[k] = [{ value: county, label: areaList.county_list[county] }]
        }
      })

      const cities = {}
      Object.keys(areaList.city_list).forEach(c => {
        const k = c.substr(0, 2) + '0000'
        if (k in cities) {
          cities[k].push({ value: c, label: areaList.city_list[c], children: counties[c] })
        } else {
          cities[k] = [{ value: c, label: areaList.city_list[c], children: counties[c] }]
        }
      })

      const options = []
      Object.keys(areaList.province_list).forEach(p =>
        options.push({ value: p, label: areaList.province_list[p], children: cities[p] })
      )
      return options
    }
  },
  watch: {
    value(val) {
      this.selectedOptions = val
    }
  },
  mounted() {
    this.selectedOptions = this.value
    this.$forceUpdate()
  },
  methods: {
    handleChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.med-address-wrapper{
  .el-cascader {
    width: 100%;
  }
}
</style>
