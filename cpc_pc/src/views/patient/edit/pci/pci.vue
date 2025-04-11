<template>
  <div>
    <med-subtitle :title="title" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.startRadiographyTime"
          form-prop="treatment.startRadiographyTime"
          label="造影开始时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.timi"
          form-prop="treatment.timi"
          label="TIMI血流等级(仅造影时)"
          :disabled="disabled"
          :select-options="dictionary.timiLevelDict"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RsBjPCI',
  components: {},
  props: {
    title: {
      required: true,
      type: String
    },
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters([
      'dictionary'
    ])
  }
}
</script>
