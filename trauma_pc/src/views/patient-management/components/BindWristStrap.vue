<template>
    <el-dialog :title="tagInfoFun().tagId ? '腕带信息' : '绑定腕带'" width="600px" :visible.sync="value" :before-close="handleClose" :close-on-click-modal="false">
        <div v-if="tagInfoFun().tagId" style="padding: 0 20px;">
            <div class="cellA">
                <div v-for="(item, index) in listB" :key="index" class="cellB">
                    <div style="flex:1;">
                        <div style="margin-bottom: 10px;">{{ item.label + '首次感应时间' }}</div>
                        <div>{{ item.label + '末次感应时间' }}</div>
                    </div>
                    <div style="flex:1;color: grey;">
                        <div style="margin-bottom: 10px;">{{ item.startTime ? item.startTime : '暂无数据' }}</div>
                        <div>{{ item.endTime ? item.endTime : '暂无数据' }}</div>
                    </div>
                    <div style="line-height: 2.3rem;">
                        <el-button plain size="small" type="primary" :disabled="item.disabled" @click="item.startTime || item.endTime ? importWristTime(item) : ''">导入</el-button>
                    </div>
                </div>
            </div>
            <div style="display: flex;justify-content: center;">
                <el-button type="success" @click="unbindWrist">解绑腕带</el-button>
            </div>
        </div>
        <div v-else>
            <el-form>
                <el-form-item label="腕带编号">
                    <el-select v-model="wristItem" placeholder="请选择">
                        <el-option v-for="(item, index) in list" :key="index" :label="item.tagName" :value="{ key: item.tagName, value: item.tagId }">
                            <span style="float: left">{{ item.tagName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tagId }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div style="margin-left: 3.3rem;">
                        <el-button style="margin-left: 1rem; background-color: rgb(75,96,253); color: white;" @click="bindRfTagId">
                            绑定
                        </el-button>
                        <el-button style="margin-left: 1rem;" @click="handleClose">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'TraumaPcBindWristStrap',
    inject: ['registIdFun', 'nameFun', 'tagInfoFun'],
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            wristItem: '',
            list: [],
            form: {},
            wristTime: {},
        }
    },
    computed: {
        ...mapGetters(['hospitalId']),
        listB() {
            return [
                { label: '抢救室', startTime: this.form.rescueEnterTime, endTime: this.form.rescueLeaveTime, timeType: '1', disabled: false },
                { label: '急救CT', startTime: this.form.ctEnterTime, endTime: this.form.ctLeaveTime, timeType: '2', disabled: true },
                { label: '手术室', startTime: this.form.orEnterTime, endTime: this.form.orLeaveTime, timeType: '3', disabled: false },
            ]
        }
    },
    methods: {
        unbindWrist() {
            // 解绑腕带
            this.$confirm(`确定要给患者【${this.nameFun()}】解绑腕带【${this.tagInfoFun().tagName}】?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.unBindRfTagId({
                    registId: this.registIdFun(),
                    rfTagId: this.tagInfoFun().tagId,
                    type: "2"
                }).then(res => {
                    if (res.code === '000000') {
                        this.wristTime.unBind = true
                        this.handleClose()
                        this.$message({
                            type: 'success',
                            message: '解绑腕带成功'
                        })
                    }
                })
            })
        },
        importWristTime(val) {
            // 导入腕带时间
            this.$api.importWristTime({
                ...val,
                registId: this.registIdFun(),
            }).then(res => {
                if (res.code === '000000') {
                    switch (val.timeType) {
                        case '1':
                            this.wristTime.rescueRoom = {
                                ...val,
                                startTime: this.$moment(this.form.rescueEnterTime).format("YYYY-MM-DD HH:mm"),
                                endTime: this.$moment(this.form.rescueLeaveTime).format("YYYY-MM-DD HH:mm"),
                            }
                            break;
                        case '3':
                            this.wristTime.operatingRoom = {
                                ...val,
                                startTime: this.$moment(this.form.orEnterTime).format("YYYY-MM-DD HH:mm"),
                                endTime: this.$moment(this.form.orLeaveTime).format("YYYY-MM-DD HH:mm"),
                            }
                            break;
                    }
                    this.$message({
                        type: 'success',
                        message: `<div style="margin-bottom: 0.3rem">【到达${val.label}时间】导入成功</div><div>【离开${val.label}时间】导入成功</div>`,
                        dangerouslyUseHTMLString: true
                    })
                }
            })
        },
        bindRfTagId() {
            let rfTagId = this.wristItem.value
            let rfTagName = this.wristItem.key
            this.$api.checkWrist(rfTagId).then(res => {
                if (res.code === '000000' && !res.body.hasBonded) {
                    // 绑定腕带
                    this.$api.bindRfTagId({
                        rfTagId: rfTagId,
                        rfTagName: rfTagName,
                        registId: this.registIdFun()
                    }).then(res => {
                        if (res.code === '000000') {
                            this.wristTime.wristInfo = { rfTagId: rfTagId, rfTagName: rfTagName }
                            this.handleClose()
                            this.$message({
                                type: 'success',
                                message: '绑定成功'
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: '绑定失败'
                            })
                        }
                        this.wristItem = ''
                    })
                } else {
                    let patient = res.body.tagUser.patientName ? `患者【${res.body.tagUser.patientName}】` : '其他患者'
                    this.$confirm(`此腕带已绑定${patient},确定要解绑并重新绑定患者【${this.nameFun()}】?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 绑定腕带
                        this.$api.bindRfTagId({
                            rfTagId: rfTagId,
                            rfTagName: rfTagName,
                            registId: this.registIdFun()
                        }).then(res => {
                            if (res.code === '000000') {
                                this.wristTime.wristInfo = { rfTagId: rfTagId, rfTagName: rfTagName }
                                this.handleClose()
                                this.$message({
                                    type: 'success',
                                    message: '绑定成功'
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '绑定失败'
                                })
                            }
                        })
                    }).catch(() => { })
                }
            })
        },
        initWrist() {
            this.wristItem = ''
            this.list = []
            this.form = {}
            this.wristTime = {}
            if (this.tagInfoFun().tagId) {
                // 获取腕带时间
                this.$api.getTagInfo(this.registIdFun()).then(res => {
                    if (res.code === '000000' && res.body) {
                        this.form = res.body
                    }
                })
            } else {
                // 获取腕带列表
                this.$api.getRfTagList({
                    hospitalId: this.hospitalId
                }).then(res => {
                    if (res.code === '000000') {
                        this.list = res.body
                    }
                })
            }
        },
        handleClose() {
            // 关闭对话框
            this.$emit('close', this.wristTime)
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.initWrist()
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.cellB {
    display: flex;
    border-bottom: 1px solid rgb(221, 224, 230);
    padding-bottom: 20px;
    margin: 20px 0;
}

.cellA div:last-child {
    border-bottom: none;
}
</style>