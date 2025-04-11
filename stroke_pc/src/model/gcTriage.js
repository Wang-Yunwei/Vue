export default function GcTriage() {
  return {
    id: '',
    registId: '',
    outPatientId: '',
    rfTagId: '',
    registrationTime: '',
    arriveHospitalTime: '', // 到院时间
    triageTime: '',
    triageVisitTime: '', // 急诊医生接诊时间
    onsetTime: '', // 发病时间
    isAfterWakeup: '', // 是否为醒后卒中
    lastHealthyTime: '',
    awareTime: '',
    strokeVisitTime: '', // 卒中医生接诊时间
    strokeDoctor: '',
    isFasted: '',
    fastedId: '',
    illnessLevel: '',
    isMrs: '',
    mrsId: '',
    bloodGlucose: null,
    bloodGlucoseTime: '',
    bodyWeight: null,
    isOpenvein: '',
    openveinTime: '',
    strokeNotifyTime: '', // 通知卒中医生时间
    rrEnterTime: '',
    rrLeaveTime: ''
  }
}
