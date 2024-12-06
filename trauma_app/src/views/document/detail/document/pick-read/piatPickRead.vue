<template>
  <div class="piat">
    <van-empty v-if="emptData" description="未查询到预检分诊信息" :image="require('@assets/image/empty.png')" />
    <van-collapse v-model="active" v-else>
      <van-collapse-item v-for="(item, index) in list" :key="index" :title="item.title" :name="index">
        <div class="content">
          <p v-for="(itemA, indexA) in item.list" :key="indexA" style="margin-bottom: 0.4rem;">
            <span>{{ itemA.label }}</span>
            <span class="value">{{ itemA.value }}</span>
          </p>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'piatPickRead',
  props: {
    dto: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      emptData: true, // 判断是否有数据
      active: [0, 1, 2],
      form: {}
    }
  },
  activated() {
    this.getDetails()
  },
  mounted() {
    this.getDetails()
  },
  computed: {
    ...mapGetters(['emId', 'hospitalId', 'hospitalArea']),
    list() {
      return [
        {
          title: '基本信息',
          list: [
            { label: '分诊时间', value: this.form.triageTime },
            { label: '急诊编号', value: this.form.emergencyId },
            { label: '卡号', value: this.form.citizenCard },
            { label: '姓名', value: this.form.name },
            { label: '性别', value: this.form.sex === '1' ? '男' : this.form.sex === '2' ? '女' : '未知' },
            { label: '年龄', value: this.form.age },
            { label: '绿色通道', value: this.form.greenChannel },
            { label: '主诉', value: this.form.patientSay },
            { label: '分诊级别', value: this.form.resetLevel ? this.form.resetLevel + ' 级' : '' }
          ]
        },
        {
          title: '生命体征',
          list: [
            { label: '意识', value: this.form.triageSenceDesc },
            { label: '呼吸（次/分）', value: this.form.mdaVitalSigns && this.form.mdaVitalSigns.r ? this.form.mdaVitalSigns.r.value : '' },
            { label: '脉搏（次/分）', value: this.form.mdaVitalSigns && this.form.mdaVitalSigns.p ? this.form.mdaVitalSigns.p.value : '' },
            { label: '血压（mmHg）', value: this.form.mdaVitalSigns && this.form.mdaVitalSigns.bp ? this.form.mdaVitalSigns.bp.value : '' },
            { label: '血氧（%）', value: this.form.mdaVitalSigns && this.form.mdaVitalSigns.spo2 ? this.form.mdaVitalSigns.spo2.value : '' },
            { label: '体温（℃）', value: this.form.mdaVitalSigns && this.form.mdaVitalSigns.t ? this.form.mdaVitalSigns.t.value : '' }
          ]
        },
        {
          title: '患者去向',
          list: [
            { label: '就诊科室', value: this.form.deptName },
            { label: '患者分诊去向', value: this.form.outWay }
          ]
        }
      ]
    }
  },
  methods: {
    getDetails() {
      this.$api.getTriagePreview({
        emId: this.emId,
        hospitalId: this.hospitalId + '_' + this.hospitalArea
      }).then(res => {
        if (res.code === '000000') {
          if (res.body && Object.keys(res.body).length > 0) {
            this.emptData = false
            this.form = res.body
          } else {
            this.emptData = true
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.piat {
  width: 98%;
  margin: 0 auto;
  height: calc(100vh - 0.1rem);
  overflow: auto;
  font-weight: 700;
  font-size: 0.4rem;

  .content {
    margin: 0.2rem 0 0 0.4rem;
    color: black;
    font-size: 0.4rem;
    font-weight: 400;

    .value {
      position: absolute;
      left: 40%;
      color: rgb(136, 134, 134);
    }
  }
}
</style>
