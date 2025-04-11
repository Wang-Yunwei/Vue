<template>
  <div>
    <med-subtitle title="院前心电图" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.hasPreEcg"
          :disabled="disabled"
          radio-type="button"
          label="是否有心电图"
          :select-options="dictionary.yesOrNoDict"
          form-prop="prehospital.hasPreEcg"
          :rules="[
            { required: true, message: '请填写是否有心电图', trigger: 'change' }
          ]"
          @change="preEcgChange()"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.hasPreEcg === '1'">
      <el-col v-for="(item, index) in recordList" :key="item.id + index" style="margin-bottom: 10px;">
        <med-ecg-field
          :ecg="item"
          :disabled="disabled"
          :upload-url="ecgPrefixUrl"
          :readonly="false"
          :rule-name="`prehospitalEcgList[${index}]`"
          @change="ecgChanged"
          @removeRecord="deleteRecord(item, index)"
        />
      </el-col>
      <el-button class="add-btn" icon="el-icon-plus" :disabled="disabled" @click="addRecord">添加</el-button>
    </el-row>
    <el-row v-if="data.hasPreEcg === '0'" :gutter="24">
      <el-col :span="6">
        <med-text-field
          v-model="data.noEcgReason"
          label="未获得原因"
          required
          :disabled="disabled"
          form-prop="prehospital.noEcgReason"
          :rules="[
            { required: true, message: '请填写未获得原因', trigger: 'blur' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isRemotetrans"
          :disabled="disabled"
          radio-type="button"
          label="是否远程心电图传输"
          :select-options="dictionary.yesOrNoDict"
          form-prop="prehospital.isRemotetrans"
          :rules="[
            { required: true, message: '请填写是否远程心电图传输', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-if="data.isRemotetrans === '1'"
          v-model="data.remotetransTime"
          label="远程心电图传输时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.remotetransTime"
          :rules="[
            { required: true, message: '请填写远程心电图传输时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="data.isRemotetrans === '1'"
          v-model="data.remotetransType"
          radio-type="button"
          :disabled="disabled"
          label="传输方式"
          :select-options="dictionary.remoteEcgtranWayDict"
          form-prop="prehospital.remotetransType"
          :rules="[
            { required: true, message: '请填写传输方式', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dicConstant as d } from '@/constant/index'
import { getEcg, deleteEcg } from '@/api/patient/edit'
import { mapGetters } from 'vuex'
export default {
  name: 'Ecg',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataEcg: {
      required: true,
      default: () => [],
      type: Array
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      ecgPrefixUrl: d.imgURL,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),

      ecgData: {
        id: '',
        checkTime: null,
        diagnosisTime: null,
        flag: '1',
        ecgDiagnosis: null,
        ecgFilesList: []
      },
      ecgField: '',
      recordList: []
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {
    this.initEcgData()

    this.$eventBus.$on('refreshPatient',this.initEcgData)
  },
  beforeDestroy() {
    this.$eventBus.$off('refreshPatient',this.initEcgData)
  },
  methods: {
    async initEcgData() {
      this.recordList = []
      const { result } = await getEcg(this.$route.query.id, '1') || []

      for (var i = 0; i < result.length; i++) {
        const recordItem = {}
        recordItem.id = result[i].id
        recordItem.registId = result[i].registId
        recordItem.ecgTime = result[i].checkTime
        recordItem.diagTime = result[i].diagnosisTime
        recordItem.ecgDiagnosis = result[i].ecgDiagnosis
        recordItem.ecgType = result[i].flag
        if (
          result[i].ecgFilesList != null &&
          result[i].ecgFilesList.length > 0
        ) {
          recordItem.ecgFile = result[i].ecgFilesList[0].attachPath
          if (recordItem.ecgFile) {
            recordItem.uploadList = recordItem.ecgFile.split(';').filter(el => el).map(item => ({ url: d.imgURL + item, isImage: true }))
          } else {
            recordItem.uploadList = []
          }
        } else {
          recordItem.ecgFile = null
          recordItem.uploadList = []
        }

        this.recordList.push(recordItem)
      }
    },
    preEcgChange() {
      if (this.data.hasPreEcg === '1') {
        this.addRecord()
      } else if (this.data.hasPreEcg === '0') {
        this.recordList = []
        this.ecgChanged()
      }
    },
    deleteRecord(item, idx) {
      this.$confirm('删除心电图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (!item.id) {
          this.recordList.splice(idx, 1)
          this.ecgChanged()
          return
        }
        const res = await deleteEcg(item.id)
        if (res && res.status === 200) {
          var index = this.recordList.findIndex(m => m.id === item.id)
          if (index > -1) {
            this.recordList.splice(index, 1)
            this.ecgChanged()
          }
        } else {
          this.$message({ type: 'error', message: '心电图删除失败。', duration: 2000 })
        }
      })
    },
    addRecord() {
      this.recordList.push({
        id: null,
        registId: this.$route.query.id,
        ecgTime: null,
        diagTime: null,
        ecgDiagnosis: null,
        ecgType: null,
        ecgFile: null,
        uploadList: []
      })

      this.ecgChanged()
    },
    ecgChanged() {
      const ecgList = []
      for (const r of this.recordList) {
        const ecgData = {}
        ecgData.ecgFilesList = []
        if (r.ecgFile != null) {
          var ecgFile = {
            attachPath: r.ecgFile,
            attachType: '1',
            attachName: r.ecgFile.substring(
              r.ecgFile.lastIndexOf('/') + 1
            )
          }
          ecgData.ecgFilesList.push(ecgFile)
        }
        ecgData.id = r.id
        ecgData.registId = this.$route.query.id
        ecgData.ecgDiagnosis = r.ecgDiagnosis
        ecgData.checkTime = r.ecgTime
        ecgData.diagnosisTime = r.diagTime
        ecgData.flag = r.ecgType || '1'

        ecgList.push(ecgData)
      }

      this.$emit('ecgchanged', ecgList)
    }
  }
}
</script>
<style lang="scss" scoped>
.add-btn {
  width: 100%;
  padding: 15px;
  border: 1px dashed #ddd;
  margin-bottom: 20px;
}
</style>
