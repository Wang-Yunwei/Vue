<template>
  <div class="piat">
    <van-collapse v-model="active">
      <van-collapse-item v-for="(item, index) in list" :key="index" :title="item.title" :name="index">
        <div class="content">
          <p v-for="(itemA, indexA) in item.list" :key="indexA" style="margin-bottom: 0.5rem;">
            <span>{{ itemA.label }}</span>
            <span class="value">{{ itemA.value }}</span>
          </p>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  name: 'piat',
  props: {
    dto: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      active: [0, 1, 2],
      form: {}
    }
  },
  mounted() {
    this.details()
  },
  computed: {
    list() {
      return [
        {
          title: '基本信息',
          list: [
            { label: '分诊时间', value: this.form.triageTime },
            { label: '急诊编号', value: this.form.emergencyId },
            { label: '卡号', value: this.form.citizenCard },
            { label: '姓名', value: this.form.name },
            {
              label: '性别',
              value:
                this.form.sex === '1'
                  ? '男'
                  : this.form.sex === '2'
                    ? '女'
                    : '未知'
            },
            { label: '年龄', value: this.form.ageDesc },
            { label: '绿色通道', value: this.form.greenChannel },
            { label: '主诉', value: this.form.patientSay },
            { label: '分诊级别', value: this.form.resetLevel ? this.form.resetLevel + ' 级' : '' }
          ]
        },
        {
          title: '生命体征',
          list: [
            { label: '意识', value: this.form.triageSenceDesc },
            {
              label: '呼吸（次/分）',
              value:
                this.form.mdaVitalSigns && this.form.mdaVitalSigns.r
                  ? this.form.mdaVitalSigns.r.value
                  : ''
            },
            {
              label: '脉搏 （次/分）',
              value:
                this.form.mdaVitalSigns && this.form.mdaVitalSigns.p
                  ? this.form.mdaVitalSigns.p.value
                  : ''
            },
            {
              label: '血压（mmHg）',
              value:
                this.form.mdaVitalSigns && this.form.mdaVitalSigns.bp
                  ? this.form.mdaVitalSigns.bp.value
                  : ''
            },
            {
              label: '血氧 （%）',
              value:
                this.form.mdaVitalSigns && this.form.mdaVitalSigns.spo2
                  ? this.form.mdaVitalSigns.spo2.value
                  : ''
            }
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
    details() {
      this.$api.piatDetails(this.dto).then(res => {
        if (res.code === '000000') {
          this.form = res.body
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
  height: calc(100vh - 4rem);
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
