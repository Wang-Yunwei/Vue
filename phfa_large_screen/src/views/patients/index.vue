<template>
  <div class="patients">
    <div class="page-title">24h内急救患者列表</div>
    <div class="statistics flex-c-s">
      <statistic-card
        class="statistic-item"
        v-for="item in statistics"
        :key="item.title"
        :title="item.title"
        :number="item.number"
      ></statistic-card>
    </div>
    <div class="patient-list-wrapper">
      <table class="patient-list txt-c">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.dataIndex">
              <gradient-text>{{ col.title }}</gradient-text>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dataSource" :key="row.key">
            <td v-for="col in columns" :key="col.dataIndex">
              {{
                col.render ? col.render(row[col.dataIndex]) : row[col.dataIndex]
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Patients",
  data() {
    return {
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
        },
        {
          title: "性别",
          dataIndex: "gender",
        },
        {
          title: "年龄",
          dataIndex: "age",
        },
        {
          title: "疾病类别",
          dataIndex: "diseaseCategory",
        },
        {
          title: "车牌号",
          dataIndex: "licensePlate",
        },
        {
          title: "初步诊断",
          dataIndex: "diagnosis",
        },
        {
          title: "交接科室",
          dataIndex: "dept",
        },
        {
          title: "交接时间",
          dataIndex: "submitTime",
          render(text) {
            return (text || "").replace(/T|\:\d\d$/g, " ");
          },
        },
      ],
      allList: [],
      curPage: 0,
      cycles: 0,
      timer: null,
      pectoralgia: 0,
      stroke: 0,
      trauma: 0,
      otherDisease: 0,
      total: 0,
      // dataSource: [
      //   {
      //     key: Math.random(),
      //     name: "卓天成",
      //     gender: "男",
      //     age: "36",
      //     diseaseCategory: "胸痛",
      //     licensePlate: "苏E 12345",
      //     diagnosis: "胸闷一小时",
      //     handoverDepartment: "胸痛诊室",
      //     handoverTime: "02-21 11:00",
      //   },
      //   {
      //     key: Math.random(),
      //     name: "傅歆",
      //     gender: "女",
      //     age: "22",
      //     diseaseCategory: "卒中",
      //     licensePlate: "苏U 65498",
      //     diagnosis: "晕厥半小时",
      //     handoverDepartment: "卒中诊室",
      //     handoverTime: "02-21 12:00",
      //   },
      //   {
      //     key: Math.random(),
      //     name: "卞望舒",
      //     gender: "男",
      //     age: "36",
      //     diseaseCategory: "胸痛",
      //     licensePlate: "苏E 12345",
      //     diagnosis: "胸闷一小时",
      //     handoverDepartment: "胸痛诊室",
      //     handoverTime: "02-21 11:00",
      //   },
      //   {
      //     key: Math.random(),
      //     name: "栾向凡",
      //     gender: "女",
      //     age: "22",
      //     diseaseCategory: "卒中",
      //     licensePlate: "苏U 65498",
      //     diagnosis: "晕厥半小时",
      //     handoverDepartment: "卒中诊室",
      //     handoverTime: "02-21 12:00",
      //   },
      //   {
      //     key: Math.random(),
      //     name: "蔺问心",
      //     gender: "女",
      //     age: "22",
      //     diseaseCategory: "卒中",
      //     licensePlate: "苏U 65498",
      //     diagnosis: "晕厥半小时",
      //     handoverDepartment: "卒中诊室",
      //     handoverTime: "02-21 12:00",
      //   },
      //   {
      //     key: Math.random(),
      //     name: "夕鸿朗",
      //     gender: "男",
      //     age: "36",
      //     diseaseCategory: "胸痛",
      //     licensePlate: "苏E 12345",
      //     diagnosis: "胸闷一小时",
      //     handoverDepartment: "胸痛诊室",
      //     handoverTime: "02-21 11:00",
      //   },
      //   {
      //     key: Math.random(),
      //     name: "宋秋灵",
      //     gender: "女",
      //     age: "22",
      //     diseaseCategory: "卒中",
      //     licensePlate: "苏U 65498",
      //     diagnosis: "晕厥半小时",
      //     handoverDepartment: "卒中诊室",
      //     handoverTime: "02-21 12:00",
      //   },
      //   {
      //     key: Math.random(),
      //     name: "沈安易",
      //     gender: "男",
      //     age: "36",
      //     diseaseCategory: "胸痛",
      //     licensePlate: "苏E 12345",
      //     diagnosis: "胸闷一小时",
      //     handoverDepartment: "胸痛诊室",
      //     handoverTime: "02-21 11:00",
      //   },
      // ],
    };
  },
  computed: {
    ...mapGetters(["hospitalArea", "hospitalId"]),
    dataSource() {
      return this.allList.slice(this.curPage * 8, (this.curPage + 1) * 8);
    },
    statistics() {
      return [
        {
          title: "胸痛",
          number: this.chestPain,
        },
        {
          title: "卒中",
          number: this.stroke,
        },
        {
          title: "创伤",
          number: this.trauma,
        },
        {
          title: "其他危急重症",
          number: this.else,
        },
        {
          title: "目前经救护车入院总数",
          number: this.total,
        },
      ];
    },
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    async getList() {
      const { body = {} } = await this.$api.queryPatientList24h({
        hospitalId: this.hospitalId + "_" + this.hospitalArea,
      });
      const list = body.patientInfoListDtoList;
      this.allList = list || [];
      this.pectoralgia = body.pectoralgia;
      this.stroke = body.stroke;
      this.trauma = body.trauma;
      this.otherDisease = body.otherDisease;
      this.total = body.nowAmbulanceToHospitalTotal;

      this.play();
    },
    play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.cycles === 3) {
          // 轮播3次重新获取数据
          this.cycles = 0;
          this.getList();
        } else {
          if (this.curPage < Math.ceil(this.allList.length / 8) - 1) {
            this.curPage += 1;
          } else {
            this.cycles += 1;
            this.curPage = 0;
          }
          this.play();
        }
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
.patients {
  margin-top: -18px;
  .page-title {
    font-size: 26px;
    letter-spacing: 1px;
    padding-bottom: 8px;
  }
  .statistics {
    margin: 20px 0;
    .statistic-item {
      flex: auto;
    }
  }
  .patient-list-wrapper {
    //   height: 796px;
    border: 2px solid rgba(126, 181, 255, 0.6);
    box-shadow: 0px 0px 24px 0px rgba(103, 168, 255, 0.35) inset;
    .patient-list {
      border-spacing: 0;
      padding: 10px;
      width: 100%;
      font-size: 26px;
      background-color: rgba(59, 81, 105, 0.2);
      th,
      td {
        height: 85px;
        font-weight: normal;
      }
      thead {
        background: rgba(7, 19, 43, 0.3);
        box-shadow: 0px 1px 0px 0px rgba(59, 81, 105, 0.4),
          0px 1px 1px 0px #06152c;
      }
      tbody {
        text-shadow: 0px 3px 1px rgba(2, 23, 41, 0.5);
        tr:nth-of-type(even) {
          background: rgba(7, 19, 43, 0.2);
          box-shadow: 0px 1px 0px 0px rgba(59, 81, 105, 0.4),
            0px 1px 1px 0px rgba(6, 21, 44, 0.24);
        }
      }
    }
  }
}
</style>
