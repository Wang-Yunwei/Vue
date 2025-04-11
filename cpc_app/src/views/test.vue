<template>
  <med-view-container>
    <med-line-chart
      title="对于自行来院或拨打本地120经救护车入院的所有急性胸痛患者。"
      :x-axis-data="xAxisData"
      :y-axis-data="yAxisData"
      :series-data="seriesData"
    />
  </med-view-container>
</template>

<script>
export default {
  data() {
    return {
      xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yAxisData: [
        {
          type: 'value',
          name: '温度',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value} °C'
          }
        }
      ],
      seriesData: [
        {
          name: 'Email',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Union Ads',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'Video Ads',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: 'Direct',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: 'Search Engine',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    }
  },
  methods: {
    ss() {}
  }
}
</script>
