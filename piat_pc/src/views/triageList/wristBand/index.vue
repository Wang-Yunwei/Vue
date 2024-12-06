<template>
  <div @click="handleShowModal">
    <slot>绑定腕带</slot>
    <med-s-modal v-if="modalVisible" v-model="modalVisible" title="腕带选择" :width="760" centered>
      <a-card class="tab-card" :tab-list="tabList" :active-tab-key="activeKey" @tabChange="onTabChange">
        <div v-if="activeKey === 'bound'">
          <a-row type="flex" :gutter="20" class="query-box">
            <a-col flex="auto">
              <a-input v-model="keyword" placeholder="请输入关键字" @keyup.enter="handleSearch" />
            </a-col>
            <a-col flex="60px">
              <med-button active @click="handleSearch"> <med-icon type="icon_sousuo" />查询</med-button>
            </a-col>
          </a-row>
          <div class="table">
            <a-table
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="dataSource"
              rowKey="value"
              :loading="loading"
              @change="handlePageChange"
              :pagination="pagination"
            />
          </div>
        </div>
        <a-row v-else style="height:100%">
          <a-col :span="12" :offset="6" class="flex-c-c" style="height:100%">
            <med-s-form-model
              :form="form"
              ref="bindForm"
              :responsive="{ span: 24 }"
              :dataSource="formControls"
              @submit="handleBind"
            />
          </a-col>
        </a-row>
      </a-card>
      <template #footer>
        <div class="flex-c-c modal-footer">
          <med-button
            v-if="activeKey === 'bound'"
            :disabled="!selectedRows.length"
            color="#fff"
            active
            @click="handleUnbind"
            :loading="unbinding"
          >
            <med-icon v-show="!unbinding" type="icon_jiechuguanlian" />解除绑定
          </med-button>
          <template v-else>
            <med-button :loading="saving" color="#fff" active @click="handleSave">
              <med-icon type="icon_baocun" />保存
            </med-button>
            <med-button @click="modalVisible = false"> <med-icon type="icon_quxiao" />取消 </med-button>
          </template>
        </div>
      </template>
    </med-s-modal>
  </div>
</template>
<script>
import { regSaveOrUpdate, getSpireLamellaList } from '@/api/preExam/basic' // 接口

export default {
  name: 'WristBand',
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
    // total: {
    //   type: Number,
    //   default: 0
    // }
  },
  data() {
    return {
      loading: false,
      saving: false,
      unbinding: false,
      modalVisible: false,
      activeKey: 'bindCurUser',
      keyword: '',
      form: {},
      selectedRows: [],
      tabList: [
        {
          key: 'bindCurUser',
          tab: '绑定当前用户'
        },
        {
          key: 'bound',
          tab: '已绑定腕带列表'
        }
      ],
      columns: [
        {
          title: '腕带名称',
          dataIndex: 'label',
          align: 'center'
        },
        {
          title: '腕带代码',
          dataIndex: 'value',
          align: 'center'
        },
        {
          title: '患者姓名',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '急诊编号',
          dataIndex: 'regId',
          align: 'center'
        }
      ],
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      unbindList: [],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
        }
      },
      formControls: [
        {
          labelText: '姓名',
          type: 'text',
          placeholder: '请输入姓名',
          fieldName: 'name'
        },
        {
          labelText: '急诊编号',
          type: 'text',
          placeholder: '请输入急诊编号',
          fieldName: 'regId'
        },
        {
          labelText: '腕带',
          type: 'select',
          placeholder: '请选择腕带',
          fieldName: 'tagNo',
          required: true,
          wrongMsg: '请选择腕带',
          optionList: []
        }
      ]
    }
  },
  methods: {
    onTabChange(key) {
      this.activeKey = key
    },
    handleShowModal() {
      this.modalVisible = true
    },
    async getDataSource() {
      const { current, pageSize } = this.pagination
      const params = {
        anchorPoint: 1, // 锚点(0-未绑定,1-已绑定)
        // listTotal: this.total,
        pageNo: current,
        pageSize,
        regList: [],
        searchValue: this.keyword.trim()
      }
      this.loading = true
      const res = await getSpireLamellaList(params)
      this.loading = false
      if (res.message === 'SUCCESS') {
        const { current, total, size, records } = res.body
        this.dataSource = records
        this.pagination = {
          current,
          pageSize: size,
          total
        }
      } else {
        this.$notification.error(`获取列表数据出错! ${res.message}`)
      }
    },
    async getUnbindList() {
      const params = {
        anchorPoint: 0, // 锚点(0-未绑定,1-已绑定)
        // listTotal: this.total,
        pageNo: 1,
        pageSize: 10,
        regList: [],
        searchValue: ''
      }
      const res = await getSpireLamellaList(params)
      params.anchorPoint = 1
      params.searchValue = this.form.name
      if (res.message === 'SUCCESS') {
        this.unbindList = res.body
        const boundRes = await getSpireLamellaList(params)
        if (boundRes.message === 'SUCCESS') {
          const boundItem = boundRes.body?.records?.find(item => item.value === this.form.tagNo)
          if (boundItem) {
            this.unbindList.unshift(boundItem)
          }
          this.$set(this.formControls[2], 'optionList', this.unbindList)
        }
      } else {
        this.$notification.error(`获取未绑定腕带列表出错! ${res.message}`)
      }
    },
    async handleUnbind() {
      const params = {
        // anchorPoint: 0, // 锚点(0-未绑定,1-已绑定)
        // listTotal: this.total,
        // pageNo: 0,
        // pageSize: 0,
        regList: this.selectedRows.map(row => row.regId)
        // searchValue: ''
      }
      this.unbinding = true
      const res = await getSpireLamellaList(params)
      this.unbinding = false
      if (res.message === 'SUCCESS') {
        this.$notification.success({ message: '解绑成功!', description: res.message })
        this.handleSearch()
        this.$emit('change')
        this.modalVisible = false
      } else {
        this.$notification.error({ message: '解绑出错!', description: res.message })
      }
    },
    handlePageChange(pagination) {
      this.pagination = pagination
      this.getDataSource()
    },
    handleSearch() {
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0
      }
      this.getDataSource()
    },
    async handleSave() {
      this.$refs.bindForm.submit()
    },
    async handleBind() {
      const { regId, tagNo } = this.form
      const payload = { regId, tagNo }
      this.saving = true
      const res = await regSaveOrUpdate(payload)
      this.saving = false
      if (res.body) {
        this.modalVisible = false
        this.$notification.success({ message: '保存成功 ', description: '保存成功' })
        this.$emit('change')
      } else {
        this.$notification.error({ message: '保存出错 ', description: res.message })
      }
    }
  },
  watch: {
    modalVisible(val) {
      if (val) {
        this.getUnbindList()
      } else {
        this.loading = false
        this.saving = false
        this.unbinding = false
        this.$set(this.form, 'tagNo', '')
        this.keyword = ''
        this.activeKey = 'bindCurUser'
      }
    },
    rowData: {
      handler(val) {
        if (val) {
          Object.keys(val).forEach(item => {
            this.$set(this.form, item, val[item])
          })
        }
      },
      immediate: true
    },
    activeKey(key) {
      if (key === 'bound') {
        this.handleSearch()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.query-box {
  margin-top: -10px;
  padding-bottom: 10px;
}
.table {
  /deep/.ant-table {
    .ant-table-thead > tr > th {
      border-bottom: 2px solid @primary-color;
      color: @primary-color;
    }
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 6px;
    }
  }
}
/deep/ .ant-btn .anticon {
  font-size: 18px;
  margin-right: 0;
  + span {
    margin-left: 4px;
  }
}
/deep/ .ant-modal-body {
  padding: 0;
  min-width: 300px;
  min-height: 100px;
  .ant-card-body {
    height: 400px;
  }
}
</style>
