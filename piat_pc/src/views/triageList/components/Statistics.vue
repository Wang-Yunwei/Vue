<template>
  <ul class="statistics-wrapper">
    <li class="statistics-item" v-for="(item, idx) in dataArr" :key="item.label">
      <span class="statistics-item-label" :style="{ color: item.color }">
        <med-icon class="info-icon" v-if="!idx" type="icon_tishi"></med-icon>
        {{ item.label }}
      </span>
      :
      <span class="statistics-item-value">{{ item.value }}人</span>
    </li>
  </ul>
</template>

<script>
const levelColor = ['#000', '#b41226', '#df6926', '#ff9900', '#009900']

export default {
  name: 'Statistics',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    dataArr() {
      return levelColor.map((color, idx) => {
        const ChineseNum = '一二三四'
        const label = idx ? ChineseNum[idx - 1] + '级患者' : '分诊总人数'
        return {
          level: idx,
          color,
          label,
          value: this.data[label]
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.statistics-wrapper {
  display: inline-block;
  padding-left: 18px;
  margin-bottom: 0;
  .statistics-item {
    display: inline-block;
    font-size: 15px;

    &:not(:last-child):after {
      content: '/';
      color: #ccc;
      width: 24px;
      display: inline-block;
      text-align: center;
    }
    &-label {
      .info-icon {
        font-size: 19px;
        vertical-align: sub;
        color: rgb(255, 204, 0);
      }
    }
  }
}
</style>
