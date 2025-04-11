<template>
  <div>
    <el-form :inline="true" :model="searchparam" class="demo-form-inline">
      <!-- <el-form-item v-if="showKeyItem" label="所有指标">
        <el-select v-model="searchparam.isUpToStandard" placeholder="所有指标" collapse-tags style="width:120px" @change="onSubmit(6)">
          <el-option v-for="d in indicatorsDic" :key="d.text + d.value" :label="d.text" :value="d.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item v-if="showKeyItem">
        <el-checkbox v-model="searchparam.isKeyIndex" @change="onSubmit(6)">关键指标</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button :type="buttonMonth" @click="onSubmit(1)">近3月</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :type="buttonSixMonth" @click="onSubmit(2)">近6月</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :type="buttonYear" @click="onSubmit(3)">近1年</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :type="buttonCustom" @click="onSubmit(4)">自定义</el-button>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="searchparam.daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="!searchVisible"
          @change="onSubmit(5)"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'SearchBarAianalysis',
  props: {
    showKeyItem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchparam: {
        name: '',
        isKeyIndex: false,
        daterange: [moment(moment(new Date()).format('YYYY-MM-DD')).add(-2, 'months').format('YYYY-MM-01'),
          moment(new Date()).format('YYYY-MM-DD')]
      },
      searchVisible: false,
      buttonMonth: 'primary',
      buttonSixMonth: 'default',
      buttonYear: 'default',
      buttonCustom: 'default',
      indicatorsDic: [
        { text: '所有指标', value: '' },
        { text: '符合指标', value: '1' },
        { text: '不符合指标', value: '2' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'hospitalArea',
      'dictionary'
    ])
  },
  mounted() {
  },
  methods: {
    setButtonType(type) {
      if (type === 1) {
        this.buttonMonth = 'primary'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'default'
        this.buttonCustom = 'default'
      } else if (type === 2) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'primary'
        this.buttonYear = 'default'
        this.buttonCustom = 'default'
      } else if (type === 3) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'primary'
        this.buttonCustom = 'default'
      } else if (type === 4) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'default'
        this.buttonCustom = 'primary'
      }
    },
    onSubmit(type) {
      this.setButtonType(type)
      if (type === 1) {
        this.searchVisible = false
        this.searchparam.daterange = [moment(moment(new Date()).format('YYYY-MM-DD')).add(-2, 'months').format('YYYY-MM-01'),
          moment(new Date()).format('YYYY-MM-DD')]
      } else if (type === 2) {
        this.searchVisible = false
        this.searchparam.daterange = [moment(moment(new Date()).format('YYYY-MM-DD')).add(-5, 'months').format('YYYY-MM-01'),
          moment(new Date()).format('YYYY-MM-DD')]
      } else if (type === 3) {
        this.searchVisible = false
        this.searchparam.daterange = [moment(moment(new Date()).format('YYYY-MM-DD')).add(-11, 'months').format('YYYY-MM-01'),
          moment(new Date()).format('YYYY-MM-DD')]
      } else if (type === 4) {
        this.searchVisible = true
        return
      } else if (type === 5) {
        const startDate = moment(this.searchparam.daterange[0]).format('YYYY-MM-DD')
        const endDate = moment(this.searchparam.daterange[1]).format('YYYY-MM-DD')
        this.searchparam.daterange = [startDate, endDate]
      }
      this.$emit('doSearch', this.searchparam)
    }
  }
}
</script>
