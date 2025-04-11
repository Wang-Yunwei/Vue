<template>
  <med-view-container
    class="patient-list-wrapper"
    @return="backClick"
    title="患者搜索"
  >
    <template #right>
      <div @click.stop>
        <i
          v-if="type === '2' || type === '3'"
          class="iconfont iconicon1-13"
          @click="handleScan"
        />
        <i class="iconfont iconicon1-441" @click="handleNewMedicalRecord" />
      </div>
    </template>
    <query-list
      ref="queryList"
      placeholder="按照患者姓名、来源、时间搜索"
      :conditions="conditions"
      :formValues.sync="queryValues"
      :defaultQuery="defaultQuery"
      :customSearch="customSearch"
      @valuesChange="onValuesChange"
    >
      <template v-slot:listItem="{ item }">
        <van-cell class="list-item">
          <div @click="onSelect(item)">
            <div class="flex-c-s">
              <div class="name">{{ item.name }}</div>
              <div :class="genderClass(item.gender)"></div>
              <div class="age">{{ item.age }}岁</div>
              <div class="badge">{{ item.diagnosis }}</div>
            </div>
            <!-- 急诊列表就是分诊时间，门诊就取门诊时间，急救是呼救时间，住院是入院时间 -->
            <div class="flex-c-b">
              <div class="time">
                {{ conversionOne(type, timeNameList) }}: {{ item.time }}
              </div>
              <div>{{ item.licensePlate || '' }}</div>
            </div>
          </div>
        </van-cell>
      </template>
    </query-list>
    <van-popup
      style="width:100vw"
      v-model="showPopup"
      :duration="0.2"
      get-container="body"
      position="right"
      @click.stop
    >
      <transition name="fade">
        <add-information
          v-if="showPopup"
          :patientData="popupData.patientHistory"
          :type="popupData.type"
          @back="closePopup"
          @enterEdit="enterEdit"
        ></add-information>
      </transition>
    </van-popup>
  </med-view-container>
</template>

<script>
import { dicConstant, thirdPartyUrl, mdtType } from '@constant/commonConstant'
import AddInformation from '@views/gc/addInformation'
import scannerMixin from '@mixins/scannerMixin'
import hospitalMixin from '@mixins/hospitalMixin'
import moment from 'moment'
import { mapGetters } from 'vuex'

const threeDaysAgo = moment()
  .startOf('day')
  .add(-2, 'days')
  .format('YYYY-MM-DD HH:mm:ss')
const startOfDay = moment()
  .startOf('day')
  .format('YYYY-MM-DD HH:mm:ss')
const endOfDay = moment()
  .endOf('day')
  .format('YYYY-MM-DD HH:mm:ss')
const defaultQuery = () => ({
  hospitalAndArea: '',
  hospitalArer: '1',
  // abc: ['1'],
  isTagNo: '1',
  type: '2',
  time: [startOfDay, endOfDay],
  patientName: ''
})
export default {
  props: ['visible'],
  components: { AddInformation },
  mixins: [scannerMixin, hospitalMixin],
  data() {
    return {
      showPopup: false,
      // 传给新建病历popup的数据，type是数据来源infoComingType
      popupData: { patientHistory: null, type: '' },
      type: '2',
      campusList: [],
      defaultQuery: defaultQuery(), // 各字段的默认值,固定不可变,用于重置
      queryValues: defaultQuery(), // 各字段的实时值,用户修改后会变
      codeList: [dicConstant.campus],
      details: {
        hospitalId: '',
        relationId: '',
        type: ''
      },
      timeNameList: [
        { label: '分诊时间', value: '2' },
        { label: '门诊时间', value: '3' },
        { label: '入院时间', value: '4' },
        { label: '呼救时间', value: '1' }
      ]
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'curHospitalArea']),
    conditions() {
      return [
        {
          field: 'hospitalArer',
          title: '院区',
          type: 'select',
          options: this.hospitalArea,
          readonly: true,
          hidden: true
        },
        {
          field: 'type',
          title: '类型',
          type: 'radio',
          options: [
            { text: '急救', value: '1' },
            { text: '急诊', value: '2' },
            { text: '门诊', value: '3' },
            { text: '住院', value: '4' }
          ]
        },
        {
          field: 'isTagNo',
          title: '腕带',
          type: 'radio',
          hidden(vals) {
            // 可以为布尔值或返回布尔值的函数
            return vals.source !== '0'
          },
          // keepValue: true,  // 控制隐藏时不清空值
          options: [
            {
              value: '1',
              text: '已绑定腕带'
            },
            {
              value: '0',
              text: '全部'
            }
          ]
        },
        {
          field: 'patientName',
          title: '姓名',
          type: 'input',
          isMain: true
        },
        {
          field: 'time',
          title: '时间',
          type: 'range'
        }
      ]
    }
  },
  methods: {
    closePopup() {
      this.showPopup = false
      this.popupData = {
        patientHistory: null,
        type: ''
      }
    },
    /**
     * 进入病历编辑页面
     * @param registId
     */
    enterEdit(registId) {
      this.showPopup = false
      this.popupData = {
        patientHistory: null,
        type: ''
      }
      this.$nextTick(() => {
        this.$router.push({
          path: '/gc/detail',
          query: { registId: registId }
        })
      })
    },
    onValuesChange(vals, field, subField) {
      if (vals.type === '1') {
        // 从别的类型切换为急救时,重置时间范围为往前3天,
        if (field === 'type') {
          const { time } = this.queryValues
          if (time[0] && time[1]) {
            const diff = moment(time[1]).diff(moment(time[0]), 'days')
            if (diff > 2 || diff < 0) {
              this.$nextTick(() => {
                this.queryValues.time = [threeDaysAgo, endOfDay]
              })
            }
          }
        } else if (field === 'time' && (vals[field][0] || vals[field][1])) {
          // 急救类型下,修改开始结束时间不能超过三天
          const diff = moment(vals[field][1]).diff(
            moment(vals[field][0]),
            'days'
          )
          const illegalRange = diff > 2 || diff < 0
          if (
            subField === 'startTime' &&
            vals[field][0] &&
            (illegalRange || !vals[field][1])
          ) {
            this.queryValues.time[1] = moment(vals[field][0])
              .endOf('day')
              .add(2, 'days')
              .format('YYYY-MM-DD HH:mm:ss')
          } else if (
            subField === 'endTime' &&
            vals[field][1] &&
            (illegalRange || !vals[field][0])
          ) {
            this.queryValues.time[0] = moment(vals[field][1])
              .startOf('day')
              .add(-2, 'days')
              .format('YYYY-MM-DD HH:mm:ss')
          }
        }
      }

      this.type = vals.type
    },
    // value转换汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    /**
     * 获取患者信息
     */
    async getGcPatients(params) {
      const response = await this.$api.thirdParty.getGcThirdPartyPatients(
        params
      )
      if (response.status === 200) {
        return response.result
      } else {
        return undefined
      }
    },
    async customSearch(formValues, pagi, callback, callFromOutside) {
      const url = thirdPartyUrl.queryPatients
      formValues.hospitalAndArea = this.hospitalAndArea()
      let params = {
        ...formValues,
        fromDate: formValues.time ? formValues.time[0] : '',
        toDate: formValues.time ? formValues.time[1] : '',
        ...(pagi || {}),
        regId: undefined
        // mdtType: mdtType.stroke
      }

      if (callFromOutside) {
        // 来自扫码，清掉其它条件
        params = {
          source: '0',
          regId: formValues.regId,
          current: pagi?.current,
          pageSize: pagi?.pageSize
        }
      }
      const result = await this.getGcPatients(params)
      if (!result || !result.records) {
        this.$notify({ type: 'danger', message: '无法获取患者列表' })
        return
      }
      const list = result.records.map(e => ({
        ...e,
        source: formValues.source
      }))
      const pagination = {
        ...pagi,
        pages: result.pages,
        current: result.current,
        total: result.total,
        pageSize: result.size
      }
      if (callback) callback({ list, pagination })
    },
    genderClass(sex) {
      let className = 'gender'
      switch (sex) {
        case '1':
          className += ' male iconfont'
          break
        case '2':
          className += ' female iconfont'
          break
        default:
          break
      }
      return className
    },
    backClick() {
      if (this.$route.path === '/gc/patientList') {
        this.$router.go(-1)
      } else {
        this.$emit('backClick')
      }
    },
    /**
     * 扫急诊分诊凭条
     * regId
     */
    handleScan() {
      // 扫急诊分诊凭条
      this.$bridge.callhandler(
        'scanner',
        { type: ['1'], hint: '请对准门诊号进行扫描' },
        async data => {
          const code = this.parseScanQrOrBar(data)
          if (code === '') {
            this.$toast(`扫码失败,请重新扫码`)
            return
          }
          // 重置默认查询条件
          this.queryValues = {
            regId: code,
            source: '0'
          }
          // 触发搜索
          this.$nextTick(() => {
            if (this.$refs.queryList?.handleSearch) {
              this.$refs.queryList.handleSearch(undefined, true)
            }
          })
        }
      )
    },
    /**
     * @deprecated
     * @param regId
     * @returns {Promise<void>}
     */
    async getTriagePatientByRegId(regId) {
      const data = { regId: regId, current: 1, pageSize: 10 }
      this.getGcPatients(thirdPartyUrl.queryPatients, data).then(
        ({ result }) => {
          if (result.records.length > 0) {
            // result.records[0]
          }
        }
      )
    },
    /**
     * 点击列表项目
     * @param item
     */
    async onSelect(item) {
      item.source = this.type
      if (item.relationId) {
        this.details.hospitalId = this.hospitalAndArea()
        this.details.type = this.type
        this.details.relationId = item.relationId
        // 根据急诊号(急诊分诊凭条)，是否已经建档
        const response = await this.$api.basicInfo.getEmIdPatient(this.details)
        if (response.status === 200 && response.result) {
          this.$toast('该患者已建档')
          return
        }
      }
      this.showPopup = true
      this.popupData = {
        patientHistory: item,
        type: this.type
      }
    },
    handleNewMedicalRecord() {
      this.showPopup = true
      this.popupData = {
        patientHistory: undefined,
        type: ''
      }
    }
  },
  watch: {
    showPopup(v) {
      if (v) {
        this.$backhelper.push(() => {
          this.showPopup = false
        })
      }
    },
    curHospitalArea: {
      immediate: true,
      handler(val) {
        this.$set(this.defaultQuery, 'hospitalArer', val)
        this.$set(this.queryValues, 'hospitalArer', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
