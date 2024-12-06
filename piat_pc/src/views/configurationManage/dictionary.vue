<template>
  <div class="pre-exam-basic-wrapper">
    <a-row :gutter="10">
      <a-col :span="19">
        <med-s-card title="字典列表">
          <template>
            <div class="flex-c-e">
              <a-button type="primary" @click="visible = true">
                <med-icon type="plus" />
                新增
              </a-button>
              <med-s-modal v-model="visible" title="新增字典值" @cancel="cancel" @ok="submit">
                <div>
                  <med-s-form-model :form="addForm" :responsive="responsive" :dataSource="mSFdataSource" />
                </div>
              </med-s-modal>
              <a-upload class="upload-btn" name="file"
                v-bind:action="GLOBAL_APP_API_BASE_URL+'/piat/DataDictionaryController/v1/ddcAddBatch'"
                @change="handleChange">
                <a-button type="primary" ghost icon="iplus-outlined">
                  <med-icon type="upload" />
                  上传文件
                </a-button>

              </a-upload>
            </div>
          </template>
          <a-table :dataSource="aTableDataSource" :columns="aTableColumns">
            <template v-for="col in ['label', 'value', 'extend','describe']" :slot="col"
              slot-scope="text, record, index">
              <div :key="col">
                <a-input v-if="record.editable" style="margin: -5px 0" :value="text"
                  @pressEnter="e => editPressEnter(e.target.value, record.id, col)" allow-clear />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <div slot="status" slot-scope="text, record">
              <a-switch @change="switchChange(record)" :checked="record.status === '1'"></a-switch>
            </div>
            <div slot="operation" slot-scope="text, record">
              <a @click="edit(record.id)">
                <a-icon type="form" />
              </a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除这条数据吗?" ok-text="Yes" cancel-text="No" @confirm="confirm(record)"
                @cancel="cancel(record)">
                <a href="#">
                  <a-icon type="delete" style="color:red" />
                </a>
              </a-popconfirm>
            </div>
          </a-table>
        </med-s-card>
      </a-col>
      <a-col :span="5">
        <med-s-card title="查询">
          <med-s-form-model :form="form" :responsive="responsive" :dataSource="dataSource" ref="form" />
          <a-button type="primary" block @click="handleSubmit">查询</a-button>
          <a-divider />
          <a-list size="small" bordered :data-source="curCodeList">
            <template #renderItem="{ title ,dictCode}">
              <a-list-item @click="dicSelect(dictCode)" :class="activeCode === dictCode ? 'active' : ''">{{
              title
              }}</a-list-item>
            </template>
          </a-list>
        </med-s-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { ddcSaveOrUpdate, ddcDelete, ddcListOrDetails, ddcAddBatch, getDictCode } from '@/api/dictionary'
const dataSource = [
  {
    labelText: '字典编码',
    type: 'text',
    placeholder: '文本输入区域',
    fieldName: 'dictCode',
    wrongMsg: '请输入文本',
    trigger: 'blur',
    responsive: { xl: 24, lg: 24, md: 24, sm: 24, xs: 24 }
  },
  {
    labelText: '字典名称',
    type: 'text',
    placeholder: '文本输入区域',
    fieldName: 'dictName',
    wrongMsg: '请输入文本',
    trigger: 'blur',
    responsive: { xl: 24, lg: 24, md: 24, sm: 24, xs: 24 }
  }
];
const aTableColumns = [
  {
    title: 'NAME',
    dataIndex: 'label',
    key: 'label',
    width: 200,
    align: 'center',
    scopedSlots: { customRender: 'label' }
  },
  {
    title: 'VALUE',
    dataIndex: 'value',
    key: 'value',
    width: 200,
    align: 'center',
    scopedSlots: { customRender: 'value' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 200,
    align: 'center',
    scopedSlots: {
      customRender: 'status'
    }
  },
  {
    title: '扩展',
    dataIndex: 'extend',
    key: 'extend',
    align: 'center',
    scopedSlots: { customRender: 'extend' },
  },
  {
    title: '备注',
    dataIndex: 'describe',
    key: 'describe',
    align: 'center',
    scopedSlots: { customRender: 'describe' },
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: {
      customRender: 'operation'
    }
  }
];
export default {
  computed: {
    mSFdataSource() {
      return [
        {
          labelText: '字典编码',
          type: 'select',
          fieldName: 'dicCode',
          required: true,
          placeholder: '选择字典编码',
          optionList: this.dicCodeOptionList
        },

        {
          labelText: '标签',
          type: 'text',
          placeholder: '文本输入区域',
          fieldName: 'label',
          required: true,
          wrongMsg: '请输入文本'
        },
        {
          labelText: '值',
          type: 'text',
          placeholder: '文本输入区域',
          fieldName: 'value',
          required: true,
          wrongMsg: '请输入文本'
        },
        {
          labelText: '状态',
          type: 'switch',
          fieldName: 'status',
          customRender: h => (
            <a-switch
              checked={this.addForm.status === '1'}
              onChange={v => {
                this.addForm.status = v ? '1' : '0'
              }}
            />
          )
        },
        {
          labelText: '扩展',
          type: 'textarea',
          placeholder: '文本输入区域',
          fieldName: 'extend',
          wrongMsg: '请输入文本',
          autoSize: {
            minRows: 1
          }
        },
        {
          labelText: '备注',
          type: 'textarea',
          placeholder: '文本输入区域',
          fieldName: 'describe',
          wrongMsg: '请输入文本',
          autoSize: {
            minRows: 1
          }
        }
      ]
    }
  },
  data() {
    return {
      GLOBAL_APP_API_BASE_URL,
      visible: false,
      dicCodeOptionList: [],
      appIdOptionList: [],
      addForm: {
        status: '1'
      },
      visible: false,
      activeCode: '',
      curCodeList: [],
      form: {},
      dataSource,
      responsive: { xl: 24, lg: 24, md: 24, sm: 24, xs: 24 },
      aTableDataSource: [],
      aTableColumns,
      editingKey: '',
    }
  },
  mounted() {
    this.getDictCodeList()
  },
  methods: {
    editPressEnter(value, id, column) {
      const newData = [...this.aTableDataSource];
      const target = newData.find(item => id === item.id);
      if (target) {
        target[column] = value;
        this.aTableDataSource = newData;
        // ddcSaveOrUpdate({
        //   id: id,
        //   [column]: value
        // }).then(res => {
        //   if (res.code === '000000' && res.body) {

        //   }
        // })
      }
    },
    edit(key) {
      const newData = [...this.aTableDataSource];
      const target = newData.find(item => key === item.id);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.aTableDataSource = newData;
      }
    },
    resetOptionList(key, arr, index) {
      if (index == 'formDataSource') {
        this.formDataSource.forEach(item => {
          if (item.fieldName === key) {
            this.$set(item, 'optionList', arr)
          }
        })
      } else {
        this.dataSource_turnResult.forEach(item => {
          if (item.fieldName === key) {
            this.$set(item, 'optionList', arr)
          }
        })
      }
    },
    submit() {
      ddcSaveOrUpdate({ ...this.addForm, code: this.addForm.dicCode }).then(res => {
        if (res.code === '000000') {
          this.visible = false
          this.dicSelect(this.activeCode)
        } else {
          this.$message.error('保存失败!' + res.message)
        }
      })
    },
    cancel() {
      console.log('用户点击了取消！')
    },
    async switchChange(row) {
      const res = await ddcSaveOrUpdate({
        id: row.id,
        status: row.status === '1' ? '0' : '1'
      })
      if (res.code === '000000') {
        this.dicSelect(this.activeCode)
      } else {
        this.$message.error('切换状态失败!' + res.message)
      }
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    confirm(e) {
      ddcDelete([e.id]).then(res => {
        if (res.code === '000000') {
          this.$message.success('删除成功!')
          this.dicSelect(this.activeCode)
        } else {
          this.$message.error('删除失败!' + res.message)
        }
      })
    },
    cancel(e) {
      console.log(e)
    },
    onEdit(row) {
      console.log(row)
    },
    handleSubmit() {
      this.getDictCodeList()
    },
    async getDictCodeList() {
      const res = await getDictCode({ ...this.form })
      this.curCodeList = res.body
      this.dicCodeOptionList = res.body.map((item) => {
        return {
          label: item.title,
          value: item.dictCode
        }
      })
    },
    dicUpload() { },
    dicSelect(param) {
      this.activeCode = param
      ddcListOrDetails({ code: param }).then(res => {
        this.aTableDataSource = res.body
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

/deep/ .ant-card-extra {
  width: calc(100% - 230px);
  position: relative !important;
  padding-right: 20px !important;
}

.export-btn {
  margin: 7px 0;
  height: 28px;
  padding: 0 10px;
}

.active {
  background-color: @primary-color;
  color: #fff;
}

.pre-exam-basic {
  &-card-btn {
    flex-wrap: wrap;

    .ant-btn {
      &:not(:last-child) {
        margin-right: 10px;
      }

      /deep/ .anticon {
        font-size: 20px;
        line-height: 24px;
      }
    }
  }

  &-wrapper {
    /deep/ .med-s-card-wrapper>.ant-card-body {
      padding: 10px 20px 20px;
    }

    .med-s-form-wrapper {
      /deep/ .ant-card-body {
        padding: 0;
      }
    }

    .pre-exam-basic-left {
      // padding: 0 10px 10px 0;
      width: 140px;

      .avatar {
        // margin: 0 auto;
        min-width: 140px;
        width: 140px;
        height: 160px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        width: 140px;
        margin-top: 7px;

        >div {
          color: #333333;
          font-size: 14px;
          line-height: 14px;
          margin-bottom: 6px;
        }

        p {
          word-break: break-all;
          margin: 0;
          color: #000;
          font-size: 16px;
          line-height: 16px;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;

          &:not(:last-of-type) {
            margin-bottom: 10px;
          }
        }

        .noinfo {
          margin-top: 14px;
          color: #333333;

          /deep/ .ant-checkbox+span {
            padding-left: 10px;
          }
        }
      }
    }

    @media (max-width: @screen-sm) {
      .pre-exam-basic-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .avatar {
          margin: 0;
        }

        .info {
          margin: 0 30px;
        }
      }
    }

    .pre-exam-basic-right {
      width: calc(100% - 140px);

      /deep/ .ant-radio-group {
        min-width: 190px;
      }

      &-top {
        /deep/.med-s-form-model-wrapper {
          >.ant-form {
            .ant-form-item .ant-form-item-control {
              min-width: unset;

              .ant-radio-button-wrapper {
                &.ant-radio-button-wrapper-checked {
                  background-color: #a1a1a1;
                  border-color: #a1a1a1;
                  color: #fff;
                }

                &:nth-of-type(1) {
                  color: #02b6e9;
                  border-color: #02b6e9;

                  &.ant-radio-button-wrapper-checked {
                    background-color: #02b6e9;
                    color: #fff;
                  }
                }

                &:nth-of-type(2) {
                  color: #ff6666;
                  border-color: #ff6666;

                  &.ant-radio-button-wrapper-checked {
                    background-color: #ff6666;
                    color: #fff;

                    &:focus-within {
                      box-shadow: 0 0 0 3px rgba(255, 102, 102, 0.1);
                    }
                  }
                }
              }
            }
          }
        }
      }

      &-bottom {
        padding-left: 28px;

        div {
          flex-wrap: wrap;
        }
      }
    }
  }
}

.upload-btn {
  margin-left: 10px;
}
</style>
