<template>
  <div>
    <div class="iss-ais">
      <span v-if="required" :style="{ color: readonly ? 'rgb(154, 154, 154)' : 'red', 'padding-right': '0.1rem' }">*</span>
      <span :style="required ? 'color: #646566;' : 'color: #646566;padding-left: 0.25rem;'">ISS-AIS评分</span>
      <span v-if="!readonly" class="score-button" @click="scoreButton">
        {{ issGradeList.length > 0 ? "新增评分" : "开始评分" }}
      </span>
      <div v-for="(item, index) in issGradeList" :key="index" class="score-card">
        <div class="card-head">
          <div class="card-head-left" :style="readonly ? 'background-color: rgb(154, 154, 154);' : 'background-color: rgb(47, 89, 246);'" />
          <span :style="readonly ? 'color: rgb(154,154,154)' : ''">{{ item.gradeTime }}</span>
          <van-icon name="delete-o" color="red" @click="issDelete(item.id, index)" v-if="!readonly" style="right: -4.8rem;" />
        </div>
        <div class="card-body">
          <div style="display: flex;">
            <span class="key-font">ISS评分:</span>
            <span :style="readonly ? 'color: rgb(154,154,154);flex: 1' : 'flex: 1'">{{ item.score }}</span>
            <div @click="details(item)" style="margin-right: 0.2rem;">
              <span class="details-button" :style="readonly ? 'border: 1px solid rgb(154, 154, 246154);color: rgb(154, 154, 154);' : 'border: 1px solid rgb(47, 89, 246);color: rgb(47, 89, 246);'">点击查看详情</span>
            </div>
          </div>
          <div style="display: flex;">
            <span class="key-font">AIS最大值:</span>
            <span :style="readonly ? 'color: rgb(154,154,154);flex: 2' : 'flex: 2'">{{ item.max }}</span>
          </div>
          <div style="display: flex;">
            <span class="key-font">评分结果:</span>
            <span :style="readonly ? 'color: rgb(154,154,154);flex: 2' : 'flex: 2'">{{ item.result }}</span>
          </div>
        </div>
      </div>
    </div>
    <med-popup-container v-model="isShowScorePage" title="ISS六大区域" @backClick="goBack">
      <template #right>
        <span style="font-size: 0.47rem;" @click="save" v-if="!isDetails">
          保存
        </span>
      </template>
      <van-cell-group class="one-page-up">
        <div class="head-score flex-c-a">
          <div v-for="(num, index) in 6" :key="index">
            <span>{{ num }}分</span>
            <div :style="`background-color:${colorValues[index].color};`" class="color-block" />
          </div>
        </div>
      </van-cell-group>
      <div style="overflow: scroll;height: calc(100vh - 2.6rem)">
        <div v-for="(item, index) in list" :key="index" @click="
        listIndex = index;
      oneListIndex = 0;
      isShowtTwoPage = true;
      " class="one-page-down" :style="item.value !== 0 ? `border-left: 0.1rem solid ${colorValues[item.value - 1].color}` : ''">
          <div class="card-left">
            <img :src="imageList[index]" class="card-image" />
          </div>
          <div class="card-right">
            <div class="right-up">
              <span>{{ item.name }}</span>
              <span :style="item.value !== 0
        ? `color:${colorValues[item.value - 1].color
        }; background-color: ${colorValues[item.value - 1].rgba};`
        : ``
        ">
                AIS最大值: {{ item.value === 0 ? "--" : item.value }}
              </span>
            </div>
            <div v-if="item.value !== 0" class="right-down">
              <span v-for="(label, index) in item.oneList.filter(
        el => el.value !== 0
      )" :key="index">{{ label.name }}: {{ label.value }}分</span>
            </div>
          </div>
        </div>
        <div style="max-width: 93%;color: rgb(100, 101, 101);font-size: 0.36rem;margin: 0 auto;">
          <div v-for="(str, index) in scoringRule" :key="index" :style="`margin-bottom: 0.3rem; color: ${scoringRule.length === index + 1 ? 'red' : ''}`">
            {{ str }}
          </div>
        </div>
      </div>
      <med-popup-container v-model="isShowtTwoPage" :title="list[listIndex].name">
        <div class="two-page-up">
          <img :src="imageList[listIndex]" style="width: 1.8rem;height: 1.8rem;filter: brightness(100)" />
        </div>
        <div style="overflow: auto;height: 94%;">
          <div v-for="(item, index) in list[listIndex].oneList" :key="index" @click="
        oneListIndex = index;
      isShowThreePage = true;
      " class="two-page-down">
            <span>
              {{ item.name }}
            </span>
            <span v-if="item.value !== 0" :style="item.value !== 0
        ? `color:${colorValues[item.value - 1].color
        };float: right;width: 10%;`
        : ``
        ">{{ item.value }}分</span>
          </div>
        </div>
      </med-popup-container>
      <med-popup-container v-model="isShowThreePage" :title="list[listIndex].oneList[oneListIndex].parent +
        '-' +
        list[listIndex].oneList[oneListIndex].name
        " @_change="$refs.outerDom.scrollTop = 0">
        <div style="margin: 0.3rem;font-size: 0.38rem;color: rgb(100, 101, 101);">
          {{
        list[listIndex].oneList[oneListIndex].parent +
        "-" +
        list[listIndex].oneList[oneListIndex].name
      }}
          (可多选)
        </div>
        <div style="overflow: auto;height: 94%;" ref="outerDom">
          <div v-for="(item, index) in list[listIndex].oneList[oneListIndex]
        .twoList" :key="index" class="three-page-down" @click="isDetails ? '' :
        item.isChecked = !item.isChecked;
      checkClick();
      ">
            <div class="card-head flex-c-s">
              <div class="head-left" :style="`background-color:${colorValues[item.value - 1].color};`
        " />
              <div style="display: flex;width: 100%;">
                <div :style="`color:${colorValues[item.value - 1].color
        };flex: 90%;font-size: 0.4rem`
        ">
                  {{ item.value }}分
                </div>
                <div style="flex: 5%;margin-right: 0.6rem;">
                  <van-checkbox v-model="item.isChecked" shape="square" checked-color="rgb(85,99,228)" :disabled="isDetails" />
                </div>
              </div>
            </div>
            <div class="card-body">
              <div v-for="(spanItem, index) in item.threeList" :key="index" style="padding-bottom: 0.3rem;">
                <div class="sub-title">
                  <div class="card-body-black-triangle" />
                  <div style="flex: 98%;">{{ spanItem.subTitle }}</div>
                </div>
                <div class="sub-content" v-for="text in spanItem.subContent || []" :key="text">
                  {{ text }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </med-popup-container>
    </med-popup-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import issAisTemplate from '@/constant/issAisTemplate'
export default {
  name: 'TraumaAppIssAis',
  inject: ['readonly'],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDetails: false,
      isShowScorePage: false, // 是否显示评分页面
      issGradeList: [], // 评分数据
      list: issAisTemplate(),
      colorValues: [
        { color: '#50d2c2', rgba: 'rgba(80, 210, 194,0.2)' },
        { color: '#2ecc71', rgba: 'rgba(46, 204, 113,0.2)' },
        { color: '#accc2e', rgba: 'rgba(172, 204, 46,0.2)' },
        { color: '#fcaf2a', rgba: 'rgba(252, 175, 42,0.2)' },
        { color: '#fc7353', rgba: 'rgba(252, 115, 83,0.2)' },
        { color: '#ff3366', rgba: 'rgba(255, 51, 102,0.2)' }
      ],
      imageList: [
        require('@assets/image/头颈部.png'),
        require('@assets/image/面部.png'),
        require('@assets/image/胸部.png'),
        require('@assets/image/腹盆.png'),
        require('@assets/image/四肢.png'),
        require('@assets/image/体表.png')
      ],
      scoringRule: [
        '评分规则：',
        '1、本评分把人体分为6个区域，ISS是身体3个最严重区域的最高AIS值的平方和，即ISS = AIS1² + AIS2² + AIS3²；',
        '2、ISS分值范围为：1~75，当患者存在1处或多出 AIS=6 分损伤时，直接确定为ISS最高分值75分；',
        '3、严重创伤病人： ISS≥16分 或单部位损伤 AIS≥3分 的病人；',
        '4、NFS注释： Not further specified 不完全指定，NFS是有损伤，但具体损伤详情未做进一步检查。',
        '本评分内容采用国际版AIS-2005版评分系统，评分结果仅供参考，请以实际情况为准。'
      ],
      listIndex: 0,
      oneListIndex: 0,
      isShowThreePage: false,
      isShowtTwoPage: false
    }
  },
  mounted() {
    this.initData()
  },
  computed: {
    ...mapGetters(['registId'])
  },
  methods: {
    initData() {
      // 获取ISS-AIS评分初始化数据
      this.$api.issAis().then(res => {
        if (res.code === '000000') {
          this.list = JSON.parse(res.body)
        }
      })
    },
    goBack() {
      // 返回
      const issAisList = this.list
        .filter(el => el.value !== 0)
        .sort((a, b) => b.value - a.value)
      if (issAisList.length > 0 && !this.isDetails) {
        this.$dialog
          .confirm({
            title: '提示',
            message: '当前患者 ISS-AIS 评分未保存，请确认是否离开？',
            confirmButtonColor: 'rgb(94,116,254)'
          })
          .then(() => {
            // 关闭评分页面
            this.isShowScorePage = false
          })
          .catch(() => { })
      } else {
        // 关闭评分页面
        this.isShowScorePage = false
      }
    },
    scoreButton() {
      // 评分按钮
      this.isDetails = false
      this.initData()
      this.isShowScorePage = true
    },
    save() {
      // 保存数据
      this.isShowScorePage = false
      // 计算结果，过滤有值的数据并降序排序
      const issAisList = this.list
        .filter(el => el.value !== 0)
        .sort((a, b) => b.value - a.value)
      if (issAisList.length > 0) {
        let issScore = 0
        const aisValue = issAisList[0].value
        // 判断 ISS评分
        if (aisValue === 6) {
          issScore = 75
        } else {
          for (var i = 0; i < issAisList.length && i < 3; i++) {
            issScore += issAisList[i].value * issAisList[i].value
          }
        }
        // 判断评分结果
        let scoreResult = '创伤'
        if (issScore >= 16 || aisValue >= 3) {
          scoreResult = '严重创伤'
        }
        // 组装详情数据，用于查看详情
        const gradeDetail = []
        issAisList.forEach(element => {
          var oneList = []
          element.oneList.forEach(one => {
            if (one.value !== 0) {
              var twoList = []
              one.twoList.forEach(two => {
                if (two.isChecked) {
                  twoList.push(two.value)
                }
              })
              oneList.push({
                name: one.name,
                value: one.value,
                twoList: twoList
              })
            }
          })
          gradeDetail.push({
            name: element.name,
            value: element.value,
            oneList: oneList
          })
        })
        // 将数据push到 issAisList中
        if (!this.issGradeList) {
          this.issGradeList = []
        }
        // 组装保存到库里的对象
        const obj = {
          registId: this.registId,
          gradeType: '4',
          gradeDetail: JSON.stringify(gradeDetail),
          gradeTime: this.$moment().format('YYYY-MM-DD HH:mm'),
          score: issScore,
          max: issAisList[0].value,
          result: scoreResult
        }
        // 保存到数据库
        this.$api.gradeUpdate(obj).then(res => {
          if (res.code === '000000') {
            // 添加到列表
            obj.id = res.body
            this.issGradeList.unshift(obj)
          }
        })
      } else {
        // 关闭评分页面
        this.isShowScorePage = false
      }
    },
    checkClick() {
      // 二级数据value赋值
      this.list[this.listIndex].oneList[this.oneListIndex].value =
        this.list[this.listIndex].oneList[this.oneListIndex].twoList
          .filter(el => el.isChecked)
          .sort((a, b) => b.value - a.value)[0]?.value || 0
      // 一级数据value赋值
      this.list[this.listIndex].value =
        this.list[this.listIndex].oneList
          .filter(el => el.value !== 0)
          .sort((a, b) => b.value - a.value)[0]?.value || 0
    },
    issDelete(id, index) {
      // 删除ISS-AIS评分
      if (id) {
        this.$api.gradeDelete(id).then(res => {
          if (res.code === '000000') {
            this.issGradeList.splice(index, 1)
          }
        })
      } else {
        this.issGradeList.splice(index, 1)
      }
    },
    details(item) {
      // 查看详情详情
      this.isDetails = true
      // 重新组装数据模板
      if (item.gradeDetail) {
        this.$api.issAis().then(res => {
          if (res.code === '000000') {
            this.list = JSON.parse(res.body)
            const gradeDetail = JSON.parse(item.gradeDetail)
            gradeDetail.forEach(oneDto => {
              this.list.forEach(element => {
                if (oneDto.name === element.name) {
                  element.value = oneDto.value
                  oneDto.oneList.forEach(twoDto => {
                    element.oneList.forEach(pop => {
                      if (twoDto.name === pop.name) {
                        pop.value = twoDto.value
                        twoDto.twoList.forEach(num => {
                          pop.twoList.forEach(car => {
                            if (num === car.value) {
                              car.isChecked = true
                            }
                          })
                        })
                      }
                    })
                  })
                }
              })
            })
          }
        })
      }
      this.isShowScorePage = true
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.issGradeList = val
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .med-view-container-body {
  background-color: rgb(239, 239, 239);
}

.iss-ais {
  width: 96%;
  margin: 0.3rem auto;
  font-size: 0.4rem;
  padding-top: 0.1rem;

  .score-button {
    float: right;
    background-color: rgb(94, 116, 254);
    color: white;
    margin-right: 0.1rem;
    border-radius: 1rem;
    padding: 5px 0.2rem;
  }

  .score-card {
    box-shadow: 0px 5px 10px #a6a6a6;
    margin: 0.3rem auto;
    border-radius: 0.15rem;

    .key-font {
      flex: 1;
      color: #aaa;
    }

    .card-head {
      padding: 0.2rem;
      font-size: 0.38rem;
      display: flex;

      .card-head-left {
        width: 0.1rem;
        height: 0.4rem;
        border-radius: 1rem;
        margin-right: 0.1rem;
      }
    }

    .card-body {
      font-size: 0.4rem;

      >div {
        margin-left: 0.4rem;
        line-height: 0.7rem;
      }

      .details-button {
        border-radius: 0.5rem;
        padding: 0 0.2rem;
      }
    }
  }
}

.one-page-up {
  background-origin: content-box;

  .head-score {
    font-size: 0.4rem;
    color: rgb(178, 178, 180);

    .color-block {
      width: 0.3rem;
      height: 0.3rem;
      display: inline-block;
      margin-top: 0.3rem;
      margin-right: 0.37rem;
    }
  }
}

.one-page-down {
  background-color: rgb(255, 255, 255);
  margin: 0.2rem auto;
  border-radius: 15px;
  width: 96%;
  padding: 0.4rem 0;
  display: flex;

  .card-left {
    flex: 15%;
    margin-right: 0.3rem;

    .card-image {
      margin-left: 0.5rem;
      width: 1.2rem;
      height: 1.2rem;
      background-color: rgb(245, 245, 245);
      border-radius: 0.5rem;
    }
  }

  .card-right {
    flex: 85%;
    font-size: 0.4rem;

    .right-up {
      padding-bottom: 0.3rem;
      margin-top: 0.3rem;

      :last-child {
        float: right;
        width: 33%;
        padding: 0.1rem 0 0.1rem 0.18rem;
        border-radius: 0.2rem 0 0 0.2rem;
        font-size: 0.36rem;
        color: rgb(100, 101, 101);
      }
    }

    .right-down {
      width: 100%;
      border-top: 1px solid rgb(190, 190, 190);
      display: inline-block;
      padding-top: 0.16rem;
      line-height: 1rem;

      &>span {
        border-radius: 0.4rem;
        background: rgb(239, 239, 239);
        color: rgb(100, 101, 101);
        font-size: 0.3rem;
        padding: 0.2rem 0.2rem;
        text-align: center;
        margin: 0.3rem 0.3rem 0 0;
        line-height: 2.5;
        white-space: nowrap;
      }
    }
  }
}

.two-page-up {
  text-align: center;
  background-color: rgb(51, 59, 210);
}

.two-page-down {
  background-color: #fff;
  border-radius: 0.1rem;
  width: 90%;
  margin: 0.2rem auto;
  padding: 0.5rem 0.3rem;
  font-size: 0.4rem;
}

.three-page-down {
  border: 0.03rem solid rgb(190, 190, 190);
  border-radius: 20px;
  width: 96%;
  padding-bottom: 0.3rem;
  margin: 0.2rem auto;
  background-color: #fff;

  .card-head {
    padding: 0.2rem 0 0.1rem 0;
    line-height: 0.5rem;

    /deep/ .van-checkbox__icon .van-icon {
      border-radius: 0.1rem;
    }

    .head-left {
      border-radius: 10px;
      width: 4px;
      height: 0.5rem;
      margin-right: 0.3rem;
    }

    .head-right {
      border: 3px solid rgb(100, 101, 101);
      width: 0.35rem;
      height: 0.35rem;
      border-radius: 0.1rem;
      line-height: 0.35rem;
      text-align: center;
    }
  }

  .card-body {
    border-top: 1px solid rgb(178, 178, 180);
    width: 90%;
    margin: 0.1rem auto;
    padding: 0.2rem 0.4rem;
    font-size: 0.34rem;

    .sub-title {
      display: flex;

      .card-body-black-triangle {
        flex: 1.5%;
        height: 0.12rem;
        border-radius: 0.1rem;
        border: 2px solid rgb(51, 59, 210);
        margin: 0.15rem 0.2rem 0 0;
      }
    }

    .sub-content {
      line-height: 1.5;
      padding: 0.2rem;
      margin: 5px 0.4rem;
      position: relative;
      background-color: rgb(242, 244, 245);
    }
  }
}
</style>
