<template>
  <div class="pre-exam-sec-wrapper">
    <div class="modal-trigger" @click="visible = true">
      <med-icon type="icon_zhuyi"></med-icon>
      二次评估 : 当前超时患者{{ this.countl }}人
    </div>
    <med-s-modal size="large" v-model="visible" @ok="ok" @cancel="cancel" class="modal">
      <template #title>
        <a-row type="flex" :gutter="88" class="modal-title-box">
          <a-col class="modal-title">
            患者二次评估
          </a-col>
          <a-col>
            <a-row class="user-info" type="flex" :gutter="10">
              <a-col flex="auto" class="user-name">
                {{ patientinformation.name }}
              </a-col>
              <a-col flex="auto">
                {{ patientinformation.gender | sex }}
              </a-col>
              <a-col flex="auto"> {{ patientinformation.regage }} 岁</a-col>
            </a-row>
          </a-col>
        </a-row>
      </template>
      <template>
        <div id="components-layout-demo-basic">
          <a-layout>
            <!--二次分诊患者-->
            <a-layout-sider width="27%">
              <div class="remind-box">
                <div class="remind">
                  <med-icon type="icon_zhuyi" />
                  当前超时候诊患者{{ this.countl }}人
                </div>
              </div>
              <div class="side-table-box">
                <a-row class="query-box" type="flex" :gutter="10">
                  <a-col flex="0 1 auto">
                    <a-range-picker
                      :show-time="{ format: 'HH:mm' }"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      :placeholder="['开始时间', '结束时间']"
                      v-model="times"
                      @change="onChange"
                    />
                  </a-col>
                  <a-col flex="70px">
                    <med-button class="search-btn" @click="onOk">
                      <med-icon type="icon_sousuo" />
                      查询
                    </med-button>
                  </a-col>
                </a-row>
                <div>
                  <a-table
                    :columns="sideTableColumns"
                    :data-source="patientlsit"
                    rowKey="regid"
                    :customRow="customRow"
                    :scroll="patientlsit.length > 20 ? { y: '620px' } : {}"
                    :rowClassName="rowClassName"
                  >
                    <template slot="resetlevel" slot-scope="text">
                      <div :class="`level-${parseInt(text)}`">
                        {{ text | resetlevel }}
                      </div>
                    </template>
                    <template slot="waitfortime" slot-scope="text, row">
                      {{ row.waitfortime + '分钟' }}
                    </template>
                  </a-table>
                </div>
              </div>
            </a-layout-sider>
            <a-layout>
              <!-- 这是患者二次分诊的记录-->
              <a-layout-content>
                <template>
                  <a-table
                    :columns="columns"
                    :data-source="recordlsit"
                    :pagination="false"
                    :scroll="{ y: 220 }"
                    :customRow="recordcustomRow"
                    rowKey="visittime"
                    :rowClassName="rowClassNametest"
                  >
                    <template slot="mind" slot-scope="text">
                      {{ text | mind }}
                    </template>

                    <template slot="yresetlevel" slot-scope="text, row">
                      {{ row.yresetlevel | resetlevel }}/{{ row.yturnresult | turnresult }}
                    </template>
                    <template slot="turnresult" slot-scope="text, row">
                      {{ row.resetlevel | resetlevel }}/{{ row.turnresult | turnresult }}
                    </template>

                    <template slot="yturnresult" slot-scope="text">
                      {{ text | resetarea }}
                    </template>

                    <template slot="sbpdbp" slot-scope="text, row"> {{ row.sbp }}/{{ row.dbp }}</template>
                  </a-table>
                </template>

                <datas ref="datas" :key="refreshKey" :detailInfo="detailInfo"></datas>
                <!--分级-->
                <grade ref="grade" :key="refreshKey + 1" :detailInfo="detailInfo"></grade>
                <a-row :gutter="12" class="remark-wrapper" type="flex">
                  <a-col flex="80px" style="line-height:32px; text-align:right">备注 :</a-col>
                  <a-col flex="auto">
                    <a-input placeholder="备注" v-model="describe" />
                  </a-col>
                </a-row>

                <whereabouts
                  ref="whereabouts"
                  :detailInfo="detailInfo"
                  :submitting="submitting"
                  :key="refreshKey + 2"
                ></whereabouts>
              </a-layout-content>
            </a-layout>
          </a-layout>
        </div>
      </template>
    </med-s-modal>
  </div>
</template>
<script>
import { Datas, Grade, Whereabouts } from './add'
import { addsecondcheck, getsecondcheck, QueryPatient, SecondaryTriageEcho } from '@/api/preExam/secondaryDiagnosis'
import moment from 'moment'

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter)
}

export default {
  name: 'PreExamDatas',
  components: {
    Datas,
    Grade,
    Whereabouts
  },
  data() {
    return {
      refreshKey: 1,
      sideTableColumns: [
        {
          title: '分诊时间',
          dataIndex: 'triagetime',
          width: 150,
          align: 'center',
          sorter: (a, b) => moment(a.triagetime) > moment(b.triagetime),
          sortDirections: ['descend', 'ascend']
        },
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '当前级别',
          dataIndex: 'resetlevel',
          align: 'center',
          width: 90,
          sorter: (a, b) => a.resetlevel - b.resetlevel,
          sortDirections: ['descend', 'ascend'],
          scopedSlots: { customRender: 'resetlevel' }
        },
        {
          title: '等候时间',
          dataIndex: 'waitfortime',
          filterMultiple: false,
          align: 'center',
          width: 120,
          sorter: (a, b) => a.waitfortime - b.waitfortime,
          sortDirections: ['descend', 'ascend'],
          scopedSlots: { customRender: 'waitfortime' }
        }
      ],
      columns: [
        { title: '评估时间', dataIndex: 'visittime', key: 'visittime', width: 160, align: 'center' },
        {
          title: '血压',
          dataIndex: 'sbp',
          key: 'sbp',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'sbpdbp' }
        },
        { title: '脉搏', dataIndex: 'plus', key: 'plus', align: 'center' },
        { title: '体温', dataIndex: 'temperature', key: 'temperature', align: 'center' },
        { title: '呼吸', dataIndex: 'breath', key: 'breath', align: 'center' },
        { title: '血氧', dataIndex: 'spo', key: 'spo', align: 'center' },
        { title: '意识', dataIndex: 'mind', key: 'mind', scopedSlots: { customRender: 'mind' }, align: 'center' },
        {
          title: '原级别/区域 ',
          dataIndex: 'yresetlevel',
          key: 'yresetlevel',
          width: 170,
          scopedSlots: { customRender: 'yresetlevel' },
          align: 'center'
        },
        {
          title: '现级别/区域 ',
          dataIndex: 'turnresult',
          key: 'turnresult',
          width: 170,
          scopedSlots: { customRender: 'turnresult' },
          align: 'center'
        },
        { title: '评估人 ', dataIndex: 'nurseid', key: 'nurseid', align: 'center' }
      ],
      submitting: false,
      visible: false,
      collapsed: false,
      regid: '' /*急诊编号*/,
      id: '' /*id*/,
      type: '' /*type*/,
      describe: '' /*备注*/,
      countl: '' /*当前超时人数*/,
      visitTime: '' /*分诊时间*/,
      nurseid: '登入用户' /*登入护士*/,
      patientlsit: [],
      recordlsit: [],
      sign: [],
      Whereabouts: [],
      grade: [],
      params: { triagetime: '2' },
      times: [] /*分诊查询日期*/,
      patientinformation: {},
      patientinformationtest: '' /*患者分诊记录高亮显示判断*/,
      detailInfo: {} /*数据回显使用*/
    }
  },
  // 钩子方法
  async created() {
    //先查下患者人数
    this.QueryPatient(this.params)
    //执行定时任务刷新人数
    // this.timerl()
  },
  filters: {
    resetlevel(val) {
      switch (val) {
        case '01':
          return '一级'
        case '02':
          return '二级'
        case '03':
          return '三级'
        case '04':
          return '四级'
        default:
          return ''
      }
    },
    mind(val) {
      switch (val) {
        case '01':
          return '清楚'
        case '02':
          return '对声音有反应'
        case '03':
          return '无反应'
        case '04':
          return '对疼痛有反应'
        default:
          return ''
      }
    },
    turnresult(val) {
      switch (val) {
        case '01':
          return '抢救监护区'
        case '02':
          return '留观诊疗区'
        case '03':
          return '普通急诊区'
        case '04':
          return '发热门诊区'
        case '05':
          return '离院'
        default:
          return ''
      }
    },
    sex(val) {
      switch (val) {
        case '01':
          return '男'
        case '02':
          return '女'
        case '03':
        default:
          return '未知'
      }
    }
  },
  methods: {
    // 根据患者id查询二次分诊记录
    async getsecondcheck(regid) {
      //保存id供保存使用
      this.regid = regid
      const resl = await getsecondcheck(regid)
      this.recordlsit = resl.result
    },

    //查询二次分诊患者
    async QueryPatient(params) {
      const res = await QueryPatient(params)
      this.patientlsit = res.body.list
      //查询患者人数
      this.countl = res.body.countl
      //判断查询返回是否有数据
      if (0 != this.countl) {
        //获取患者id查询患者记录使用
        this.regid = res.body.list[0].regid
        //第一次查询患者分诊记录
        this.getsecondcheck(this.regid)
        //首次进入页面患者基本信息
        this.patientinformation = res.body.list[0]
      }
    },
    // 根据id 类型查询数据回显
    async SecondaryTriageEcho(id, type) {
      const resl = await SecondaryTriageEcho(id, type)
      this.detailInfo = resl.result[0]
      this.describe = this.detailInfo.describe
    },
    async ok() {
      await this.handleSubmitAll()
      this.submit()
      this.patientinformationtest = ''
    },
    cancel() {
      console.log('用户点击了取消！')
    },
    onChange(value, dateString) {},
    /*开始时间结束时间查询*/
    onOk(value) {
      //判断是否选择日期
      if (this.times.length === 2) {
        this.params = {
          starttime: moment(this.times[0]).format('YYYY-MM-DDTHH:mm:[00][Z]'),
          endtime: moment(this.times[1]).format('YYYY-MM-DDTHH:mm:[00][Z]')
        }
      } else {
        //日期为空，清空查询条件
        this.params = {}
      }
      this.QueryPatient(this.params)
    },
    customRow(record) {
      return {
        on: {
          click: e => {
            this.patientinformation = record
            this.getsecondcheck(record.regid)
            this.patientinformationtest = ''
            this.$refs.datas.resetSigns()
            this.$refs.grade.resetSigns()
            this.$refs.whereabouts.resetSigns()
            this.id = ''
            this.type = ''
            this.describe = ''
          }
        }
      }
    },
    recordcustomRow(record) {
      return {
        on: {
          click: e => {
            this.id = record.id
            this.type = record.type
            this.patientinformationtest = record.id
            this.SecondaryTriageEcho(this.id, this.type)
          }
        }
      }
    },
    //选中患者高亮显示
    rowClassName(record, index) {
      const isActive = this.patientinformation === record
      const activeClass = isActive ? 'active' : ''
      const rowClass = index % 2 ? 'dark-row' : ''
      return rowClass ? `${rowClass} ${activeClass}` : activeClass
    },
    //选中患者记录高亮显示
    rowClassNametest(record, index) {
      const isActive = this.patientinformationtest === record.id
      const activeClass = isActive ? 'active' : ''
      const rowClass = index % 2 ? 'dark-row' : ''
      return rowClass ? `${rowClass} ${activeClass}` : activeClass
    },
    async handleSubmitAll() {
      let payload = {}
      //获取几个模块的数据
      const refKeys = ['datas', 'grade', 'whereabouts']
      const promises = refKeys.map(async key => {
        let result = null
        if (this.$refs[key]?.formSubmit) {
          result = await this.$refs[key].formSubmit()
        }
        if (['basic', 'datas', 'knowledge'].includes(key)) {
          return result
        }
        return { [key]: result }
      })
      const values = await Promise.all(promises)
      values.forEach(valObj => {
        payload = { ...payload, ...valObj }
      })
      this.sign = values[0].vitalSigns
      this.visitTime = values[0].visitTime
      this.grade = values[1].grade
      this.Whereabouts = values[2].whereabouts
    },
    //保存组装数据
    async submit() {
      const params = {
        clinicSecondcheckDto: {},
        clinicVitalsignsDto: {}
      }
      params.clinicSecondcheckDto.id = this.id
      params.clinicSecondcheckDto.type = this.type
      params.clinicSecondcheckDto.describe = this.describe /*备注*/
      params.clinicSecondcheckDto.departmentId = this.Whereabouts.departmentId /*就诊科室*/
      params.clinicSecondcheckDto.turnResult = this.Whereabouts.turnResult /*患者去向*/
      params.clinicSecondcheckDto.nurseId = this.nurseid /*用户登入名*/
      params.clinicSecondcheckDto.visitTime = this.visitTime /*巡视时间*/
      params.clinicSecondcheckDto.regid = this.regid
      params.clinicSecondcheckDto.resetLevel = this.grade.resetLevel /*护士分诊级别*/
      // params.clinicSecondcheckDto.resetArea = this.resetarea/*护士分诊区域*/
      params.clinicVitalsignsDto.acqTime = this.sign.acqTime /*采集时间*/
      params.clinicVitalsignsDto.area = this.sign.area /*采集区域*/
      params.clinicVitalsignsDto.haslife = this.sign.haslife /*是否有生命迹象*/
      params.clinicVitalsignsDto.temperature = this.sign.temperature /*体温*/
      params.clinicVitalsignsDto.plus = this.sign.plus /*脉搏*/
      params.clinicVitalsignsDto.breath = this.sign.breath /*呼吸*/
      params.clinicVitalsignsDto.mind = this.sign.mind /*意识*/
      params.clinicVitalsignsDto.spo = this.sign.spo /*SPO₂ (%)*/
      params.clinicVitalsignsDto.dbp = this.sign.dbp /*舒张压(mmhg)*/
      params.clinicVitalsignsDto.sbp = this.sign.sbp /*收缩压(mmhg)*/
      const res = await addsecondcheck(params)
      if (res.result) {
        this.refreshKey += 1
      }
      //保存以后从新查询患者记录
      this.getsecondcheck(this.regid)
      this.id = ''
      this.type = ''
      this.describe = ''
    }
    // 定时任务
    /*async timerl() {
      console.log('定时任务执行')
      this.timer = null
      this.timer = setInterval(() => {
        this.QueryPatient(this.params)
      }, 60000)
    }*/
  },
  watch: {
    //监听点击事件，改变调用接口
    visible(val) {
      if (val) {
        this.QueryPatient(this.params)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.modal-trigger {
  color: #ff0000;
  font-size: 15px;
  line-height: 30px;
  cursor: pointer;
  user-select: none;

  /deep/ .anticon {
    font-size: 24px;
    vertical-align: sub;
  }
}

.modal {
  /deep/ .ant-modal-header {
    padding: 0 10px;
    height: 50px;
  }

  /deep/ .ant-modal-body {
    padding: 10px;
  }

  /deep/ .ant-modal-content > button.ant-modal-close > span.ant-modal-close-x {
    height: 50px;
    line-height: 50px;
    width: 50px;
  }

  /deep/ .ant-table {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 5px;
    }

    .ant-table-tbody > tr > td {
      cursor: pointer;
    }
  }

  /deep/ .ant-table-body {
    border-top: 2px solid @primary-color;
  }

  /deep/ .dark-row {
    background-color: #fafafa;
  }

  /deep/ tr.active td,
  tr.active:hover > td {
    background-color: @primary-color;
    color: #fff;
  }

  .side-table-box {
    height: calc(100% - 38px);
    background-color: #fafafa;
  }

  .modal-title-box {
    line-height: 50px;

    .user-info {
      margin-top: 7px;
      flex-wrap: nowrap;
      line-height: 36px;
      padding: 0 15px;
      background-color: #fff;
      border-radius: 36px;
      color: #333;

      .user-name {
        font-size: 16px;
      }
    }
  }

  .remind-box {
    padding: 5px;
    background-color: @primary-color;
    border-radius: 5px 5px 0 0;

    .remind {
      color: red;
      background-color: #fff;
      padding: 0 16px 0 2px;
      border-radius: 30px;
      line-height: 28px;
      font-size: 16px;
      display: inline-block;

      /deep/ .anticon {
        font-size: 26px;
        vertical-align: sub;
      }
    }
  }

  .query-box {
    padding: 10px;

    /deep/ .ant-calendar-picker-input {
      border-radius: 5px;
    }

    .search-btn {
      border-radius: 5px;
      padding: 0 10px 0 6px;

      /deep/ .anticon {
        font-size: 22px;

        + span {
          margin-left: 0;
        }
      }
    }
  }

  .remark-wrapper {
    padding: 0 20px;
  }

  #components-layout-demo-basic .ant-layout-header {
    background: #ffffff;
    height: 40% !important;
    /* max-height: 200px !important;*/
  }

  #components-layout-demo-basic .ant-layout-footer {
    background: rgb(255, 255, 255);
    min-height: 140px;
    line-height: 140px;
  }

  #components-layout-demo-basic .ant-layout-sider {
    background: #ffffff;
    height: 622px !important;
    // width: 30% !important;
    // max-width: 100% !important;
  }

  #components-layout-demo-basic .ant-layout-content {
    background: #fafafa;
    min-height: 140px;
  }
}
</style>
