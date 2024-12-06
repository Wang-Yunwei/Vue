<template>
  <div class="pre-exam-basic-wrapper">
    <med-s-card title="分诊列表">
      <med-s-form
        layout="inline"
        :responsive="{ xl: 8, lg: 8, md: 12, sm: 24, xs: 24 }"
        :dataSource="dataSource"
        title="表单标题"
        @submit="formSubmit"
      />
    </med-s-card>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'TriageList',
  data() {
    return {
      form: {},
      dataSource: [
        {
          labelText: '分诊时间',
          type: 'datetimeRange',
          fieldName: 'triageTime',
          placeholder: ['开始时间', '结束时间']
        },
        {
          labelText: '三无患者',
          type: 'select',
          fieldName: 'isNoname',
          placeholder: '全部',
          optionList: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]
        },
        {
          labelText: '院前急救',
          type: 'select',
          fieldName: 'isFirstAid',
          placeholder: '全部',
          optionList: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        },
        {
          type: 'text',
          placeholder: '患者姓名/急诊编号/病历号',
          fieldName: 'searchValue',
          wrongMsg: '请输入文本'
        },
        {
          labelText: '就诊科室',
          type: 'select',
          fieldName: 'departmentId',
          placeholder: '全部',
          optionList: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]
        },
        {
          labelText: '性别',
          type: 'select',
          fieldName: 'gender',
          placeholder: '全部',
          optionList: [
            {
              label: '男',
              value: '0'
            },
            {
              label: '女',
              value: '1'
            },
            {
              label: '未知',
              value: '2'
            }
          ]
        },
        {
          labelText: '患者诊断',
          type: 'text',
          placeholder: '请输入',
          fieldName: 'diagnoseDescribe',
          wrongMsg: '请输入文本'
        },
        {
          labelText: '重点病种',
          type: 'select',
          fieldName: 'formField7',
          placeholder: '全部',
          optionList: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]
        },
        {
          labelText: '分诊级别',
          type: 'select',
          fieldName: 'resetLevel',
          placeholder: '全部',
          optionList: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]
        },
        {
          labelText: '转归区域',
          type: 'select',
          fieldName: 'turnResult',
          placeholder: '',
          optionList: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]
        },
        {
          labelText: '绿色通道',
          type: 'select',
          fieldName: 'channel',
          placeholder: '全部',
          optionList: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]
        },
        {
          labelText: '状态',
          type: 'select',
          fieldName: 'checkStatus',
          placeholder: '正常',
          optionList: [
            {
              label: '正常',
              value: '0'
            },
            {
              label: '作废',
              value: '1'
            }
          ]
        },
        {
          labelText: '主诉类别',
          type: 'text',
          placeholder: '请输入',
          fieldName: 'categoryName',
          wrongMsg: '请输入文本'
        }
      ]
    }
  },
  methods: {
    async formSubmit(params) {
      params.triageTime = params.triageTime.map(item => {
        return moment(item).valueOf()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
