<template>
  <med-view-container @return="handleBack" title="预检分诊">
    <template #bottom-part>
      <van-button
        class="save-btn"
        block
        round
        type="info"
        icon-position="center"
        size="normal"
        @click.stop="handleBind"
      >
        &nbsp;&nbsp; 建档 &nbsp;&nbsp;
      </van-button>
    </template>
    <div class="med-view-wrapper scroll-view">
      <van-collapse v-model="exhibit">
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
                {{ conversionOne(paitInfo.sex, dictionary.genderDict) }}
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
              <span>{{ paitInfo.resetLevel }}级</span>
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
              <span
                >{{ paitInfo?.mdaVitalSigns?.bp?.sp }} /
                {{ paitInfo?.mdaVitalSigns?.bp?.dp }}</span
              >
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
    ...mapGetters(['dictionary'])
  },
  mounted() {
    this.getPushPaitInfo()
  },
  beforeRouteLeave(to, from, next) {
    const keepPath = ['/patient/document/addInformation']
    if (keepPath.includes(to.path)) {
      from.meta.keepAlive = true
    } else {
      const vnode = this.$vnode
      const parentVnode = vnode && vnode.parent
      if (
        parentVnode &&
        parentVnode.componentInstance &&
        parentVnode.componentInstance.cache
      ) {
        var key =
          vnode.key == null
            ? vnode.componentOptions.Ctor.cid +
              (vnode.componentOptions.tag
                ? `::${vnode.componentOptions.tag}`
                : '')
            : vnode.key
        var cache = parentVnode.componentInstance.cache
        var keys = parentVnode.componentInstance.keys
        if (cache[key]) {
          this.$destroy()
          // remove key
          if (keys.length) {
            var index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          cache[key] = null
        }
      }
    }
    next()
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    async getPushPaitInfo() {
      const patientHistory = this.$route.query.patientHistory || {}
      const jzVisitId = patientHistory?.relationId
      var params = {
        hospitalId: this.hospitalAndArea(),
        jzVisitId
      }
      const res = await this.$api.preHospitalPush.getPushPaitInfo(params)
      if (res.status === 200 && res.result) {
        this.paitInfo = { ...patientHistory, ...res.result }
      }
    },
    // value转换汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    async handleBind() {
      try {
        const item = this.paitInfo
        const type = item.source === 'phep' ? 1 : 2
        if (!item.relationId) {
          throw new Error('没有relationId')
        }
        const p = {
          hospitalId: this.hospitalAndArea(),
          relationId: item.relationId,
          visitId: item.relationId,
          type
        }
        const res = await this.$api.service.getEmIdPatient(p)
        if (res.status === 200) {
        if (res.result.isRegister) {
          this.$toast('该患者已建档')
          } else {
            item.emId = res.result.emId
            this.$router.push({
              path: '/patient/document/addInformation',
              query: {
                from: 'import',
                patientHistory: { ...item, type }
              }
            })
          }
        } else {
          throw new Error(res.message || '接口异常')
        }
      } catch (err) {
        this.$notify(err.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
.scroll-view {
  max-height: calc(100vh - 4.1rem);
  overflow: auto;
}
</style>
