<template>
  <div class="inspection-wrapper">
    <van-collapse v-model="inspectionItems" @change="collapseChange">
      <div v-for="(item, key) in inspection.masterList" :key="key">
        <van-collapse-item :title="item.testCause" :name="key">
          <div class="center">
            <van-cell style="padding:0">
              <!--              <p>
                <span> 检验申请时间:</span><span>{{ item.applyTime }}</span>
              </p>
              <p>
                <span>诊断:</span><span>{{ item.diagnosis }}</span>
              </p>
              <p>
                <span>申请医生:</span
                ><span>{{ item.orderingProviderName }}</span>
              </p>
              <p>
                <span>采样时间:</span
                ><span>{{ item.spcmReceivedDateTime }}</span>
              </p>
              <p>
                <span>化验样本:</span><span>{{ item.specimen }}</span>
              </p>
              <p>
                <span>报告医生:</span><span>{{ item.transcriptionist }}</span>
              </p>
              <p>
                <span>审核医生:</span><span>{{ item.verifiedBy }}</span>
              </p>-->
              <p class="report-time">
                <span>报告时间:</span><span>{{ item.reportTime }}</span>
              </p>
              <!--              <div class="center">
                              <van-cell class="card-item" v-for="(iteml, indexl) in item.labResultList" :key="indexl">
                                <p>
                                  <span>报告项目:</span><span>{{ iteml.reportItemName }}</span></p>
                                <p>
                                  <span>缩写:</span><span>{{ iteml.reportItemCode }}</span>
                                </p>
                                <p>
                                  <span>单位:</span><span>{{ iteml.result }}</span>
                                </p>
                                <p>
                                                              <span>检验结果:</span
                                                              ><span>{{
                                    conversionOne(iteml.abnormalIndicator, medicationResults)
                                  }}</span>
                                </p>
                                <p>
                                  <span>参考值:</span><span>{{ iteml.referenceResult }}</span>
                                </p>
                              </van-cell>
                            </div>-->
              <table class="center report-table">
                <colgroup>
                  <col />
                  <col style="width:20%" />
                  <col style="width:13%" />
                  <col style="width:24%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>结果</th>
                    <th>标识</th>
                    <th>参考值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(iteml, indexl) in item.labResultList"
                    :key="indexl"
                  >
                    <td>{{ iteml.reportItemName }}</td>
                    <td>{{ iteml.result }}{{ iteml.units }}</td>
                    <td>{{ conversionOne(iteml.abnormalIndicator) }}</td>
                    <td>{{ iteml.referenceResult }}</td>
                  </tr>
                </tbody>
              </table>
            </van-cell>
          </div>
        </van-collapse-item>
      </div>
    </van-collapse>
    <van-empty
     :image="require('@assets/image/empty.png')"
      description="未查询到检验信息"
      v-if="inspection.masterList.length === 0"
    />
  </div>
</template>
<script>
import hospitalMixin from '@mixins/hospitalMixin'
import { mapGetters } from 'vuex'
import Overview from '../main'

export default {
  name: 'Inspection',
  mixins: [hospitalMixin],
  components: { Overview },
  props: {},
  data() {
    return {
      inspectionItems: [],
      infoComingType: this.$route.query.infoComingType,
      emId: this.$route.query.emId,
      inspection: {
        masterList: []
      },
      medicationResults: [
        { label: '正常', name: '用药结果', value: 'N' },
        { label: '低', name: '用药结果', value: 'L' },
        { label: '高', name: '用药结果', value: 'H' },
        { label: '阳性', name: '用药结果', value: 'P' }
      ]
    }
  },
  async created() {
    // 获取检验信息
    this.getInspectList()
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  methods: {
    // 获取检验信息
    getInspectList() {
      if (!this.emId || !this.infoComingType) {
        return
      }
      this.$api.preview
        .getInspectList(this.emId, this.infoComingType, this.hospitalAndArea())
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (!result) {
              return
            }
            if (result.inspection && Object.keys(result.inspection).length) {
              this.inspection = {
                ...this.inspection,
                ...(result.inspection || [])
              }
              this.getFormName()
            }
          })
        })
    },
    getFormName() {
      Object.keys(this.inspection).map(val => {
        this.inspectionItems.push(val)
      })
    },
    collapseChange(val) {},
    // value转换汉字
    conversionOne(str) {
      if (str === 'N') {
        return ''
      } else {
        return str
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
