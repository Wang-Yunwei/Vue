<template>
  <med-view-container
    class="patient-list-wrapper"
    @return="backClick"
    :title="title"
  >
    <i class="iconfont iconicon1-13 button-scan" v-if="showScan"  @click="handleScan"  />
    <template #right v-if="showAddBtn">
      <div @click.stop>
        <i class="iconfont iconicon1-441" @click="handleNewMedicalRecord" />
      </div>
    </template>
    <query-list
      ref="queryList"
      placeholder="按照患者姓名、来源、时间搜索"
      :conditions="conditions"
      :formValues="defaultQuery"
      :customSearch="customSearch"
      @valuesChange="onValuesChange"
      @confirm="confirm"
    >
      <template v-slot:listItem="{ item }">
        <van-cell class="list-item" @click="onSelect(item)">
          <div class="flex-c-s">
            <span class="name">{{ item.name }}</span>
            <div></div>
            <div class="age">{{ item.age }} 岁</div>
            <div class="badge">{{ item.diagnosis }}</div>
          </div>
          <div class="flex-c-b">
            <div class="time">
              {{ conversionOne(type, timeNameList) }}: {{ item.time }}
            </div>
            <div>{{ item.licensePlate || '' }}</div>
          </div>
        </van-cell>
      </template>
    </query-list>
  </med-view-container>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import hospitalMixin from '@mixins/hospitalMixin'

const startOfDay = moment()
  .startOf('day')
  .subtract('days', 2)
  .format('YYYY-MM-DD HH:mm')
const startOfOneDay = moment()
  .startOf('day')
  .format('YYYY-MM-DD HH:mm')
const endOfDay = moment()
  .endOf('day')
  .format('YYYY-MM-DD HH:mm')

export default {
  mixins: [hospitalMixin],
  props: {
    filterTypes: {
      required: false,
      type: Array,
      default: () => ['1', '2', '3', '4']
    },
    queryType: {
      required: false,
      type: String
    },
    patientInfo: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      type: '',
      modelType: '',
      registId: '',
      defaultQuery: {
        abc: ['1'],
        hospitalArea: '1',
        hospitalAndArea: '',
        isTagNo: '1',
        type: '',
        time: [],
        patientName: ''
      },
      query: {
        visitId: '',
        type: ''
      },
      scanItem: {
        name: '',
        age: '',
        gender: '',
        type: '',
        idcardType: '',
        idcardNo: ''
      },
      result: [],
      searchOptions: {
        name: '',
        type: '',
        time: '3',
        beginTime: '',
        endTime: ''
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
    title() {
      return this.$route.query.importType === 'add' ? '患者搜索' : '关联患者'
    },
    showScan() {
      return Number(this.type) === 2 || Number(this.type) === 3
    },
    showAddBtn() {
      // 患者关联不需要显示新增按钮
      return this.$route.query.importType === 'add'
    },
    conditions() {
      return [
        {
          field: 'hospitalArea',
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
          ],
          hidden: this.filterTypes && this.filterTypes.length <= 1
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
    },
    timeName() {
      if (this.type === '1') {
        return '任务时间'
      } else if (this.type === '2') {
        return '分诊时间'
      } else if (this.type === '3') {
        return '挂号时间'
      } else if (this.type === '4') {
        return '入院时间'
      }
      return ''
    },
    idName() {
      if (this.type === '1') {
        return '车牌号'
      } else if (this.type === '2' || this.type === '3') {
        return '门诊号'
      } else if (this.type === '4') {
        return '住院号'
      }
      return '车牌号'
    }
  },
  created() {
    this.initData()
  },
  beforeRouteLeave(to, from, next) {
    const keepPath = ['/patient/document/addInformation', '/document/index']
    if (keepPath.includes(to.path)) {
      from.meta.keepAlive = true
    } else {
      const vnode = this.$vnode
      const parentVnode = vnode && vnode.parent
      if (
        parentVnode &&
        parentVnode.componentInstance &&
        parentVnode.componentInstance.cache
      ) {
        var key =
          vnode.key == null
            ? vnode.componentOptions.Ctor.cid +
              (vnode.componentOptions.tag
                ? `::${vnode.componentOptions.tag}`
                : '')
            : vnode.key
        var cache = parentVnode.componentInstance.cache
        var keys = parentVnode.componentInstance.keys
        if (cache[key]) {
          this.$destroy()
          // remove key
          if (keys.length) {
            var index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          cache[key] = null
        }
      }
    }
    next()
  },
  methods: {
    initData() {
      const type = this.getQueryType(this.queryType, this.filterTypes)
      const { importType, registId } = this.$route.query
      this.type = type
      this.registId = registId
      this.modelType = importType
      this.$set(this.searchOptions, 'type', type)
      this.$set(this.defaultQuery, 'type', type)
      this.$set(this.defaultQuery, 'patientName', this.patientInfo?.name || '')
      this.$set(this.defaultQuery, 'hospitalAndArea', this.hospitalAndArea())
      this.$set(this.defaultQuery, 'time', this.patientInfo?.name ? [startOfDay, endOfDay] : [startOfOneDay, endOfDay])
    },
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    getQueryType(queryType, filterTypes) {
      if (!filterTypes || filterTypes.length === 0) return '2'
      if (filterTypes.indexOf(this.queryType) < 0) {
        if (filterTypes.indexOf('1') >= 0 || filterTypes.indexOf('2') >= 0) {
          return '2'
        }
        if (filterTypes.indexOf('3') >= 0 || filterTypes.indexOf('4') >= 0) {
          return '3'
        }
        if (filterTypes.indexOf('-1') >= 0) {
          return '1'
        }
        if (filterTypes.indexOf('-4') >= 0) {
          return '4'
        }

        return filterTypes[0]
      } else {
        return queryType
      }
    },
    getTimeValue(val) {
      if (!val) return ''
      return moment(val).format('MM-DD HH:mm')
    },
    onValuesChange(val) {
      this.type = val.type
    },
    confirm(val) {
      this.defaultQuery = { ...this.defaultQuery, ...val }
    },
    async getPatients(params) {
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
      let params = {
        ...formValues,
        fromDate: formValues && formValues.time ? formValues.time[0] : '',
        toDate: formValues && formValues.time ? formValues.time[1] : '',
        type: formValues && formValues.type ? formValues.type : '',
        ...(pagi || {}),
        regId: undefined
      }

      if (callFromOutside) {
        // 来自扫码，清掉其它条件
        params = {
          type: '0',
          current: pagi?.current,
          pageSize: pagi?.pageSize
        }
      }

      this.type = params.type
      const res = await this.getPatients(params)
      if (!res || !res.records) {
        this.$notify({ type: 'danger', message: '无法获取患者列表' })
        return
      }
      this.result = { ...res }
      const list = this.result.records.map(e => ({
        ...e,
        type: formValues.source
      }))
      const pagination = {
        ...pagi,
        pages: this.result.pages,
        current: this.result.current,
        total: this.result.total,
        pageSize: this.result.size
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
      if (this.$route.path === '/patient/document/detail/main') {
        this.$emit('backClick')
      } else {
        this.$router.go(-1)
      }
    },
    /**
     * 扫急诊分诊凭条
     * regId
     */
    handleScan() {
      if (!this.showScan) return
      this.$bridge.callhandler('scanner', { type: ['1'], hint: '请对准门诊号进行扫描' }, async data => {
        if (data.type === '1') {
          this.scanItem.name = data.words_result.name
          this.scanItem.age = data.words_result.age
          this.scanItem.gender = data.words_result.sex === '男' ? '1' : '2'
          this.scanItem.idcardType = '1'
          this.scanItem.idcardNo = data.words_result.identity
          this.scanItem.type = this.type
          this.$router.push({
            path: '/patient/document/addInformation',
            query: { from: 'scan', patientHistory: this.scanItem }
          })
        } else if (data.type === '2') {
          const item = this.result.filter(function(x) {
            return x.no === data.words_result.text
          })
          if (item == null) {
            this.$notify({ type: 'warning', message: '没有找到患者信息' })
          }
          this.onSelect(item)
        }
      })
    },
    async onSelect(item) {
      if (this.$route.path === '/patient/document/importInfo') {
        try {
          item.type = this.type
          if (!item.relationId) {
            throw new Error('没有relationId')
          }
          const p = {
            hospitalId: this.hospitalAndArea(),
            relationId: item.relationId,
            visitId: item.relationId,
            type: this.type
          }
          const res = await this.$api.service.getEmIdPatient(p)
          if (res.status === 200) {
            if (res.result.isRegister) {
              this.$toast('该患者已建档')
              } else {
                item.emId = res.result.emId
                this.$router.push({
                  path: '/patient/document/addInformation',
                  query: { from: 'import', patientHistory: { ...item } }
                })
              }
            } else {
              throw new Error(res.message || '接口异常')
            }
          } catch (err) {
            this.$notify(err.message)
          }
      } else {
        item.type = this.type
        this.$emit('select', item)
      }
    },
    getTimeChange(val) {
      if (val === '1') {
        this.showTime = true
        this.searchOptions.endTime = moment(new Date())
          .endOf('day')
          .format('YYYY-MM-DD HH:mm')
        this.searchOptions.beginTime = moment(this.searchOptions.endTime)
          .startOf('day')
          .format('YYYY-MM-DD HH:mm')
      } else if (val === '2') {
        this.showTime = true
        this.searchOptions.endTime = moment(new Date())
          .endOf('day')
          .format('YYYY-MM-DD HH:mm')
        this.searchOptions.beginTime = moment(this.searchOptions.endTime)
          .add(-2, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm')
      } else if (val === '3') {
        this.showTime = true
        this.searchOptions.endTime = moment(new Date())
          .endOf('day')
          .format('YYYY-MM-DD HH:mm')
        this.searchOptions.beginTime = moment(this.searchOptions.endTime)
          .add(-6, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm')
      }
      this.customSearch()
    },
    open() {
      this.$backhelper.push(() => {
        this.$refs.dropMenu.toggle(false)
        this.$refs.dropTime.toggle(false)
      })
    },
    close() {
      this.$backhelper.pop()
    },
    handleNewMedicalRecord() {
      this.$router.push({
        path: '/patient/document/addInformation',
        query: { from: 'add' }
      })
    }
  },
  watch: {
    curHospitalArea: {
      immediate: true,
      handler(val) {
        this.$set(this.defaultQuery, 'hospitalArea', val)
      }
    },
    queryType: {
      immediate: true,
      handler(val) {
        this.type = this.getQueryType(val, this.filterTypes)
        this.$set(this.defaultQuery, 'type', this.type)
      }
    },
    filterTypes: {
      immediate: true,
      handler(val) {
        this.type = this.getQueryType(this.queryType, val)
        this.$set(this.defaultQuery, 'type', this.type)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';

.scroll-view {
  height: calc(100vh - 350px);
  overflow-y: auto;
}

</style>
