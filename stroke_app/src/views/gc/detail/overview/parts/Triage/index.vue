<template>
  <div class="task-preliminary-diagnosis-wrapper">
    <van-collapse
      v-if="Object.keys(triage).length > 0"
      v-model="exhibit"
      @change="collapseChange"
    >
      <van-collapse-item title="基本信息" name="exhibit1">
        <div class="center">
          <p>
            <span> 分诊时间</span>
            <span>{{ triage.triageTime }}</span>
          </p>
          <p>
            <span> 急诊编号</span>
            <span>{{ triage.emergencyId }}</span>
          </p>
          <p>
            <span>卡号</span>
            <span>{{ triage.citizenCard }}</span>
          </p>
          <p>
            <span>姓名</span>
            <span>{{ triage.name }}</span>
          </p>
          <p>
            <span>性别</span>
            <span>
              {{ conversionOne(triage.sex, dicData.genderOpts) }}
            </span>
          </p>
          <p>
            <span>年龄</span>
            <span>{{ triage.age }}</span>
          </p>
          <!-- <p>
            <span>职业</span>
            <span>{{ triage.PatJob }}</span>
          </p>
          <p>
            <span> 住址</span>
            <span>{{ triage.MailAddress }}</span>
          </p> -->
          <p>
            <span> 绿色通道</span>
            <span>{{ triage.greenChannel }}</span>
          </p>
          <p>
            <span>主诉</span>
            <span>{{ triage.triageComplaint }}</span>
          </p>
          <p>
            <span>分诊级别</span>
            <span v-if="triage?.resetLevel"> {{ triage.resetLevel }}级 </span>
          </p>
          <!-- <p>
            <span> 三无患者:</span>
            <span></span>
          </p>
          <p>
            <span> 其他:</span>
            <span></span>
          </p>
          <p>
            <span> 备注:</span>
            <span></span>
          </p> -->
        </div>
      </van-collapse-item>
      <van-collapse-item title="生命体征" name="exhibit2">
        <div class="center">
          <p>
            <span>意识</span>
            <span>{{ triage.triageSenceDesc }}</span>
          </p>
          <p>
            <span>呼吸（次/分）</span>
            <span>{{ triage?.mdaVitalSigns?.r?.value }}</span>
          </p>
          <p>
            <span>脉搏（次/分）</span>
            <span>{{ triage?.mdaVitalSigns?.p?.value }}</span>
          </p>
          <p>
            <span>血压（mmHg）</span>
            <span v-if="triage?.mdaVitalSigns?.bp?.sp">
              {{ triage?.mdaVitalSigns?.bp?.sp }} /
              {{ triage?.mdaVitalSigns?.bp?.dp }}</span
            >
          </p>
          <p>
            <span>血氧（%）</span>
            <span>{{ triage?.mdaVitalSigns?.spo2?.value }}</span>
          </p>
          <p>
            <span>体温（°C）</span>
            <span>{{ triage?.mdaVitalSigns?.t?.value }}</span>
          </p>
        </div>
      </van-collapse-item>
      <!-- <van-collapse-item title="患者评分:" name="exhibit3">
        <div class="center">
        </div>
      </van-collapse-item> -->
      <!-- <van-collapse-item title="知识库" name="exhibit4">
        <div class="center">
          <p>
            <span> 主诉</span>
            <span>{{ triage.patientSay }}</span>
          </p>
          <p>
            <span> 第二主诉:</span>
            <span></span>
          </p>
        </div>
      </van-collapse-item> -->
      <!-- <van-collapse-item title="分级" name="exhibit5">
        <div class="center">
          <p>
            <span>患者级别:</span>
            <span></span>
          </p>
        </div>
      </van-collapse-item> -->
      <van-collapse-item title="患者去向" name="exhibit3">
        <div class="center">
          <p>
            <span>就诊科室</span>
            <span>{{ triage.deptName }}</span>
          </p>
          <p>
            <span>患者分诊去向</span>
            <span>{{ triage.outWay }}</span>
          </p>
        </div>
      </van-collapse-item>
      <!-- <van-collapse-item title="到院信息" name="exhibit7">
        <div class="center">
          <p>
            <span>发病时间:</span>
            <span></span>
          </p>
          <p>
            <span> 发病地址:</span>
            <span></span>
          </p>
          <p>
            <span> 陪送人员:</span>
            <span></span>
          </p>
          <p>
            <span> 联系电话:</span>
            <span></span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="流行病学史" name="exhibit8">
        <div class="center">
          <p>
            <span>有无流行病学史:</span>
            <span></span>
          </p>
          <p>
            <span> 发热时间:</span>
            <span></span>
          </p>
          <p>
            <span> 近14天疫区旅游史:</span>
            <span></span>
          </p>
          <p>
            <span> 24小时体温超过38度:</span>
            <span></span>
          </p>
          <p>
            <span> 入院前3天有发热病学史:</span>
            <span></span>
          </p>
          <p>
            <span> 死亡或患者动物接触史:</span>
            <span></span>
          </p>
        </div>
      </van-collapse-item> -->
    </van-collapse>
    <van-empty
      :image="require('@assets/image/empty.png')"
      description="未查询到预检分诊信息"
      v-if="Object.keys(triage).length === 0"
    />
  </div>
</template>
<script>
import hospitalMixin from '@mixins/hospitalMixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [hospitalMixin],
  props: {},
  data() {
    return {
      diagnosisTwo: '',
      infoComingType: this.$route.query.infoComingType,
      emId: this.$route.query.emId,
      infectHistory: '',
      otherList: [
        { label: '脉搏', name: '生命体征', value: 'p' },
        { label: '心率', name: '生命体征', value: 'hr' },
        { label: '血压', name: '生命体征', value: 'bp' },
        { label: '呼吸', name: '生命体征', value: 'r' },
        { label: '体温', name: '生命体征', value: 't' },
        { label: '血氧饱和度', name: '生命体征', value: 'spo2' }
      ],
      exhibit: ['exhibit1', 'exhibit2', 'exhibit3'],
      triage: {}
    }
  },
  async created() {
    // 查询分诊信息
    this.getTriagePreview()
  },
  computed: {
    ...mapGetters(['hospitalId', 'dicData'])
  },
  methods: {
    // todo :获取采集设备：字段信息为空，分诊暂时没有和硬件对接
    // 查询分诊 信息
    getTriagePreview() {
      /* this.$api.preview.getTriagePreview(this.regNo).then(res => {
         console.log('分诊信息返回结果为', res)
         this.triage = res.result
         this.triage.scores = res.result.scores
       }) */
      this.$api.preview
        .getTriagePreview(
          this.emId,
          this.infoComingType,
          this.hospitalAndArea()
        )
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (result) {
              this.triage = result
            } else {
              this.triage = this.emptyData()
            }
          })
        })
    },
    // value转换汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    collapseChange(val) {
      if (val) {
        this.diagnosisTwo = ''
      }
    },
    // 数据为空，赋值空对象
    emptyData() {
      return {}
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
