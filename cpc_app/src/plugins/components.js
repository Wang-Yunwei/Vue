import MedHeader from '@/components/common/MedHeader/index.jsx'
import MedTitle from '@/components/common/MedTitle/index'
import MedHintField from '@/components/common/MedHintField/index.jsx'
import MedSign from '@/components/process/MedSign'
import MedRadioButtonGroup from '@/components/common/MedRadioButtonGroup/index'
import MedRadioSelectField from '@/components/common/MedRadioSelectField/index'
import MedCheckSelectField from '@/components/common/MedCheckSelectField/index'
import MedLabResultField from '@/components/common/MedLabResultField/index'
import MedDrugDoseField from '@/components/common/MedDrugDoseField/index'
import MedTextField from '@/components/common/MedTextField/index'
import MedBpField from '@/components/common/MedBPField/index'
import MedIdcardField from '@/components/common/MedIdcardField/index'
import MedBarChart from '@/components/extension/MedChart/BarChart'
import MedLineChart from '@/components/extension/MedChart/LineChart'
import MedPieChart from '@/components/extension/MedChart/PieChart'
import MedListSelectField from '@/components/common/MedListSelectField'
import QueryList from '@/components/common/QueryList/index'
import MedDatePicker from '@/components/common/MedDatePicker'
import MedFastDateField from '@/components/common/MedFastDateField/index'
import MedViewContainer from '@/components/common/MedViewContainer'
import MedNumberField from '@/components/common/MedNumberField/index.jsx'
import MedPopupContainer from '@/components/common/MedPopupContainer'
import MedRadioButtonField from '@/components/common/MedRadioButtonField/index'
import MedEcgField from '@/components/common/MedEcgField'
import MedActionSheet from '@/components/common/MedActionSheet'
import MedEcgList from '@/components/common/MedEcgField/EcgList'
import MedEcgEdit from '@/components/common/MedEcgField/EcgEdit'
import MedDrug from '@/components/extension/MedDrug'
import MedCollapsibleCell from '@/components/extension/MedCollapsibleCell'
import MedAddressField from '@/components/extension/MedAddressField'
import MedTnField from '@/components/extension/MedTnField'
import MedPopup from '@/components/common/MedPopup'
import MedPopover from '@/components/common/MedPopover'
import MedLoading from '@/components/common/MedLoading'
import MedSwitch from '@/components/extension/MedSwitchButtonField'
import MedGaugeChart from '@/components/extension/MedChart/GaugeChart'
import MedDraggableButton from '@/components/extension/MedDraggableButton/index'
import MedRadioGroup from '@/components/common/MedRadioGroup'
import MedSelect from '@/components/common/MedSelect'

export default {
  install: Vue => {
    Vue.component('med-select', MedSelect)
    Vue.component('med-select', MedSelect)
    Vue.component('med-radio-group', MedRadioGroup)
    Vue.component('med-header', MedHeader)
    Vue.component('med-title', MedTitle)
    Vue.component('med-hint-field', MedHintField)
    Vue.component('med-sign', MedSign)
    Vue.component('med-radio-button-group', MedRadioButtonGroup)
    Vue.component('med-radio-select-field', MedRadioSelectField)
    Vue.component('med-check-select-field', MedCheckSelectField)
    Vue.component('med-text-field', MedTextField)
    Vue.component('med-bp-field', MedBpField)
    Vue.component('med-idcard-field', MedIdcardField)
    Vue.component('med-list-select-field', MedListSelectField)
    Vue.component('query-list', QueryList)
    Vue.component('med-date-picker', MedDatePicker)
    Vue.component('med-fast-date-field', MedFastDateField)
    Vue.component('med-view-container', MedViewContainer)
    Vue.component('med-popup-container', MedPopupContainer)
    Vue.component('med-number-field', MedNumberField)
    Vue.component('med-radio-button-field', MedRadioButtonField)
    Vue.component('med-lab-result-field', MedLabResultField)
    Vue.component('med-ecg-field', MedEcgField)
    Vue.component('med-drug-dose-field', MedDrugDoseField)
    Vue.component('med-drug', MedDrug)
    Vue.component('med-collapsible-cell', MedCollapsibleCell)
    Vue.component('med-address-field', MedAddressField)
    Vue.component('med-tn-field', MedTnField)
    Vue.component('med-bar-chart', MedBarChart)
    Vue.component('med-line-chart', MedLineChart)
    Vue.component('med-pie-chart', MedPieChart)
    Vue.component('med-action-sheet', MedActionSheet)
    Vue.component('med-ecg-list', MedEcgList)
    Vue.component('med-ecg-edit', MedEcgEdit)
    Vue.component('med-popup', MedPopup)
    Vue.component('med-popover', MedPopover)
    Vue.component('med-loading', MedLoading)
    Vue.component('med-switch', MedSwitch)
    Vue.component('med-gauge-chart', MedGaugeChart)
    Vue.component('med-draggable-button', MedDraggableButton)
  }
}
