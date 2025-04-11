<template>
  <div v-if="!sorting" class="med-tn-wrapper">
    <div v-for="(item, index) in data" :key="index">
      <el-row :gutter="24">
        <med-radio-field
          v-model="item.creatinineprotein"
          :disabled="disabled"
          :select-options="typeOptions"
          label="肌钙蛋白"
          style="padding-right: 5px;"
          :form-prop="`creatinineproteinList[${index}].creatinineprotein`"
          :rules="[
            { required: true, message: '请填写肌钙蛋白', trigger: 'change' }
          ]"
        />
        <med-unit-field
          :f-value="item"
          :unit-options="dictionary.ctnUnitDict"
          :disabled="disabled"
          label="数值"
          style="padding-right: 5px;"
          :form-prop="`creatinineproteinList[${index}].value`"
          :rules="[
            { required: true, message: '请填写肌钙蛋白数值', trigger: 'blur' }
          ]"
        />
        <med-radio-field
          v-model="item.result"
          :disabled="disabled"
          :select-options="dictionary.testResultDict"
          label="结果"
          style="padding-right: 5px;"
          :form-prop="`creatinineproteinList[${index}].result`"
          :rules="[
            { required: true, message: '请填写肌钙蛋白结果', trigger: 'change' }
          ]"
        />
        <el-col :span="6">
          <med-datetime-field
            v-model="item.drawBloodTime"
            label="抽血时间"
            :disabled="disabled"
            :form-prop="`creatinineproteinList[${index}].drawBloodTime`"
            :rules="[
              { required: true, message: '请填写抽血时间', trigger: 'change' }
            ]"
            @change="sort"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="item.reportTime"
            label="报告时间"
            :disabled="disabled"
            :form-prop="`creatinineproteinList[${index}].reportTime`"
            :rules="[
              { required: true, message: '请填写报告时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <div class="med-tn-wrapper-button">
          <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="disabled" @click="add" />
          <el-button v-if="data.length > 1 && index >= 0" type="danger" icon="el-icon-delete" size="mini" :disabled="disabled" @click="delete1(index)" />
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MedTnField',
  props: {
    data: {
      required: true,
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeOptions: [
        {
          label: 'cTnT',
          value: '1'
        },
        {
          label: 'cTnI',
          value: '2'
        }
      ],
      sorting: false
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  watch: {
    // data(val) {
    //   this.data = val
    // }
  },
  created() {
  },
  mounted() {
    this.sort()
  },
  methods: {
    sort() {
      this.sorting = true
      this.data.sort((a, b) => {
        if (!a.drawBloodTime) return -1
        if (!b.drawBloodTime) return 1
        return a.drawBloodTime.localeCompare(b.drawBloodTime)
      })
      this.$nextTick(() => {
        this.sorting = false
      })
    },
    add() {
      this.data.push({
        creatinineprotein: '',
        drawBloodTime: '',
        id: '',
        registId: this.$route.query.id,
        reportTime: '',
        unit: '1',
        result: '',
        value: ''
      })
    },
    delete1(index) {
      this.data.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.med-tn-wrapper {
  ::v-deep .el-form-item--mini .el-form-item__label {
    height: 38px;
  }
  .el-row {
    margin-left: 0!important;
    display: flex;
  }
  &-button {
    margin-top: 37px;
  }
}
.med-tn-field-label {
  margin-top: 10px;
}
.med-tn-field-label .el-button{
padding: 3px;
margin-left: 10px;;
}
.med-tn-field-row {
  margin-top: -28px;
}
.med-tn-field-add-button {
  margin-left: 10px;
}

.med-tn-field-col-delete-button {
  margin-top: 38px;
}

.tn-field-select {
  width: 45px;
}

.med-tn-field-row {
  display: flex;

.ed-tn-field-col-nolabel {
    margin-top: 38px;
}
.med-tn-field-col {
  margin-right: 10px;
}
  .med-tn-field-col:nth-child(1) {
    flex-basis: 115px;
    flex-shrink: 0;
  }

  //   .med-tn-field-col:nth-child(2) {
  //   margin-right: 20px;
  // }

    .med-tn-field-col:nth-child(3) {
    flex-basis: 115px;
    flex-shrink: 0;
  }
}
</style>
