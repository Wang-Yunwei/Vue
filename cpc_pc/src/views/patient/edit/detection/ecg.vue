<template>
  <div>
    <med-subtitle title="院内心电图" />
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isEcg"
          :disabled="disabled"
          form-prop="admission.isEcg"
          label="是否心电图"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否心电图', trigger: 'change' }
          ]"
          @change="ecgChange()"
        />
      </el-col>
      <el-col v-if="data.isEcg == '0'" :span="6">
        <med-text-field
          v-model="data.noEcgReason"
          form-prop="admission.noEcgReason"
          :disabled="disabled"
          label="未获得原因"
          :rules="[
            { required: true, message: '请填写未获得原因', trigger: 'blur' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.isEcg == '1'">
      <el-col v-for="(item, index) in recordList" :key="item.id + index" style="margin-bottom: 10px;">
        <!-- <i
          v-if="recordList.length > 1 && !disabled"
          class="el-icon-delete"
          style="font-size:32px; color: red; position: absolute; right: 140px; top: 60px; cursor: pointer;"
          @click="deleteRecord(item, index)"
        />
        <i
          v-if="!disabled"
          class="el-icon-document-add"
          style="font-size:32px; color: green; position: absolute; right: 100px; top: 60px; cursor: pointer;"
          @click="addRecord"
        /> -->
        <med-ecg-field
          :ecg="item"
          :disabled="disabled"
          :upload-url="ecgPrefixUrl"
          :readonly="false"
          :rule-name="`admissionEcgList[${index}]`"
          @change="ecgChanged"
          @removeRecord="deleteRecord(item, index)"
        />
      </el-col>
      <el-button class="add-btn" icon="el-icon-plus" :disabled="disabled" @click="addRecord">添加</el-button>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-if="data.comeType === '1' || data.comeType === '2'"
          v-model="data.isEcgTransmission"
          :disabled="disabled"
          label="接收远程心电图"
          form-prop="admission.isEcgTransmission"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写接收远程心电图', trigger: 'change' }
          ]"
        />
      </el-col>
      <div v-if="data.isEcgTransmission == '1'" :gutter="24">
        <el-col :span="6">
          <med-datetime-field
            v-model="data.ecgTransmissionTime"
            label="接收远程心电图时间"
            form-prop="admission.ecgTransmissionTime"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写接收远程心电图时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-model="data.ecgTransmissionType"
            :disabled="disabled"
            form-prop="admission.ecgTransmissionType"
            label="远程心电传输方式"
            :select-options="dictionary.remoteEcgtranWayDict"
            :rules="[
              { required: true, message: '请填写远程心电传输方式', trigger: 'change' }
            ]"
          />
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import { dicConstant as d } from '@/constant/index'
import { getEcg, deleteEcg } from '@/api/patient/edit'
import { mapGetters } from 'vuex'
export default {
  name: 'DetectionEcg',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataEcg: {
      required: true,
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
        flag: '2',
        ecgDiagnosis: null,
        ecgFilesList: []
      },
      ecgField: '',
      recordItem: {
        id: '',
        registId: '',
        ecgFile: '',
        ecgTime: '',
        ecgDiagnosis: '',
        ecgException: '',
        ecgType: ''
      },
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
      const { result } = await getEcg(this.$route.query.id, '2') || []

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

      // 如果没有心电图记录，生成一条初始的记录
      // if (this.recordList.length === 0 && !this.disabled) this.addRecord()
    },
    ecgChange() {
      if (this.data.isEcg === '1') {
        this.addRecord()
      } else if (this.data.isEcg === '0') {
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
