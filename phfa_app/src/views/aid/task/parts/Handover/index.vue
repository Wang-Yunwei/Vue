<template>
  <div class="hand-over-wrapper">
    <div class="task-part-title">
      <span class="solid"></span><span>患者交接</span>
    </div>
    <div :class="{ 'disabled-form': !canEdit }">
      <van-cell-group>
        <van-field v-model="medPhepShiftRecordEntity.chiefComplaint" label="患者主诉" placeholder="请填写" />
        <van-field type="textarea" label="初步诊断" v-model="medPhepShiftRecordEntity.diagnosis" placeholder="请输入或选择" :rules="[{ required: true, message: '请选择初步诊断' }]">
          <template #right-icon>
            <van-icon name="arrow" class="select-icon" @click="switchPop" />
          </template>
        </van-field>
        <van-cell title="病情判断">
          <template>
            <med-select v-model="medPhepShiftRecordEntity.conditionGrade" :options="conditionGradeList" @change="onConditionGradeChange"></med-select>
          </template>
        </van-cell>
        <van-field v-model.number="medPhepGeneralInspectionsEntity.rr" label="呼吸(次/分)" placeholder="请填写" type="digit" />
        <van-field v-model.number="medPhepGeneralInspectionsEntity.pulse" label="脉搏(次/分)" placeholder="请填写" type="digit" />
        <van-field v-model.number="medPhepGeneralInspectionsEntity.sbp" label="收缩压(mmhg)" placeholder="请填写" type="digit" />
        <van-field v-model.number="medPhepGeneralInspectionsEntity.dbp" label="舒张压(mmhg)" placeholder="请填写" type="digit" />
        <van-field v-model="medPhepGeneralInspectionsEntity.spo2" label="SPO2%" placeholder="请填写" />
        <van-cell title="意识">
          <template>
            <med-select v-model="medPhepGeneralInspectionsEntity.consciousness" :options="consciousnessList"></med-select>
          </template>
        </van-cell>
        <van-cell title="皮肤">
          <template>
            <med-select v-model="medPhepGeneralInspectionsEntity.skin" :options="skinList"></med-select>
          </template>
        </van-cell>
        <van-cell title="瞳孔">
          <template>
            <med-select v-model="medPhepGeneralInspectionsEntity.pupilResponse" :options="pupilResponseList"></med-select>
          </template>
        </van-cell>
        <van-cell title="对光反射">
          <template>
            <med-select v-model="medPhepGeneralInspectionsEntity.lightReflection" :options="lightReflectionList"></med-select>
          </template>
        </van-cell>
        <van-field v-model.number="medPhepGeneralInspectionsEntity.t" label="体温(°C)" placeholder="请填写" />
        <van-field readonly type="textarea" autosize v-model="medPhepShiftRecordEntity.accessoryExam" label="辅助检查" />
        <van-field label="急救措施" readonly />
        <van-list class="drug-list">
          <div v-for="(item, index) in measuresList" :key="index">
            <p>{{ item.measureName || "" }} {{ formatDate(item.opTime) }}</p>
          </div>
        </van-list>
        <van-field label="用药" readonly />
        <van-list class="drug-list">
          <div v-for="(item, index) in emergencyOrdersList" :key="index">
            <p>{{ item.drugName || "" }} {{ formatDate(item.createTime) }}</p>
          </div>
        </van-list>
        <van-cell class="drugCell-list" v-if="otherDruge">
          <p>
            {{ otherDruge }}
          </p>
        </van-cell>
        <van-field v-model="medPhepShiftRecordEntity.otherInfo" label="其他" placeholder="请填写" />
        <van-field label="交接医院" required>
          <template #input>
            <med-select v-model="medPhepShiftRecordEntity.handoverHospitalId" :options="hospitalAreaList"></med-select>
          </template>
        </van-field>
        <van-cell title="交接科室">
          <template>
            <med-select v-model="medPhepShiftRecordEntity.dept" :options="toDeptList"></med-select>
          </template>
        </van-cell>
        <van-field class="imgField" required readonly label="出诊医护" :placeholder="medPhepShiftRecordEntity.outOfOfficeDiagnosis
      ? '已签，点击重签'
      : '去签名'
      " @click="signClick('outOfOfficeDiagnosis')">
          <template #right-icon>
            <van-image :src="medPhepShiftRecordEntity.outOfOfficeDiagnosis" width="100" height="100" fit="contain" v-if="medPhepShiftRecordEntity.outOfOfficeDiagnosis" />
            <i class="iconfont iconicon1svg-18"></i>
          </template>
        </van-field>
        <van-field class="imgField" required readonly label="接诊医护" :placeholder="medPhepShiftRecordEntity.acceptDiagnosis
      ? '已签，点击重签'
      : '去签名'
      " @click="signClick('acceptDiagnosis')">
          <template #right-icon>
            <van-image :src="medPhepShiftRecordEntity.acceptDiagnosis +
      `?v=${new Date().getTime()}`
      " width="100" height="100" fit="contain" v-if="medPhepShiftRecordEntity.acceptDiagnosis" />
            <i class="iconfont iconicon1svg-18"></i>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <div class="flex-c-a submitbt">
      <van-button v-if="canEdit" round type="info" size="small" style="width:30%;margin:0 auto" @click="onSubmit">
        提交交接单
      </van-button>
      <van-button v-else round type="default" size="small" style="width:30%;margin:0 auto" @click="printDeliveryRecord">
        打印交接单
      </van-button>
      <van-popup v-model="showPopup" :close-on-click-overlay="false" style="background:transparent">
        <van-loading size="100" text-size="32" type="spinner" color="#fff" vertical>{{ printMessage }}</van-loading>
      </van-popup>
      <transition name="moveR">
        <van-popup v-if="diagnosisShow" v-model="diagnosisShow" position="right" :style="{ width: '100%', height: '100%' }">
          <preliminary-diagnosis @submit="submit" :list="diagnosisList" @backClick="diagnosisShow = false"></preliminary-diagnosis>
        </van-popup>
      </transition>
    </div>
    <van-popup v-model="drawerFlag" position="right" :style="{ width: '100%', height: '100%' }">
      <med-header title="签名" @backClick="drawerFlag = false" />
      <med-sign :fileName="patientId + signPa" @signSubmit="signSubmit" />
    </van-popup>
    <van-popup v-model="handoverFlag" style="width:90%;text-align:center;">
      <van-image show-error fit="contain" :src="handoverSrc" style="border: 1px solid #ccc;">
        <template v-slot:error>加载失败</template>
      </van-image>
    </van-popup>
  </div>
</template>
<script>
import PreliminaryDiagnosis from '@views/aid/task/parts/Diagnosis/preliminaryDiagnosis'
import methodMixin from '@mixins/methodMixin'
import dateMixin from '@mixins/dateMixin'
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import { clearNull } from '@/utils/functions'
import { throttle } from 'lodash'
import { attSave } from '@/api/attachment'

export default {
  components: { PreliminaryDiagnosis },
  data() {
    return {
      fileTypes: [], // 文件类别
      printMessage: '加载中',
      showPopup: false,
      diagnosisShow: false,
      handoverFlag: false,
      handoverSrc: '',
      diagnosisList: [], // 初步诊断
      signPa: '', // 签名参数
      drawerFlag: false,
      consciousness: [], // 意识
      skin: [], // 皮肤
      pupilResponse: [], // 瞳孔
      lightReflection: [], // 对光反射
      conditionGradeList: [], // 病情判断List
      consciousnessList: [],
      skinList: [],
      pupilResponseList: [],
      lightReflectionList: [],
      emergencyOrdersList: [], // 患者用药信息list
      drugList: [], // 药品信息
      drugUsageList: [], // 药品用法
      otherDruge: '', // 其他用药
      measuresList: [], // 急救措施
      toDeptList: [], // 科室列表
      medPhepGeneralInspectionsEntity: {
        consciousness: '', // 意识
        skin: '', // 皮肤
        pupilResponse: '', // 瞳孔
        lightReflection: '', // 对光反射
        // rr: '', // 呼吸(次/分)
        // pulse: '', // 脉搏(次/分)"
        // sbp: '', // 收缩压(mmhg)
        // dbp: '', // 舒张压(mmhg)
        spo2: '', // SPO2%"
        t: '' // 体温
      },
      medPhepShiftRecordEntity: {
        shiftTime: '', // 提交交接单时间
        chiefComplaint: '', // 患者主诉
        diagnosis: '', // 初步诊断
        conditionGrade: '', // 病情判断
        accessoryExam: '', // 辅助检查
        treatment: '', // 急救措施
        otherInfo: '', // 其他
        handoverHospitalId: '', // 交接医院
        handoverHospitalName: '', // 交接医院名称
        dept: '', // 交接科室
        outOfOfficeDiagnosis: '', // 出诊医护
        acceptDiagnosis: '' // 接诊医护
      },
      medPhepAutoTimesEntity: {}
    }
  },
  mounted() {
    this.getAppData()
    if (this.patientId) this.queryDetail()
  },
  created() {
    this.getCodeList()
    this.queryDiagnosisList()
    this.queryDrugsList()
    this.getDeptTree() // 获取科室
    // 监听病历数据变化时刷新
    this.$bus.$on('refreshHandover', this.refreshHandover)
  },
  beforeDestroy() {
    this.$bus.$off('refreshHandover', this.refreshHandover)
  },
  computed: {
    ...mapGetters([
      'patientId',
      'missionId',
      'hospitalId',
      'chiefComplaint',
      'diagnosis',
      'conditionGrade',
      'hospitalAreaList'
    ]),
    canEdit() {
      return !this.medPhepShiftRecordEntity?.submitTime
    }
  },
  methods: {
    ...mapMutations(types),
    refreshHandover() {
      if (this.canEdit) {
        this.queryDetail()
      }
    },
    onConditionGradeChange(v) {
      this[types.SET_CONDITIONGRADE](v)
    },
    getAppData() {
      // 外部调本地方法
      this.$bridge.registerHandler('printInfoResult', data => {
        console.log('app主动调用js方法，传入数据:', typeof data, data)
        const obj = JSON.parse(data)
        this.printMessage = obj.msg || '*打印中...'
        if (obj.msgCode === 3) {
          this.showPopup = false
          this.printMessage = ''
        }
      })
    },
    submit(val) {
      this.medPhepShiftRecordEntity = {
        ...this.medPhepShiftRecordEntity,
        ...val
      }
    },
    switchPop() {
      this.diagnosisShow = true
    },
    tabChange() {
      // this.queryDetail()
      if (this.patientId) this.queryByPatientId()
    },
    queryDetail() {
      this.$api.mpsrQueryDetail(this.patientId).then(res => {
        if (res.body) {
          // 获取急救措施
          this.measuresList = res.body.measuresEntities
          this.$preventWatch(() => {
            if (res.body.medPhepShiftRecordEntity) {
              // 体格检查
              if (
                res.body.medPhepGeneralInspectionsEntity &&
                res.body.medPhepGeneralInspectionsEntity.length > 0
              ) {
                const gis = res.body.medPhepGeneralInspectionsEntity.filter(
                  el => el.isHand === '1'
                )
                this.medPhepGeneralInspectionsEntity = {
                  ...gis[0]
                }
              }
              this.medPhepShiftRecordEntity = {
                ...clearNull(res.body.medPhepShiftRecordEntity)
              }
              if (!res.body.medPhepShiftRecordEntity?.submitTime) {
              }
            } else {
              this.medPhepGeneralInspectionsEntity = {
                ...res.body.medPhepGeneralInspectionsEntity[0]
              }
              delete this.medPhepGeneralInspectionsEntity.id
              this.medPhepShiftRecordEntity = {
                ...clearNull(res.body.medPhepMedicalRecordsEntity)
              }
              this.$set(
                this.medPhepShiftRecordEntity,
                'handoverHospitalId',
                res.body.medPhepMedicalRecordsEntity.toHospital
              )
              delete this.medPhepShiftRecordEntity.submitTime
            }
            this[types.SET_ISHANDEDOVER](
              !!this.medPhepShiftRecordEntity?.shiftTime
            )
          })

          this.otherDruge = res.body?.medPhepMedicalRecordsEntity?.otherDruge
          let accessoryExam
          if (res.body?.ecgCount > 0) {
            accessoryExam = (accessoryExam || '') + '心电图:已检查'
          } else {
            accessoryExam = (accessoryExam || '') + '心电图:未检查'
          }
          if (accessoryExam) {
            accessoryExam = accessoryExam + '、'
          }
          if (res.body?.medPhepMedicalRecordsEntity?.bloodglucose) {
            accessoryExam = (accessoryExam || '') + '血糖:已检查'
          } else {
            accessoryExam = (accessoryExam || '') + '血糖:未检查'
          }
          if (res.body?.estimateEntityList) {
            res.body.estimateEntityList.map(item => {
              // 评分添加显示到辅助检查
              accessoryExam =
                (accessoryExam || '') +
                '、' +
                (item.title || '') +
                ':' +
                (item.description || '')
            })
          }
          this.$preventWatch(() => {
            this.medPhepShiftRecordEntity.accessoryExam = accessoryExam
          })
        }
      })
    },
    // 获取科室
    getDeptTree() {
      const res = this.getCodeListByKey([
        'PHFA_0058' // 交接科室
      ])
      this.toDeptList = res.PHFA_0058
    },
    // 查询药品信息
    queryDrugsList() {
      this.$api.drugPageList({}).then(res => {
        this.drugList = res.body?.records || []
      })
    },
    // 根据患者id查询此患者用药信息
    queryByPatientId() {
      this.$api.mpeoQueryByPatientId(this.patientId).then(res => {
        this.emergencyOrdersList = res.body.map(item => {
          const drug =
            this.drugList.find(el => el.id && el.id === item.drugId) || {}
          const drugName = drug.name
            ? drug.name + '/' + item.usageDesc + '/' + item.dose
            : ''
          return {
            ...item,
            drugName
          }
        })
      })
    },
    async printDeliveryRecord() {
      this.showPopup = true
      const res = await this.$api.printDeliveryRecord(this.patientId)
      this.$bridge.callhandler('print', res.body)
    },
    async printSubmit() {
      const downUrl =
        '/medPhepShiftRecord/printShiftRecord/444/' + this.patientId
      const res = await axios({
        method: 'post',
        url: downUrl,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'blob'
      })
      if (res.data.type.startsWith('application/json')) {
        const reader = new FileReader()
        reader.onload = () => {
          const message = JSON.parse(reader.result).message
          this.$notify({ type: 'danger', message })
        }
        reader.readAsText(res.data)
      } else {
        const data = this.getObjectURL(res.data)
        this.handoverSrc = data
        this.handoverFlag = true
      }
    },
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        try {
          url = window.webkitURL.createObjectURL(file)
        } catch (error) { }
      } else if (window.URL !== undefined) {
        try {
          url = window.URL.createObjectURL(file)
        } catch (error) { }
      }
      return url
    },
    onSave: throttle(
      async function (isSubmit) {
        this.$preventWatch(() => {
          if (this.medPhepShiftRecordEntity.handoverHospitalId) {
            // 匹配医院名称
            const { name } =
              this.hospitalAreaList.find(
                el =>
                  el.value === this.medPhepShiftRecordEntity.handoverHospitalId
              ) || {}

            this.medPhepShiftRecordEntity.handoverHospitalName = name
          }
          this.medPhepShiftRecordEntity.patientId = this.patientId
          if (isSubmit) {
            this.medPhepShiftRecordEntity.shiftTime = this.$moment().format(
              'YYYY-MM-DD[T]HH:mm:ss'
            )
            this.medPhepShiftRecordEntity.submitTime = this.$moment().format(
              'YYYY-MM-DD[T]HH:mm:ss'
            )
          }
          // 交接单体格检查
          this.medPhepGeneralInspectionsEntity.patientId = this.patientId
          this.medPhepGeneralInspectionsEntity.createTime = this.$moment().format(
            'YYYY-MM-DD[T]HH:mm:ss'
          )
          this.$set(this.medPhepGeneralInspectionsEntity, 'isHand', '1')
        })
        var shiftSaveOrUpdateVo = {
          medPhepShiftRecordEntity: this.medPhepShiftRecordEntity,
          medPhepGeneralInspectionsEntity: this.medPhepGeneralInspectionsEntity
        }
        const res = await this.$api.saveOrUpdateShift(
          shiftSaveOrUpdateVo
        )
        if (res.code === '000000') {
          this.queryDetail()
        } else {
          this.$notify({ type: 'danger', message: '保存失败！' + res.message })
        }
        return res.code === '000000'
      },
      1000,
      { leading: false, trailing: true }
    ),
    async onSubmit() {
      if (!this.medPhepShiftRecordEntity.handoverHospitalId) {
        this.$toast.fail('请选择交接医院')
        return
      }
      if (!this.medPhepShiftRecordEntity.outOfOfficeDiagnosis) {
        this.$toast.fail('出诊医护签名不可为空')
        return
      }
      if (!this.medPhepShiftRecordEntity.acceptDiagnosis) {
        this.$toast.fail('接诊医护签名不可为空')
      }
      const success = await this.onSave(true)
      if (success) this.$notify({ type: 'success', message: '保存成功！' })
    },
    // 签名
    signClick(pa) {
      this.drawerFlag = true
      this.signPa = pa
    },
    parseFileTypeCode(type) {
      return this.fileTypes.find(el => el.label === type)?.value
    },
    parseSignPa(s) {
      switch (s) {
        case 'acceptDiagnosis':
          return {
            type: this.parseFileTypeCode('接诊医护签名'),
            remark: '接诊医护签名'
          }

        case 'outOfOfficeDiagnosis':
          return {
            type: this.parseFileTypeCode('出诊医护签名'),
            remark: '出诊医护签名'
          }

        default:
      }
    },
    // 签名提交
    async signSubmit(data) {
      // 此时可以自行将文件上传至服务器
      this.drawerFlag = false
      var formData = new FormData()
      formData.append('file', data)
      formData.append('remark', this.parseSignPa(this.signPa).remark)
      formData.append('fileType', this.parseSignPa(this.signPa).type)
      let id = this.medPhepShiftRecordEntity?.id
      if (!id) {
        // 获取uuid
        const { body } = await this.$api.getUUID()
        id = body
      }
      formData.append('businessId', id)

      attSave(formData).then(res => {
        this.medPhepShiftRecordEntity.id = id
        this.$set(this.medPhepShiftRecordEntity, this.signPa, '')
        this.$nextTick(() => {
          this.$set(this.medPhepShiftRecordEntity, this.signPa, res.body)
        })
      })
    },
    getCodeList() {
      const res = this.getCodeListByKey([
        'PHFA_0016', // 意识
        'PHFA_0017', // 皮肤
        'PHFA_0018', // 瞳孔
        'PHFA_0019', // 对光反射
        'PHFA_0030', // 病情判断
        'PHFA_0055', // 药品用法
        'PHFA_0064' // 文件类别
      ])
      this.consciousnessList = res.PHFA_0016
      this.skinList = res.PHFA_0017
      this.pupilResponseList = res.PHFA_0018
      this.lightReflectionList = res.PHFA_0019
      this.conditionGradeList = res.PHFA_0030
      this.drugUsageList = res.PHFA_0055
      this.fileTypes = res.PHFA_0064
    },
    // 查询字典表初步诊断信息
    async queryDiagnosisList() {
      const res = await this.$api.getDictByCodes({
        hospitalId: this.hospitalId,
        code: ['PHFA_0057']
      })
      const resp = res.body || {}
      const arr = Object.keys(resp).map(key => {
        return {
          name: key,
          value: (resp[key][0].value || '').split('-')[0],
          list: resp[key]
        }
      })
      this.diagnosisList = arr
    }
  },
  watch: {
    patientId(v) {
      if (v) {
        this.queryByPatientId()
        this.queryDetail()
      }
    },
    chiefComplaint: {
      immediate: true,
      handler(v) {
        if (this.canEdit) {
          this.medPhepShiftRecordEntity.chiefComplaint = v
        }
      }
    },
    'medPhepShiftRecordEntity.chiefComplaint': {
      immediate: true,
      handler(v) {
        this[types.SET_CHIEFCOMPLAINT](v)
      }
    },
    diagnosis: {
      immediate: true,
      handler(v) {
        if (this.canEdit) {
          this.medPhepShiftRecordEntity.diagnosis = v
        }
      }
    },
    'medPhepShiftRecordEntity.diagnosis': {
      immediate: true,
      handler(v) {
        this[types.SET_DIAGNOSIS](v)
      }
    },
    conditionGrade(v) {
      if (this.canEdit) {
        this.$set(this.medPhepShiftRecordEntity, 'conditionGrade', v)
      }
    },
    medPhepGeneralInspectionsEntity: {
      deep: true,
      handler() {
        if (this.canEdit) {
          this.onSave()
        }
      }
    },
    medPhepShiftRecordEntity: {
      deep: true,
      handler() {
        if (this.canEdit) {
          this.onSave()
        }
      }
    }
  },
  mixins: [methodMixin, dateMixin]
}
</script>
<style lang="less" scoped>
.disabled-form {
  pointer-events: none;
}

.hand-over-wrapper {
  .drug-list {
    padding: 0 50px;

    >div {
      padding-top: 20px;
      border-bottom: 1px solid #dadada;
    }

    p {
      font-size: 30px;
      line-height: 57px;
      color: #696969;

      &:nth-of-type(2) {
        font-size: 26px;
      }
    }
  }

  .drugCell-list {
    padding: 0 50px;

    .van-cell__title {
      max-width: 100%;

      span {
        display: block;
        font-size: 30px;
        color: #696969;
        padding-left: 20px;
        line-height: 57px;
      }
    }

    p {
      font-size: 30px;
      line-height: 57px;
      color: #696969;

      &:nth-of-type(2) {
        font-size: 26px;
      }
    }
  }

  .imgField {
    /deep/ .van-field__body {
      align-items: flex-start;
    }
  }

  .submitbt {
    padding: 30px 0;
  }
}

.iconicon1svg-18,
.iconicon1-13 {
  font-size: 0.5rem;
  color: #5e74fe;
  border-left: 1px solid #ddd;
  padding: 0 0.15rem;
  margin-left: 0.3rem;
}

.iconicon1-13 {
  border-left: none;
}
</style>
