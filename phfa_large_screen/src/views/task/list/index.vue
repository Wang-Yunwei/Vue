<template>
  <div class="task-list-wrapper">
    <div class="task-list">
      <div class="task-list-item flex-c-s" v-for="item in list" :key="item.key">
        <div class="info-card corners">
          <div class="flex-c-b">
            <div class="plate-number">
              <gradient-text>{{ item.licensePlate }}</gradient-text>
            </div>
            <div class="right flex-c-e">
              <div class="name">{{ item.name }}</div>
              <div :class="genderClass(item.gender)">未知</div>
            </div>
          </div>
          <div class="flex-c-b">
            <div class="ambulance-belongs flex-c-c txt-c">
              <marquee-box>
                {{ item.dispatchVehicleName }}
              </marquee-box>
            </div>
            <div class="arrow"></div>
            <div class="this-hospital">
              <marquee-box>
                <gradient-text>{{
                  item.hospitalName
                }}</gradient-text>
              </marquee-box>
            </div>
          </div>
        </div>
        <ul class="time-line flex-c-c">
          <li
            :class="`time-item txt-c${el.active ? ' active' : ''} ${
              item[el.field] ? 'done' : ''
            }`"
            v-for="el in timeLine(item)"
            :key="el.key"
          >
            <div class="time-item-time">
              <div class="item-date">
                {{ item[el.field] && item[el.field].slice(0, 10) }}
              </div>
              <div class="item-time">
                {{ item[el.field] && item[el.field].slice(11, 16) }}
              </div>
            </div>
            <div class="time-item-dot" />
            <div class="time-item-title">
              <span v-if="el.active">{{ el.title }}</span>
              <gradient-text v-else>{{ el.title }}</gradient-text>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
let timer;
export default {
  name: "TaskList",
  data() {
    return {
      cycles: 0,
      curPage: 0,
      allList: [],
    };
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  computed: {
    ...mapGetters(["hospitalArea", "hospitalId"]),
    list() {
      return this.allList.slice(this.curPage * 4, this.curPage * 4 + 4);
    },
  },
  methods: {
    timeLine(item) {
      const list = [
        {
          key: Math.random(),
          field: "callTime",
          title: "患者呼救",
        },
        {
          key: "2",
          field: "planVehicleTime",
          title: "准备出车",
        },
        {
          key: Math.random(),
          field: "dispatchVehicleTime",
          title: "赶往现场",
        },
        {
          key: Math.random(),
          field: "arrivedSceneTime",
          title: "到达现场",
        },
        {
          key: Math.random(),
          field: "leftSceneTime",
          title: "送往医院",
        },
        {
          key: Math.random(),
          field: "expectHospitalTime",
          title: "预计到院",
          hidden: item.arrivedHospitalTime,
        },
        {
          key: Math.random(),
          field: "arrivedHospitalTime",
          title: "到达医院",
          hidden: !item.arrivedHospitalTime,
        },
        {
          key: Math.random(),
          field: "shiftTime",
          title: "交接完成",
        },
      ].filter((el) => !el.hidden);

      list.reverse().some((el) => item[el.field] && (el.active = true));
      list.reverse();

      return list;
    },
    async getList() {
      const res = await this.$api.timeAxis(
        this.hospitalId + "_" + this.hospitalArea
      );
      this.allList = res.body;
      this.play();
    },
    play() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (this.cycles === 3) {
          // 轮播3次重新获取数据
          this.cycles = 0;
          this.getList();
        } else {
          if (this.curPage < Math.ceil(this.allList.length / 4) - 1) {
            this.curPage += 1;
          } else {
            this.cycles += 1;
            this.curPage = 0;
          }
          this.play();
        }
      }, 5000);
    },
    // 性别样式名
    genderClass(type) {
      let cls = "gender";
      switch (type) {
        case "女":
          cls += " female";
          break;
        case "男":
          cls += " male";
          break;
        default:
          break;
      }
      return cls;
    },
  },
};
</script>

<style lang="less" scoped>
.task-list-wrapper {
  margin-top: 16px;
  min-height: calc(100vh - 138px);
  background-color: rgba(59, 81, 105, 0.1);
  border: 2px solid rgba(126, 181, 255, 0.6);
  box-shadow: 0px 0px 24px 0px rgba(103, 168, 255, 0.35) inset;
  .task-list {
    height: calc(100% - 5px);
    background: radial-gradient(
          closest-side at 50% 1px,
          #3caceb 80%,
          transparent
        )
        center -3px repeat-y,
      linear-gradient(
          to bottom,
          #3caceb 5px,
          rgba(255, 0, 0, 0) 5px,
          rgba(255, 0, 0, 0) 100%
        )
        60px -5px repeat-y,
      linear-gradient(
          to bottom,
          #3caceb 5px,
          rgba(255, 0, 0, 0) 5px,
          rgba(255, 0, 0, 0) 100%
        )
        calc(100% - 60px) -5px repeat-y;
    background-size: 110% 236px, 16px 236px, 16px 236px;
    .task-list-item {
      padding: 30px 0 30px 24px;
      .info-card {
        padding: 16px 19px;
        height: 174px;
        width: 392px;
        background-color: rgba(60, 172, 235, 0.15);
        font-size: 25px;
        &::before {
          background: linear-gradient(
                to bottom,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              left top no-repeat,
            linear-gradient(
                to right,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              left top no-repeat,
            linear-gradient(
                to bottom,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              right top no-repeat,
            linear-gradient(
                to left,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              right top no-repeat,
            linear-gradient(
                to top,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              left bottom no-repeat,
            linear-gradient(
                to right,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              left bottom no-repeat,
            linear-gradient(
                to top,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              right bottom no-repeat,
            linear-gradient(
                to left,
                #3caceb 0%,
                #3caceb 20%,
                transparent 20%,
                transparent 100%
              )
              right bottom no-repeat;
          background-size: 16px 16px;
        }
        .plate-number {
          font-weight: normal;
        }
        .right {
          width: 190px;
          .name {
            white-space: nowrap;
          }
          .gender {
            margin-left: 12px;
            width: 26px;
            height: 20px;
            background-size: contain;
            background-repeat: no-repeat;
            font-size: 12px;
            &.male {
              color: transparent;
              background-image: url(~@/assets/male.png);
            }
            &.female {
              color: transparent;
              background-image: url(~@/assets/female.png);
            }
          }
        }
       
        .flex-c-b:last-child {
          margin-top: 12px;
          .ambulance-belongs {
            text-align: center;
            font-size: 20px;
            line-height: 36px;
            text-shadow: 0px 3px 1px rgba(2, 23, 41, 0.5);
            flex: 1 1 120px;
            height: 73px;
            margin-top: 10px;
            // border:1px solid #f00;
            // background-image: url(~@/assets/forma.png);
            background-size: 100% 100%;
            overflow: hidden;
          }
          .arrow {
            min-width: 72px;
            flex: auto;
            height: 36px;
            background: url(~@/assets/arrow.png) no-repeat center;
          }
          .this-hospital {
            font-size: 20px;
            flex: 1 1 120px;
            height: 73px;
            margin-top: 10px;
            line-height: 36px;
            overflow: hidden;
            text-align: center;
          }
        }
      }
      .time-line {
        flex: 1 1 auto;
        padding: 0 24px;
        height: 176px;
        .time-item {
          opacity: 0.7;
          margin-top: 10px;
          flex: 1 1;
          position: relative;
          min-height: 136px;
          &.done {
            opacity: 1;
          }
          &:before,
          &:after {
            content: "";
            display: block;
            width: calc(50% - 20px);
            height: 2px;
            background-color: #3caceb;
            position: absolute;
            top: calc(50% - 2px);
            box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.35);
          }
          &:before {
            left: 0;
          }
          &:after {
            right: 0;
          }

          // &:first-child:before {
          //   width: 80%;
          //   left: calc(-30% - 20px);
          //   background-color: unset;
          //   background-image: linear-gradient(to right, transparent, #2772e3);
          // }
          &:last-child:after {
            content: none;
          }

          &-title {
            font-size: 17px;
          }

          &-time {
            opacity: 0.9;
            font-size: 14px;
            .item-date {
              height: 19px;
            }
            .item-time {
              height: 26px;
              font-size: 20px;
            }
          }

          &-dot {
            margin: 16px 0;
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 100%;
            background-color: #fff;
            position: relative;
          }

          &.active {
            .time-item-title > span {
              display: inline-block;
              background-color: #fff;
              width: 142px;
              height: 40px;
              box-shadow: 0px 5px 29px 0px rgba(0, 138, 255, 0.71);
              border-radius: 20px;
              font-size: 18px;
              line-height: 40px;
              color: #008aff;
              margin-bottom: 4px;
            }
            .time-item-dot {
              &:before {
                content: "";
                display: block;
                position: absolute;
                top: -4px;
                left: -4px;
                width: 20px;
                height: 20px;
                border-radius: 100%;
                background-color: rgba(255, 255, 255, 0.6);
              }
              &:after {
                content: "";
                display: block;
                position: absolute;
                top: -8px;
                left: -8px;
                width: 28px;
                height: 28px;
                border-radius: 100%;
                background-color: rgba(255, 255, 255, 0.2);
              }
            }
          }
        }
      }
    }
  }
}
</style>
