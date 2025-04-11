<template>
  <div>
    <el-card
      v-for="(item, index) in value || []"
      :key="index"
      class="card-item"
      shadow="never"
    >
      <el-row type="flex" justify="space-between" align="middle" class="row">
        <el-col :span="2">
          <picture-list
            :limit="1"
            :value="item.fileList"
            :disabled="disabled"
            @input="onPictureChange(item, $event)"
          />
        </el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="12">
              <el-row type="flex" align="middle">
                <!-- <el-col
                  :xs="12"
                  :sm="12"
                  :md="10"
                  :lg="8"
                  :xl="6"
                  class="sub-title"
                >
                  <b>心电图完成时间</b>
                </el-col> -->
                <el-col>
                  <el-form-item
                    class="ecg-form-item"
                    label="心电图完成时间"
                    size="mini"
                    :prop="prop('ecgTime', index)"
                    :rules="[
                      {
                        required: true,
                        message: '请填写时间',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <med-datetime
                      v-model="item.ecgTime"
                      size="small"
                      :disabled="disabled"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row type="flex" align="middle">
                <el-col>
                  <el-form-item
                    class="ecg-form-item"
                    label="心电图检查结果"
                    size="mini"
                    :prop="prop('ecgDiagnosis', index)"
                    :rules="[
                      {
                        required: true,
                        message: '请填写检查结果',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <med-radio
                      v-model="item.ecgDiagnosis"
                      size="small"
                      :readonly="disabled"
                      :select-options="[
                        {
                          label: '正常',
                          value: '1'
                        },
                        {
                          label: '异常',
                          value: '0'
                        }
                      ]"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="10" class="sub-title">
                  <b>心电图检查结果</b>
                </el-col>
                <el-col :span="14">
                  <med-radio
                    v-model="item.ecgDiagnosis"
                    size="small"
                    :readonly="disabled"
                    :select-options="[
                      {
                        label: '正常',
                        value: '1'
                      },
                      {
                        label: '异常',
                        value: '0'
                      }
                    ]"
                  />
                </el-col> -->
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="item.ecgDiagnosis === '0'">
            <br>
            <!-- <el-col
              :xs="6"
              :sm="6"
              :md="5"
              :lg="4"
              :xl="2"
              class="sub-title"
            ><b>异常类型</b></el-col> -->
            <!-- <el-col :xs="18" :sm="18" :md="19" :lg="20" :xl="22"> -->
            <el-col>
              <el-form-item
                class="ecg-form-item"
                label="异常类型"
                size="mini"
                :prop="prop('ecgException', index)"
                :rules="[
                  {
                    required: true,
                    message: '请填写异常类型',
                    trigger: 'change'
                  }
                ]"
              >
                <el-form-item
                  class="ecg-form-item-other"
                  label="其他"
                  size="mini"
                  :prop="prop('ecgExceptionOther', index)"
                  :rules="
                    (item.ecgException||'').includes('99')
                      ? [
                        {
                          required: true,
                          message: '请填写其他',
                          trigger: 'change'
                        }
                      ]
                      : []
                  "
                >
                  <advancedCheckbox
                    v-model="item.ecgException"
                    v-clear="!disabled"
                    :options="dic.electrocardiogram"
                    :other.sync="item.ecgExceptionOther"
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
            <!-- </el-col> -->
          </el-row>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="!disabled"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="handleRemove(index)"
          >删除</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-button
      v-if="!disabled"
      class="add-btn"
      icon="el-icon-plus"
      @click="handleAdd"
    >添加</el-button>
  </div>
</template>

<script>
import { removeEcg } from '@/api/ecg'
import PictureList from '@/components/PictureList'
import storage from 'store'
import advancedCheckbox from '@/components/AdvancedCheckbox'
// 心电图记录列表
export default {
  name: 'EcgList',
  components: {
    PictureList,
    advancedCheckbox
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    propPath: {
      // 心电图值在form model对象中的路径,用于校验
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dic: storage.get('dicData')
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(v) {
        this.$preventWatch(() => {
          (v || []).forEach((el) => {
            if (el.ecgFile) {
              if (el.fileList && el.fileList[0]) {
                el.fileList[0].url = el.ecgFile
              } else {
                el.fileList = [{ ...el, url: el.ecgFile }]
              }
            } else {
              delete el.fileList
            }
          })
        })
      }
    }
  },
  methods: {
    prop(fieldName, index) {
      if (this.value[index]) {
        const path = this.propPath + `[${index}].${fieldName}`
        return path
      } else {
        return ''
      }
    },
    onPictureChange(item, picList) {
      item.ecgFile = picList[0]?.url
      item.fileList = item.ecgFile
        ? [{ ...item, url: item.ecgFile }]
        : undefined
      this.$forceUpdate()
    },
    handleAdd() {
      const newValue = (this.value || []).concat([{}])
      this.$emit('input', newValue)
    },
    async handleRemove(index) {
      await this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      const removedItem = (this.value || [])[index]
      if (removedItem) {
        if (removedItem.id) {
          await removeEcg(removedItem.id)
        }
        const newValue = this.value || []
        newValue.splice(index, 1)
        this.$emit('input', newValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ecg-form-item-other {
  margin-bottom: 0;
  ::v-deep .el-form-item__label {
    display: none;
  }

  ::v-deep .el-form-item__error {
    right: 100px;
    left: auto;
  }
}
.ecg-form-item {
  display: flex;
  align-items: center;
  ::v-deep .el-form-item__label {
    padding: 0 10px 0 0;
  }
}
.row {
  ::v-deep .el-col {
    font-size: 15px;

    > span {
      padding-right: 10px;
    }

    .el-upload-list__item {
      margin-bottom: 0;
    }
  }
}

.card-item {
  margin-bottom: 10px;

  ::v-deep .el-card__body {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .sub-title {
    text-align: right;
    padding-right: 12px;
  }
}

.add-btn {
  width: 100%;
  padding: 15px;
  border: 1px dashed #ddd;
  margin-bottom: 20px;
}
</style>
