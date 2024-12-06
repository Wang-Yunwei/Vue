<template>
  <div>
    <el-form ref="meetingDetail" :model="meetingDetail" :rules="rules" label-width="20%" class="demo-ruleForm">
      <el-form-item label="院区" prop="hospitalArea">
        <el-select v-model="meetingDetail.hospitalArea" placeholder="院区">
          <el-option v-for="item in hospitalAreaList" :key="item.areaId" :label="item.areaName" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="开会日期" prop="meetingTime">
        <el-col :span="8">
          <med-datetime v-model="meetingDetail.meetingTime" />
        </el-col>
      </el-form-item>
      <el-form-item label="会议主旨" prop="title">
        <el-input v-model="meetingDetail.title" placeholder="会议主旨" :maxlength="100" />
      </el-form-item>
      <el-form-item label="内容简介" prop="content">
        <el-input v-model="meetingDetail.content" type="textarea" placeholder="内容简介" :maxlength="300" />
      </el-form-item>
      <el-form-item label="会议资料（会议纪要、签到表）">
        <div style="display: flex;">
          <div style="margin-right:1rem;">
            <el-upload action="#" drag :http-request="(pa) => uploadFile(pa, '1')" :limit="fileLimit" :file-list="signFiles" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="(file, fileList) => handleRemove(file, fileList, '1')" :disabled="signFiles.length > 0">
              <i class="el-icon-upload" />
              <div class="el-upload__text">上传会议签到表</div>
            </el-upload>
          </div>
          <el-upload action="#" drag :http-request="(pa) => uploadFile(pa, '2')" :limit="fileLimit" :file-list="recordFiles" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="(file, fileList) => handleRemove(file, fileList, '2')" :disabled="recordFiles.length > 0">
            <i class="el-icon-upload" />
            <div class="el-upload__text">上传会议记录</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="现场照片">
        <el-upload action="#" :limit="3" :on-exceed="handleExceed" :before-upload="beforeUpload" list-type="picture-card" :http-request="(pa) => uploadFile(pa, '3')" :file-list="meetingDetail.photoFilesList" :class="meetingDetail.photoFilesList.length > 2 ? 'hide_box' : ''">
          <i slot="default" class="el-icon-plus" />
          <div slot="file" slot-scope="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.thumbFileAllPath" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in" />
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handlePreview(file)">
                <i class="el-icon-download" />
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file, '', '3')">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog title="查看图片" width="fit-content" :visible.sync="dialogVisible" append-to-body>
          <div class="view-box">
            <template v-if="dialogVisible">
              <img :src="dialogImageUrl" alt="">
            </template>
          </div>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <span style="color: red">注：会议资料包含（会议纪要1份，签到表1份，现场照片3张），上传文件支持：Word、PDF文件及jpg、png格式图片。</span>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="submitForm('meetingDetail')">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EcgField from '@/components/MedEcg/EcgField.vue'
export default {
  name: 'CreateFile',
  components: { EcgField },
  props: {
    fileInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: { 'Content-Type': 'multipart/form-data' },
      fileType: [
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'txt',
        'png',
        'jpg',
        'bmp',
        'jpeg'
      ],
      fileLimit: 1,
      signFiles: [],
      recordFiles: [],
      photoFilesList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      meetingDetail: {
        signFiles: {},
        recordFiles: {},
        photoFilesList: []
      },
      rules: {
        meetingTime: [
          { required: true, message: '请选择开会时间', trigger: 'blur' }
        ],
        title: [{ required: true, message: '请输入开会主旨', trigger: 'blur' }],
        hospitalArea: [
          { required: true, message: '请选择院区', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalAreaList', 'hospitalArea'])
  },
  mounted() {
    if (JSON.stringify(this.fileInfo) !== '{}') {
      this.getDetail()
    }
  },
  methods: {
    getDetail() {
      this.$api.meetingGetDetailById(this.fileInfo.id).then((res) => {
        this.meetingDetail = { ...this.meetingDetail, ...res.body }
        let recordFile = {}
        let signFile = {}
        if (res.body.signFiles !== undefined) {
          signFile = res?.body?.signFiles
          this.$set(signFile, 'name', res?.body?.signFiles?.attachName)
          this.signFiles.push(signFile)
        }
        if (res.body.recordFiles !== undefined) {
          recordFile = res.body.recordFiles
          this.$set(recordFile, 'name', res.body.recordFiles.attachName)
          this.recordFiles.push(recordFile)
        }
        if (res.body.photoFilesList !== undefined) {
          res.body.photoFilesList.forEach((item) => {
            this.$set(item, 'name', item.attachName)
            this.$set(
              item,
              'thumbFileAllPath',
              window.GLOBAL_APP_API_BASE_URL + item.thumbAttachPath
            )
            this.$set(
              item,
              'attachALLPath',
              window.GLOBAL_APP_API_BASE_URL + item.attachPath
            )
          })
        }
      })
    },
    // 点击文件列表中已上传文件进行下载
    handlePreview(file) {
      const fileExt = file.name.replace(/.+\./, '').toLowerCase()
      if (['png', 'jpg', 'bmp', 'jpeg'].includes(fileExt)) {
        // 下载图片,新建图片对象
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        // 图片加载
        image.onload = function () {
          // 新建 canvas标签
          let canvas = document.createElement("canvas");
          // 设置 canvas宽高
          canvas.width = image.width;
          canvas.height = image.height;
          // 添加 canvas画笔
          let context = canvas.getContext("2d");
          // 绘制图片
          context.drawImage(image, 0, 0, image.width, image.height);
          // 得到图片的 base64 编码
          let url = canvas.toDataURL("image/png");
          // 新建 a标签
          let a = document.createElement("a");
          // 新建点击事件
          let event = new MouseEvent("click");
          // 将图片的 base64 编码，设置为 a标签的地址
          a.href = url;
          const names = file.attachName.split('.')
          a.download = names[0]
          // 触发点击事件
          a.dispatchEvent(event);
        };
        // 将图片地址 设置为 传入的参数 imgsrc
        image.src = window.GLOBAL_APP_API_BASE_URL + file.attachPath;
      } else {
        this.$api.download(file.attachPath, 'get', null, file.attachName)
      }
    },
    // 超出文件个数的回调
    handleExceed() {
      this.$message({
        type: 'warning',
        message: '超出最大上传文件数量的限制！'
      })
      return
    },
    // 上传文件之前
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (file.type !== '' || file.type !== null || file.type !== undefined) {
          // 截取文件的后缀，判断文件类型
          const FileExt = file.name.replace(/.+\./, '').toLowerCase()
          // 计算文件的大小
          const isLt5M = file.size / 1024 / 1024 < 50 // 这里做文件大小限制
          // 如果大于50M
          if (!isLt5M) {
            this.$message.error('上传文件大小不能超过 50MB!')
            reject(false)
          }
          // 如果文件类型不在允许上传的范围内
          if (this.fileType.includes(FileExt)) {
            resolve(true)
          } else {
            this.$message.error('上传文件格式不正确!')
            reject(false)
          }
        }
      })
    },
    uploadFile(pa, va) {
      // 上传文件的需要formdata类型;所以要转
      const FormDatas = new FormData()
      FormDatas.append('file', pa.file)
      this.$api.fileApi(FormDatas).then((res) => {
        if (va === '1') {
          const signVa = {}
          signVa.name = pa.file.name
          signVa.attachName = pa.file.name
          signVa.attachPath = res.body.filePath
          this.signFiles.push(signVa)
          this.meetingDetail.signFiles = signVa
        } else if (va === '2') {
          const recordVa = {}
          recordVa.name = pa.file.name
          recordVa.attachName = pa.file.name
          recordVa.attachPath = res.body.filePath
          this.recordFiles.push(recordVa)
          this.meetingDetail.recordFiles = recordVa
        } else if (va === '3') {
          const photoFile = {}
          photoFile.name = pa.file.name
          photoFile.attachName = pa.file.name
          photoFile.attachPath = res.body.filePath
          photoFile.thumbAttachPath = res.body.thumbFilePath
          photoFile.thumbFileAllPath =
            window.GLOBAL_APP_API_BASE_URL + res.body.thumbFilePath
          photoFile.attachALLPath =
            window.GLOBAL_APP_API_BASE_URL + res.body.filePath
          this.meetingDetail.photoFilesList.push(photoFile)
        }
      })
    },
    // 文件移除操作
    beforeRemove(file, fileList) {
      if (this.status === 'view') {
        this.$message.warning('不允许删除！')
        return false
      } else {
        return true
      }
    },
    // 文件移除操作
    handleRemove(file, fileList, va) {
      if (va === '1') {
        this.signFiles = []
        this.meetingDetail.signFiles = {}
      } else if (va === '2') {
        this.recordFiles = []
        this.meetingDetail.recordFiles = {}
      } else if (va === '3') {
        var li = [...this.meetingDetail.photoFilesList]
        var index
        for (var i = 0; i < li.length; i++) {
          if (li[i].id.indexOf(file.id) > -1) {
            index = i
            li.splice(index, 1)
          }
        }
        this.meetingDetail.photoFilesList = [...li]
      }
      if (file.id) {
        this.$api.meetingDeleteFileById(file.id).then((res) => {
          if (res.code === '000000') {
            // 进入遍历编辑页面
            this.$message.success('删除成功')
          } else {
            this.$message.error('请求错误，请确认数据是否正常！')
          }
        })
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.attachALLPath
      this.dialogVisible = true
    },
    submitForm() {
      //保存按钮
      this.$refs.meetingDetail.validate((valid, error) => {
        if (valid) {
          // 通过校验
          this.$api.meetingSaveOrUpdate(this.meetingDetail).then((res) => {
            if (res.code === '000000') {
              this.$emit('subVisibleFlag')
              // 进入遍历编辑页面
              this.$message.success('编辑成功')
            } else {
              this.$message.error('请求错误，请确认数据是否正常！')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hide_box ::v-deep .el-upload--picture-card {
  display: none;
}

.view-box {
  overflow: hidden;
  text-align: center;
  min-width: 400px;
  min-height: 200px;

  img {
    max-height: 70vh;
    max-width: 90vw;
  }
}
</style>
