<template>
  <div>
    <!-- 日志列表 -->
    <el-table
      v-loading="downloading"
      element-loading-text="拼命下载中..."
      :data="logList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getLogList, logDownload } from '@/api/setting'
export default {
  name: 'LogDownload',
  data() {
    return {
      logList: [],
      downloading: false
    }
  },
  mounted() {
    this.getLogList()
  },
  methods: {
    async getLogList() {
      const { result } = await getLogList() || []
      this.logList = result.map(r => {
        return { name: r }
      })
    },
    async handleClick(row) {
      this.downloading = true
      const res = await logDownload(row.name)
      this.downfiles(res, row.name)
      this.downloading = false
    },
    downfiles(datas, filename) {
      const urlObject = window.URL || window.webkitURL || window
      const export_blob = new Blob([datas])
      const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = urlObject.createObjectURL(export_blob)
      save_link.download = filename
      save_link.click()
    }
  }
}
</script>

<style>

</style>
