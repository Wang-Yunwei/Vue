<template>
  <el-form ref="form" :model="form" label-width="120px" label-position="top">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-form-item
          label="血糖(mmol/L)"
          prop="bloodglucose"
          style="flex: 1 1 25%"
        >
          <el-input
            v-model="form.bloodglucose"
            :readonly="viewMode"
            size="mini"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="POCT" prop="poct" style="flex: 1 1 25%">
          <POCT
            v-model="form.poct"
            :readonly="viewMode"
            size="mini"
            @save="onPOCTSave"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="TI评估" prop="ti" style="flex: 1 1 25%">
          <TI
            v-model="form.ti"
            :readonly="viewMode"
            size="mini"
            @save="onTISave"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="GCS评估" prop="gcs" style="flex: 1 1 25%">
          <GCS
            v-model="form.gcs"
            :readonly="viewMode"
            size="mini"
            @save="onTISave"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="胸痛评估" prop="chestPain" style="flex: 1 1 25%">
          <chest-pain
            v-model="form.chestPain"
            :readonly="viewMode"
            size="mini"
            @save="onTISave"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Killip评估" prop="killip" style="flex: 1 1 25%">
          <killip
            v-model="form.killip"
            :readonly="viewMode"
            size="mini"
            @save="onTISave"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="FAST评估" prop="fast" style="flex: 1 1 25%">
          <fast
            v-model="form.fast"
            :readonly="viewMode"
            size="mini"
            @save="onTISave"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="其他检查" prop="otherCheck" style="flex: 1 1 25%">
          <el-input
            v-model="form.otherCheck"
            :readonly="viewMode"
            size="mini"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="心电图" prop="ecgUrlList" style="flex: 1 1 100%">
          <picture-list
            v-model="form.ecgUrlList"
            :disabled="viewMode"
            :type="0"
            :business-id="patientId"
            @refresh="$emit('refresh')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="现场照片" prop="ecgUrlList" style="flex: 1 1 100%">
          <picture-list
            v-model="form.scenePhotoUrlList"
            :disabled="viewMode"
            :type="1"
            :business-id="patientId"
            @refresh="$emit('refresh')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="现场视频" prop="gender" style="flex: 1 1 100%">
          <picture-list
            v-model="form.sceneVideoUrlList"
            :disabled="viewMode"
            :type="2"
            :business-id="patientId"
            @refresh="$emit('refresh')"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'
import PictureList from '@/components/PictureList'
import POCT from './poct'
import TI from './ti'
import GCS from './gcs'
import ChestPain from './chestPain'
import Killip from './killip'
import Fast from './fast'

export default {
  name: 'Auxiliaryexam',
  components: { PictureList, POCT, TI, GCS, ChestPain, Killip, Fast },
  props: {
    viewMode: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dic,
      form: {}
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    patientId() {
      return this.$route.query.patientId
    },
    recordId() {
      return this.$route.query.recordId
    }
  },
  watch: {
    detailData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = this.detail2form(val)
        }
      }
    }
  },
  methods: {
    onPOCTSave(v, callback) {
      // 保存poct
      const payload = { medPhepPoctEntity: this.form.poct }
      this.$emit('save', payload, callback)
    },
    onTISave(v, callback) {
      // 保存ti
      const payload = {
        estimateDto: v
      }
      this.$emit('save', payload, callback)
    },
    clearNull(obj) {
      const newObj = {}
      if (Object.prototype.toString.call(obj) === '[object Object]') {
        Object.keys(obj).forEach((k) => {
          if (obj[k] !== null) {
            newObj[k] = obj[k]
          }
        })
      }
      return newObj
    },
    detail2form(detail = {}) {
      const cleanDetail = this.clearNull(detail)
      const {
        poctUrlList,
        medPhepPoctEntity = {},
        medPhepMedicalRecordsEntity = {},
        ecgUrlList = [],
        estimateDtoList = [],
        scenePhotoUrlList = [],
        sceneVideoUrlList = []
      } = cleanDetail
      const { otherCheck, bloodglucose } = medPhepMedicalRecordsEntity

      return {
        otherCheck,
        ecgUrlList,
        bloodglucose,
        poct: {
          poctUrlList,
          ...medPhepPoctEntity
        },
        scenePhotoUrlList,
        sceneVideoUrlList,
        ti: estimateDtoList.find((el) => el.name === 'ti'),
        gcs: estimateDtoList.find((el) => el.name === 'gcs'),
        chestPain: estimateDtoList.find((el) => el.name === 'chestPain'),
        killip: estimateDtoList.find((el) => el.name === 'killip'),
        fast: estimateDtoList.find((el) => el.name === 'fast')
      }
    },
    form2detail(form) {
      return {
        medPhepMedicalRecordsEntity: {
          patientId: this.patientId,
          recordId: this.recordId,
          otherCheck: form.otherCheck,
          bloodglucose: form.bloodglucose
        }
      }
    },
    onSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const payload = this.form2detail(this.form)
          this.$emit('save', payload)
        }
      })
    }
  }
}
</script>
