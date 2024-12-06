<template>
    <el-dialog width="70%" :visible.sync="isShow" :before-close="() => $emit('close')" :close-on-click-modal="false">
        <template #title>
            <div style="width: 96%;">
                <el-row>
                    <el-col :span="11">
                        <span style="line-height: 24px;font-size: 18px;color: #303133;">
                            ISS-AIS评分 {{ readonly }}
                        </span>
                    </el-col>
                    <el-col :span="8">
                        <el-col :span="5">
                            <span style="line-height: 25px;">
                                评估时间：
                            </span>
                        </el-col>
                        <el-col :span="16">
                            <med-datetime v-model="form.gradeTime" size="mini" readonly />
                        </el-col>
                    </el-col>
                    <el-col :span="5">
                        <el-col :span="8">
                            <span style="line-height: 25px;">
                                评估医生：
                            </span>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model="form.opBy" size="mini" readonly />
                        </el-col>
                    </el-col>
                </el-row>
            </div>
        </template>
        <el-container style="background-color: white;">
            <el-header style="height: auto;">
                <div class="flex-c-b">
                    <a v-for="(item, index) in list" :key="index"
                        :class="{ 'check-active': curHead === index, 'head-card': true, 'flex-c-b': true }"
                        :style="item.value ? 'border-left: 0.2rem solid ' + issAisColor[item.value] : ''"
                        @click="curHead = index; active = '0'">
                        <div class="card-font">
                            <h5>{{ item.name }}</h5>
                            <h5>AIS: {{ item.value === 0 ? '--' : item.value }}</h5>
                        </div>
                        <div class="card-img">
                            <img :src="imageList[index]" style="width: 2rem;height: 1.8rem;">
                        </div>
                    </a>
                    <div class="card-score ">
                        <div class="score-right flex-c-c"
                            :style="`background-color: ${issAisResultColor[form.result]}`">
                            {{ form.result }}
                        </div>
                        <div class="flex-c-b">
                            <div style="text-align: center;">
                                <span>{{ form.score }}</span>
                                <br>
                                <span>ISS总分</span>
                            </div>
                            <div style="height: 2rem; border-left: 0.1rem solid rgb(255, 255, 255);" />
                            <div style="text-align: center;">
                                <span>{{ form.max }}</span>
                                <br>
                                <span>AIS最大值</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main>
                <el-tabs v-model="active">
                    <el-tab-pane v-for="(item, index) in list[curHead].oneList" :key="index">
                        <template #label>
                            <div style="display: flex;">
                                <div>
                                    {{ item.name }}
                                </div>
                                <div style="position: relative;">
                                    <div class="tab-bubble" :style="`background-color: ${issAisColor[item.value]}`"
                                        v-if="item.value !== 0">
                                        <span style="font-size: 0.7rem;">
                                            {{ '+' + item.value }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div style=" display: flex; padding: 0.8rem 0.3rem 0.3rem 0.3rem;">
                            <div v-for="(itemA, indexA) in item.twoList" :key="indexA" class="body-card"
                                @click="readonly ? '' : checkClick(itemA)">
                                <div class="flex-c-b">
                                    <div class="card-value" :style="'color: ' + issAisColor[itemA.value]">
                                        {{ itemA.value }}分
                                    </div>
                                    <div @click.stop>
                                        <el-checkbox v-model="itemA.isChecked" :disabled="readonly"
                                            @change="checkClick(null)" />
                                    </div>
                                </div>
                                <div v-for="(itemB, indexB) in itemA.threeList" :key="indexB" class="card-content">
                                    <div class="card-tag" :style="`background-color: ${issAisColor[itemA.value]}`" />
                                    <div>
                                        <span>{{ itemB.subTitle }}</span>
                                        <br>
                                        <p v-for="(str, indexC) in itemB.subContent" :key="indexC">{{ str }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
        <el-button v-if="!readonly" class="save-button" size="mini" @click="certainButt">保存</el-button>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import issAisTemplate from '@/constant/IssAisTemplate'
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcIssAis',
    mixins: [DictionariesMixin],
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        dto: {
            type: Object,
            default: () => { }
        },
        readonly: { // 是否查看详情状态
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            curHead: 0,
            active: '0',
            list: issAisTemplate(),
            imageList: [
                require('@/assets/images/头颈部.png'),
                require('@/assets/images/面部.png'),
                require('@/assets/images/胸部.png'),
                require('@/assets/images/腹盆.png'),
                require('@/assets/images/四肢.png'),
                require('@/assets/images/体表.png'),
            ],
            form: {},
        }
    },
    mounted() {
        this.initData()
    },
    computed: {
        ...mapGetters(['user']),
    },
    methods: {
        checkClick(obj) {
            // 处理checkBox
            if (obj) {
                obj.isChecked = !obj.isChecked
            }
            // 细项选中事件
            let curActive = parseInt(this.active)
            // 统计三级数据最大值赋值到二级数据value中
            const threeList = this.list[this.curHead].oneList[curActive].twoList.filter(el => el.isChecked) || []
            this.list[this.curHead].oneList[curActive].value = threeList.length > 0 ? threeList.sort((a, b) => b.value - a.value)[0].value : 0
            // 统计二级数据到一级数据中
            const twoList = this.list[this.curHead].oneList.filter(el => el.value !== 0) || []
            this.list[this.curHead].value = twoList.length > 0 ? twoList.sort((a, b) => b.value - a.value)[0].value : 0
            // 计算总结果
            const oneList = this.list.filter(el => el.value !== 0) || []
            if (oneList.length > 0) {
                const descOneList = oneList.sort((a, b) => b.value - a.value)
                if (descOneList.length > 0) {
                    // AIS最大值
                    this.$set(this.form, 'max', descOneList[0].value)
                    this.$set(this.form, 'aisValue', descOneList[0].value)// 兼容app处理
                    // ISS总分
                    let score = 0
                    if (descOneList[0].value > 5) {
                        score = 75
                    } else {
                        for (var i = 0; i < descOneList.length && i < 3; i++) {
                            score += descOneList[i].value * descOneList[i].value
                        }
                    }
                    this.$set(this.form, 'score', score)
                    //评分结果
                    let result = '创伤'
                    if (score >= 16 || descOneList[0].value >= 3) {
                        result = '严重创伤'
                    }
                    this.$set(this.form, 'result', result)
                    // 评分时间
                    this.$set(this.form, 'gradeTime', this.$moment().format(this.DATE_TIME_FORMAT.DATE_MINUTE))
                }
            }
        },
        initData() {
            // 初始化数据
            this.list = issAisTemplate()
            // this.$api.issAis().then(res => {
            //     if (res.code === '000000') {
            //         try {
            //             this.list = JSON.parse(res.body)
            //         } catch (error) {
            //             this.$message({
            //                 message: '接口数据异常',
            //                 type: 'error'
            //             })
            //         }
            //     }
            // })
        },
        certainButt() {
            // 筛出一级目录有值的数据
            const issAisList = this.list
                .filter(el => el.value !== 0)
                .sort((a, b) => b.value - a.value)
            // 组装评分详情,用于查看
            const gradeDetail = []
            issAisList.forEach(e1 => {
                const oneList = []
                e1.oneList.forEach(e2 => {
                    if (e2.value !== 0) {
                        const twoList = []
                        e2.twoList.forEach(e3 => {
                            if (e3.isChecked) twoList.push(e3.value)
                        })
                        oneList.push({
                            name: e2.name,
                            value: e2.value,
                            twoList: twoList
                        })
                    }
                })
                gradeDetail.push({
                    name: e1.name,
                    value: e1.value,
                    maxAis: e1.maxAis,
                    oneList: oneList,
                })
            })
            this.$set(this.form, 'gradeDetail', JSON.stringify(gradeDetail))
            this.$emit('close', this.form)
        },
        viewDetailsInitData() {
            // 查看详情初始化数据
            this.form = this.dto
            // 重新组装数据
            if (this.dto.gradeDetail) {
                const gradeDetail = JSON.parse(this.dto.gradeDetail)
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
        }
    },
    watch: {
        isShow(val) {
            if (val) {
                // 初始化数据
                this.initData()
                if (this.readonly) {
                    this.viewDetailsInitData()
                } else {
                    this.form = {
                        opBy: this.user.name
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';

$blue: rgb(75, 96, 253);

::v-deep .el-dialog__body {
    padding: 0 20px 20px 20px;
}

.head-card {
    width: 13%;
    height: 5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.19);
    padding: 0.3rem;

    .card-font {
        margin-left: 0.3rem;
    }

    .card-img {
        float: right;
        border-radius: 0.8rem;
        background-color: rgb(245, 245, 245);
    }
}

.check-active {
    background-color: $blue;
    color: white;
}

.card-score {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.19);
    border-radius: 0.5rem;
    width: 10rem;
    height: 5.5rem;
    padding: 0 0.5rem;
    background-color: $blue;
    color: white;

    .score-right {
        width: 5rem;
        height: 2rem;
        border-radius: 0 0.5rem;
        margin-bottom: 0.3rem;
        position: relative;
        top: -0.3rem;
        left: 4.6rem;
    }
}

.tab-bubble {
    border-radius: 1rem;
    text-align: center;
    color: white;
    position: absolute;
    line-height: 1rem;
    top: 0.8rem;
    left: -0.4rem;
    padding: 0 0.3rem;
}

.body-card {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.19);
    background-color: rgb(255, 255, 255);
    width: 10.5rem;
    height: 30rem;
    border-radius: 0.5rem;
    padding: 0.6rem;
    overflow: auto;
    margin-right: 0.6rem;
    @include scrollBar();

    .card-value {
        width: 6rem;
        border-bottom: 0.1rem solid rgb(220, 223, 230);
        padding-bottom: 0.3rem;
    }

    .card-content {
        border: 0.1rem solid rgb(237, 237, 237);
        margin-top: 0.3rem;
        padding: 0.3rem;
        position: relative;

        .card-tag {
            width: 3px;
            height: 10px;
            position: absolute;
            top: 8px;
            left: -1px;
        }
    }
}

.save-button {
    background-color: $blue;
    color: white;
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 1.8rem;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
}
</style>