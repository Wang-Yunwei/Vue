<template>
  <div>
    <el-tabs v-model="active" type="card">
      <el-tab-pane label="知情同意书" name="consents">
        <consents ref="consents" :readonly="viewMode" />
      </el-tab-pane>
      <el-tab-pane label="新冠流调表" name="epidemiological">
        <epidemiological ref="epidemiological" :readonly="viewMode" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Consents from './Consents'
import Epidemiological from './Epidemiological'

export default {
  name: 'Informedconsent',
  components: {
    Consents,
    Epidemiological
  },
  props: {
    viewMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 'consents'
    }
  },
  methods: {
    onSave() {
      if (this.active === 'consents' && this.$refs.consents?.onSave) {
        this.$refs.consents.onSave()
      }
      if (
        this.active === 'epidemiological' &&
        this.$refs.epidemiological?.onSave
      ) {
        this.$refs.epidemiological.onSave()
      }
    }
  }
}
</script>
