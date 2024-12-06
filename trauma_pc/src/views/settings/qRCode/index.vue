<template>
  <div>
    <el-table ref="QRCodeTable" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="80" />
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="title" label="名称" width="300" />
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button v-print="'#QRCodeUrl'" size="mini" type="primary" plain @click="handlePrint(scope.$index, scope.row)">
            打印
          </el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增场景二维码" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <el-checkbox-group v-model="checkList" size="medium">
        <el-row>
          <el-col v-for="QRCode in QRCODE_00001" :key="QRCode.value" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-checkbox :label="QRCode.value" border style="margin-top: 10px; width: 170px;">
              {{ QRCode.label }}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="saveQRCode">确 定</el-button>
      </div>
    </el-dialog>
    <div>
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
import { DictionariesMixin } from '@/mixins/index'
export default {
  name: 'QRCode',
  mixins: [DictionariesMixin],
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      checkList: []
    }
  },
  mounted() {
    this.getQRCode()
  },
  methods: {
    getQRCode() {
      this.$api.getRrCodePage({
        current: 1,
        pageSize: 100
      }).then(res => {
        if (res.code === '000000') {
          this.tableData = res.body.records
          this.checkList = []
          this.tableData.forEach((item) => {
            this.checkList.push(item.code)
          })
        }
      })
    },
    saveQRCode() {
      const saveCode = []
      this.QRCODE_00001.forEach((QRCode) => {
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
      this.$api.saveRrCodePage(saveCode).then(res => {
        if (res.code === '000000') {
          this.$emit('close')
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
          width: 800,
          height: 800,
          colorDark: 'rgb(75, 96, 253)', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.H // 容错率，L/M/Q/H
        })
      })
    },
    handleDelete(index, row) {
      const saveCode = this.tableData.filter((item) => {
        return item.code !== row.code
      })
      this.$api.saveRrCodePage(saveCode).then(res => {
        if (res.code === '000000') {
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
