import state from '@store/state/state'
const entitled = key =>
  state.permissions?.some(m => m.authority === `stroke-${key}`)

export { entitled }
