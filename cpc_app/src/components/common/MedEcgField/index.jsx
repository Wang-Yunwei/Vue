import './index.less'
import {
  getClass,
  getStyle,
  initDefaultProps,
  getListeners,
  getOptionProps
} from '../../_utils/props-util'
import MedHintFiled from './../MedHintField'
import MedDatePicker from './../MedDatePicker'
import MedPopupContainer from './../MedPopupContainer'
import MedListSelectField from './../MedListSelectField'
import MedEcgList from './EcgList'
import MedEcgEdit from './EcgEdit'
import moment from 'moment'
const selfProps = (defaultProps = {}) => {
  return initDefaultProps(
    {
      ...MedHintFiled.props,
      uploadUrl: {
        type: String,
        required: false
      },
      uploadImage: {
        type: Function,
        required: true
      },
      updateRecord: {
        type: Function,
        required: true
      },
      deleteRecord: {
        type: Function,
        required: true
      },
      recordList: {
        type: Array,
        required: false,
        default: []
      },
      readonly: {
        type: Boolean,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false
      },
      showFirst: {
        type: Boolean,
        default: false
      },
      enabledReason: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    defaultProps
  )
}
export default {
  name: 'MedEcgField',
  inheritAttrs: false,
  components: {
    MedDatePicker,
    MedHintFiled,
    MedPopupContainer,
    MedListSelectField
  },
  props: selfProps({}),
  data() {
    return {
      editFlag: false,
      ecgObj: {},
      pageTitle: '新增心电图',
      listFlag: false,
      popupFlag: false,
      fieldValue: '',
      inputValue: '',
      errorMessages: '',
      picture: ''
    }
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  methods: {
    showPopup() {
      this.pageTitle = '新增心电图'
      this.ecgObj = {}
      this.popupFlag = true
      this.editFlag = false
    },
    hidePopup() {
      this.popupFlag = false
    },
    showList() {
      this.listFlag = true
    },
    hideList() {
      this.listFlag = false
    },
    format(val) {
      if (!val) return ''
      return moment(val).format('HH:mm')
    },
    getDiagDesc(item) {
      if (!item) return '未知'
      // if (item.ecgDiagnosis === '0') return '异常'
      // if (item.ecgDiagnosis === '1') return '正常'
      if (item.ecgDiagnosis === '0') return '异常'
      if (item.ecgDiagnosis === '1') return '正常'
      return '未知'
    },
    getDuration(item) {
      if (item.ecgTime && item.diagTime) {
        return (
          moment(item.diagTime).diff(moment(item.ecgTime), 'minutes') + '分钟'
        )
      }
      return ''
    },
    getTimeStyle() {
      if (this.disabled) return { color: '#c8c9cc' }
      return {}
    },
    getDiagStyle(item) {
      const style = {
        color: '#323233'
        // 'margin-left': '20px'
      }
      if (this.disabled) {
        style.color = '#c8c9cc'
        return style
      }
      if (!item) return style
      if (item.ecgDiagnosis === '0') style.color = 'red'
      if (item.ecgDiagnosis === '1') style.color = 'green'
      return style
    },
    deleteRow(e, item) {
      if (this.disabled) return
      this.onDeleteRecord(item)
      e.stopPropagation()
    },
    async onDeleteRecord(item) {
      this.$dialog
        .confirm({ title: '提示', message: '确认删除心电图?' })
        .then(async () => {
          try {
            const res = await this.deleteRecord(item)
            if (res) {
              var index = this.recordList.findIndex(m => m.id === item.id)
              if (index > -1) {
                this.recordList.splice(index, 1)
              }
            } else {
              this.$notify({ type: 'success', message: '心电图删除失败！' })
            }
          } catch (e) {
            this.$notify({ type: 'warning', message: e.message })
          }
        })
        .catch(() => {})
    },
    onUpdateRecord(item) {
      const res = this.updateRecord(item)
      this.popupFlag = false
      return res
    },
    editRecord(item) {
      this.listFlag = false
      this.popupFlag = true
      if (this.readonly || this.disabled) {
        this.pageTitle = '查看心电图'
      } else {
        this.pageTitle = '编辑心电图'
      }
      this.editFlag = true
      this.ecgObj = {
        ...item,
        uploadList: this.getUploadList(item)
      }
    },
    getUploadList(item) {
      if (!item || !item.ecgFile) return []
      return item.ecgFile
        .split(';')
        .map(item => ({
          url: item,
          isImage: true
        }))
        .filter(el => el.url)
    },
    getFieldValue(records) {
      if (!records || records.length === 0) return ''
      let completed = true
      records.forEach(m => {
        if (!m.ecgTime || !m.diagTime || !m.path) completed = false
      })
      if (!completed) return ''
      return JSON.stringify(records)
    },
    setFieldValue(val) {
      this.fieldValue = this.getFieldValue(val)
      this.setInputValue(val)
    },
    getInputValue(records) {
      if (!records || records.length === 0) return ''
      let completed = true
      records.forEach(m => {
        if (!m.ecgTime || !m.diagTime || !m.path) completed = false
      })
      if (!completed) return '部分填写'
      return '已完成'
    },
    setInputValue(val) {
      this.inputValue = this.getInputValue(val)
    }
  },
  mounted() {
    this.setFieldValue(this.recordList)
  },
  computed: {
    hintClass() {
      if (!this.inputValue || this.inputValue === '') return 'med-ecg-hint--no'
      if (this.inputValue === '已完成') return 'med-ecg-hint--ok'
      return 'med-ecg-hint--ng'
    }
  },
  watch: {
    fieldValue(val) {
      this.$emit('_change', val)
    },
    recordList(val) {
      this.setFieldValue(val)
      if (val.length) {
        this.$emit('_change', this.fieldValue) // this.getDescription('已上传' + val.length + '张')
      } else {
        this.$emit('_change', '')
      }
    }
  },
  render() {
    const { $attrs } = this
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const HintProps = {
      attrs: $attrs,
      props: {
        ...getOptionProps(this),
        readonly: true
      },
      on: {
        ...getListeners(this)
      }
    }
    const bodySlots = Object.keys(this.$slots).length
      ? Object.keys(this.$slots).map(slot => {
          if (slot === 'default') {
            return <template slot={'right-icon'}>{this.$slots[slot]}</template>
          }
          return <template slot={slot}>{this.$slots[slot]}</template>
        })
      : [
          <template slot={'right-icon'}>
            <div class="flex-c-c upload-field-btns">
              <van-icon
                name="add-o"
                size="0.6rem"
                v-show={!this.disabled && !this.readonly}
                onClick={this.showPopup}
              />
              <van-icon name="coupon-o" size="0.6rem" onClick={this.showList} />
            </div>
          </template>
        ]
    return (
      <div
        class={{
          'med-ecg-field-wrapper': true
        }}
        {...TProps}
      >
        <med-hint-field
          class="no-link-arrow"
          v-model={this.fieldValue}
          {...HintProps}
          disabled={this.disabled}
          readonly
        >
          <template slot={'input-part'}>
            <span class="med-ecg-input-part">
              <van-field
                v-model={this.inputValue}
                readonly
                disabled={this.disabled}
                class={this.hintClass}
                input-align="left"
                placeholder="点击右侧按钮"
              ></van-field>
            </span>
          </template>
          {bodySlots}
        </med-hint-field>
        <van-list class="list" readonly>
          {this.recordList.map((item, index) => (
            <van-cell
              key={item.id}
              disabled={this.disabled}
              readonly
              onClick={() => this.editRecord(item)}
            >
              <div>
                <van-row>
                  <van-col span="14">
                    <van-badge
                      content={this.showFirst && index === 0 ? '首次' : ''}
                    >
                      <span style={this.getDiagStyle(item)}>心电完成</span>
                      <span style={this.getDiagStyle(item)}>~</span>
                      <span style={this.getDiagStyle(item)}>心电诊断</span>
                    </van-badge>
                  </van-col>
                  {/* <van-col span="13">
                    <span>{this.format(item.ecgTime)}</span>
                    <span>~</span>
                    <span>{this.format(item.diagTime)}</span>
                  </van-col> */}
                  <van-col span="6">
                    <span style={this.getDiagStyle(item)}>
                      {this.getDuration(item)}
                    </span>
                  </van-col>
                </van-row>
              </div>
              {/* <span style={this.getTimeStyle()}>
                {this.format(item.ecgTime)}
              </span>
              <span style={this.getDiagStyle(item)}>
                {this.getDiagDesc(item)}
              </span> */}
              <template slot={'right-icon'}>
                <div style="display:flex; align-items:center;">
                  <van-icon
                    name="delete-o"
                    v-show={!this.disabled && !this.readonly}
                    color={this.disabled ? '#c8c9cc' : 'red'}
                    onClick={e => this.deleteRow(e, item)}
                  />
                </div>
              </template>
            </van-cell>
          ))}
        </van-list>
        <med-popup-container
          teleport="#app"
          get-container="body"
          title={this.pageTitle}
          v-model={this.popupFlag}
          return={this.hidePopup}
        >
          <MedEcgEdit
            ecg={this.ecgObj}
            enabledReason={this.enabledReason}
            disabled={this.disabled}
            readonly={this.readonly}
            uploadUrl={this.uploadUrl}
            uploadImage={this.uploadImage}
            updateRecord={this.onUpdateRecord}
          />
        </med-popup-container>
        <med-popup-container
          title="心电图列表"
          scroll
          v-model={this.listFlag}
          return={this.hideList}
        >
          <template slot={'right'}>
            <div v-show={!this.disabled && !this.readonly}>
              <i class="iconfont iconicon1-441" onClick={this.showPopup} />
            </div>
          </template>
          <MedEcgList
            disabled={this.disabled}
            readonly={this.readonly}
            records={this.recordList}
            deleteRecord={this.deleteRecord}
            on-editRecord={this.editRecord}
          />
        </med-popup-container>
      </div>
    )
  }
}
