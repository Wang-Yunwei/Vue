<template>
  <med-view-container
    class="patient-list-wrapper"
    @return="backClick"
    title="关联患者"
  >
    <query-list
      ref="queryList"
      placeholder="姓名"
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
            <!-- 急诊列表就是分诊时间，门诊就取门诊时间，急救是呼救时间，住院是入院时间           -->
            <div class="flex-c-b">
              <div class="time">
                {{ conversionOne(patientType, timeNameList) }}: {{ item.time }}
              </div>
              <div>{{ item.licensePlate || "" }}</div>
            </div>
          </div>
        </van-cell>
      </template>
    </query-list>
  </med-view-container>
</template>

<script>
import { dicConstant } from '@constant/commonConstant'
import hospitalMixin from '@mixins/hospitalMixin'
import moment from 'moment'
import { mapGetters } from 'vuex'

const formatStr = 'YYYY-MM-DD HH:mm:ss'
const threeDaysAgo = moment()
  .startOf('day')
  .add(-2, 'days')
  .format(formatStr)
const endOfDay = moment()
  .endOf('day')
  .format(formatStr)

export default {
  // 住院患者列表
  name: 'Inpatients',
  mixins: [hospitalMixin],
  props: {
    patientName: {
      type: String,
      default: ''
    },
    // 患者类型  1:急救, 2:急诊(分诊)，3:门诊，4:住院
    type: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    const defaultQuery = () => ({
      hospitalAndArea: '',
      hospitalArer: '1',
      isTagNo: '0',
      type: this.type,
      patientName: this.patientName,
      time: [threeDaysAgo, endOfDay]
    })
    return {
      patientType: this.type,
      campusList: [],
      defaultQuery: defaultQuery(),
      queryValues: defaultQuery(),
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
    ...mapGetters([
      'hospitalId',
      'hospitalArea',
      'curHospitalArea',
      'patientInfo'
    ]),
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
          hidden: true,
          keepValue: true,
          options: [
            { text: '急救', value: '1' },
            { text: '急诊(分诊)', value: '2' },
            { text: '门诊', value: '3' },
            { text: '住院', value: '4' }
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
    onValuesChange(vals, field, subField) {
      if (vals.type === '1') {
        if (field === 'time' && (vals[field][0] || vals[field][1])) {
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
              .format(formatStr)
          } else if (
            subField === 'endTime' &&
            vals[field][1] &&
            (illegalRange || !vals[field][0])
          ) {
            this.queryValues.time[0] = moment(vals[field][1])
              .startOf('day')
              .add(-2, 'days')
              .format(formatStr)
          }
        }
      }

      this.patientType = vals.type
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
      formValues.hospitalAndArea = this.hospitalAndArea()
      let params = {
        ...formValues,
        fromDate: formValues.time ? formValues.time[0] : '',
        toDate: formValues.time ? formValues.time[1] : '',
        ...(pagi || {}),
        regId: undefined
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
      this.$emit('backClick')
    },
    /**
     * 点击列表项目
     * @param item
     */
    async onSelect(item) {
      this.$emit('selectItem', item)
    }
  },
  watch: {
    curHospitalArea: {
      immediate: true,
      handler(val) {
        this.$set(this.queryValues, 'hospitalArer', val)
        this.$set(this.defaultQuery, 'hospitalArer', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "index.less";
</style>
