<template>
  <div class="task-treatment-wrapper">
    <med-header title="急救措施" @backClick="backClick" />
    <div class="treatment-main" :style="!canEdit ? 'pointer-events:none' : ''">
      <h2>治疗措施</h2>
      <div class="action-list">
        <van-checkbox-group v-model="form.treatment" direction="horizontal">
          <van-checkbox v-for="item in showList" :key="item.label" :name="item.value" @click="() => checkTime(item)">
            <span>
              {{ item.label }}
            </span>
            <span class="dates">
              {{ formatDate(item.opTime) }}
            </span>
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="add-btn flex-c-c">
        <van-icon name="add-o" />
        <van-cell @click="showPopup">请添加其他治疗措施</van-cell>
      </div>
    </div>
    <med-date-picker ref="datePicker" v-show="false" @changeTime="timeConfirm" @cancel="timeCancel" />
    <!-- <med-time v-if="timeShow" @submit="timeConfirm" @cancel="timeCancel" /> -->
    <van-popup class="add-wrapper" v-model="otherTreatmentShow">
      <div>
        <med-header title="添加治疗措施" leftText="" :leftArrow="false" />
        <div>
          <van-cell-group>
            <van-field v-model="medPhepMeasuresEntity.measureName" label="名称" placeholder="请填写" />
            <med-date-picker label="时间" placeholder="请填写" v-model="medPhepMeasuresEntity.opTime"></med-date-picker>
            <!-- <van-field
              v-model="medPhepMeasuresEntity.opTime"
              label="时间"
              placeholder="请填写"
              readonly
              @click="timeShow = true"
            /> -->
          </van-cell-group>
        </div>
        <van-button class="popBtn" round type="info" block @click="onAddSbumit">
          确定
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dateMixin from '@mixins/dateMixin'
export default {
  props: {
    list: {
      require: true,
      default: () => []
    }
  },
  mixins: [dateMixin],
  data() {
    return {
      timeShow: false,
      otherTreatmentShow: false,
      otherTreatment: '',
      form: {
        treatment: []
      },
      medPhepMeasuresEntity: {
        patientId: '', // 患者ID
        measureKey: '', // 措施标识
        measureName: '', // 措施名称
        opTime: '' // 实施时间
      },
      showList: this.list
    }
  },
  computed: {
    ...mapGetters(['patientId', 'medicalStatus']),
    canEdit() {
      return this.medicalStatus === '01'
    }
  },
  methods: {
    async saveMeasures(params) {
      await this.$api.mpmSaveMeasures(params)
      this.medPhepMeasuresEntity = {}
      this.$emit('update', 'treatment')
    },
    onAddSbumit() {
      const params = {
        ...this.medPhepMeasuresEntity,
        patientId: this.patientId
      }
      this.saveMeasures(params)
      this.otherTreatmentShow = false
      this.$emit('update', 'treatment')
    },
    showPopup() {
      this.medPhepMeasuresEntity = {}
      this.otherTreatmentShow = true
    },
    checkTime(val) {
      if (!val.opTime) {
        this.medPhepMeasuresEntity = { ...val }
        // this.timeShow = true
        this.$refs.datePicker.showPicker()
      } else {
        this.$emit('delete', 'treatment', val.id)
        this.showList = this.showList.map(item => {
          if (item.value === val.value) {
            delete item.opTime
            return { ...item }
          }
          return {
            ...item
          }
        })
        this.$forceUpdate()
      }
    },
    timeConfirm(date) {
      this.medPhepMeasuresEntity.opTime = this.$moment(date).format(
        'YYYY-MM-DD[T]HH:mm:ss'
      )
      this.showList = this.showList.map(item => {
        if (item.value === this.medPhepMeasuresEntity.value) {
          return {
            ...item,
            opTime: this.medPhepMeasuresEntity.opTime
          }
        }
        return { ...item }
      })
      if (this.medPhepMeasuresEntity.value) {
        const params = {
          patientId: this.patientId,
          measureKey: this.medPhepMeasuresEntity.value,
          measureName: this.medPhepMeasuresEntity.label,
          opTime: this.medPhepMeasuresEntity.opTime
        }
        this.saveMeasures(params)
      }
      this.timeShow = false
    },
    timeCancel() {
      const arr = this.form.treatment.slice()
      arr.pop()
      this.form.treatment = [...arr]
      this.timeShow = false
    },
    backClick() {
      this.$emit('backClick')
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      } else if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val
    }
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler(v) {
        this.showList = v || []
        this.form.treatment = (v || []).map(item => item.id && item.value)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.task-treatment-wrapper {
  background: #f2f4f5;
  height: 100%;

  .treatment-main {
    padding: 0 20px;

    h2 {
      color: #202020;
      padding: 30px 0;
      font-size: 30px;
    }

    .action-list {
      background: #ffffff;
      border-radius: 10px;
      padding: 24px 30px;

      /deep/ .van-checkbox {
        margin-top: 30px;
        border: 1px solid #cacaca;
        border-radius: 50px;

        .van-checkbox__icon {
          width: 0;
          height: 0;
          visibility: hidden;

          &.van-checkbox__icon--checked+.van-checkbox__label {
            background: #5e74fe;
            color: #fff;
          }
        }

        .van-checkbox__label {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          font-size: 30px;
          color: #696969;
          text-align: center;
          line-height: 1;
          width: 290px;
          height: 80px;

          .dates {
            font-size: 24px;
            line-height: 1.3;
          }
        }
      }
    }

    .add-btn {
      border-radius: 8px;
      font-size: 30px;
      padding: 20px 20px;
      background: #5e74fe;
      border-radius: 100px;
      width: 80%;
      margin: 30px auto 0;

      .van-icon {
        color: #fff;
        font-size: 38px;
        margin-right: 20px;
      }

      .van-cell {
        background-color: transparent;
        padding: 0;
        width: auto;

        .van-cell__value {
          color: #fff;
        }
      }
    }

    .treatment-part {
      &.active {
        max-height: 300px;
      }

      margin-top: 20px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 1.5s ease;
    }
  }

  .popBtn {
    width: 70%;
    margin: 20px auto;
  }

  .add-wrapper {
    width: 90%;
    border-radius: 30px;
  }
}
</style>
