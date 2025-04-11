import state from '@store/state/state'
export default function Gc() {
  return {
    name: '',
    age: null,
    gender: '',
    patientId: '',
    registId: '',
    distressCase: '',
    outPatientNo: '',
    patientNo: '',
    admissionNo: '',
    isTimearea: '',
    comeType: '',
    attackTime: '',
    createTime: '',
    createName: 'adminx',
    // 院前任务号
    firstaidNo: '',
    hospitalId: state.hospitalId,
    hospitalArea: '',
    isAttackUncertain: '',
    distressCaseDetail: []
  }
}
