<template>
  <div>
    <med-view-container @return="onBackClick" title="心电图列表" scroll>
      <template #right>
        <div v-if="false">
          <i class="iconfont iconicon1-441" @click="showEdit" />
        </div>
      </template>
      <med-ecg-list
        :disabled="isReadonly"
        :records="recordList"
        :readonly="true"
        :delete-record="deleteRecord"
        @editRecord="editRecord"
      />
    </med-view-container>
    <med-popup-container
      :title="editEcgTitle"
      v-model="showEditEcg"
      @return="onEditEcgReturn"
    >
      <med-ecg-edit
        :ecg="ecgObj"
        :disabled="true"
        :readonly="true"
        :upload-url="uploadUrl"
        :upload-image="uploadImage"
        :update-record="updateRecord"
      />
    </med-popup-container>
  </div>
</template>
<script>
import { dicConstant } from '@constant/commonConstant'

export default {
  name: 'ecgView',
  components: {},
  data() {
    return {
      registId: this.$route.query.registId,
      status: this.$route.query.status,
      uploadUrl: dicConstant.imgURL,
      editEcgTitle: '',
      showEditEcg: false,
      recordList: [],
      ecgObj: {}
    }
  },
  created() {
    this.getSupDetails()
  },
  computed: {
    isReadonly() {
      return (
        this.status === '21' || this.status === '31' || this.status === '41'
      )
    }
  },
  methods: {
    // 调用后台接口
    getSupDetails() {
      this.recordList = []
      this.$api.service.getEcg(this.registId, '').then(res => {
        if (res.result != null) {
          for (var i = 0; i < res.result.length; i++) {
            const recordItem = {}
            recordItem.id = res.result[i].id
            recordItem.registId = res.result[i].registId
            recordItem.ecgTime = res.result[i].checkTime
            recordItem.diagTime = res.result[i].diagnosisTime
            recordItem.ecgDiagnosis = res.result[i].ecgDiagnosis
            recordItem.ecgType = res.result[i].flag
            if (
              res.result[i].ecgFilesList != null &&
              res.result[i].ecgFilesList.length > 0
            ) {
              recordItem.ecgFile =
                dicConstant.imgURL + res.result[i].ecgFilesList[0].attachPath
            }

            this.recordList.push(recordItem)
          }
        }
      })
    },
    onEditEcgReturn() {
      this.showEditEcg = false
    },
    async deleteRecord(item) {
      const res = await this.$api.service.deleteEcg(item.id)
      if (res && res.status === 200) {
        return true
      } else {
        return false
      }
    },
    editRecord(item) {
      this.showEditEcg = true
      // if (this.isReadonly) {
      this.editEcgTitle = '查看心电图'
      // } else {
      // this.editEcgTitle = '编辑心电图'
      // }
      this.ecgObj = {
        ...item,
        uploadList: this.getUploadList(item)
      }
    },
    getUploadList(item) {
      if (!item || !item.ecgFile) return []
      return item.ecgFile
        .split(';')
        .map(item => ({
          url: item,
          isImage: true
        }))
        .filter(el => el.url)
    },
    async uploadImage(data) {
      const res = await this.$api.service.uploadWithThumb(data)
      if (res && res.status === 200) {
        return res.result
      } else {
        return null
      }
    },
    async updateRecord(params) {
      this.ecgObj.ecgFilesList = []
      if (params.ecgFile != null) {
        var ecgFile = {
          attachPath: params.path,
          thumbAttachPath: params.thumb,
          attachType: '1',
          attachName: params.ecgFile.substring(
            params.ecgFile.lastIndexOf('/') + 1
          )
        }
        this.ecgObj.ecgFilesList.push(ecgFile)
      }
      this.ecgObj.registId = this.$route.query.registId
      this.ecgObj.id = params.id
      this.ecgObj.ecgDiagnosis = params.ecgDiagnosis
      this.ecgObj.checkTime = params.ecgTime
      this.ecgObj.diagnosisTime = params.diagTime
      const res = await this.$api.service.saveEcg(this.ecgObj)
      if (res && res.status === 200) {
        this.showEditEcg = false
        this.getSupDetails()
        return true
      } else {
        this.$notify({ type: 'warning', message: '心电图保存失败！' })
        return false
      }
    },
    // 返回跳转
    onBackClick() {
      this.$router.push({
        path: '/index',
        query: {
          type: this.$route.query.type
        }
      })
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped></style>
