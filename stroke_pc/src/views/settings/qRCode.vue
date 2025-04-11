<template>
  <div>
    <div style="position: fixed; top: 68px; right: 60px; z-index: 1;">
      <el-button @click="dialogTableVisible = true">配置</el-button>
      <el-button v-if="multipleSelection.length !== 0" v-print="'#QRCodeUrl'" @click="handleBatchPrint">批量打印</el-button>
    </div>

    <el-table
      ref="QRCodeTable"
      :data="tableData"
      style="width: 100%;"
      height="calc(100vh - 90px)"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="80" />
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="title" label="名称" width="300" />
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            v-print="'#QRCodeUrl'"
            size="mini"
            type="primary"
            plain
            @click="handlePrint(scope.$index, scope.row)"
          >
            打印
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增场景二维码" :visible.sync="dialogTableVisible">
      <el-checkbox-group v-model="checkList" size="medium">
        <el-row>
          <el-col
            v-for="QRCode in dic.qrCode"
            :key="QRCode.value"
            :xs="12"
            :sm="8"
            :md="8"
            :lg="8"
            :xl="6"
          >
            <el-checkbox
              :label="QRCode.value"
              border
              style="margin-top: 10px; width: 170px;"
            >
              {{ QRCode.label }}
            </el-checkbox>
          </el-col>
        </el-row>

      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveQRCode">确 定</el-button>
      </div>
    </el-dialog>

    <div style="position: fixed; top: 10000px">
      <div id="QRCodeUrl">
        <div v-for="QRCode in multipleSelection" :key="QRCode.code" style="page-break-after:always">
          <div style="text-align: center; font-size: 88px; margin-bottom: 20px">{{ QRCode.title }}</div>
          <div :id="QRCode.code" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import storage from 'store'
import settingsApi from '@/api/settings'

export default {
  name: 'QRCode',
  data() {
    return {
      dic: storage.get('dicData'),
      tableData: [],
      dialogTableVisible: false,
      multipleSelection: [],
      checkList: []
    }
  },
  mounted() {
    this.getQRCode()
  },
  methods: {
    getQRCode() {
      settingsApi.getRrCodePage({
        current: 1,
        pageSize: 100
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.result.records
          this.checkList = []
          this.tableData.forEach((item) => {
            this.checkList.push(item.code)
          })
        }
      })
    },
    saveQRCode() {
      const saveCode = []
      this.dic.qrCode?.forEach((QRCode) => {
        this.checkList.forEach((check) => {
          if (check === QRCode.value) {
            saveCode.push({
              code: QRCode.value,
              title: QRCode.label
            })
            return
          }
        })
      })
      settingsApi.saveRrCodePage(saveCode).then(res => {
        if (res.status === 200) {
          this.dialogTableVisible = false
          this.$message.success('已添加成功')
          this.getQRCode()
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleBatchPrint() {
      this.multipleSelection.forEach((item) => {
        this.creatQRCode(item.code)
      })
    },
    handlePrint(index, row) {
      this.$refs.QRCodeTable.clearSelection()
      this.$refs.QRCodeTable.toggleRowSelection(row)
      this.$nextTick(() => {
        this.creatQRCode(row.code)
      })
    },
    creatQRCode(text) {
      document.getElementById(text).innerHTML = ''
      this.$nextTick(() => {
        new QRCode(text, {
          text: text, // 二维码的内容
          width: 888,
          height: 888,
          colorDark: '#000000', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.H // 容错率，L/M/Q/H
        })
      })
    },
    handleDelete(index, row) {
      const saveCode = this.tableData.filter((item) => {
        return item.code !== row.code
      })
      settingsApi.saveRrCodePage(saveCode).then(res => {
        if (res.status === 200) {
          this.$message.success('已删除')
          this.getQRCode()
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
