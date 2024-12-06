<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid"></span><span>体格检查</span>
      <van-button size="mini" plain color="#5E74FE" class="new-check" v-if="canEdit" @click="handleNew"><i class="iconfont iconicon1-441"></i></van-button>
    </div>
    <div class="list">
      <van-cell-group>
        <van-cell is-link v-for="(record, index) in recordList" :key="record.id" @click="handleEdit(index)" class="list-item">
          <template>
            <div class="flex-c-b">
              <div class="check-title">
                {{ `${index ? "新增" : ""}体格检查${index ? index : ""}` }}
              </div>
              <div class="check-describe">
                {{ checkResultFilter(record) }}
              </div>
              <van-button color="#FFEDEE" type="default" round size="mini" v-if="index && canEdit" @click.stop="handleRemove(record, index - 1)">
                <i class="iconfont iconicon1-201"></i>
              </van-button>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-action-sheet v-model="show" :actions="sheetList" @select="onSelect" />
    <van-action-sheet v-model="dateTimeShow">
      <van-datetime-picker type="datetime" title="选择年月" @confirm="onConfirm" @cancel="onCancel" :formatter="dateUtil.formatter" item-height="1rem" />
    </van-action-sheet>
    <van-popup v-model="showPopup" position="right" get-container="body" duration="0.2">
      <transition name="moveR" :duration="500">
        <div class="check-detail" v-if="showPopup">
          <med-header title="检查明细" @backClick="showPopup = false" />
          <div class="main" :style="!canEdit ? 'pointer-events:none' : ''">
            <van-cell-group>
              <med-date-picker label="检查时间" placeholder="请选择" v-model="form.createTime">
                <template #right-icon>
                  <van-button type="default" size="small" @click.stop="getPhysical()">
                    获取
                  </van-button>
                </template>
              </med-date-picker>
              <van-cell title="检查状态">
                <van-radio-group class="flex-c-s radio-btn-type" v-model="form.isNormal">
                  <van-radio name="0">拒绝采集</van-radio>
                  <van-radio name="1">正常采集</van-radio>
                </van-radio-group>
              </van-cell>
              <van-field v-model.number="form.rr" label="呼吸(次/分)" placeholder="请填写" type="digit" />
              <van-field v-model.number="form.pulse" label="脉搏(次/分)" placeholder="请填写" type="digit" />
              <van-field v-model.number="form.sbp" label="收缩压(mmHg)" placeholder="请填写" />
              <van-field v-model.number="form.dbp" label="舒张压(mmHg)" placeholder="请填写" />
              <van-field v-model="form.spo2" label="SPO2(%)" placeholder="无" />
              <van-cell title="意识">
                <med-select v-model="form.consciousness" :options="consciousnessList" />
              </van-cell>
              <van-cell title="皮肤">
                <med-select v-model="form.skin" :options="skinList" />
              </van-cell>
              <van-cell title="瞳孔">
                <med-select v-model="form.pupilResponse" :options="pupilList" />
              </van-cell>
              <van-cell title="对光反射">
                <med-select v-model="form.lightReflection" :options="lightList" />
              </van-cell>
              <van-field v-model.number="form.t" label="体温(℃)" placeholder="请填写" />
            </van-cell-group>
          </div>
        </div>
      </transition>
    </van-popup>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import { mapGetters } from 'vuex'
import dateMixin from '@mixins/dateMixin'
import dateUtil from '@utils/dateUtil'

let saveTimer = 0
const resetFormData = () => {
  return {
    createTime: '',
    isNormal: '',
    rr: '',
    pulse: '',
    sbp: '',
    dbp: '',
    spo2: '',
    consciousness: '',
    skin: '',
    pupilResponse: '',
    lightReflection: '',
    t: ''
  }
}

const autoRetry = async (func, interval = 2000) => {
  let res
  try {
    res = await func()
  } catch (error) {
    // 获取失败等一段时间再次获取
    await new Promise(resolve => setTimeout(resolve, interval))
    res = await autoRetry(func, interval)
  }
  return res
}

export default {
  mixins: [dateMixin, methodMixin],
  data() {
    return {
      showPopup: false,
      dateUtil,
      dateShow: false,
      dateTimeShow: false,
      dateField: '',
      saving: false,
      recordList: [
        // {
        //   consciousness: '1', // 意识
        //   createBy: '2', // 创建人
        //   createTime: '2021-11-17T02:46:24.696Z', // 检查时间
        //   dbp: 0, // 舒张压
        //   id: '321', // 唯一键
        //   isHand: '0', // 是否用于交接(0-否,1-是)
        //   isNormal: '1', // 是否正常采集(0-否,1-是)
        //   lightReflection: 'string', // 对光反应
        //   patientId: 'string', // 患者ID
        //   pulse: 0, // 脉搏(次/分)
        //   pupilResponse: 'string', // 瞳孔
        //   rr: 0, // 呼吸频率(次/分)
        //   sbp: 0, // 收缩压
        //   skin: 'string', // 皮肤
        //   spo2: 'string', // 血氧
        //   status: 'string', // 删除状态(0-否,1-是)
        //   t: 0 // 体温
        // }
      ],
      editingId: '',
      form: resetFormData(),
      show: false,
      consciousnessList: [],
      skinList: [],
      lightList: [],
      pupilList: [],
      sheetList: [],
      sheetType: '',
      reSave: false
    }
  },
  computed: {
    ...mapGetters(['missionId', 'patientId', 'medicalStatus']),
    canEdit() {
      return this.medicalStatus === '01'
    }
  },
  created() {
    const res = this.getCodeListByKey([
      'PHFA_0016',
      'PHFA_0017',
      'PHFA_0018',
      'PHFA_0019'
    ])
    this.consciousnessList = res.PHFA_0016 // 意识
    this.skinList = res.PHFA_0017 // 皮肤
    this.pupilList = res.PHFA_0018 // 瞳孔
    this.lightList = res.PHFA_0019 // 对光反射
  },
  methods: {
    checkResultFilter(result) {
      if (result.isNormal === '0') {
        return '拒绝采集'
      }
      if (result.isNormal === '1') {
        return '正常采集'
      }
      return this.formatDate(result.createTime)
    },
    onConfirm(date) {
      this.dateShow = false
      if (this.dateField.indexOf('.') !== -1) {
        const fields = this.dateField.split('.')
        this.form[fields[0]][fields[1]] = this.formatDate(date)
      } else {
        this.form[this.dateField] = this.formatDate(date)
      }
      this.onCancel()
    },
    onCancel() {
      this.dateTimeShow = false
    },
    showCalendar(field) {
      this.dateField = field
      this.dateTimeShow = true
    },
    getPhysical() {
      // 读取硬件时间
      // this.$set(
      //   this.form,
      //   'createTime',
      //   this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
      // )
    },
    showSheet(type) {
      const obj = {
        consciousness: this.consciousnessList
      }
      this.sheetList = obj[type]
      this.sheetType = type
      this.show = true
    },
    onSelect(item) {
      this.show = false
      this.form[this.sheetType] = item.name
    },
    async fetchList() {
      const { body } = await this.$api.genList({
        patientId: this.patientId
      })
      if (body) {
        this.recordList = body
        if (!body.length) {
          this.recordList.push({
            patientId: this.patientId
          })
        }
        return true
      }
      return false
    },
    async handleEdit(index) {
      this.showPopup = true
      await this.fetchList()
      const record = this.recordList[index]
      this.editingId = record.id
      this.form = {
        ...resetFormData(),
        ...record
      }
    },
    isChanged() {
      const oldItem = this.recordList.find(row => row.id === this.editingId)
      const compareTarget = oldItem || resetFormData()

      const changed = Object.keys(this.form).some(key => {
        const keyChange =
          (this.form[key] || '') + '' !== (compareTarget[key] || '') + ''
        return keyChange
      })
      return changed
    },
    async handleRemove(record, index) {
      await this.$dialog.confirm({
        title: '确认删除吗?',
        message: `体格检查${1 + index}  ${record.createTime || ''}`
      })
      const {
        generalInspections: { genRemove }
      } = this.$api
      const res = await genRemove([record.id])
      if (res.body) {
        this.$notify({
          type: 'success',
          message: '删除成功!'
        })
        this.fetchList()
      } else {
        this.$notify({
          type: 'warning',
          message: '删除失败! ' + res.message
        })
      }
    },
    async getRandomId() {
      const {
        common: { getUUID }
      } = this.$api
      const res = await autoRetry(getUUID)
      if (res.body) {
        return res.body
      }
      return false
    },
    handleNew() {
      // 点击新增
      this.showPopup = true
      this.editingId = ''
      this.form = resetFormData()
    },
    async handleSave() {
      if (this.saving) {
        // 前一次保存还没返回,等待执行
        this.reSave = true
      }
      const {
        generalInspections: { genSaveOrUpdate }
      } = this.$api
      let payload = {
        ...this.form,
        patientId: this.patientId
      }
      this.saving = true
      if (this.editingId) {
        // 编辑
        const oldItem = this.recordList.find(row => row.id === this.editingId)
        payload = {
          ...oldItem,
          ...this.form
        }
      } else {
        // 新增要获取新id
        const id = await this.getRandomId()
        payload.id = id
      }
      const res = await autoRetry(() => genSaveOrUpdate(payload))
      if (res.body) {
        await this.fetchList()
        this.editingId = payload.id
        // 刷新交接单部分数据
        this.$bus.$emit('refreshHandover')
      } else {
        this.$notify({
          type: 'warning',
          message: '保存失败!' + res.message
        })
      }
      this.saving = false
      if (this.reSave) {
        // 后面有等待执行的,执行之
        this.handleSave()
      }
    }
  },
  watch: {
    patientId: {
      immediate: true,
      handler(v) {
        if (v) this.fetchList()
      }
    },
    form: {
      handler(e) {
        clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          if (this.isChanged()) {
            this.handleSave()
          }
        }, 2000)
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.task-basic-info-wrapper {
  .new-check {
    margin: 10px 30px;
    border: none;
    float: right;
    padding: 10px;

    /deep/ .iconicon1-441 {
      font-size: 36px;
      font-weight: bold;
    }
  }

  .check-title {
    width: 250px;
    padding-right: 30px;
  }

  .check-describe {
    font-size: 28px;
    // padding-right: 90px;
  }

  .iconicon1-201 {
    color: #ff6169;
    font-size: 32px;
    padding: 0 4px;
  }

  .list-item:first-child {
    /deep/ .flex-c-b:after {
      content: "";
      display: block;
      width: 0.8rem;
    }
  }
}

.check-detail {
  width: 100vw;
  height: 100vh;

  /deep/ .van-cell__title {
    max-width: 220px;
    width: 220px;
  }
}
</style>
