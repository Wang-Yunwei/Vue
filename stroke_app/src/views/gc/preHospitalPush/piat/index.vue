<template>
  <med-view-container @return="jumpToDetails" title="预检分诊">
    <div class="med-view-wrapper scroll-view">
      <van-collapse v-model="exhibit" @change="collapseChange">
        <van-collapse-item title="基本信息" name="exhibit1">
          <div class="center">
            <p>
              <span>分诊时间</span>
              <span>{{ paitInfo.triageTime }}</span>
            </p>
            <p>
              <span>急诊编号</span>
              <span>{{ paitInfo.emergencyId }}</span>
            </p>
            <p>
              <span>卡号</span>
              <span>{{ paitInfo.citizenCard }}</span>
            </p>
            <p>
              <span>姓名</span>
              <span>{{ paitInfo.name }}</span>
            </p>
            <p>
              <span>性别</span>
              <span>
                {{ conversionOne(paitInfo.sex, dicData.genderOpts) }}
              </span>
            </p>
            <p>
              <span>年龄</span>
              <span>{{ paitInfo.age }}</span>
            </p>
            <p>
              <span>绿色通道</span>
              <span>{{ paitInfo.greenChannel }}</span>
            </p>
            <p>
              <span>主诉</span>
              <span>{{ paitInfo.triageComplaint }}</span>
            </p>
            <p>
              <span>分诊级别</span>
              <span v-if="paitInfo?.resetLevel">
                {{ paitInfo.resetLevel }}级
              </span>
            </p>
          </div>
        </van-collapse-item>
        <van-collapse-item title="生命体征" name="exhibit2">
          <div class="center">
            <p>
              <span>意识</span>
              <span>{{ paitInfo.triageSenceDesc }}</span>
            </p>
            <p>
              <span>呼吸（次/分）</span>
              <span>{{ paitInfo?.mdaVitalSigns?.r?.value }}</span>
            </p>
            <p>
              <span>脉搏（次/分）</span>
              <span>{{ paitInfo?.mdaVitalSigns?.p?.value }}</span>
            </p>
            <p>
              <span>血压（mmHg）</span>
              <span v-if="paitInfo?.mdaVitalSigns?.bp?.sp">
                {{ paitInfo?.mdaVitalSigns?.bp?.sp }} /
                {{ paitInfo?.mdaVitalSigns?.bp?.dp }}
              </span>
            </p>
            <p>
              <span>血氧（%）</span>
              <span>{{ paitInfo?.mdaVitalSigns?.spo2?.value }}</span>
            </p>
            <p>
              <span>体温（°C）</span>
              <span>{{ paitInfo?.mdaVitalSigns?.t?.value }}</span>
            </p>
          </div>
        </van-collapse-item>
        <van-collapse-item title="患者去向" name="exhibit3">
          <div class="center">
            <p>
              <span>就诊科室</span>
              <span>{{ paitInfo.deptName }}</span>
            </p>
            <p>
              <span>患者分诊去向</span>
              <span>{{ paitInfo.outWay }}</span>
            </p>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <van-button
      class="save-btn"
      block
      round
      type="info"
      icon-position="center"
      size="normal"
      @click.stop="handleBind()"
    >
      &nbsp;&nbsp; 建档 &nbsp;&nbsp;
    </van-button>
  </med-view-container>
</template>

<script>
import hospitalMixin from '@mixins/hospitalMixin'
import { mapGetters } from 'vuex'
import { PaitPreview } from '@model/commonModel'
export default {
  name: 'pait',
  mixins: [hospitalMixin],
  data() {
    return {
      paitInfo: PaitPreview(),
      exhibit: ['exhibit1', 'exhibit2', 'exhibit3']
    }
  },
  computed: {
    ...mapGetters(['dicData'])
  },
  mounted() {
    this.getPushPaitInfo()
  },
  methods: {
    // 返回主页面
    jumpToDetails() {
      this.$router.push({
        path: '/gc/preHospitalPush'
      })
    },
    collapseChange(val) {
      if (val) {
      }
    },
    getPushPaitInfo() {
      var params = {
        hospitalId: this.hospitalAndArea(),
        jzVisitId: this.$route.query.relationId
      }
      this.$api.preHospitalPush
        .getPushPaitInfo(params)
        .then(res => {
          if (res.status === 200 && res.result) {
            this.paitInfo = res.result
            console.log('preHospitalPush', this.paitInfo)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // value转换汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    handleBind() {
      this.$router.push({
        name: 'createPatientHistory',
        query: { patientHistory: this.$route.query }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../firstAid/index.less";
.scroll-view {
  max-height: calc(100vh - 4.1rem);
  overflow: auto;
}
</style>
