<template>
  <div>
    <med-radio-button-field
      v-model="data.hasPreEcg"
      :disabled="disabled"
      label="是否有心电图"
      :select-options="yesOrNoDic"
      required
      :rules="[{ required: true, message: '请填写是否有心电图' }]"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <div v-if="data.hasPreEcg == '0'">
      <med-text-field
        required
        :rules="[{ required: true, message: '请填写未获得原因' }]"
        v-model="data.noEcgReason"
        :disabled="disabled"
        maxlength="60"
        label="未获得原因"
        @confirm="onChanged"
      />
    </div>
    <div v-if="data.hasPreEcg === '1'">
      <med-ecg-field
        label="心电图"
        v-model="ecgField"
        :disabled="disabled"
        :upload-url="ecgPrefixUrl"
        :upload-image="uploadImage"
        :deleteRecord="deleteRecord"
        :record-list="recordList"
        :readonly="false"
        :show-first="true"
        :update-record="uploadSave"
        required
        :rules="[{ required: true, message: '请填写心电图' }]"
      />
    </div>
    <med-radio-button-field
      v-model="data.isRemotetrans"
      :disabled="disabled"
      label="是否远程心电图传输"
      required
      :rules="[{ required: true, message: '请填写是否远程心电图传输' }]"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-date-picker
      v-if="data.isRemotetrans === '1'"
      v-model="data.remotetransTime"
      label="远程心电图传输时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写远程心电图传输时间' }]"
      @confirm="onChanged"
    />
    <med-radio-select-field
      v-model="data.remotetransType"
      :disabled="disabled"
      v-if="data.isRemotetrans === '1'"
      label="传输方式"
      :select-options="remoteEcgtranWayDic"
      required
      :rules="[{ required: true, message: '请填写传输方式' }]"
      @confirm="onChanged"
    >
    </med-radio-select-field>
  </div>
</template>

<script>
import Vue from 'vue'
import { Uploader } from 'vant'
import { dicConstant } from '@/constant/commonConstant'
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
    dataEcg: {
      required: true,
      type: []
    },
    dataAdmission: {
      required: true,
      type: []
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      ecgPrefixUrl: dicConstant.imgURL,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      yesOrNoDic: [],
      remoteEcgtranWayDic: [],

      ecgData: {
        id: '',
        checkTime: null,
        diagnosisTime: null,
        flag: '1',
        ecgDiagnosis: null,
        ecgFilesList: [],
        timeStamp: ''
      },
      ecgField: '',
      recordList: [],
      codeList: [dicConstant.yesOrNoCode, dicConstant.remoteEcgtranWayCode]
    }
  },
  computed: {
    // fisrtEcg() {
    //   if (this.dataEcg != null && this.dataEcg.length > 0) {
    //     return this.dataEcg[0]
    //   }
    //   return this.ecgData
    // }
  },
  created() {
    this.getDicList()
    this.initEcgData()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.remoteEcgtranWayDic = result[dicConstant.remoteEcgtranWayCode]
      })
    },

    initEcgData() {
      this.recordList = []
      this.$api.service.getEcg(this.$route.query.registId, '1').then(res => {
        if (res.result != null) {
          for (var i = 0; i < res.result.length; i++) {
            const recordItem = {}
            recordItem.id = res.result[i].id
            recordItem.registId = res.result[i].registId
            recordItem.ecgTime = res.result[i].checkTime
            recordItem.diagTime = res.result[i].diagnosisTime
            recordItem.ecgDiagnosis = res.result[i].ecgDiagnosis
            recordItem.ecgType = res.result[i].flag
            if (
              res.result[i].ecgFilesList != null &&
              res.result[i].ecgFilesList.length > 0
            ) {
              recordItem.path = res.result[i].ecgFilesList[0].attachPath
              recordItem.ecgFile =
                dicConstant.imgURL + res.result[i].ecgFilesList[0].attachPath
            }
            this.recordList.push(recordItem)
            // for (var j = 0; j < res.result[i].ecgFilesList.length; j++) {
            //    this.recordItem.ecgFile = res.result[i].ecgFilesList.registId
            // }
          }
        }
      })
    },
    onChanged() {
      this.$emit('change')
    },
    async uploadImage(data) {
      const res = await this.$api.service.uploadWithThumb(data)
      if (res && res.status === 200) {
        return res.result
      } else {
        return null
      }
    },
    async deleteRecord(item) {
      const res = await this.$api.service.deleteEcg(item.id)
      if (res && res.status === 200) {
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
          this.initEcgData()
          this.$emit('updateReportStatus', true)
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
    // deleteSuccess() {
    //   this.initEcgData()
    //   this.$forceUpdate()
    // }
  }
}
</script>
<style lang="less" scoped></style>
