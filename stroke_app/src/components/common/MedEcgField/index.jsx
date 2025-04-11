import './index.less'
import { ImagePreview } from 'vant'
import {
  getClass,
  getStyle,
  initDefaultProps,
  getListeners,
  getOptionProps
} from '../../_utils/props-util'
import storage from 'store'
import MedHintFiled from './../MedHintField'
import MedDatePicker from './../MedDatePicker'
import MedPopupContainer from './../MedPopupContainer'
import MultiSelect from './../MultiSelect'
import dateMixin from '@mixins/dateMixin'

const selfProps = (defaultProps = {}) => {
  return initDefaultProps(
    {
      ...MedHintFiled.props,
      prefixUrl: {
        type: String,
        required: false
      },
      uploadUrl: {
        type: Function,
        required: true
      },
      deleteUrl: {
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
      autoClose: {
        type: Boolean,
        required: false
      },
      value: {
        type: Boolean,
        default: false
      },
      listonly: {
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
    MultiSelect
  },
  mixins: [dateMixin],
  props: selfProps({}),
  data() {
    return {
      editFlag: false,
      ecgObj: {},
      pageTitle: '新增心电图',
      listFlag: false,
      popupFlag: this.value,
      errorMessages: '',
      picture: '',
      genderList: [
        { label: '正常', name: '心电图检查结果', value: '1' },
        { label: '异常', name: '心电图检查结果', value: '0' }
      ],
      ecgExceptionOpts: storage.get('dicData')?.ecgExceptionOpts
    }
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  methods: {
    // 将base64转换为blob
    base64ToFile(urlData, fileName) {
      const arr = urlData.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bytes = atob(arr[1]) // 解码base64
      let n = bytes.length
      const ia = new Uint8Array(n)
      while (n--) {
        ia[n] = bytes.charCodeAt(n)
      }
      return new File([ia], fileName, { type: mime })
    },
    takePhotoCallback(base64Data) {
      const file = this.base64ToFile(
        'data:image/jpeg;base64,' + base64Data,
        'ecg.png'
      )
      this.doUploadFile(file)
    },
    showHint(val) {
      this.errorMessages = val || ''
    },
    showPopup() {
      this.pageTitle = '新增心电图'
      this.ecgObj = {}
      this.popupFlag = true
      this.editFlag = false
    },
    hidePopup() {
      if (this.editFlag) {
        this.editFlag = false
        this.listFlag = false
      }
      this.popupFlag = false
    },
    showList() {
      this.listFlag = true
    },
    hideList() {
      this.listFlag = false
    },
    async doUploadFile(file) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await this.uploadUrl(formData)
        if (res && res.result) {
          const { result } = res
          this.picture = result
          this.ecgObj.uploadList = (result || '')
            .split(';')
            .map(item => ({
              url: (this.prefixUrl || '') + item,
              isImage: true
            }))
            .filter(el => el.url)
          this.ecgObj.ecgFile = this.picture
          this.$forceUpdate()
        } else {
          throw new Error(res.message)
        }
      } catch (err) {
        this.$notify({ type: 'warning', message: err })
      }
    },
    beforeDelete(params) {
      this.ecgObj.uploadList = this.ecgObj.uploadList.filter(
        el => el.url !== params.url
      )
      const pictures = this.picture ? this.picture.split(';') : []
      const newPics = pictures.filter(ele => ele !== params.url)
      this.picture = newPics.join(';')
      this.ecgObj.ecgFile = this.picture
      this.$forceUpdate()
    },
    uploadSave() {
      if (!this.ecgObj.ecgFile) {
        this.$notify({ type: 'warning', message: '请上传图片！' })
        return
      }
      if (!this.ecgObj.ecgTime) {
        this.$notify({ type: 'warning', message: '请选择时间！' })
        return
      }
      if (!this.ecgObj.ecgDiagnosis) {
        this.$notify({ type: 'warning', message: '请选择检查结果！' })
        return
      }
      if (this.ecgObj.ecgDiagnosis === '0' && !this.ecgObj.ecgException) {
        this.$notify({ type: 'warning', message: '请选择异常原因！' })
        return
      }
      if (
        this.ecgObj.ecgDiagnosis === '0' &&
        this.ecgObj.ecgException.indexOf('99') !== -1 &&
        !this.ecgObj.ecgExceptionOther
      ) {
        this.$notify({ type: 'warning', message: '请填写其他原因！' })
        return
      }
      this.$emit('submit', this.editFlag, { ...this.ecgObj })
      if (this.autoClose) {
        if (this.editFlag) {
          this.editFlag = false
          this.listFlag = true
        }
        this.popupFlag = false
      }
    },
    async deletePicture(item) {
      try {
        const res = await this.deleteUrl(item.id)
        if (res && res.status === 200) {
          this.$notify({ type: 'success', message: '删除成功' })
          this.$emit('delete-success')
        } else {
          throw new Error(res.message)
        }
      } catch (err) {
        this.$notify({ type: 'error', message: err })
      }
    },
    exceptionReason(str) {
      const arrValues = str ? str.split(',') : []
      const labels = arrValues.map(val => {
        const matched = storage
          .get('dicData')
          ?.ecgExceptionOpts.find(item => item.value === val)
        return matched?.label
      })
      return labels.join(' ; ')
    },
    preview(urlList) {
      ImagePreview(urlList.map(u => (this.prefixUrl || '') + u))
    },
    updateElectrocardiogram(item, isFromDownList) {
      if (this.listonly) return
      this.editFlag = !isFromDownList
      this.listFlag = false
      this.popupFlag = true
      this.pageTitle = '编辑心电图'
      this.ecgObj = {
        ...item,
        uploadList: item.ecgFile
          ? item.ecgFile
              .split(';')
              .map(item => ({
                url: (this.prefixUrl || '') + item,
                isImage: true
              }))
              .filter(el => el.url)
          : []
      }
    },
    getTimeStyle() {
      if (this.disabled) return { color: '#c8c9cc' }
      return {}
    },
    getDiagStyle(item) {
      const style = {
        color: 'grey',
        'margin-left': '20px'
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
    getDiagDesc(item) {
      if (!item) return '未知'
      if (item.ecgDiagnosis === '0') return '异常'
      if (item.ecgDiagnosis === '1') return '正常'
      return '未知'
    },
    deleteRow(e, item) {
      if (this.disabled) return
      this.deletePicture(item)
      e.stopPropagation()
    },
    fieldClick() {
      if (this.listonly) return
      this.showPopup()
    }
  },
  watch: {
    popupFlag(val) {
      this.$emit('_change', val)
    },
    value(val) {
      this.popupFlag = val
    }
  },
  render() {
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const HintProps = {
      attrs: this.$attrs,
      props: {
        ...getOptionProps(this),
        value: '',
        readonly: true,
        placeholder: this.listonly ? ' ' : '点击上传心电图'
      },
      on: {
        ...getListeners(this),
        'click-input': this.fieldClick
      }
    }
    const uploaderProp = {
      props: {
        // readonly: true,
        afterRead: ({ file }) => this.doUploadFile(file),
        beforeDelete: this.beforeDelete,
        maxSize: '8 * 1024 * 1024',
        maxCount: 1,
        multiple: true,
        capture: 'camera',
        accept: 'image/*'
      },
      on: {
        'click-upload': () => {
          this.$bridge.takePhoto({}, this.takePhotoCallback)
        }
      }
    }
    const SelectProp = {
      props: {
        label: '异常类型',
        options: this.ecgExceptionOpts,
        other: this.ecgObj.ecgExceptionOther
      },
      on: {
        'update:other': $$val => {
          this.$set(this.ecgObj, 'ecgExceptionOther', $$val)
        }
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
                v-show={!this.listonly && !this.readonly}
                name="add-o"
                size="0.6rem"
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
        <med-hint-field class="no-link-arrow" {...HintProps}>
          {bodySlots}
        </med-hint-field>
        <van-list class="list" readonly>
          {this.recordList.map(item => (
            <van-cell
              key={item.id}
              disabled={this.disabled}
              readonly
              onClick={() => this.updateElectrocardiogram(item, true)}
            >
              <span style={this.getTimeStyle()}>
                {this.formatDate(item.ecgTime)}
              </span>
              <span style={this.getDiagStyle(item)}>
                {this.getDiagDesc(item)}
              </span>
              <template slot={'right-icon'}>
                <van-icon
                  v-show={!this.listonly && !this.readonly}
                  name="delete-o"
                  color={this.disabled ? '#c8c9cc' : 'red'}
                  onClick={e => this.deleteRow(e, item)}
                />
              </template>
            </van-cell>
          ))}
        </van-list>
        <med-popup-container
          title={this.pageTitle}
          v-model={this.popupFlag}
          onReturn={this.hidePopup}
        >
          <div class="med-ecg-uploader-popup-wrapper">
            <h3 class="uploadfile">{this.listonly ? ' ' : '点击上传文件'}</h3>
            <van-uploader
              class="med-ecg-uploader"
              v-model={this.ecgObj.uploadList}
              {...uploaderProp}
            />
            <div class="med-ecg-uploader-info">
              <med-date-picker
                label="心电图完成时间"
                v-model={this.ecgObj.ecgTime}
                required
              />
              <med-hint-field
                label="心电图检查结果"
                v-model={this.ecgObj.ecgDiagnosis}
                required
              >
                <template slot={'input'}>
                  <van-radio-group
                    class="flex-c-e radio-btn-type"
                    v-model={this.ecgObj.ecgDiagnosis}
                  >
                    {this.genderList.map(item => (
                      <van-radio key={item.value} name={item.value}>
                        {item.label}
                      </van-radio>
                    ))}
                  </van-radio-group>
                </template>
              </med-hint-field>
              <multi-select
                v-show={this.ecgObj.ecgDiagnosis === '0'}
                v-model={this.ecgObj.ecgException}
                {...SelectProp}
              />
            </div>
            <van-button
              class="med-ecg-uploader-btn"
              block
              round
              type="info"
              size="normal"
              onClick={this.uploadSave}
            >
              保存
            </van-button>
          </div>
        </med-popup-container>
        <med-popup-container
          title="心电图列表"
          scroll
          v-model={this.listFlag}
          onReturn={this.hideList}
        >
          <div class="uploaded-list-wrapper">
            {this.recordList.map(item => (
              <van-swipe-cell key={item.id}>
                <van-cell class="card-item">
                  <span class={{ pin: true, spec: item.ecgDiagnosis === '0' }}>
                    {item.ecgDiagnosis === '0'
                      ? '异常'
                      : item.ecgDiagnosis === '1'
                      ? '正常'
                      : '未知'}
                  </span>
                  {(item.ecgFile ? item.ecgFile.split(';') : []).map(url => (
                    <van-image
                      key={url}
                      src={(this.prefixUrl || '') + url}
                      fit="contain"
                      onClick={() =>
                        this.preview(
                          item.ecgFile ? item.ecgFile.split(';') : []
                        )
                      }
                    />
                  ))}
                  {!item.ecgFile && (
                    <van-empty
                      image={require('./empty.png')}
                      description="没有图片"
                    />
                  )}
                  <div class="info flex-c-b">
                    <div class="infoTime">
                      <van-icon name="clock-o" />
                      <span>{this.formatDate(item.ecgTime)}</span>
                    </div>

                    <span class="infoE">
                      {this.exceptionReason(item.ecgException)}
                    </span>

                    <van-button
                      v-show={!this.readonly && !this.listonly}
                      round
                      size="mini"
                      type="default"
                      onClick={() => this.updateElectrocardiogram(item)}
                    >
                      编辑
                    </van-button>
                  </div>
                </van-cell>
                <template
                  slot={!this.listonly && !this.readonly ? 'right' : null}
                >
                  <div
                    class="del-icon flex-c-c"
                    onClick={() => this.deletePicture(item)}
                  >
                    <van-icon name="delete-o" />
                  </div>
                </template>
              </van-swipe-cell>
            ))}
          </div>
          <van-empty
            v-show={!this.recordList || !this.recordList.length}
            image={require('./empty.png')}
            description="暂无数据"
          />
        </med-popup-container>
      </div>
    )
  }
}
