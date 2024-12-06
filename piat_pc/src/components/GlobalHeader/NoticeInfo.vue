<template>
  <span>
    <a-popover>
      <template slot="content">
        <a-card
          :bordered="false"
          size="small"
          :tab-list="tabList"
          :active-tab-key="curTab"
          @tabChange="key => (curTab = key)"
        >
          <div v-if="curTab === 'prehospital'">
            <a-list item-layout="horizontal" :data-source="noticeList">
              <a-list-item slot="renderItem" slot-scope="item" @click="openPatientInfo()">
                <a-list-item-meta>
                  <div slot="title">{{ item.content }}</div>
                  <div slot="description" style="float:right">
                    <a-tag
                      :color="item.checkStatus === 1 ? 'green' : 'red'"
                    >{{ item.checkStatus === 1 ? '已' : '未' }}分诊</a-tag
                    >{{ item.pushTime }}
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
          <div v-else-if="curTab === 'consultation'">
            会诊
          </div>
          <div v-else-if="curTab === 'else'">
            其他
          </div>
        </a-card>
      </template>
      <a-icon
        @mouseenter="queryList"
        type="bell"
        style="cursor:pointer;font-size:20px;padding:10px;vertical-align:middle;"
      />
    </a-popover>

    <PatientInfo ref="patientInfoModal" />
  </span>
</template>

<script>
import { dasQuery } from '@/api/common'
import PatientInfo from './PatientInfo'
import moment from 'moment'

export default {
  components: {
    PatientInfo
  },
  data() {
    return {
      noticeList: [
        {
          noticeType: '1',
          businessId: 'abcd222',
          sendTime: '2022-07-12 14:56:00',
          content: '急诊患者 张三 即将到院，请做好接诊准备！'
        }
      ],
      curTab: 'prehospital',
      tabList: [
        {
          key: 'prehospital',
          tab: '院前急救'
        },
        {
          key: 'consultation',
          tab: '会诊'
        },
        {
          key: 'else',
          tab: '其他'
        }
      ]
    }
  },
  methods: {
    queryList() {
      const param = {
        hospitalId: 'RBAC_csyq'
      }
      dasQuery(param).then(res => {
        this.noticeList = res.body
      })
    },
    openPatientInfo() {
      this.$refs.patientInfoModal.open()
    }
  },
  mounted: function() {
    this.queryList()
  }
}
</script>
