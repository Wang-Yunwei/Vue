<template>
  <div>
    <el-form
      ref="baseInfo"
      :inline="true"
      :model="gc"
      :rules="rules"
      class="demo-form-inline"
      size="mini"
    >
      <el-form-item label="姓名" prop="patientInfo.name">
        <el-input
          v-model="gc.patientInfo.name"
          :disabled="disabled"
          placeholder="姓名"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="patientInfo.identificationCard">
        <el-input
          v-model="gc.patientInfo.identificationCard"
          :disabled="disabled"
          placeholder="身份证号"
          @change="IDChange"
        />
      </el-form-item>
      <el-form-item label="性别" prop="patientInfo.gender">
        <med-radio
          v-model="gc.patientInfo.gender"
          :select-options="dic.gender"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="gc.patientInfo.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="disabled"
          @change="birthdayChange"
        />
      </el-form-item>
      <el-form-item label="年龄" prop="patientInfo.age">
        <el-input
          v-model="gc.patientInfo.age"
          :disabled="disabled"
          placeholder="年龄"
        />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input
          v-model="gc.patientInfo.ecPhone"
          :disabled="disabled"
          placeholder="联系电话"
        />
      </el-form-item>
      <el-form-item label="来院方式" prop="patientInfo.comingType">
        <med-radio
          v-model="gc.patientInfo.comingType"
          :select-options="dic.comingType"
          :disabled="disabled"
          @_change="comingTypeChange"
        />
        <!-- <el-radio-group
          v-model="gc.patientInfo.comingType"
          @change="comingTypeChange"
        >
          <el-radio-button
            v-for="item in dic.comingType"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item label="民族">
        <el-select v-model="gc.patientInfo.nation" :disabled="disabled">
          <el-option
            v-for="item in dic.strokeNation"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="紧急联系人">
        <el-input
          v-model="gc.patientInfo.ecName"
          :disabled="disabled"
          placeholder="紧急联系人"
        />
      </el-form-item>
      <el-form-item label="紧急联系人与患者关系">
        <el-select v-model="gc.patientInfo.ecType" :disabled="disabled">
          <el-option
            v-for="item in dic.urgentType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="院区">
        <el-select
          v-model="gc.patientInfo.hospitalArea"
          placeholder="院区"
          disabled
        >
          <el-option
            v-for="item in hospitalArea"
            :key="item.areaId"
            :label="item.areaName"
            :value="item.areaId"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { Gc } from '@/model/commonModel'
import idCardMixin from '@/mixins/idCardMixin'
import storage from 'store'
import { mapGetters } from 'vuex'
import { validateForm } from '@/utils/validate'

export default {
  name: 'BaseInfo',
  mixins: [idCardMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gc: { patientInfo: { ...Gc() }},
      dic: storage.get('dicData'),
      rules: {
        'patientInfo.name': [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        'patientInfo.gender': [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        'patientInfo.age': [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', message: '请输入年龄', trigger: 'blur' }
        ],
        'patientInfo.identificationCard': [
          { len: 18, message: '长度必须18个字符', trigger: 'blur' }
        ],
        'patientInfo.comingType': [
          { required: true, message: '请选择来院方式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalArea'])
  },
  watch: {},
  created() {},
  mounted() {
    this.gc.patientInfo = { ...this.gc.patientInfo, ...this.info }
    this.comingTypeChange()
  },
  methods: {
    // 根据身份证号，计算性别、出生日期、年龄
    IDChange(val) {
      // if (val.length === 18) {
      //   // 身份证号码第十七位 奇数为男性，偶数为女性
      //   if (Number(val.substr(16, 1)) % 2 !== 0) {
      //     this.$set(this.gc.patientInfo, 'gender', 1)
      //   } else {
      //     this.$set(this.gc.patientInfo, 'gender', 2)
      //   }
      //   // 身份证号码第七位到第十四位 为出生日期
      //   this.$set(
      //     this.gc.patientInfo,
      //     'birthday',
      //     val.substr(6, 4) + '-' + val.substr(10, 2) + '-' + val.substr(12, 2)
      //   )
      //   // 根据出生日期，计算年龄
      //   this.$set(
      //     this.gc.patientInfo,
      //     'age',
      //     moment().diff(this.gc.patientInfo.birthday, 'years')
      //   )
      // }
      if (this.isIdcard(val)) {
        this.$set(this.gc.patientInfo, 'birthday', this.getBirthday(val))

        this.$set(this.gc.patientInfo, 'gender', this.getSex(val))

        this.$set(
          this.gc.patientInfo,
          'age',
          this.calcAge(moment(this.getBirthday(val)))
        )
      }
    },
    // 根据出生日期，计算年龄
    birthdayChange(val) {
      this.$set(this.gc.patientInfo, 'age', this.calcAge(val))
    },
    comingTypeChange() {
      this.$emit('comingTypeChange', this.gc.patientInfo.comingType)
    },
    validate() {
      return validateForm(this.$refs['baseInfo'], '基本信息')
    }
  }
}
</script>
