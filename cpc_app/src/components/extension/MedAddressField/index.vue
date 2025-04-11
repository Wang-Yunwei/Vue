<template>
  <div class="med-address-wrapper">
    <med-hint-field
      v-bind="$props"
      :link="!disabled && !readonly"
      link-icon="arrow-down"
      readonly
    >
      <template #right-icon>
        <div class="med-address-location" @click.stop="onLocationClick">
          <van-icon name="location-o" />
          <div>定位</div>
        </div>
      </template>
      <template #input-part>
        <span class="med-address-input-part">
          <van-field
            v-model="selectName"
            readonly="readonly"
            :disabled="disabled"
            input-align="left"
            :placeholder="addressPlaceholder"
            @click.stop="onFieldClick"
          >
          </van-field>
        </span>
      </template>
    </med-hint-field>
    <med-popup
      v-model="show"
      :duration="0.15"
      position="bottom"
      v-if="!disabled && !readonly"
      :style="{ height: '40%' }"
      @click.stop
    >
      <van-area
        :title="label"
        :area-list="areaList"
        :value="selectValue"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </med-popup>
  </div>
</template>

<script>
import MedHintField from '../../common/MedHintField/index.jsx'
import { areaList } from '@vant/area-data'
import parseJson from 'parse-json'
import { resolve } from 'path'
export default {
  name: '',
  props: {
    ...MedHintField.props,
    areaList: {
      type: Object,
      default: () => {
        Reflect.deleteProperty(areaList.county_list, '320571')
        return areaList
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  data() {
    return {
      selectValue: this.value,
      selectName: '',
      show: false,
      address: {},
      addressInfo: ''
    }
  },
  computed: {
    addressPlaceholder() {
      if (this.disabled) return ''
      if (this.placeholder) return this.placeholder
      return '请选择' + (this.label || '')
    }
  },
  mounted() {
    this.selectName = this.buildNameByCode(this.selectValue)

    // console.log('isLocationEnable', this.$bridge.isLocationEnable())
    this.$bridge.isLocationEnable().then(data => {
      console.log('isLocationEnable', data)
      if (data === '1') {
        this.getGps()
      }
    })

    // this.selectValue = this.buildSelectValue(this.addres)

    this.$forceUpdate()
  },
  destroyed() {
    this.$bridge.stopGPS()
  },
  methods: {
    getGps() {
      return new Promise((resolve, reject) => {
        this.$bridge.startGPS()
        this.$bridge.onLocation(data => {
          const json = parseJson(data)
          const location = `${json.longitude},${json.latitude}`

          this.$bridge.stopGPS()

          if (json && Object.keys(json).length > 0) {
            this.$api.service
              .regeo(location)
              .then(res => {
                console.log('regeo', res)
                this.address = res.result
                if (this.address) {
                  let adds = this.address
                  adds = adds.formattedAddress
                    .replace(adds.province, '')
                    .replace(adds.city, '')
                    .replace(adds.district, '')

                  this.addressInfo = adds

                  // this.$emit('_change', this.selectValue)
                  this.$emit('onLocation', this.addressInfo)
                  resolve(1)
                } else {
                  reject(new Error('获取地理信息接口出错'))
                }
              })
              .catch(function(error) {
                reject(error)
              })
          } else {
            reject(new Error('获取不到地理信息'))
          }
        })
      })
    },
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    onLocationClick() {
      if (this.readonly || this.disabled) return
      // 定位
      this.getGps().then(() => {
        this.selectValue = this.buildSelectValue(this.address)
        this.selectName = this.buildNameByCode(this.selectValue)
        this.$emit('_change', this.selectValue)
        this.$emit('onHandLocation', this.addressInfo)
      })
    },
    onConfirm(selected) {
      // this.selectName = this.buildSelectedName(selected)
      const lastest = this.buildAreaCode(selected)
      this.selectName = this.buildNameByCode(lastest)
      this.$emit('_change', lastest)
      this.$emit('change', lastest)
      this.$emit('confirm', lastest)
      this.$emit('select', selected)
      this.show = false
    },
    buildNameByCode(selected) {
      if (!selected || selected.length !== 6) return ''
      const provinceCode = selected.slice(0, 2).padEnd(6, '0')
      const provinceName = this.areaList['province_list'][provinceCode]
      const cityCode = selected.slice(0, 4).padEnd(6, '0')
      const cityName = this.areaList['city_list'][cityCode]
      const countyName = this.areaList['county_list'][selected]
      if (provinceName === cityName) return `${cityName}${countyName}`
      return `${provinceName}${cityName}${countyName}`
    },
    buildSelectedName(selected) {
      let val = ''
      if (!selected) return val
      selected.forEach(element => {
        val += element.name
      })
      return val
    },
    buildAreaCode(selected) {
      if (!selected) return ''
      const lastest = selected.pop()
      if (!lastest) return ''
      return lastest.code
    },
    buildSelectValue(addres) {
      const provinceList = this.areaList['province_list']
      const cityList = this.areaList['city_list']
      const countyList = this.areaList['county_list']
      // for (let i = 0; i < countyList.length; i++) {
      //   console.log('for', i, countyList[i])
      // }

      let code = ''
      for (const c in provinceList) {
        if (provinceList[c] === addres.province) {
          code = c.slice(0, 2)
          break
        }
      }

      if (code === '') {
        return
      }

      for (const c in cityList) {
        if (cityList[c] === addres.city) {
          if (c.slice(0, 2) === code) {
            code = c.slice(0, 4)
            break
          }
        }
      }

      if (code.length < 4) {
        return code.padEnd(6, '0')
      }

      for (const c in countyList) {
        if (countyList[c] === addres.district) {
          if (c.slice(0, 4) === code) {
            code = c
            break
          }
        }
      }

      return code.padEnd(6, '0')
    },
    onCancel() {
      this.show = false
    }
  },
  watch: {
    value(val) {
      this.selectValue = val
      this.selectName = this.buildNameByCode(this.selectValue)
    },
    address(val) {
      if (!this.value && val && Object.keys(val).length > 0) {
        this.selectValue = this.buildSelectValue(val)
        this.selectName = this.buildNameByCode(this.selectValue)
        this.$emit('_change', this.selectValue)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.med-address-wrapper {
  .med-address-location {
    display: flex;
    flex-direction: row;
  }
  .med-address-input-part {
    display: flex;
    align-items: center;

    .van-cell {
      padding: 0;
    }
  }
}
</style>
