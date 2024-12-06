<template>
  <div class="consultation-contacts-wrapper">
    <div class="consultation-contacts-top">
      <med-header title="选择联系人" @backClick="backClick">
        <template #right>
          <van-button round @click="handleConfirm">确定</van-button>
        </template>
      </med-header>
      <van-search v-model="searchKey" placeholder="请输入搜索关键词" />
    </div>
    <div class="consultation-contacts-block"></div>
    <div class="consultation-contacts-main">
      <van-index-bar :index-list="indexList" sticky ref="indexBar">
        <div v-for="item in list" :key="item.key">
          <van-index-anchor :index="item.key">
            {{ item.key }}
          </van-index-anchor>
          <van-checkbox-group v-model="chosen">
            <ul>
              <li v-for="(el, index) in item.val" :key="index" class="flex-c-s">
                <van-checkbox :name="el.id">
                  <p class="flex-c-s">
                    <van-image round :src="el.avatar" />
                    <span>{{ el.name }}</span>
                  </p>
                </van-checkbox>
              </li>
            </ul>
          </van-checkbox-group>
        </div>
      </van-index-bar>
      <ol class="custom-index">
        <li
          class="custom-index-li"
          :class="{ 'custom-index-active': currentIndex === item }"
          v-for="item in indexList"
          :key="item"
          @click="indexClick(item)"
        >
          {{ item }}
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
let saveTimer = 0
export default {
  props: ['list', 'selected'],
  data() {
    return {
      searchKey: '',
      currentIndex: '',
      chosen: [],
      indexList: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
    }
  },
  computed: {
    selectedList() {
      const res = []
      this.list.forEach(item => {
        if (item.val?.length) {
          item.val.forEach(el => {
            if (this.chosen?.includes(el.id)) {
              res.push(el)
            }
          })
        }
      })

      return res
    }
  },
  created() {},
  methods: {
    handleConfirm() {
      this.$emit('confirm', this.selectedList)
    },
    backClick() {
      this.$emit('backClick')
    },
    indexClick(index) {
      if (this.currentIndex && index && this.currentIndex === index) {
        // 取消选择，展示所有
        this.currentIndex = ''
        this.getAll()
      } else {
        // 切换了索引，调接口展示当前
        this.currentIndex = index
        this.getAllUser(index?.toLowerCase())
      }
    }
  },
  watch: {
    selected: {
      immediate: true,
      handler(v) {
        this.chosen = v.map(el => el.id)
      }
    },
    searchKey: {
      handler(param) {
        clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          this.getAllUser(param)
        }, 1000)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.consultation-contacts {
  &-wrapper {
    background: #f2f4f5;
    /deep/ .med-header-wrapper .van-nav-bar {
      background: #fff;
      div,
      span,
      i {
        color: #000;
      }
      .van-button {
        height: auto;
        padding: 10px 30px;
      }
    }
    .van-search {
      padding: 0;
      .van-search__content {
        background: #fff;
      }
    }
  }
  &-block {
    width: 100%;
    height: 160px;
  }
  &-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }

  &-main {
    position: fixed;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    /deep/ .van-index-bar {
      position: relative;
      .van-index-bar__sidebar {
        display: none;
      }
    }
    ul {
      li {
        padding-bottom: 30px;
        background: #fff;
        /deep/ .van-checkbox {
          width: 100%;
          margin-left: 20px;
          display: flex;
          .van-checkbox__label {
            width: 100%;
          }
        }
        .van-image {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          margin-right: 30px;
        }
        .van-icon {
          font-size: @font-lg-size;
          color: #464c5f;
          &:nth-of-type(1) {
            font-size: @font-xl-size;
          }
        }
        p {
          border-bottom: 1px solid #dadada;
          width: 100%;
          span {
            line-height: 2.5;
            font-size: @font-lg-size;
            &.sp {
              color: #ccc;
            }
          }
        }
      }
    }
    ol {
      position: fixed;
      top: 160px;
      right: 20px;
      z-index: 999;
      li.custom-index-li {
        margin: 16px 0;
        position: relative;
        line-height: 1.8;
        padding-left: 80px;
        &.custom-index-active {
          font-size: 30px;
          position: relative;
          border-radius: 30px 0 0 30px;
          color: red;
          background: #eef0f0;
          &::before,
          &::after {
            content: "";
            position: absolute;
            height: 2px;
            width: 30px;
            top: 50%;
            left: 20px;
            margin-top: -1px;
            background: red;
          }
          &::before {
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
          }
          &::after {
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
          }
        }
      }
    }
  }
}
</style>
