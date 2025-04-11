<template>
  <div class="task-preliminary-diagnosis-wrapper">
    <van-collapse v-model="exhibit" @change="collapseChange">
      <div v-for="(item, index) in medication" :key="index">
        <van-collapse-item
          :title="formatOnlyDate(item.enterDateTime)"
          :name="index + ''"
        >
          <div class="center">
            <van-cell class="card-item">
              <!--              <p>
                <span> HIS系统门诊号:</span><span>{{ item.clinicNo }}</span>
              </p>
              <p>
                <span>接诊医生:</span><span>{{ item.doctor }}</span>
              </p>
              <p>
                <span>医生录入时间:</span><span>{{ item.enterDateTime }}</span>
              </p>
              <p>
                <span>停医嘱录入时间:</span
                ><span>{{ item.stopOrderDateTime }}</span>
              </p>-->
              <table class="center report-table">
                <colgroup>
                  <col style="width:35%" />
                  <col style="width:22%" />
                  <col style="width:22%" />
                  <col style="width:21%" />
                </colgroup>
                <!--                <thead>-->
                <!--                  <tr>-->
                <!--                    <th>药品名称</th>-->
                <!--                    <th>剂量单位</th>-->
                <!--                    <th>给药途径</th>-->
                <!--                    <th>频次</th>-->
                <!--                  </tr>-->
                <!--                </thead>-->
                <tbody>
                  <tr v-for="(iteml, indexl) in item.items" :key="indexl">
                    <td>{{ iteml.orderText }}</td>
                    <td>{{ iteml.dosage }}&nbsp;{{ iteml.dosageUnits }}</td>
                    <td>{{ iteml.administration }}</td>
                    <td>{{ iteml.frequency }}</td>
                  </tr>
                </tbody>
              </table>
              <!--              <div class="center">
                              <van-cell class="card-item" v-for="(iteml, indexl) in item.items" :key="indexl">
                                <p>
                                  <span>药品一次使用剂量:</span
                                  ><span
                                >{{ iteml.dosage }}&nbsp;{{ iteml.dosageUnits }}</span
                                >
                                </p>
                                <p>
                                  <span>医嘱类别:</span><span>{{ iteml.orderClass }}</span>
                                </p>
                                <p>
                                  <span>医嘱状态:</span><span>{{ iteml.orderStatus }}</span>
                                </p>
                                <p>
                                  <span>医嘱内容:</span><span>{{ iteml.orderText }}</span>
                                </p>
                                <p>
                                  <span>频次:</span><span>{{ iteml.frequency }}</span>
                                </p>

                                <p>
                                  <span>医嘱标志:</span
                                  ><span>{{ iteml.repeatIndicator }}</span>
                                </p>
                                <p>
                                  <span>医嘱起始时间:</span
                                  ><span>{{ iteml.startDateTime }}</span>
                                </p>
                                <p>
                                  <span>医嘱停止时间:</span
                                  ><span>{{ iteml.stopDateTime }}</span>
                                </p>
                              </van-cell>
                            </div>-->
            </van-cell>
          </div>
        </van-collapse-item>
      </div>
    </van-collapse>
    <van-empty
      :image="require('@assets/image/empty.png')"
      description="未查询到用药信息"
      v-if="medication.length === 0"
    />
  </div>
</template>
<script>
import dateMixin from '@mixins/dateMixin'
import hospitalMixin from '@mixins/hospitalMixin'
import { mapGetters } from 'vuex'

export default {
  props: {},
  mixins: [dateMixin, hospitalMixin],
  data() {
    return {
      exhibit: [],
      diagnosisTwo: '',
      infoComingType: this.$route.query.infoComingType,
      emId: this.$route.query.emId,
      infectHistory: '',
      // medication: Medication()
      medication: []
    }
  },
  async created() {
    // 查询用药数据
    this.getMedicationList()
  },
  computed: {
    ...mapGetters(['hospitalId', 'dicData'])
  },
  methods: {
    // 用药数据返回
    getMedicationList() {
      if (!this.emId || !this.infoComingType) {
        return
      }
      this.$api.preview
        .getMedicationList(
          this.emId,
          this.infoComingType,
          this.hospitalAndArea()
        )
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (!result) {
              return
            }
            if (Object.keys(result).length) {
              this.medication = result
              this.getFormName(this.medication)
            }
          })
        })
    },
    // value转换汉字
    collapseChange(val) {},
    // 截取字符串
    Intercept(str) {
      var b = str.substr(str.lastIndexOf('t') + 1)
      return b
    },
    getFormName(params) {
      Object.keys(params).map(val => {
        this.exhibit.push(val)
      })
    },
    emptyData() {
      return {
        /*  ...Medication() */
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
