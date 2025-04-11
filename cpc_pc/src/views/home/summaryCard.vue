<template>
  <div class="cases-wrapper">
    <el-row :gutter="36">
      <el-col :span="6" class="col">
        <el-row class="col-bell">
          <el-col />
          <el-col>
            <div class="case-title">新增病例</div>
            <div class="col-bel-number">
              {{ summary.new ? summary.new : '--' }}
              <span style="font-size: 18px">例</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" class="col">
        <el-row class="col-bell">
          <el-col />
          <el-col>
            <div class="case-title">本周填报量</div>
            <div class="col-bel-number">
              {{ summary.week ? summary.week : '--' }}
              <span style="font-size: 18px">例</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" class="col">
        <el-row class="col-bell">
          <el-col />
          <el-col>
            <div class="case-title">本月填报量</div>
            <div class="col-bel-number">
              {{ summary.month ? summary.month : '--' }}
              <span style="font-size: 18px">例</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" class="col">
        <el-row class="col-bell">
          <el-col />
          <el-col>
            <div class="case-title">累计填报量</div>
            <div class="col-bel-number">
              {{ summary.total ? summary.total : '--' }}
              <span style="font-size: 18px">例</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'SummaryCard',
  props: {
    summary: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.cases-wrapper {
  padding: 22px 0;
}
.col {
  &:nth-of-type(1) .col-bell {
    background-color: rgb(253, 235, 211);
  }
  &:nth-of-type(2) .col-bell {
    background-color: rgb(252, 229, 229);
  }
  &:nth-of-type(3) .col-bell {
    background-color: rgb(208, 247, 254);
  }
  &:nth-of-type(4) .col-bell {
    background-color: rgb(230, 252, 229);
  }
}

.col-bell {
  border-radius: 8px;
  padding: 16px 26px;
  color: rgba(0, 0, 0, 0.8);

  .case-title {
    font-size: 14px;
    padding-bottom: 10px;
  }
  .col-bel-number {
    font-size: 36px;
  }
}
</style>
