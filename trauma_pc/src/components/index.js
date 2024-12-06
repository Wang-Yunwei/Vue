import MedRadio from './MedRadio/Radio'
import MedSelect from './MedSelect/Select'
import MedDatetime from './MedDatetime/Datetime'
import MedSubtitle from './MedSubtitle/index.vue'
export default {
  install: Vue => {
    Vue.component('med-radio', MedRadio)
    Vue.component('med-select', MedSelect)
    Vue.component('med-datetime', MedDatetime)
    Vue.component('med-subtitle', MedSubtitle)
  }
}
