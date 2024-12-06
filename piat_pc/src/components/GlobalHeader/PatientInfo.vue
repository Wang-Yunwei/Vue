<template>
  <a-modal v-model="visible" :title="title" width="80%" :footer="null" @cancel="close">
    <div>
      <a-form class="ant-advanced-search-form" :label-col="{ span: 5 }">
        <a-row>
          <a-col :span="12">
            <a-form-item label="急救呼叫时间：">
              <a-range-picker v-model="range" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="姓名：">
              <a-input style="width: 180px" v-model="form.name" :allowClear="true" />
            </a-form-item>
          </a-col>
          <a-col :span="2" offset="4">
            <a-form-item>
              <a-button type="primary" @click="queryList">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-card>
        <!--        <a-table :columns="columns" :data-source="data" :pagination="false">
        </a-table>-->
        <med-s-table
          questNow
          ref="table"
          rowKey="missionId"
          :columns="columns"
          :dataSource="loadData"
          :showPagination="true"
          @rowLock="rowLock"
        />
      </a-card>

      <a-row style="margin-top: 20px">
        <a-col :span="10">
          <a-button type="primary">
            急救病历
          </a-button>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" @click="toPreExam">
            保存
          </a-button>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapMutations, mapGetters } from 'vuex'
import { queryByCallTime } from '@/api/notice'
import { dasQuery } from '@/api/common'
import { queryByCodeList } from '@/api'

export default {
  data() {
    return {
      dateFormat: 'YYYY/MM/DD',
      form: {
        // startTime: '',
        // endTime: '',
        name: ''
      },
      isEdit: false,
      visible: false,
      loading: false,
      title: '',
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      columns: [
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '性别',
          dataIndex: 'gender',
          customRender: (text, row, index) => {
            if (this.genderList.find(t => t.value === row.gender)) {
              return <div> {this.genderList.find(t => t.value === row.gender).label} </div>
            } else {
              return <div> {row.gender} </div>
            }
          }
        },
        {
          title: '年龄',
          dataIndex: 'age'
        },
        {
          title: '出生日期',
          dataIndex: 'birthday'
        },
        {
          title: '主诉',
          dataIndex: 'chiefComplaint'
        },
        {
          title: '急救呼叫时间',
          dataIndex: 'callTime'
        },
        {
          title: '急救医生',
          dataIndex: 'doctorName'
        },
        {
          title: '急救护士',
          dataIndex: 'nurseName'
        },
        {
          title: '急救车牌',
          dataIndex: 'licensePlate'
        }
      ],
      data: [],
      genderList: [],
      record: {}
    }
  },
  computed: {
    ...mapGetters(['hospitalId']),
    range: {
      get() {
        const range = []
        if (this.form.startTime) {
          range[0] = this.form.startTime
        }
        if (this.form.endTime) {
          range[1] = this.form.endTime
        }
        return range
      },
      set(v) {
        const [start, end] = v || []
        this.$set(this.form, 'startTime', start)
        this.$set(this.form, 'endTime', end)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_MSG_INFO']),
    loadData(page) {
      var requestParameters = { hospitalId: 'RBAC_csyq', ...this.form }
      return dasQuery(requestParameters).then(function(res) {
        return {
          current: 1,
          size: 10,
          total: res.body.length,
          records: res.body
        }
      })
    },
    open() {
      this.loadData()
      this.visible = true
      this.title = '院前急救病人信息'
      // this.form.startTime = moment(new Date(), this.dateFormat)
      // this.form.endTime = moment(new Date(), this.dateFormat)
    },
    queryList() {
      this.$refs.table.refresh()
    },
    close() {
      this.visible = false
      this.form = {}
    },
    rowLock(record, index) {
      this.record = record
    },
    toPreExam() {
      if (!Object.keys(this.record)?.length) {
        this.$message.warning('请先选择一条数据')
        return
      }
      this.SET_MSG_INFO({ ...this.record })
      this.$refs.table.rowClickedId = ''
      this.record = {}

      this.visible = false
      if (this.$route.path !== '/preExam/selfReg') {
        this.$router.push('/preExam/selfReg')
      }
    },
    async getDictionaryData() {
      const params = {
        codeList: [
          'gender' //性别
        ],
        hospitalId: this.hospitalId
      }
      const res = await queryByCodeList(params)
      const { gender } = res.result || {}
      this.genderList = gender
    },
    moment
  },
  async created() {
    await this.getDictionaryData()
  },
  mounted: function() {}
}
</script>
