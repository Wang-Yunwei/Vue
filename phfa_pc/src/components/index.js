import MedRadio from './MedRadio/Radio'
import MedSelect from './MedSelect/Select'
import StationSelect from './StationSelect'
import MedCheckbox from './MedCheckbox/Checkbox'
import FuzzyDatePicker from './FuzzyDatePicker'
import AgeInput from './AgeInput'
import DiagnosisInput from './DiagnosisInput'
import MonthRange from './MonthRange'
import HospitalAreaSelect from './HospitalAreaSelect'

export default {
  install: Vue => {
    Vue.component('med-checkbox', MedCheckbox)
    Vue.component('med-radio', MedRadio)
    Vue.component('station-select', StationSelect)
    Vue.component('month-range', MonthRange)
    Vue.component('med-select', MedSelect)
    Vue.component('fuzzy-date-picker', FuzzyDatePicker)
    Vue.component('age-input', AgeInput)
    Vue.component('diagnosis-input', DiagnosisInput)
    Vue.component('hospital-area-select', HospitalAreaSelect)
  }
}
