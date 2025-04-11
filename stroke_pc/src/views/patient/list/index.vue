<template>
  <div style="margin: 0 10px">
    <div class="header">
      <index-search @onSearch="search" />
    </div>
    <el-divider />
    <div>
      <index-table ref="indexTable" />
    </div>
  </div>
</template>

<script>
import indexSearch from '@/views/patient/list/indexSearch'
import indexTable from '@/views/patient/list/indexTable'

export default {
  components: {
    indexSearch,
    indexTable
  },
  data() {
    return {}
  },
  methods: {
    search(searchParam) {
      this.$refs.indexTable.searchBarHandle({ ...searchParam })
    }
  }
}
</script>

<style lang="sass" scoped>
.header
  padding: 20px 5px 0 5px
  background-color: #f5f6fb
</style>
