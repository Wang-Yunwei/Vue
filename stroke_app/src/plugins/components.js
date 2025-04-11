import MedSign from '@/components/common/MedSign'
import QueryList from '@/components/common/QueryList'
import MedSelect from '@/components/common/MedSelect'
import MedFieldset from '@/components/common/MedFieldset'
import InputNumber from '@/components/common/InputNumber'
import MultiSelect from '@/components/common/MultiSelect'
import MedEcgField from '@/components/common/MedEcgField'
import MedUnitField from '@/components/common/MedUnitField'
import MedDatePicker from '@/components/common/MedDatePicker'
import MedRadioGroup from '@/components/common/MedRadioGroup'
import MedSelectField from '@/components/common/MedSelectField'

import MedHeader from '@/components/common/MedHeader'
import MedBPField from '@/components/common/MedBPField'
import MedHintField from '@/components/common/MedHintField'
import MedIdcardField from '@/components/common/MedIdcardField'
import MedNumberField from '@/components/common/MedNumberField'
import MedViewContainer from '@/components/common/MedViewContainer'
import MedPopupContainer from '@/components/common/MedPopupContainer'
import MedRadioButtonField from '@/components/common/MedRadioButtonField'
import MedRadioSelectField from '@/components/common/MedRadioSelectField'
import MedCheckSelectField from '@/components/common/MedCheckSelectField'
import MedTextField from '@/components/common/MedTextField/index.vue'
import PersonSelector from '@/components/common/PersonSelector/index.vue'
import MedFastDateField from '@/components/common/MedFastDateField/index.vue'
import MedActionSheet from '@/components/common/MedActionSheet/index.vue'
import MedCheckbox from '@/components/common/MedCheckbox'
import MedCollapsibleCell from '@/components/extension/MedCollapsibleCell'
import MedRangePicker from '@/components/common/MedRangePicker'

export default {
  install: Vue => {
    Vue.component('med-range-picker', MedRangePicker)
    Vue.component('med-header', MedHeader)
    Vue.component('med-bp-field', MedBPField)
    Vue.component('med-hint-field', MedHintField)
    Vue.component('med-idcard-field', MedIdcardField)
    Vue.component('med-number-field', MedNumberField)
    Vue.component('med-view-container', MedViewContainer)
    Vue.component('med-popup-container', MedPopupContainer)
    Vue.component('med-radio-button-field', MedRadioButtonField)
    Vue.component('med-radio-select-field', MedRadioSelectField)
    Vue.component('med-sign', MedSign)
    Vue.component('med-select', MedSelect)
    Vue.component('med-ecg-field', MedEcgField)
    Vue.component('med-select-field', MedSelectField)
    Vue.component('med-unit-field', MedUnitField)
    Vue.component('med-radio-group', MedRadioGroup)
    Vue.component('med-fieldset', MedFieldset)
    Vue.component('med-date-picker', MedDatePicker)
    Vue.component('query-list', QueryList)
    Vue.component('multi-select', MultiSelect)
    Vue.component('input-number', InputNumber)
    Vue.component('med-text-field', MedTextField)
    Vue.component('person-selector', PersonSelector)
    Vue.component('med-fast-date-field', MedFastDateField)
    Vue.component('med-check-select-field', MedCheckSelectField)
    Vue.component('med-action-sheet', MedActionSheet)
    Vue.component('med-checkbox', MedCheckbox)
    Vue.component('med-collapsible-cell', MedCollapsibleCell)
  }
}
