<template>
  <el-dialog
    title="任务回放"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    custom-class="replay-modal"
  >
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="医疗舱视频" name="1">
        <video
          width="100%"
          controls
          src="https://mazwai.com/videvo_files/video/free/2017-08/small_watermarked/170724_15_Setangibeach_preview.webm?v=1888463z"
        />
      </el-tab-pane>
      <el-tab-pane
        label="行车轨迹"
        name="2"
      ><task-map
        v-if="visible && activeName === '2'"
        :mission-id="missionId"
      /></el-tab-pane>
      <el-tab-pane label="体征监护" name="3">体征监护</el-tab-pane>
      <el-tab-pane label="会诊" name="4">会诊</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import TaskMap from './taskMap.vue'
export default {
  name: 'ReplayModal',
  components: {
    TaskMap
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    missionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: '1'
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
        if (!v) {
          this.activeName = '1'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .replay-modal {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
