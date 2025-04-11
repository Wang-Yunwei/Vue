<template>
  <med-view-container :title="'绑定患者'" @return="$emit('backClick')">
    <van-dropdown-menu class="top" :close-on-click-outside="false">
      <van-dropdown-item ref="name">
        <template #title>
          <span>{{ search.patientName ? search.patientName : "姓名" }}</span>
        </template>
        <van-search
          v-model="search.patientName"
          show-action
          placeholder="请输入姓名查询"
          @search="onSearchName"
        >
          <template #action>
            <div @click="onSearchName">搜索</div>
          </template>
        </van-search>
      </van-dropdown-item>
      <van-dropdown-item
        ref="type"
        v-model="search.type"
        :options="typeOptions"
        @change="onTypeChange"
      >
        <template #title>
          <span>{{
            search.type ? convert(search.type, typeOptions) : "类型"
          }}</span>
        </template>
      </van-dropdown-item>
      <van-dropdown-item title="时间" ref="time">
        <template #title>
          <span>{{
            search.time ? convert(search.time, timeOption) : "时间"
          }}</span>
        </template>
        <van-cell
          clickable
          class="van-dropdown-item__option"
          :class="{
            'van-dropdown-item__option--active': item.value === search.time,
            disabled: item.disabled
          }"
          v-for="item in timeOption"
          :key="item.value"
          :title="item.text"
          @click="onTimeOptClick(item.value)"
        >
          <i
            v-if="item.value === search.time"
            class="van-icon van-icon-success van-dropdown-item__icon"
          />
        </van-cell>
      </van-dropdown-item>
    </van-dropdown-menu>
    <van-row gutter="24" class="condition-date">
      <van-col span="11">
        <med-date-picker
          v-model="search.fromDate"
          displayFormatter="YYYY-MM-DD"
          placeholder="开始日期"
          type="date"
          :disabled="timeDisabled"
          minDate="2021-01-01"
          @confirm="onRangeChange('start', $event)"
        />
      </van-col>
      <van-col span="2">
        <div>到</div>
      </van-col>
      <van-col span="11">
        <med-date-picker
          v-model="search.toDate"
          displayFormatter="YYYY-MM-DD"
          placeholder="结束日期"
          type="date"
          :disabled="timeDisabled"
          minDate="2021-01-01"
          @confirm="onRangeChange('end', $event)"
        />
      </van-col>
    </van-row>
    <!-- 下拉刷新,滚动加载 -->
    <van-list
      v-model="listLoading"
      offset="1"
      :immediate-check="false"
      :finished="listFinished"
      :finished-text="list.length ? '没有更多了' : ''"
      @load="onLoad"
      class="scroll-box"
    >
      <van-pull-refresh
        v-model="addRefreshing"
        success-text="刷新成功"
        @refresh="onRefresh"
      >
        <van-checkbox-group v-model="checked" :max="1">
          <van-cell
            class="list-item"
            v-for="item in list"
            clickable
            :key="item.relationId"
            @click="onSelect(item)"
          >
            <div>
              <div class="flex-c-s">
                <div class="name">{{ item.name }}</div>
                <div :class="genderClass(item.gender)"></div>
                <div class="age">{{ item.age }}岁</div>
                <div class="badge">{{ item.diagnosis }}</div>
              </div>
              <!-- 急诊列表就是分诊时间，门诊就取门诊时间，急救是呼救时间，住院是入院时间           -->
              <div class="flex-c-b">
                <div class="time">
                  {{ conversionOne(search.type, timeNameList) }}:
                  {{ item.time }}
                </div>
                <div>{{ item.licensePlate || "" }}</div>
              </div>
            </div>
          </van-cell>
        </van-checkbox-group>
      </van-pull-refresh>
    </van-list>
  </med-view-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { throttle } from 'lodash'
import hospitalMixin from '@mixins/hospitalMixin'

export default {
  name: 'BindPatient',
  components: {},
  mixins: [hospitalMixin],
  props: {
    patientName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: {
        hospitalAndArea: '',
        isTagNo: '1',
        type: '2',
        time: '0',
        patientName: this.patientName,
        fromDate: '',
        toDate: ''
      },
      typeOptions: [
        { text: '急救', value: '1' },
        { text: '急诊', value: '2' },
        { text: '门诊', value: '3' },
        { text: '住院', value: '4' }
      ],

      timeDisabled: true,
      list: [],
      listLoading: false,
      listFinished: false,
      addRefreshing: false,
      current: 0,
      followupList: [],
      timeNameList: [
        { label: '分诊时间', value: '2' },
        { label: '门诊时间', value: '3' },
        { label: '入院时间', value: '4' },
        { label: '呼救时间', value: '1' }
      ],
      checked: []
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'dictionary']),
    timeOption() {
      return [
        { text: '近三天', value: '0' },
        { text: '近一周', value: '1', disabled: this.search.type === '1' },
        { text: '自定义', value: '2' }
      ]
    }
  },
  mounted() {
    this.search.hospitalId = this.hospitalId
    this.onTimeOptSelect(this.search.time)
  },
  methods: {
    onRangeChange(which, time) {
      const { type, fromDate, toDate } = this.search
      if (type === '1') {
        const diff =
          this.$moment(toDate).diff(this.$moment(fromDate), 'days') || 0
        const illegalRange = diff > 2 || diff < 0
        // 急救类型下,修改开始结束时间不能超过三天
        if (which === 'start' && time && illegalRange) {
          this.$set(
            this.search,
            'toDate',
            this.$moment(time)
              .endOf('day')
              .add(2, 'days')
              .format('YYYY-MM-DD HH:mm:ss')
          )
        } else if (which === 'end' && time && illegalRange) {
          this.$set(
            this.search,
            'fromDate',
            this.$moment(time)
              .startOf('day')
              .add(-2, 'days')
              .format('YYYY-MM-DD HH:mm:ss')
          )
        }
      }
      this.search.toDate = this.$moment(this.search.toDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      this.onSubmit()
    },
    // value转换汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    genderClass(sex) {
      let className = 'gender'
      switch (sex) {
        case '1':
          className += ' male iconfont'
          break
        case '2':
          className += ' female iconfont'
          break
        default:
          break
      }
      return className
    },
    convert(value, dic) {
      if ([undefined, null, ''].includes(value)) return ''
      if (!dic || !Array.isArray(dic)) return value
      return (dic.find(v => v.value === value) || { text: '' }).text
    },
    onSearchName() {
      this.$refs.name.toggle()
      this.onSubmit()
    },
    // 类型变更
    onTypeChange(type) {
      if (type === '1') {
        // 急救类型仅支持查三天
        this.search.time = '0'
        this.onTimeOptSelect('0')
      } else {
        this.onSubmit()
      }
    },
    onTimeOptClick(val) {
      this.search.time = val
      this.onTimeOptSelect(val)
      this.$refs.time.toggle()
    },
    onTimeOptSelect(val) {
      if (val === '0') {
        // 三天
        this.timeDisabled = true
        this.search.fromDate = this.$moment()
          .startOf('day')
          .subtract(2, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
        this.search.toDate = this.$moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.onSubmit()
      } else if (val === '1') {
        // 一周
        this.timeDisabled = true
        this.search.fromDate = this.$moment()
          .startOf('day')
          .subtract(1, 'weeks')
          .format('YYYY-MM-DD HH:mm:ss')
        this.search.toDate = this.$moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.onSubmit()
      } else {
        // 自定义
        this.timeDisabled = false
        this.onSubmit()
      }
    },
    onSubmit() {
      this.followupList = []
      this.list = []
      this.current = 1
      this.onSearch()
    },
    loading(duration = 0) {
      this.$toast.loading({
        message: '加载中',
        forbidClick: true,
        duration: duration // 值为 0 时，loading 不会消失
      })
    },
    hideLoading() {
      this.$toast.clear()
    },
    fail(message) {
      this.$toast.fail({
        duration: 2000,
        forbidClick: true,
        message: message
      })
    },
    /**
     * 点击列表项目
     * @param item
     */
    onSelect(item) {
      this.checked = [item.relationId]
      this.$forceUpdate()
      this.$dialog
        .confirm({
          title: '提示',
          message: `确认绑定患者【${item.name}】吗?`,
          confirmButtonColor: '#5e74fe'
        })
        .then(async () => {
          if (item.relationId) {
            const params = {
              hospitalId: this.hospitalAndArea(),
              relationId: item.relationId,
              type: this.search.type
            }
            // 根据急诊号(急诊分诊凭条)，是否已经建档
            const response = await this.$api.basicInfo.getEmIdPatient(params)
            if (response.status === 200 && response.result) {
              this.$toast('该患者已建档')
              return
            }
          }
          this.$toast.loading({
            message: '绑定中...',
            forbidClick: true,
            duration: 0 // 值为 0 时，loading 不会消失
          })
          this.$api.thirdParty
            .initWithDepartment({
              registId: this.$route.query.registId,
              visitId: item.relationId,
              department: this.search.type
            })
            .then(res => {
              console.log('bind', res)
              if (res.code === '0') {
                this.$toast.success({
                  message: '绑定成功',
                  forbidClick: true,
                  duration: 2000
                })
                this.$emit('success')
              } else {
                this.$toast.fail({
                  message: '绑定失败!' + res.message,
                  forbidClick: true,
                  duration: 2000
                })
              }
            })
            .finally(() => {
              this.checked = []
              this.$toast.clear()
            })
        })
        .catch(() => {
          this.checked = []
        })
    },
    onSearch() {
      const pageSize = 8
      const params = {
        ...this.search,
        hospitalAndArea: this.hospitalAndArea(),
        regId: undefined,
        current: this.current,
        pageSize: pageSize,
        time: undefined
        // mdtType: mdtType.stroke
      }
      this.loading()
      this.listLoading = true
      this.$api.thirdParty
        .getGcThirdPartyPatients(params)
        .then(res => {
          if (res.status === 200) {
            this.checked = []
            this.list.push(...res.result.records)
            // 如果查询出来的数据少于pageSize，说明数据已被查询完，则关闭查询接口
            if (res.result.records.length < pageSize) {
              this.listFinished = true
            } else {
              this.listFinished = false
            }
          } else {
            this.fail(res.message || '数据获取失败！！')
          }
        })
        .finally(() => {
          this.listLoading = false
          this.addRefreshing = false
          this.hideLoading()
        })
    },
    onLoad: throttle(function() {
      // 清空列表数据
      if (this.addRefreshing) {
        this.list = []
        this.current = 0
        this.addRefreshing = false
      }
      // 重新加载数据
      this.current++
      this.onSearch()
      this.listLoading = false
    }, 1000),
    onRefresh() {
      this.listFinished = false

      // 将 listLoading 设置为 true，表示处于加载状态
      this.listLoading = true
      this.onSubmit()
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  position: fixed;
  top: 146px;
  z-index: 9;
  left: 0;
  right: 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);

  /deep/ .van-dropdown-menu__bar {
    box-shadow: none;
  }
}

.condition-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  margin-top: 100px;
  position: fixed;
  z-index: 1;

  :deep(.van-field__control) {
    text-align: center;
  }
}

.scroll-box {
  margin-top: 184px;
  height: calc(100vh - 4.37rem);
  overflow: auto;
  /deep/ .van-pull-refresh {
    padding-bottom: 2.5rem;
  }
  /deep/ .van-pull-refresh__track {
    min-height: calc(100vh - 6rem);
  }
  /deep/ .van-list__finished-text {
    margin-top: -2.5rem;
    height: 0;
  }
}
.list-item {
  .flex-c-s > div:not(:last-child) {
    margin-right: 18px;
  }

  .name {
    font-size: 36px;
    color: #202020;
  }

  .gender {
    &:before {
      content: "未知";
    }

    &.male:before {
      content: "\e63d";
      font-size: 26px;
      font-weight: 800;
      color: #2b65f8;
    }

    &.female:before {
      content: "\e63a";
      font-size: 26px;
      font-weight: 800;
      color: #f86359;
    }
  }

  .age {
    color: #202020;
    font-size: 30px;
  }

  .badge {
    font-size: 30px;
    line-height: 42px;
    padding: 0 15px;
    border-radius: 21px;
    background: rgba(94, 116, 253, 0.1);
    color: #5e74fe;
    white-space: nowrap;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;

    &.from {
      font-size: 20px;

      &.first-aid {
        color: #e5adad;
        background: rgba(255, 83, 62, 0.1);
      }
    }
  }
  /deep/ .van-checkbox__label {
    width: 100%;
    margin-left: 28px;
  }

  .flex-c-b {
    padding-top: 16px;

    .time {
      font-size: 22px;
      color: #b5b5b5;
    }
  }
}
.van-dropdown-item__option.disabled {
  display: none;
}
</style>
