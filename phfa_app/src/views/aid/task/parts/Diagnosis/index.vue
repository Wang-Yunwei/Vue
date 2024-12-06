<template>
  <div class="task-diagnosis-wrapper">
    <div class="task-part-title">
      <span class="solid"></span><span>诊断处理</span>
    </div>
    <div>
      <van-field type="textarea" label="初步诊断" v-model="medPhepMedicalRecordsEntity.diagnosis" placeholder="请输入或选择">
        <template #right-icon>
          <van-icon name="arrow" class="select-icon" @click="switchPop('diagnosis', 0)" />
        </template>
      </van-field>
      <van-cell title="病情判断">
        <template>
          <med-select v-model="medPhepMedicalRecordsEntity.conditionGrade" :options="conditionGradeList" @change="onConditionGradeChange"></med-select>
        </template>
      </van-cell>
      <van-field label="急救措施" @click="switchPop('treatment', 1)" readonly>
        <template #right-icon>
          <van-icon name="arrow" class="select-icon" />
        </template>
      </van-field>
      <van-list class="drug-list">
        <van-cell v-for="item in measuresList" :key="item.measureKey" :title="item.measureName">
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #right-icon>
            <van-icon name="delete-o" color="red" class="delete-icon" v-if="canEdit" @click="deleteMeasures(item.id)" />
          </template>
        </van-cell>
      </van-list>
      <van-field label="用药" @click="switchPop('drug', 2)">
        <template #right-icon>
          <van-icon name="arrow" class="select-icon" />
        </template>
      </van-field>
      <van-list class="drug-list">
        <van-cell v-for="item in emergencyOrdersList" :key="item.drugId">
          <template #title>
            {{
        parseDrugName(item.drugId) +
        " / " +
        parseDrugUsage(item.usageDesc) +
        " / " +
        item.dose +
        parseDrugUnit(item.drugId)
      }}
            <br />
            {{ (item.createTime || "").replace("T", " ") }}
          </template>
          <template #right-icon>
            <van-icon name="delete-o" color="red" class="delete-icon" @click="deleteEmergencyOrders(item)" />
          </template>
        </van-cell>
        <van-cell v-if="medPhepMedicalRecordsEntity.otherDruge" :title="medPhepMedicalRecordsEntity.otherDruge">
          <template #right-icon>
            <van-icon name="delete-o" color="red" class="delete-icon" @click="emptyOtherDruge" />
          </template>
        </van-cell>
      </van-list>
      <van-cell title="病情转归">
        <template>
          <med-select v-model="medPhepMedicalRecordsEntity.rescueChangeResult" :options="rescueChangeResultList">
          </med-select>
        </template>
      </van-cell>
      <van-cell title="出诊结果">
        <template>
          <med-select v-model="medPhepMedicalRecordsEntity.treatmentResult" :options="treatmentResultList"></med-select>
        </template>
      </van-cell>
      <van-cell title="送往医院">
        <template>
          <med-select v-model="medPhepMedicalRecordsEntity.toHospital" :options="hospitalAreaList" @select="toHospitalNameChange"></med-select>
        </template>
      </van-cell>
    </div>
    <transition name="moveR">
      <van-popup v-if="show" v-model="show" position="right" :style="{ width: '100%', height: '100%' }">
        <component :list="list" :is="currentView" @backClick="backClick" @deleteDrug="deleteDrug" @submit="submit" @delete="deleteSth" @update="updateSth" />
      </van-popup>
    </transition>
  </div>
</template>

<script>
import methodMixin from '@mixins/methodMixin'
import * as types from '@store/mutations/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import { mergeObjArr } from '@utils/functions'
import otherDruge from '../Diagnosis/otherDruge'
import preliminaryDiagnosis from '../Diagnosis/preliminaryDiagnosis'
import treatment from '../Diagnosis/treatment'
export default {
  components: { otherDruge, preliminaryDiagnosis, treatment },
  data() {
    return {
      loading: false,
      finished: false,
      emergencyOrdersList: [], // 患者用药信息list
      measuresList: [], // 对应患者急救措施list
      currentIndex: 0,
      componentsArr: [preliminaryDiagnosis, treatment, otherDruge],
      show: false,
      active: 'task',
      // conditionGrade: [], // 病情判断
      rescueChangeResult: [], // 病情转归
      treatmentResult: [], // 出诊结果
      conditionGradeList: [],
      rescueChangeResultList: [],
      treatmentResultList: [],
      treatmentList: [],
      diagnosisList: [], // 患者用药信息
      drugList: [], // 药品列表
      drugUsageList: [], // 药品用法
      medPhepMedicalRecordsEntity: {
        diagnosis: '', // 初步诊断
        conditionGrade: '', // 病情判断
        rescueChangeResult: '', // 病情转归
        treatmentResult: '', // 出诊结果
        toHospital: '', // 送往医院
        toHospitalName: '' // 医院名称
      }
    }
  },
  computed: {
    ...mapGetters([
      'patientId',
      'hospitalId',
      'diagnosis',
      'conditionGrade',
      'medicalStatus',
      'toHospitalId',
      'toHospitalName',
      'hospitalAreaList'
    ]),
    canEdit() {
      return this.medicalStatus === '01'
    },
    list() {
      switch (this.currentIndex) {
        case 0: // 用药
          return this.diagnosisList
        case 1: // 急救措施
          return this.treatmentList
        case 2: // 药品
          return this.drugList
        case 3: // 急救措施
          return this.treatmentList
        default:
          return []
      }
    },
    currentView() {
      return this.componentsArr[this.currentIndex]
    }
  },
  async created() {
    this.getCodeList()
    await this.queryDrugsList() // 查询药品信息
    this.queryDiagnosisList()
  },
  methods: {
    ...mapMutations(types),
    // 解析药品用法
    parseDrugUsage(id) {
      const matched = this.drugUsageList.find(d => d.value === id)
      return matched?.label || ''
    },
    // 解析药品id为名称
    parseDrugName(id) {
      const drug = this.drugList.find(d => d.id === id)
      return drug?.name
    },
    // 解析药品单位
    parseDrugUnit(id) {
      const drug = this.drugList.find(d => d.id === id)
      return drug?.drugUnit
    },
    // 病情变化
    onConditionGradeChange(v) {
      this[types.SET_CONDITIONGRADE](v)
    },
    // 保存医院名称
    toHospitalNameChange(opt) {
      this.medPhepMedicalRecordsEntity.toHospitalName = opt?.label
    },
    async emptyOtherDruge() {
      const req = { ...this.medPhepMedicalRecordsEntity, otherDruge: '' }
      const res = await this.$api.mpmrUpdateByPatientId(req)
      if (res.code === '000000') {
        this.medPhepMedicalRecordsEntity.otherDruge = ''
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    // 删除用药信息
    async deleteEmergencyOrders({ orderId }) {
      await this.$api.deleteEmergencyOrdersById(orderId)
      this.$emit('deleteDrug', orderId)
      this.deleteDrug(orderId)
    },
    switchPop(type, idx) {
      if (type === 'treatment' && !this.canEdit) {
        return
      }
      this.currentIndex = idx
      this.show = true
    },
    // 过滤删除的用药信息
    deleteDrug(orderId) {
      this.emergencyOrdersList = this.emergencyOrdersList.filter(
        item => item.orderId !== orderId
      )
    },
    deleteSth(type, id) {
      if (type === 'treatment') this.deleteMeasures(id)
    },
    updateSth(type) {
      if (type === 'treatment') this.queryMeasuresByPatientId()
    },
    // 删除急救措施
    async deleteMeasures(id) {
      await this.$api.mpmDeleteMeasures(id)
      await this.getCodeList()
      await this.queryMeasuresByPatientId()
    },
    // 根据患者id查询此患者用药信息
    async queryByPatientId() {
      const res = await this.$api.mpeoQueryByPatientId(this.patientId)
      this.emergencyOrdersList = res.body.map(item => {
        const drug =
          this.drugList.find(el => el.drugId && el.drugId === item.drugId) ||
          {}

        const drugName = drug.drugName
          ? drug.drugName + '/' + item.usageDesc + '/' + item.dose
          : ''
        return {
          ...item,
          drugName
        }
      })
    },
    // 根据患者id查询此患者相关的急救措施
    async queryMeasuresByPatientId() {
      const res = await this.$api.mpmQueryByPatientId(this.patientId)
      const arr = res.body.map(item => ({
        id: item.id,
        label: item.measureName,
        value: item.measureKey,
        opTime: item.opTime
      }))
      this.measuresList = res.body
      this.treatmentList = mergeObjArr(this.treatmentList, arr, 'value')
    },
    // 查询初步诊断列表
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
    },
    getCodeList() {
      const res = this.getCodeListByKey([
        'PHFA_0030', // 病情判断
        'PHFA_0032', // 病情转归
        'PHFA_0033', // 出诊结果
        'PHFA_0031', // 急救措施
        'PHFA_0055' // 药品用法
      ])
      this.conditionGradeList = res.PHFA_0030
      this.rescueChangeResultList = res.PHFA_0032
      this.treatmentResultList = res.PHFA_0033
      this.treatmentList = res.PHFA_0031
      this.drugUsageList = res.PHFA_0055
    },
    // 查询药品信息
    async queryDrugsList() {
      const res = await this.$api.drugPageList({})
      this.drugList = res.body?.records || []
    },
    submit(val) {
      this.medPhepMedicalRecordsEntity = {
        ...this.medPhepMedicalRecordsEntity,
        ...val
      }
    },
    async queryMedicalRecordsByPatientId() {
      const res = await this.$api.mpmrQueryById(this.patientId)
      this.$preventWatch(() => {
        this.medPhepMedicalRecordsEntity = { ...res.body }
        this[types.SET_TOHOSPITALNAME](
          this.medPhepMedicalRecordsEntity.toHospitalName
        )
        this[types.SET_TOHOSPITALID](
          this.medPhepMedicalRecordsEntity.toHospital
        )
      })
    },
    // 保存诊断处理
    async medicalRecordsSave() {
      this.medPhepMedicalRecordsEntity.patientId = this.patientId
      if (this.medPhepMedicalRecordsEntity.patientId) {
        const req = { ...this.medPhepMedicalRecordsEntity }
        const res = await this.$api.mpmrUpdateByPatientId(req)
        if (res.code !== '000000') {
          this.$notify({ type: 'warning', message: res.message })
        }
      }
    },
    backClick() {
      if (this.currentIndex === 2) {
        this.queryByPatientId()
        this.queryMedicalRecordsByPatientId()
      }
      this.show = false
    }
  },
  watch: {
    conditionGrade(v) {
      this.$set(this.medPhepMedicalRecordsEntity, 'conditionGrade', v)
    },
    medPhepMedicalRecordsEntity: {
      handler(v) {
        if (this.toHospitalId !== v.toHospital) {
          this[types.SET_TOHOSPITALNAME](v.toHospitalName)
          this[types.SET_TOHOSPITALID](v.toHospital)
          // 发送通知到急救大屏
          this.$api.pushDataToSSE({
            sseId: v.toHospital,
            content: 'missionChange'
          })
        }
        this.medicalRecordsSave()
      },
      deep: true
    },
    patientId: {
      immediate: true,
      handler(v) {
        if (v) {
          this.queryByPatientId() // 根据患者ID查询用药信息
          this.queryMeasuresByPatientId() // 根据患者ID查询急救措施
          this.queryMedicalRecordsByPatientId() // 查询病历信息
        }
      }
    },
    'medPhepMedicalRecordsEntity.diagnosis': {
      immediate: true,
      handler(v) {
        this[types.SET_DIAGNOSIS](v)
      }
    },
    diagnosis(v) {
      this.$set(this.medPhepMedicalRecordsEntity, 'diagnosis', v)
    },
    toHospitalId(v) {
      if (v) {
        this.$set(this.medPhepMedicalRecordsEntity, 'toHospital', v)
        this.$set(
          this.medPhepMedicalRecordsEntity,
          'toHospitalName',
          this.toHospitalName
        )
      }
    }
  },
  mixins: [methodMixin]
}
</script>
<style lang="less" scoped>
.task-diagnosis-wrapper {
  padding: 36px 0;

  .delete-icon {
    font-size: 34px;
    line-height: inherit;
  }

  .drug-list {
    .van-cell {
      padding: 12px 12px 12px 60px;
      align-items: center;

      .van-cell__title {
        max-width: 100%;
        display: block;
        font-size: 26px;
        color: #696969;
      }

      /deep/ .delete-icon {
        padding-right: 30px;
      }
    }
  }

  .moveR-enter-active,
  .moveR-leave-active {
    transition: all 0.3s linear;
    transform: translateX(0);
    transform: translateY(0);
  }

  .moveR-enter,
  .moveR-leave {
    transform: translateX(100%);
  }

  .moveR-leave-to {
    transform: translateX(100%);
  }
}

// popup
.van-popup--right {
  top: 0;
  transform: translate3d(0, 0, 0);
}
</style>
