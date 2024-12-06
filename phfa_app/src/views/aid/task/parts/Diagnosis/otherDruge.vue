<template>
  <div class="task-diag-drug-wrapper">
    <med-header title="用药" @backClick="onClickLeft" />
    <div :style="!canEdit ? 'pointer-events:none' : ''">
      <p class="title">已添加用药</p>
      <ul class="added flex-c-s">
        <li v-for="item in emergencyOrdersList" :key="item.orderId">
          {{ item.drugName }}
          <van-icon name="cross" @click="deleteEmergencyOrders(item)" />
        </li>
      </ul>
      <!-- <div class="add-btn flex-c-c" @click="otherShow = true">
        <van-icon name="add-o" />
        <span>添加用药</span>
      </div> -->
      <div class="add-part" :style="!canEdit ? 'pointer-events:none' : ''">
        <!-- <van-collapse v-model="name">
        <van-collapse-item :title="drugName" ref="drugpse">
          <van-tag
            class="drugTag"
            type="primary"
            v-for="(item, index) in list"
            :key="index"
            @click="chooseDrug(item)"
          >
            {{ item.name }}
          </van-tag>
        </van-collapse-item>
      </van-collapse> -->
        <van-cell>
          <med-select v-model="medPhepEmergencyOrdersEntity.drugId" placeholder="选择要添加的药品" :options="drugOptions" @select="chooseDrug" />
        </van-cell>

        <div class="info" v-if="medPhepEmergencyOrdersEntity.drugId">
          <med-date-picker label="时间" v-model="medPhepEmergencyOrdersEntity.createTime" />
          <van-field placeholder="请输入" label="用法" :value="medPhepEmergencyOrdersEntity.usageDesc">
            <template #input>
              <med-select v-model="medPhepEmergencyOrdersEntity.usageDesc" :options="drugUsageList"></med-select>
            </template>
          </van-field>
          <van-field placeholder="请输入" label="用量" v-model="medPhepEmergencyOrdersEntity.dose">
            <template #extra>
              {{ parseDrugUnit(medPhepEmergencyOrdersEntity.drugId) }}
            </template>
          </van-field>
          <div class="flex-c-e confirm-btn">
            <van-button round type="info" @click="onSubmit">
              确认添加
            </van-button>
          </div>
        </div>
      </div>
      <p class="title">其他用药</p>
      <van-field rows="2" autosize type="textarea" v-model="medPhepMedicalRecordsEntity.otherDruge" placeholder="填写其他用药" @blur="blur" />
    </div>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      drugUsageList: [], // 药品用法
      emergencyOrdersList: [],
      otherShow: false,
      name: [],
      // drugName: '请选择',
      medPhepEmergencyOrdersEntity: {
        patientId: '', // 所属患者
        stackId: '', // 药品组套ID
        drugId: '', // 药品ID
        dose: '', // 用量
        usageId: '', // 用法（数据字典表主键）
        createTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'), // 用药时间
        specifications: ''
      },
      medPhepMedicalRecordsEntity: {
        otherDruge: '' // 其他用药
      },
      medPhepAutoTimesEntity: {}
    }
  },
  props: {
    list: {
      require: true,
      default: () => []
    }
  },
  async created() {
    await this.queryMedicalRecordsByPatientId()
    this.queryByPatientId()
    this.getCodeList()
  },
  computed: {
    ...mapGetters(['patientId', 'missionId', 'medicalStatus']),
    canEdit() {
      return this.medicalStatus === '01'
    },
    drugOptions() {
      return (this.list || []).map(l => ({ ...l, value: l.id, label: l.name }))
    }
    // matchDrugs() {
    //   const usageArr = (this.drugUsageList || []).find(o => {
    //     return o.value === this.medPhepEmergencyOrdersEntity.usageId
    //   })
    //   if (usageArr) {
    //     const usageName = usageArr.label
    //     return usageName
    //   }
    //   return ''
    // }
  },
  methods: {
    parseDrugUnit(drugId) {
      const matched = this.drugOptions.find(d => d.value === drugId)
      return matched?.drugUnit
    },
    async blur() {
      this.medPhepMedicalRecordsEntity.patientId = this.patientId
      if (this.medPhepMedicalRecordsEntity.patientId) {
        const req = { ...this.medPhepMedicalRecordsEntity }
        const res = await this.$api.mpmrUpdateByPatientId(req)
        if (res.code !== '000000') {
          this.$notify({ type: 'warning', message: res.message })
        }
      }
    },
    async queryMedicalRecordsByPatientId() {
      const res = await this.$api.mpmrQueryById(this.patientId)
      this.medPhepMedicalRecordsEntity.otherDruge = res.body?.otherDruge
    },
    async queryByPatientId() {
      const res = await this.$api.mpeoQueryByPatientId(this.patientId)
      this.emergencyOrdersList = res.body.map(item => {
        const drug = this.list.find(el => el.id === item.drugId)
        return {
          ...item,
          drugName: drug?.name
        }
      })
    },
    async deleteEmergencyOrders({ orderId }) {
      await this.$dialog.confirm({
        title: '确定删除吗?'
      })
      await this.$api.deleteEmergencyOrdersById(orderId)
      this.$emit('deleteDrug', orderId)
      this.emergencyOrdersList = this.emergencyOrdersList.filter(
        item => item.orderId !== orderId
      )
    },
    async onSubmit() {
      const res = await this.$api.mpeoSaveOrUpdate(
        this.medPhepEmergencyOrdersEntity
      )
      if (res.code === '000000') {
        this.$notify({ type: 'success', message: '添加成功!' })
        this.emergencyOrdersList.push({ ...this.medPhepEmergencyOrdersEntity })
        this.medPhepEmergencyOrdersEntity = {}
        this.queryByPatientId(this.medPhepEmergencyOrdersEntity.patientId)
      } else {
        this.$notify({ type: 'danger', message: '添加失败! ' + res.message })
      }
    },
    chooseDiagnosis(item, key) {
      this.$set(this.medPhepEmergencyOrdersEntity, key, item.label)
      // this.$refs[key].toggle()
    },
    getCodeList() {
      const res = this.getCodeListByKey(['PHFA_0055'])
      this.drugUsageList = res.PHFA_0055 // 药品用法
    },
    chooseDrug(item) {
      this.medPhepEmergencyOrdersEntity = {
        ...this.medPhepEmergencyOrdersEntity,
        createTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'),
        patientId: this.patientId, // 患者ID
        drugId: item.id, // 药品ID
        dose: item.defaultDose, // 用量
        usageDesc: item.defaultUsage, // 用法,
        drugName: item.name
      }
      // const usageArr = (this.drugUsageList || []).find(o => {
      //   return o.value === item.defaultUsage
      // })
      // if (usageArr) {
      //   this.medPhepEmergencyOrdersEntity.usageDesc = usageArr.label
      // }
      // this.drugName = item.name
      // this.$refs.drugpse.toggle()
    },
    onClickLeft() {
      this.$emit('backClick')
    }
  },
  watch: {
    patientId(v) {
      if (v) {
        this.queryByPatientId()
      }
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.task-diag-drug-wrapper {
  padding: 20px;
  background: #f2f4f5;
  height: 100%;

  .title {
    font-size: @font-md-size;
    color: #696969;
    line-height: 50px;
  }

  ul.added {
    margin-top: 20px;
    flex-wrap: wrap;

    li {
      color: #fe6161;
      padding: 0 18px;
      border: 1px solid #fe6161;
      border-radius: 80px;
      font-size: @font-md-size;
      line-height: 50px;
      margin-right: 20px;
      margin-bottom: 20px;

      .van-icon {
        color: #fe6161;
        font-size: @font-md-size;
        line-height: 50px;
        padding-left: 10px;
      }
    }
  }

  .add-part {
    background: #fff;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 0 10px 12px;

    .van-button {
      padding: 10px 30px;
      height: auto;
      text-align: right;
    }
  }

  // .drugTag {
  //   margin-bottom: 20px;
  //   margin-right: 20px;
  //   font-size: 32px;
  //   padding: 10px;
  // }
  .confirm-btn {
    margin-top: 14px;
    margin-right: 30px;
  }

  // .add-btn {
  //   background-color: #fff;
  //   width: 100%;
  //   margin-top: 30px;
  //   border: 2px dashed #d2d1d1;
  //   border-radius: 8px;
  //   font-size: 30px;
  //   padding: 20px 20px;
  //   color: #d2d1d1;
  //   .van-icon {
  //     color: #d2d1d1;
  //     font-size: 38px;
  //     margin-right: 20px;
  //   }
  // }
  // .treatment-part {
  //   &.active {
  //     max-height: 300px;
  //   }
  //   margin-top: 20px;
  //   max-height: 0;
  //   overflow: hidden;
  //   transition: max-height 1.5s ease;
  // }
  .van-cell.van-cell__title {
    max-width: 260px;
  }
}
</style>
