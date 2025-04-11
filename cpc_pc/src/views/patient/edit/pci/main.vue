<template>
  <div class="content-wrapper">
    <el-form
      ref="pciform"
      :model="data"
      label-width="80px"
      label-position="top"
    >
      <div>
        <pci
          v-if="bjPci"
          title="补救PCI"
          :data="data.treatmentPci"
          :disabled="disabled"
        />
        <pci
          v-if="rshPci"
          title="溶栓后介入"
          :data="data.treatmentPci"
          :disabled="disabled"
        />
        <operation
          v-if="zjPci || jjPci"
          :regist-id="data.regist.Id"
          :data="data.treatmentPci"
          :data-pci-part="data.treatmentPciPartList"
          :data-admission="data.admission"
          :disabled="disabled"
        />
        <cag :data="data" :disabled="disabled" />
        <instruments :data="data.treatmentPci" :disabled="disabled" />
      </div>
    </el-form>
  </div>
</template>

<script>
import operation from './operation'
import cag from './cag'
import instruments from './instruments'
import pci from './pci'
import { debounce } from 'lodash'
export default {
  name: 'PCI',
  components: {
    operation,
    cag,
    instruments,
    pci
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    bjPci: {
      required: false,
      type: Boolean
    },
    zjPci: {
      required: false,
      type: Boolean
    },
    rshPci: {
      required: false,
      type: Boolean
    },
    jjPci: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0
    }
  },
  created() {},
  methods: {
    save: debounce(function() {
      this.data.treatmentPci.registId = this.$route.query.registId
      this.$api.service.saveTreatmentPci(this.data.treatmentPci).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    savePciPart: debounce(function() {
      this.data.treatmentPciPartList.forEach((opt) => {
        opt.registId = this.$route.query.registId
      })
      this.$api.service
        .saveTreatmentPciPart(this.data.treatmentPciPartList)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    // onChanged(type) {
    //   if (type === 'treatmentPci') {
    //     this.save()
    //   } else if (type === 'treatmentPciPart') {
    //     this.savePciPart()
    //   }
    // },
    validate() {
      return new Promise((resolve, reject) => {
        const formRef = this.$refs['pciform']
        formRef.validate((valid, err) => {
          const errors = Object.keys(err).reduce((arr, key) => {
            const label = formRef.fields.find((f) => f.prop === key)?.label
            return arr.concat([
              {
                module: '介入',
                fieldName: label,
                message: '必填'
              }
            ])
          }, [])

          if (valid) {
            resolve(true)
          } else {
            reject({ errors })
          }
        })
      })
    },
    clearValidate() {
      this.$refs['pciform'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
