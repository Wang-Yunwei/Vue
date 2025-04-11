<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isEcg"
      :disabled="disabled"
      label="是否有心电图"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否心电图' }]"
    />
    <div v-if="data.isEcg === '0'">
      <med-text-field
        required
        :rules="[{ required: true, message: '请填写未获得原因' }]"
        v-model="data.noEcgReason"
        maxlength="60"
        :disabled="disabled"
        label="未获得原因"
        @confirm="onChanged"
      />
    </div>
    <div v-if="data.isEcg === '1'">
      <med-ecg-field
        label="心电图"
        v-model="ecgField"
        :disabled="disabled"
        :upload-url="ecgPrefixUrl"
        :upload-image="uploadImage"
        :deleteRecord="deleteRecord"
        :record-list="recordList"
        :readonly="false"
        :show-first="showFirstEcgTag"
        :update-record="uploadSave"
        required
        :rules="[{ required: true, message: '请填写心电图' }]"
      />
      <!-- required
        :rules="[{ required: true, message: '' }]" -->
    </div>
    <med-radio-button-field
      v-model="data.isEcgTransmission"
      :disabled="disabled"
      label="接收远程心电图"
      required
      :rules="[{ required: true, message: '请填写接收远程心电图' }]"
      :select-options="yesOrNoDic"
      v-if="data.comeType === '1' || data.comeType === '2'"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <div v-if="data.isEcgTransmission == '1'">
      <med-date-picker
        v-model="data.ecgTransmissionTime"
        label="接收远程心电图时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写接收远程心电图时间' }]"
      />
      <med-radio-select-field
        v-model="data.ecgTransmissionType"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写远程心电传输方式' }]"
        label="远程心电传输方式"
        :select-options="ecgTransferTypeDic"
        @confirm="onChanged"
      >
      </med-radio-select-field>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Uploader } from 'vant'
import { dicConstant } from '../../../../../constant/commonConstant'
import { debounce } from 'lodash'
Vue.use(Uploader)

export default {
  name: 'Ecg',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    dataPreEcg: {
      required: false,
      type: []
    },
    dataPreHospital: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      active: 0,
      ecgPrefixUrl: dicConstant.imgURL,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      yesOrNoDic: [],
      ecgTransferTypeDic: [],
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
      recordList: [],
      codeList: [dicConstant.yesOrNoCode, dicConstant.remoteEcgtranWayCode]
    }
  },
  computed: {
    showFirstEcgTag() {
      if (
        this.dataPreEcg !== null &&
        this.dataPreEcg.length > 0 &&
        this.dataPreHospital.hasPreEcg === '1'
      ) {
        return false
      }
      return true
    }
  },
  created() {
    this.getDicList()
    this.initEcgData()
  },
  methods: {
    async getDicList() {
      const result = await this.$api.service.getDictionary('')
      this.yesOrNoDic = result[dicConstant.yesOrNoCode]
      this.ecgTransferTypeDic = result[dicConstant.remoteEcgtranWayCode]
    },
    async initEcgData() {
      this.recordList = []
      const res = await this.$api.service.getEcg(this.$route.query.registId, '2')
      if (res.result != null) {
        for (var i = 0; i < res.result.length; i++) {
          this.recordItem = {}
          this.recordItem.id = res.result[i].id
          this.recordItem.registId = res.result[i].registId
          this.recordItem.ecgTime = res.result[i].checkTime
          this.recordItem.diagTime = res.result[i].diagnosisTime
          this.recordItem.ecgDiagnosis = res.result[i].ecgDiagnosis
          this.recordItem.ecgType = res.result[i].flag
          if (
            res.result[i].ecgFilesList != null &&
            res.result[i].ecgFilesList.length > 0
          ) {
            this.recordItem.path = res.result[i].ecgFilesList[0].attachPath
            this.recordItem.ecgFile =
              dicConstant.imgURL + res.result[i].ecgFilesList[0].attachPath
          }
          this.recordList.push(this.recordItem)
        }
      }
      this.$emit('onReloadEcg', res.result)
    },
    onChanged() {
      this.$emit('change', '1')
    },
    async uploadImage(data) {
      const res = await this.$api.service.uploadWithThumb(data)
      if (res && res.status === 200) {
        console.log(res.result)
        return res.result
      } else {
        return null
      }
    },
    async deleteRecord(item) {
      const res = await this.$api.service.deleteEcg(item.id)
      if (res && res.status === 200) {
        this.initEcgData()
        this.$emit('updateReportStatus', true)
        return true
      } else {
        return false
      }
    },
    uploadSave: debounce(async function(params) {
      this.ecgData.ecgFilesList = []
      if (params.ecgFile != null) {
        var ecgFile = {
          id: params.id || '',
          attachPath: params.path,
          thumbAttachPath: params.thumb,
          attachType: '1',
          attachName: params.ecgFile.substring(
            params.ecgFile.lastIndexOf('/') + 1
          )
        }
        this.ecgData.ecgFilesList.push(ecgFile)
      }
      this.ecgData.registId = this.$route.query.registId
      this.ecgData.id = params.id
      this.ecgData.ecgDiagnosis = params.ecgDiagnosis
      this.ecgData.checkTime = params.ecgTime
      this.ecgData.diagnosisTime = params.diagTime
      this.ecgData.timeStamp = this.data.timeStamp

      try {
        const res = await this.$api.service.saveEcg(this.ecgData)
        if (res && res.status === 200) {
          this.data.timeStamp = res.result.timeStamp
          this.$emit('updateReportStatus', true)
          this.initEcgData()
          return true
        } else {
          this.$notify({ type: 'warning', message: '心电图保存失败！' })
          return false
        }
      } catch (ex) {
        this.initEcgData()
        this.$emit('onSaveException', ex)
      }
    }, 300)
  }
}
</script>

<style lang="less" scoped></style>
