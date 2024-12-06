<template>
  <med-s-modal v-model="visible" title="确认分诊" size="large" @cancel="$emit('cancel')" :footer="null">
    <div class="pre-exam-basic-wrapper">
      <med-s-card title="患者信息">
        <div class="flex-c-s">
          <div class="avatar">
            <img :src="defaultAvatar" alt="头像" />
          </div>
          <ul class="flex-t-b info">
            <li>急诊编号：{{ patientDetails.regId }}</li>
            <li>姓名：{{ patientDetails.name }}</li>
            <li>分诊时间：{{ patientDetails.triageTime }}</li>
            <li>挂号编号：{{ patientDetails.registerNo }}</li>
            <li>性别：{{ patientDetails.gender }}</li>
            <li>卡号：{{ patientDetails.cardId }}</li>
            <li>病历号：{{ patientDetails.patientId }}</li>
            <li>年龄：{{ patientDetails.regAgeCaption }}</li>
          </ul>
        </div>
      </med-s-card>
      <!--关联卡号-->
      <med-s-card :tabList="tabList" activeTabKey="0" @tabChange="tabListChenge">
        <div v-show="tabShow === '0'">
          <med-s-card title="患者列表">
            <template>
              <div>
                <med-s-transfer
                  rowKey="patientId"
                  show-search
                  :filter-option="(inputValue, option) => option.patientId.indexOf(inputValue) !== -1"
                  :titles="['已关联挂号信息', '未关联挂号信息']"
                  :operations="['取消关联', '关联']"
                  :leftData="leftData"
                  :rightData="rightData"
                  :leftColumns="leftColumns"
                  :rightColumns="rightColumns"
                  @change="change"
                />
              </div>
              <div class="pre-exam-basic-card-btn-right flex-c-c" style="margin-top:10px">
                <med-button
                  style="margin-right:20px"
                  type="primary"
                  shape="round"
                  icon="icon_baocun"
                  @click="associateCard('1')"
                >
                  保存
                </med-button>
                <med-button type="primary" shape="round" icon="icon_quxiao" @click="onCancel">
                  取消
                </med-button>
              </div>
            </template>
          </med-s-card>
        </div>
        <!--匹配卡号-->
        <div v-show="tabShow === '1'">
          <med-s-card>
            <med-s-form
              :dataSource="selectParmDataSource"
              :responsive="formResponsive"
              layout="inline"
              @submit="selectListByKey"
            />
          </med-s-card>
          <med-s-card>
            <template>
              <med-s-table
                ref="table"
                :columns="columns"
                :dataSource="hisListResult"
                rowKey="patientId"
                @rowLock="rowClick"
              >
                <div slot="sex" slot-scope="text">
                  {{ automatch(hisgender, text, 'value', 'label') }}
                </div>
              </med-s-table>
              <div class="pre-exam-basic-card-btn-right flex-c-c" style="margin-top:10px">
                <med-button
                  style="margin-right:20px"
                  type="primary"
                  shape="round"
                  icon="icon_baocun"
                  @click="onInsert('2')"
                >
                  保存
                </med-button>
                <med-button type="primary" shape="round" icon="icon_quxiao" @click="onCancel">
                  取消
                </med-button>
              </div></template
            >
          </med-s-card>
        </div>
        <!--换卡-->
        <div v-show="tabShow === '2'">
          <med-s-card>
            <med-s-form
              :dataSource="changeCardDataSource"
              :responsive="formResponsive"
              layout="inline"
              @submit="selectListByKeyTables"
            />
          </med-s-card>
          <med-s-card>
            <template slot="extra">
              <div class="pre-exam-basic-card-btn flex-c-b">
                <div class="pre-exam-basic-card-btn-left flex-c-c"></div>
              </div>
            </template>
            <med-s-table
              ref="tables"
              :columns="columns"
              :dataSource="hisListResultTables"
              rowKey="patientId"
              @rowLock="rowClick"
            >
              <div slot="sex" slot-scope="text">
                {{ automatch(hisgender, text, 'value', 'label') }}
              </div>
            </med-s-table>
            <div class="pre-exam-basic-card-btn-right flex-c-c" style="margin-top:10px">
              <med-button
                style="margin-right:20px"
                type="primary"
                shape="round"
                icon="icon_baocun"
                @click="onInsert('3')"
              >
                保存
              </med-button>
              <med-button type="primary" shape="round" icon="icon_quxiao" @click="onCancel">
                取消
              </med-button>
            </div>
          </med-s-card>
        </div>
      </med-s-card>
    </div>
  </med-s-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryByCodeList } from '@/api'
import {
  selectCheckListByRegId,
  selectListHis,
  bindingCard,
  selectCardInfoByRegId,
  selectHis
} from '@/api/preExam/registration' // 接口
//穿梭框标题
const leftColumns = [
  {
    title: '病历号',
    dataIndex: 'patientId',
    key: 'patientId'
  },
  {
    title: '挂号编号',
    dataIndex: 'registerNo',
    key: 'registerNo'
  }
]
const rightColumns = [
  {
    title: '病历号',
    dataIndex: 'patientId',
    key: 'patientId'
  },
  {
    title: '挂号编号',
    dataIndex: 'hisNo',
    key: 'hisNo'
  },
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '性别',
    key: 'sex',
    dataIndex: 'sex'
  },
  {
    title: '年龄',
    key: 'dateOfBirth',
    dataIndex: 'dateOfBirth'
  },
  {
    title: '挂号时间',
    key: 'registTime',
    dataIndex: 'registTime'
  }
]
//his系统详细数据标题
const columns = [
  {
    title: '病历号',
    key: 'patientId',
    dataIndex: 'patientId'
  },
  {
    title: '挂号编号',
    key: 'hisNo',
    dataIndex: 'hisNo'
  },
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '性别',
    key: 'sex',
    dataIndex: 'sex',
    scopedSlots: {
      customRender: 'sex'
    }
  },
  {
    title: '年龄',
    key: 'dateOfBirth',
    dataIndex: 'dateOfBirth'
  },
  {
    title: '挂号时间',
    key: 'registTime',
    dataIndex: 'registTime'
  }
]

export default {
  name: 'PreExamGroup',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    patientProp: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      codeList: [
        'hisgender' //性别
      ],
      visible: this.showModal,
      hisListResult: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return selectListHis(requestParameters).then(res => {
          this.hisList = res.result.records
          return res.result
        })
      },
      hisListResultTables: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return selectListHis(requestParameters).then(res => {
          return res.result
        })
      },
      changeParamList: {}, //关联卡号数据
      patientRecord: [],
      hisgender: [],
      leftData: [],
      rightData: [],
      leftColumns,
      rightColumns,
      patientDetails: {},
      queryParam: {},
      patient: {},
      checkListResult: [],
      tabShow: '0',
      selectParm: {},
      defaultAvatar: require('@/assets/images/preExam/portrait_default.png'),
      columns,
      loading: false,
      // 针对不同分辨率，表单 整体布局（可理解为一行几个， 例 24 / 8，xl分辨率为一行3个）
      formResponsive: { xxl: 8, xl: 8, lg: 12, md: 12, sm: 24, xs: 24 },
      // 针对不同分辨率，表单 label 和 输入框 宽度
      formLayout: {
        labelCol: { xl: 9, lg: 9, md: 9, sm: 5, xs: 5 },
        wrapperCol: { span: 15 }
      },
      selectParmDataSource: [
        {
          labelText: '挂号日期',
          type: 'datetimeRange',
          fieldName: 'startAndEndTime',
          required: false,
          showTime: true,
          wrongMsg: '请选择挂号日期',
          initialValue: [
            moment()
              .subtract(0, 'days')
              .format('YYYY-MM-DD 00:00:00'),
            moment()
              .subtract(-1, 'days')
              .format('YYYY-MM-DD 00:00:00')
          ]
        },
        {
          labelText: '姓名',
          type: 'text',
          placeholder: '请输入姓名',
          fieldName: 'name',
          required: false,
          wrongMsg: '请输入姓名'
        }
      ],
      changeCardDataSource: [
        {
          labelText: '挂号日期',
          type: 'datetimeRange',
          fieldName: 'startAndEndTime',
          required: false,
          showTime: true,
          wrongMsg: '请选择挂号日期',
          initialValue: [
            moment()
              .subtract(0, 'days')
              .format('YYYY-MM-DD 00:00:00'),
            moment()
              .subtract(-1, 'days')
              .format('YYYY-MM-DD 00:00:00')
          ]
        },
        {
          labelText: '姓名',
          type: 'text',
          placeholder: '请输入姓名',
          fieldName: 'name',
          required: false,
          wrongMsg: '请输入姓名'
        },
        {
          labelText: '卡号',
          type: 'text',
          placeholder: '请输入卡号',
          fieldName: 'cardId',
          required: false,
          wrongMsg: '请输入卡号'
        }
      ],
      tabList: [
        {
          key: '0',
          tab: '关联挂号'
        },
        {
          key: '1',
          tab: '匹配挂号'
        },
        {
          key: '2',
          tab: '换卡'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  async created() {
    //字典表中参数获取
    const res = await queryByCodeList({ codeList: this.codeList, hospitalId: this.hospitalId })
    const obj = {
      hisgender: res.result.hisgender //性别
    }
    this.hisgender = obj.hisgender //性别

    //进入页面默认值
    this.patient = this.patientProp
    this.selectCardInfoByRegId()
    const checkList = await selectCheckListByRegId(this.patient.regId)
    const hisList = await selectHis()
    this.leftData = checkList.result
    hisList.result.forEach(item => {
      if (item.sex === 'M') {
        item.sex = '男'
      } else if (item.sex === 'F') {
        item.sex = '女'
      }
    })
    this.rightData = hisList.result
  },

  methods: {
    async selectCardInfoByRegId() {
      const patientDetails = await selectCardInfoByRegId(this.patient.regId)
      this.patientDetails = patientDetails.result
      if (this.patientDetails.gender === '1') {
        this.patientDetails.gender = '男'
      } else if (this.patientDetails.gender === '2') {
        this.patientDetails.gender = '女'
      } else {
        this.patientDetails.gender = '未知'
      }
    },
    //匹配卡号提交
    async onInsert(status) {
      const parmam = { ...this.patientRecord }
      if (parmam.sex === 'M') {
        parmam.sex = '1'
      } else if (parmam.sex === 'F') {
        parmam.sex = '2'
      } else {
        parmam.sex = '3'
      }
      parmam.dateOfBirth = moment(parmam.dateOfBirth).valueOf()
      parmam.registTime = moment(parmam.registTime).valueOf()
      parmam.createTime = moment().valueOf()
      var paramListDto = { hisParamDto: parmam, cardInfoParamDto: this.patientDetails }
      const result = await bindingCard(paramListDto, status)
      if (result.result) {
        if (status === '2') {
          this.$notification.success({ message: '匹配成功', description: '匹配成功' })
        } else if (status === '3') {
          this.$notification.success({ message: '换卡成功', description: '换卡成功' })
        }
        this.selectCardInfoByRegId()
      } else {
        this.$notification.success({ message: '数据已经匹配', description: '数据已经匹配' })
      }
    },
    //匹配卡号查询his系统数据
    selectListByKey(selectListKey) {
      if (selectListKey.startAndEndTime != null) {
        this.queryParam = {
          startTime: moment(selectListKey.startAndEndTime[0]).valueOf(),
          endTime: moment(selectListKey.startAndEndTime[1]).valueOf(),
          name: selectListKey.name
        }
      } else {
        this.queryParam = {
          name: selectListKey.name
        }
      }
      this.$refs.table.refresh()
    },
    //换卡查询his系统数据
    selectListByKeyTables(selectListKey) {
      if (selectListKey.startAndEndTime != null) {
        this.queryParam = {
          startTime: moment(selectListKey.startAndEndTime[0]).valueOf(),
          endTime: moment(selectListKey.startAndEndTime[1]).valueOf(),
          name: selectListKey.name,
          cardId: selectListKey.cardId
        }
      } else {
        this.queryParam = {
          name: selectListKey.name,
          cardId: selectListKey.cardId
        }
      }
      this.$refs.tables.refresh()
    },
    //table切换
    tabListChenge(tabShow) {
      this.tabShow = tabShow
      this.checkListRequest()
    },
    async checkListRequest() {
      const checkList = await selectCheckListByRegId(this.patient.regId)
      const hisList = await selectHis()
      this.checkList = checkList
      this.leftData = checkList.result
      hisList.result.forEach(item => {
        if (item.sex === 'M') {
          item.sex = '男'
        } else if (item.sex === 'F') {
          item.sex = '女'
        }
      })
      this.rightData = hisList.result
    },
    async change(leftArr, rightArr) {
      this.leftData = leftArr
      this.rightData = rightArr
    },
    async associateCard(status) {
      this.patientDetails.createTime = moment().valueOf()
      var paramListDto = {
        cardInfoParamDto: this.patientDetails,
        regitionRelationResultDtosLeft: this.leftData,
        regitionRelationResultDtosRight: this.rightData
      }
      this.changeParamList = paramListDto
      const result = await bindingCard(this.changeParamList, status)
      this.checkListRequest()
    },
    //自动匹配
    automatch(arr, val, key, sKey) {
      const obj = arr.find(item => item[key] === val)
      if (obj) return obj[sKey]
      else return ''
    },
    //数据点击事件
    rowClick(record, index) {
      this.patientRecord = record
    },
    //取消弹窗
    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
/deep/ .ant-card-extra {
  width: 90%;
  position: relative !important;
}

.pre-exam-basic {
  &-card-btn {
    flex-wrap: wrap;
    .ant-btn {
      margin: 0 10px;
    }
  }
  &-wrapper {
    .flex-t-b {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .info {
      li {
        margin: 10px 0;
        width: 33%;
      }
    }
    /deep/ .ant-card-body {
      padding: 10px;
    }
    .med-s-form-wrapper {
      /deep/ .ant-card-body {
        padding: 0;
      }
    }
    .pre-exam-basic-left {
      padding: 0 10px 10px;
      .info {
        width: 120px;
        margin: 10px auto 0;
        p {
          margin: 0;
          color: #000;
          font-size: 14px;
        }
        .noinfo {
          margin-top: 10px;
        }
      }
    }
    @media (max-width: @screen-sm) {
      .pre-exam-basic-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .info {
          margin: 0 30px;
        }
      }
    }
    .pre-exam-basic-right {
      /deep/ .ant-radio-group {
        min-width: 180px;
      }
      &-top {
      }
      &-bottom {
        div {
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>
