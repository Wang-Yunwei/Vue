<template>
  <div class="time-line-wrapper">
    <ul class="time-line flex-c-c">
      <li
        :class="`time-item txt-c${item.active ? ' active' : ''}`"
        v-for="item in list"
        :key="item.id"
      >
        <div class="time-item-title">
          <span v-if="item.active">{{ item.title }}</span>
          <gradient-text v-else>{{ item.title }}</gradient-text>
        </div>
        <div class="time-item-dot" />
        <div class="time-item-time">{{ (curData()[item.field]||'').replace(/T|\:\d\d$/g,' ') }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TimeLine",
  inject: ["curData"],
  data() {
    return {};
  },
  computed: {
    list() {
      let arr = [
        {
          id: "1",
          title: "准备出车",
          field: "acceptMissionTime",
        },
        {
          id: "2",
          title: "到达现场",
          field: "arrivedSceneTime",
        },
        {
          id: "3",
          title: "首次医疗接触",
          field: "touchPatientTime",
        },
        {
          id: "4",
          title: "送往医院",
          field: "leftSceneTime",
        },
        {
          id: "5",
          title: "到达医院",
          field: "arrivedHospitalTime",
        },
      ];
      arr
        .reverse()
        .some((el) => this.curData()[el.field] && (el.active = true));
      arr.reverse();
      return arr;
    },
  },
};
</script>

<style lang="less" scoped>
.time-line-wrapper {
  margin-top: 9px;
  margin-bottom: 16px;
  .time-line {
    padding: 0 140px;
    height: 120px;
    .time-item {
      flex: auto;
      position: relative;

      &:before,
      &:after {
        content: "";
        display: block;
        width: calc(50% - 20px);
        height: 2px;
        background-color: #2772e3;
        position: absolute;
        top: 50%;
      }
      &:before {
        left: 0;
      }
      &:after {
        right: 0;
      }

      &:first-child:before {
        width: 80%;
        left: calc(-30% - 20px);
        background-color: unset;
        background-image: linear-gradient(to right, transparent, #2772e3);
      }
      &:last-child:after {
        width: 80%;
        right: calc(-30% - 20px);
        background-color: unset;
        background-image: linear-gradient(to left, transparent, #2772e3);
      }

      &-title {
        font-size: 17px;
      }

      &-time {
        font-size: 14px;
        height: 19px;
      }

      &-dot {
        margin: 12px;
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 100%;
        background-color: #fff;
        position: relative;
      }

      &.active {
        height: 120px;
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
</style>
