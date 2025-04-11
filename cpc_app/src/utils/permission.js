import storage from 'store'
import state from '@store/state/state'
import { SET_PERMISSION } from '@store/mutations/mutations-types'

const _permission = key => {
  const obj = state.permission
  if (obj) {
    // const pObj = JSON.parse(obj)
    if (key) {
      return obj[key]
    }
    return obj
  }
  return {}
}
const hasPermission = key => {
  const resources = _permission().resources
  if (!resources) return false
  return resources.findIndex(m => m.authority === key) >= 0
}

const _resources = {
  patientMr: () => hasPermission('pateint-mr'),
  mrAdd: () => hasPermission('mr-add'),
  mrSubmit: () => hasPermission('mr-submit'),
  mrPatient: () => hasPermission('mr-patient'),
  mrFirstAid: () => hasPermission('mr-firstaid'),
  mrDischarge: () => hasPermission('mr-discharge'),
  mrInspection: () => hasPermission('mr-inspection'),
  mrTriage: () => hasPermission('mr-triage'),
  mrCure: () => hasPermission('mr-cure'),
  mrPci: () => hasPermission('mr-pci'),
  mrArchive: () => hasPermission('mr-archive'),
  mrAudit: () => hasPermission('mr-audit'),
  mrList: () => hasPermission('mr-list'),
  mrList120: () => hasPermission('mr-list-120'),
  mrListTransfer: () => hasPermission('mr-list-transfer'),
  mrListSelf: () => hasPermission('mr-list-self'),
  mrListInhospital: () => hasPermission('mr-list-inhospital'),
  chestpainQc: () => hasPermission('chestpain-qc'),
  mrQc: () => hasPermission('mr-qc'),
  mrAuditReject: () => hasPermission('mr-auditreject'),
  mrArchiveReject: () => hasPermission('mr-archivereject'),
  mrDelete: () => hasPermission('mr-delete'),
  transferList: () => hasPermission('list-transfer')
}

export { _permission, hasPermission, _resources }
