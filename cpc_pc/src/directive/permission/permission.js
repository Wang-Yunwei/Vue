import checkPms from '@/utils/permission'

function checkPermission(el, binding) {
  const { value: allowList } = binding

  if (Array.isArray(allowList)) {
    const hasPermission = checkPms(allowList)
    if (!hasPermission && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need permissions! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted: checkPermission,
  update: checkPermission
}
