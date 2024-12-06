<template>
  <div class="med-tn-field-wrapper">
    <med-hint-field v-model="fieldValue" v-bind="$props" readonly>
      <template #input-part>
        <span class="med-tn-input-part">
          <van-field v-model="inputValue" readonly :disabled="disabled" :class="hintClass" input-align="left" placeholder="点击右侧按钮">
          </van-field>
        </span>
      </template>
      <template #right-icon>
        <div class="flex-c-c med-tn-field-buttons">
          <van-icon name="add-o" size="0.6rem" v-if="!disabled && !readonly" @click="onAddClick" />
          <!-- <van-icon name="coupon-o" size="0.6rem" @click="onListClick" /> -->
        </div>
      </template>
    </med-hint-field>
    <van-list :class="disabled ? 'display_list_disabled' : 'display_list'" readonly>
      <div v-for="(item, index) in labRecords" :key="item.id" class="display_list-row">
        <van-cell>
          <div @click.stop="onListClick">
            <van-row>
              <van-col span="14">
                <van-badge :content="index === 0 ? '首次' : ''">
                  <div>
                    <span>抽血时间</span>
                    <!-- {{ format(item.drawBloodTime) }} -->
                    <span>~</span>
                    <span>报告时间</span>
                    <!-- {{ format(item.reportTime) }} -->
                  </div>
                </van-badge>
              </van-col>
              <van-col span="6">
                {{ getDuration(item) }}
              </van-col>
            </van-row>
            <van-row class="display_list-row-memo">
              <van-col span="24">
                <span>
                  {{ getTypeName(item.creatinineprotein) }}
                </span>
                <span>
                  {{ getDescription(item) }}
                </span>
                <span>
                  {{ getResultName(item.result) }}
                </span>
              </van-col>
            </van-row>
          </div>
          <template #right-icon>
            <div style="display:flex; align-items:center;" v-if="!disabled">
              <van-icon name="delete-o" :color="disabled ? '#c8c9cc' : 'red'" @click="onDeleteClick(item)" />
            </div>
          </template>
        </van-cell>
      </div>
    </van-list>
    <med-popup-container title="肌钙蛋白列表" scroll v-model="showList" return="onCloseList" :close-on-click-overlay="false" ref="ctnList" :auto-bottom="scrollToBottom">
      <template #right>
        <div v-if="!disabled && !readonly">
          <i class="iconfont iconicon1-441" @click="onAddClick" />
        </div>
      </template>
      <div style="background-color:#f2f4f5;">
        <div v-for="item in labRecords" :key="item.id" class="med-tn-row">
          <van-swipe-cell>
            <van-cell class="med-tn-row-cell">
              <med-date-picker v-model="item.drawBloodTime" label="抽血时间" :disabled="disabled" required @confirm="onConfirm(item)" />
              <med-lab-result-field v-model="item.value" :disabled="disabled" placeholder="请输入肌钙蛋白" maxlength="13" :unit-options="unitOptions" v-labResult="{ scale: 3, min: 0, max: 99999999 }" required @confirm="onConfirm(item)">
                <template #label>
                  <med-radio-button-field class="type" v-model="item.creatinineprotein" :disabled="disabled" label="" :deselect="false" :select-options="typeOptions" :border="false" @confirm="onConfirm(item)">
                  </med-radio-button-field>
                </template>
              </med-lab-result-field>
              <med-radio-button-field v-model="item.result" :disabled="disabled" label="检查结果" :select-options="resultOptions" required @confirm="onConfirm(item)">
              </med-radio-button-field>
              <med-date-picker v-model="item.reportTime" label="报告时间" :disabled="disabled" required :border="false" @confirm="onConfirm(item)" />
            </van-cell>
            <template #right>
              <van-button class="swipe-button" square type="danger" text="删除" :disabled="disabled" @click="onDeleteClick(item)" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
      <van-empty v-if="!records || records.length <= 0" :image="require('@assets/image/empty.png')" description="暂无数据" />
    </med-popup-container>
  </div>
</template>

<script>
import MedHintField from '@/components/common/MedHintField/index.jsx'
import moment from 'moment'
export default {
  name: 'MedTnField',
  props: {
    ...MedHintField.props,
    records: {
      type: Array,
      required: false,
      default: () => []
    },
    unitOptions: {
      type: Array,
      required: true,
      default: () => []
    },
    resultOptions: {
      type: Array,
      required: true,
      default: () => []
    },
    createRecord: {
      type: Function,
      required: true
    },
    deleteRecord: {
      type: Function,
      required: true
    },
    updateRecord: {
      type: Function,
      required: true
    }
  },
  model: {
    prop: 'records',
    event: '_change'
  },
  data() {
    return {
      labRecords: [],
      description: '',
      showList: false,
      showAdd: false,
      scrollToBottom: false,
      fieldValue: '',
      typeOptions: [
        {
          label: 'cTnT',
          value: '1'
        },
        {
          label: 'cTnI',
          value: '2'
        }
      ]
    }
  },
  computed: {
    inputValue() {
      if (!this.labRecords || this.labRecords.length === 0) return ''
      if (this.fieldValue) return '已完成'
      return '部分完成'
    },
    hintClass() {
      if (this.inputValue === '未填写') return 'med-tn-hint--no'
      if (this.inputValue === '已完成') return 'med-tn-hint--ok'
      return 'med-tn-hint--ng'
    }
  },
  mounted() {
    this.rebuildLabRecord(this.records)
    this.setFieldValue()
    this.$forceUpdate()
  },
  methods: {
    rebuildLabRecord(rec) {
      this.labRecords = rec.map(m => {
        return {
          id: m.id,
          registId: m.registId,
          drawBloodTime: m.drawBloodTime,
          reportTime: m.reportTime,
          value: {
            value: m.value,
            unit: m.unit
          },
          creatinineprotein: m.creatinineprotein,
          result: m.result
        }
      })
      this.labRecords.sort(function (a, b) {
        if (b.drawBloodTime === null) return 1
        if (a.drawBloodTime === null) return -1
        const diff = moment(a.drawBloodTime) - moment(b.drawBloodTime)
        return diff
      })
      // this.updateField(this.labRecords)
    },
    setFieldValue() {
      if (!this.labRecords || this.labRecords.length === 0) {
        this.fieldValue = ''
        return
      }
      let completed = true
      const that = this
      this.labRecords.forEach(m => {
        if (!that.hasValue(m)) completed = false
      })
      if (!completed) {
        this.fieldValue = ''
        return
      }
      this.fieldValue = JSON.stringify(this.labRecords)

      // const record = this.labRecords[0]
      // if (
      //   record &&
      //   record.drawBloodTime &&
      //   record.value &&
      //   record.value.unit &&
      //   record.value.value &&
      //   record.creatinineprotein &&
      //   record.result &&
      //   record.reportTime
      // ) {
      //   this.fieldValue = this.getDescription(record)
      //   return
      // }
    },
    hasValue(record) {
      return (
        record &&
        record.drawBloodTime &&
        record.value &&
        record.value.unit &&
        record.value.value &&
        record.creatinineprotein &&
        record.result &&
        record.reportTime
      )
    },
    // updateField(records) {
    //   let rec = {}
    //   if (!records || records.length === 0) return ''
    //   rec = records[0]
    //   records.forEach(m => {
    //     if (!rec.drawBloodTime && m.drawBloodTime) rec = m
    //     else if (
    //       rec.drawBloodTime &&
    //       m.drawBloodTime &&
    //       moment(rec.drawBloodTime) > moment(m.drawBloodTime)
    //     ) {
    //       rec = m
    //     }
    //   })
    //   // this.fieldValue = `${this.getTypeName(
    //   //   rec.creatinineprotein
    //   // )} ${this.getDescription(rec)} ${this.getResultName(rec.result)} `
    // },
    rebuildRecords(rec) {
      // this.updateField(rec)
      this.records.splice(0, this.records.length)
      return rec.map(m => {
        this.records.push(this.rebuildRecord(m))
      })
    },
    rebuildRecord(m) {
      return {
        id: m.id,
        registId: m.registId,
        creatinineprotein: m.creatinineprotein,
        drawBloodTime: m.drawBloodTime,
        reportTime: m.reportTime,
        value: m.value ? m.value.value : null,
        unit: m.value ? m.value.unit : null,
        result: m.result
      }
    },
    onCloseList() {
      this.showList = false
    },
    async onAddClick() {
      if (!this.showList) {
        this.showList = true
      }

      try {
        // 创建成功，则更新
        const res = await this.createRecord()
        if (res) {
          this.records.push(res)
          this.rebuildLabRecord(this.records)
          this.setFieldValue()
        } else {
          this.$notify({ type: 'warning', message: '肌钙蛋白添加失败！' })
        }
      } catch (e) {
        this.$notify({ type: 'warning', message: e.message })
      }

      this.scrollToBottom = true
    },
    onListClick() {
      this.showList = true
    },
    async onDeleteClick(item) {
      if (this.disabled) return
      this.labRecords.forEach((val, index, array) => {
        if (item.id === val.id) {
          array.splice(index, 1)
        }
      })
      try {
        // 删除成功，则更新
        const res = await this.deleteRecord(item)
        if (res) {
          this.rebuildRecords(this.labRecords)
          this.setFieldValue()
          // this.$emit('_change', _records)
        } else {
          this.rebuildLabRecord(this.records)
          this.setFieldValue()
          this.$notify({ type: 'warning', message: '肌钙蛋白删除失败！' })
        }
      } catch (e) {
        this.rebuildLabRecord(this.records)
        this.setFieldValue()
        this.$notify({ type: 'warning', message: e.message })
      }
    },
    async onConfirm(item) {
      try {
        // 创建成功，则更新
        const res = await this.updateRecord(this.rebuildRecord(item))
        if (res) {
          this.rebuildRecords(this.labRecords)
          this.setFieldValue()
          // this.$emit('_change', _records)
        } else {
          this.rebuildLabRecord(this.records)
          this.setFieldValue()
          this.$notify({ type: 'warning', message: '肌钙蛋白更新失败！' })
        }
      } catch (e) {
        this.rebuildLabRecord(this.records)
        this.setFieldValue()
        this.$notify({ type: 'warning', message: e.message })
      }
    },
    format(val) {
      if (!val) return '--'
      return moment(val).format('HH:mm')
    },
    getDuration(item) {
      if (item.drawBloodTime && item.reportTime) {
        return (
          moment(item.reportTime).diff(moment(item.drawBloodTime), 'minutes') +
          '分钟'
        )
      }
      return ''
    },
    getDescription(item) {
      let labValue = '--'
      let labUnit = ''
      if (item.value) {
        if (item.value.value) labValue = item.value.value
        if (item.value.unit) labUnit = this.getUnitName(item.value.unit)
      }
      return `${labValue}${labUnit}`
    },
    getUnitName(val) {
      const matched = (this.unitOptions || []).find(ele => ele.value === val)
      if (matched) return matched.label
      return ''
    },
    getResultName(val) {
      const matched = (this.resultOptions || []).find(ele => ele.value === val)
      if (matched) return matched.label
      return ''
    },
    getTypeName(val) {
      if (val === '1') return 'cTnT'
      else if (val === '2') return 'cTnI'
      return ''
    }
  },
  watch: {
    records: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) this.rebuildLabRecord(val)
        this.setFieldValue()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.med-tn-field-wrapper {
  .med-tn-field-buttons {
    .van-icon {
      margin: 0 10px;
    }
  }

  .med-tn-input-part {
    .van-cell {
      padding: 0 0;
    }

    .med-tn-hint--no {
      /deep/ input {
        color: red;
      }
    }

    .med-tn-hint--ok {
      /deep/ input {
        color: green;
      }
    }

    .med-tn-hint--ng {
      /deep/ input {
        color: orange;
      }
    }
  }

  .display_list_disabled {
    /deep/ .van-cell .van-cell__value--alone {
      color: #c8c9cc;
    }
  }

  .display_list {
    /deep/ .van-cell .van-cell__value--alone {
      color: #323233;
    }
  }

  .display_list-row {
    position: relative;
    background: #fff;
    padding: 0 16px;

    // .van-cell .van-cell__value {
    //   font-size: 24px;
    // }
    &-memo span {
      padding-right: 16px;
    }
  }

  .display_list-row::after {
    display: inline;
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    left: 48px;
    bottom: 0;
    right: 48px;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
    border-bottom: 2px solid #dadada;
  }

  /deep/ .van-list {
    .van-badge--fixed {
      top: 24px;
      right: -40px;
    }
  }
}

.med-tn-row {
  // background-color: #ebedf0;
  margin-bottom: 10px;
  border-bottom: 3px solid #ebedf0;

  // padding-bottom: 3px;
  .van-swipe-cell {
    background-color: #fff;

    .swipe-button {
      height: 100%;
      margin: 0 !important;
    }

    /deep/ .van-swipe-cell__wrapper {
      padding: 1px 0px;
    }

    /deep/ .van-swipe-cell__right {
      right: -1px;
    }
  }

  .med-tn-row-cell {
    padding: 0;

    /deep/ .type .van-cell {
      padding: 0;
    }
  }

  .med-tn-row-cell::after {
    border-bottom: 0;
  }
}
</style>
