import moment from 'moment'
import Vue from 'vue'
import { Notify } from 'vant'

let timer
let followUpNotify = null
// 强制提醒三秒,期间阻止别的提醒出现
const forceNotify = (message, duration = 3000) => {
  Notify({ type: 'warning', duration, message })
  // 记录后续提醒
  Vue.prototype.$notify = obj => (followUpNotify = obj)
  clearTimeout(timer)
  timer = setTimeout(() => {
    Vue.prototype.$notify = Notify
    if (followUpNotify) {
      // 重放后续提醒
      Notify(followUpNotify)
      followUpNotify = null
    }
  }, duration)
}

const timeValidationData = () => ({
  firstAid: {},
  triage: {},
  detection: {},
  outcome: {},
  cure: {}
})
let data = timeValidationData()

// 校验时间先后顺序
export const validateTimeSequence = (obj, partName) => {
  let isValid = true
  if (window.ENABLE_TIME_VERIFICATION) {
    data[partName] = { ...data[partName], ...obj } || {}
    const { firstAid, triage, detection, outcome, cure } = data

    const sequence = {
      firstAid: [
        [
          { 发病时间: triage.onsetTime },
          { 最后看起来正常时间: triage.lastHealthyTime }
        ],
        [{ 患者到院时间: triage.arriveHospitalTime }]
      ],
      detection: [
        [{ 患者到院时间: triage.arriveHospitalTime }],
        [{ 采血时间: detection.bloodCollectionTime }],
        [
          {
            血常规报告时间: detection.gcLisList?.find(el => el.itemType === '1')
              ?.reportTime
          },
          {
            凝血常规报告时间: detection.gcLisList?.find(
              el => el.itemType === '2'
            )?.reportTime
          },
          {
            肝肾功能及电解质报告时间: detection.gcLisList?.find(
              el => el.itemType === '3'
            )?.reportTime
          }
        ]
      ],
      ct: [
        [{ 患者到院时间: triage.arriveHospitalTime }],
        [
          {
            CT平扫检查完成时间: detection.gcImageList?.find(
              el => el.itemType === '1'
            )?.finishTime
          }
        ]
      ],
      thrombolysis: [
        [
          { 发病时间: triage.onsetTime },
          { 最后看起来正常时间: triage.lastHealthyTime }
        ],
        [{ 患者到院时间: triage.arriveHospitalTime }],
        [{ 溶栓开始谈话时间: cure.rsTalkStartTime }],
        [
          { 溶栓谈话结束时间: cure.rsTalkEndTime },
          { 溶栓家属签字时间: cure.rsInformedSignTime }
        ],
        [{ 首剂给药时间: cure.firstPharmacyTime }]
      ],
      pci: [
        [
          { 发病时间: triage.onsetTime },
          { 最后看起来正常时间: triage.lastHealthyTime }
        ],
        [{ 介入开始谈话时间: cure.pciTalkStartTime }],
        [
          { 介入谈话结束时间: cure.pciTalkEndTime },
          { 介入家属签字时间: cure.pciInformedSignTime }
        ],
        [{ 完成动脉穿刺时间: cure.femoralArteryFinishTime }],
        [{ 首次血管再通时间: cure.pciFroTime }]
      ]
    }

    const title = timeObj => Object.keys(timeObj)[0]
    const time = timeObj => Object.values(timeObj)[0]

    isValid = Object.values(sequence).every(arr =>
      arr.every(
        (timeArr, index) =>
          index >= arr.length - 1 ||
          timeArr.every(obj => {
            return (
              !time(obj) ||
              arr[index + 1].every(nextObj => {
                const valid =
                  !time(nextObj) ||
                  moment(time(obj)).diff(time(nextObj), 'm') < 0
                if (!valid) {
                  forceNotify(title(obj) + '应早于' + title(nextObj))
                }
                return valid
              })
            )
          })
      )
    )
  }
  return isValid
}

// 重置校验对象,防止切换患者后残留干扰信息
export const resetTimeValidationData = () => (data = timeValidationData())
