<template>
  <div>
    <med-subtitle title="再次危险分层" />
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="data.graceRehazardLevel"
          form-prop="inspection.graceRehazardLevel"
          label="再次危险分层"
          :disabled="disabled"
          :select-options="nsteAcsDic"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-if="showGraceRehazardTime"
          v-model="data.graceRehazardTime"
          form-prop="inspection.graceRehazardTime"
          label="再次危险分层时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写再次危险分层时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dicConstant as d } from '@/constant/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Nsteacs',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataTreatment: {
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
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    nsteAcsDic() {
      console.log('graceRehazardLevelCode', this.dictionary[d.graceRehazardLevelCode])
      return this.dictionary[d.graceRehazardLevelCode]
    },
    showGraceRehazardTime() {
      if (
        this.data.graceRehazardLevel === '99' ||
        this.data.graceRehazardLevel === null ||
        this.data.graceRehazardLevel === ''
      ) {
        return false
      }
      return true
    }
  },
  created() {
    // const { getDictionary } = this
    // this.dictionary = await getDictionary() || {}
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
