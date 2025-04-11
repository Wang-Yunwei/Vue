<template>
  <div>
    <el-divider content-position="left">
      <b class="timeline-title">时间轴</b>
    </el-divider>

    <el-timeline class="timeline">
      <el-timeline-item v-for="(item, index) in timelines" :key="index" type="info">
        <div class="time-title">{{ item.nodeName }}</div>
        <div v-if="item.timeDiffs && item.timeDiffs.length" class="time-diff">
          <el-row
            v-for="el in item.timeDiffs"
            :key="el.name"
            class="time-diff-item"
            :class="{ abnormal: el.color === 'red' }"
            :gutter="12"
          >
            <el-col :span="15">{{ el.name }}</el-col>
            <el-col :span="9">{{ el.value }}min</el-col>
          </el-row>
        </div>
        <template #dot>
          <div :class="{ dot: true, 'is-date': !item.nodeName }">
            {{ item.timeValue }}
          </div>
        </template>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>

export default {
  name: 'Timeline',
  filtersAll: {},
  props: {
    registId: {
      type: String,
      required: true
    },
    timelines: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  created() {
  },
  mounted() { },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

.timeline-title {
  color: $blue;
}

.timeline {
  padding-left: 0;

  ::v-deep .el-timeline-item {
    display: flex;
    min-height: 42px;
    padding-bottom: 0;

    &__tail {
      left: 43px;
    }

    &__dot {
      width: 88px;
      color: #435372;
      text-align: center;
      background: #fff;
    }

    &__wrapper {
      line-height: 32px;
      padding-left: 84px;
      width: 100%;
    }
  }

  .time-title {
    color: #435372;
  }

  .time-diff {
    font-size: 14px;

    .time-diff-item {
      border-radius: 5px;
      line-height: 1.6;
      background-color: #ECF5FF;
      color: #4b60fd;

      &+.time-diff-item {
        margin-top: 5px;
      }

      &.abnormal {
        color: rgb(255, 78, 78);
        background-color: #FEF0F0;
      }
    }
  }

  .dot {
    line-height: 1.8;

    &.is-date {
      font-size: 15px;
      font-weight: 550;
    }
  }
}
</style>
