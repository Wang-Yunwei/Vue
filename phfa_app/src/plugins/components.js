import MedIcon from '@/components/common/MedIcon'
import MedCalenderTime from '@/components/common/MedCalenderTime'
import MedHeader from '@/components/common/MedHeader'
import MedSign from '@/components/process/MedSign'
import MedRadioGroup from '@/components/common/MedRadioGroup'
import MedCheckboxGroup from '@/components/common/MedCheckboxGroup'
import MedFieldset from '@/components/common/MedFieldset'
import MedSelect from '@/components/common/MedSelect'
import PersonSelect from '@/components/common/PersonSelect'
import MedDatePicker from '@/components/common/MedDatePicker'
import MedEmpty from '@/components/common/MedEmpty'
import MedUploader from '@/components/common/MedUploader'

export default {
  install: Vue => {
    Vue.component('med-icon', MedIcon)
    Vue.component('med-header', MedHeader)
    Vue.component('med-sign', MedSign)
    Vue.component('med-radio-group', MedRadioGroup)
    Vue.component('med-checkbox-group', MedCheckboxGroup)
    Vue.component('med-fieldset', MedFieldset)
    Vue.component('med-select', MedSelect)
    Vue.component('person-select', PersonSelect)
    Vue.component('med-time', MedCalenderTime)
    Vue.component('med-date-picker', MedDatePicker)
    Vue.component('med-empty', MedEmpty)
    Vue.component('med-uploader', MedUploader)
  }
}
