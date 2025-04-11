<template>
  <div>
    <med-subtitle title="冠脉造影" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.treatmentPci.approach"
          form-prop="treatmentPci.approach"
          :disabled="disabled"
          label="入路"
          :select-options="dictionary.routeDict"
          :rules="[
            { required: true, message: '请填写入路', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <med-checkbox-field
          v-model="data.treatmentPci.cagPosition"
          check-type="check"
          form-prop="treatmentPci.cagPosition"
          label="造影部位"
          :disabled="disabled"
          :select-options="dictionary.cagPositionDict"
          :rules="[
            { required: true, message: '请填写造影部位', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="8">
        <div class="part-wrapper">
          <el-image :src="require('@/assets/images/pci.png')" />
          <div :class="'part-point one ' + selected('01')" @click="check('01')">1</div>
          <div :class="'part-point two ' + selected('02')" @click="check('02')">2</div>
          <div :class="'part-point three ' + selected('03')" @click="check('03')">3</div>
          <div :class="'part-point four ' + selected('04')" @click="check('04')">4</div>
          <div :class="'part-point five ' + selected('05')" @click="check('05')">5</div>
          <div :class="'part-point six ' + selected('06')" @click="check('06')">6</div>
          <div :class="'part-point seven ' + selected('07')" @click="check('07')">7</div>
          <div :class="'part-point eight ' + selected('08')" @click="check('08')">8</div>
          <div :class="'part-point nine ' + selected('09')" @click="check('09')">9</div>
          <div :class="'part-point ten ' + selected('10')" @click="check('10')">10</div>
          <div :class="'part-point eleven ' + selected('11')" @click="check('11')">11</div>
          <div :class="'part-point twelve ' + selected('12')" @click="check('12')">12</div>
          <div :class="'part-point thirteen ' + selected('13')" @click="check('13')">13</div>
          <div :class="'part-point fourteen ' + selected('14')" @click="check('14')">14</div>
          <div :class="'part-point fifteen-l ' + selected('15')" @click="check('15')">15</div>
          <div :class="'part-point fifteen-r ' + selected('15')" @click="check('15')">15</div>
        </div>
      </el-col>
    </el-row>
    <el-row v-for="(item,index) in data.treatmentPciPartList" :key="item.partId" :gutter="24">
      <el-col :span="24">
        <cagpart
          v-if="showCagPostion(item.partId)"
          :data="item"
          :index="index"
          :disabled="disabled"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import cagpart from './cagpart.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Cag',
  components: {
    cagpart
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
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
  computed: {
    ...mapGetters([
      'dictionary'
    ])
  },
  created() {

  },
  methods: {
    showCagPostion(testKey) {
      if (!this.data.treatmentPci.cagPosition) return false
      return this.data.treatmentPci.cagPosition?.indexOf(testKey) > -1
    },
    selected(val) {
      if (!this.data.treatmentPci) return ''
      if (this.data.treatmentPci.cagPosition?.indexOf(val) > -1) return 'selected'
    },
    check(val) {
      if (this.disabled) return
      if (!this.data.treatmentPci.cagPosition) this.data.treatmentPci.cagPosition = [val]
      if (this.data.treatmentPci.cagPosition?.indexOf(val) < 0) this.data.treatmentPci.cagPosition.push(val)
      else {
        const _set = new Set(this.data.treatmentPci.cagPosition)
        _set.delete(val)
        this.data.treatmentPci.cagPosition = [..._set]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.part-wrapper {
  position: relative;

  .part-point {
    position: absolute;
    border: 1px solid;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    background: #fff;
  }

  .one {
    left: 100px;
    top: 75px;
  }

  .two {
    left: 50px;
    top: 184px;
  }

  .three {
    left: 102px;
    top: 291px;
  }

  .four {
    left: 155px;
    top: 346px;
  }

  .five {
    left: 282px;
    top: 42px;
  }

  .six {
    left: 359px;
    top: 88px;
  }

  .seven {
    left: 414px;
    top: 192px;
  }

  .eight {
    left: 401px;
    top: 304px;
  }

  .nine {
    left: 432px;
    top: 130px;
  }

  .ten {
    left: 448px;
    top: 238px;
  }

  .eleven {
    left: 262px;
    top: 104px;
  }

  .twelve {
    left: 293px;
    top: 157px;
  }

  .thirteen {
    left: 236px;
    top: 203px;
  }

  .fourteen {
    left: 290px;
    top: 232px;
  }

  .fifteen-l {
    left: 190px;
    top: 294px;
  }

  .fifteen-r {
    left: 249px;
    top: 281px;
  }

  .selected {
    background: #0213ff;
    color: #fff
  }
}
</style>
