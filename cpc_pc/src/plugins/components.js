import MedCheckbox from '@/components/MedCheck/Checkbox'
import MedCheckboxField from '@/components/MedCheck/CheckboxField'
import MedDatetime from '@/components/MedDatetime/Datetime'
import MedDatetimeField from '@/components/MedDatetime/DatetimeField'
import MedEcgField from '@/components/MedEcg/EcgField'
import MedRadio from '@/components/MedRadio/Radio'
import MedRadioField from '@/components/MedRadio/RadioField'
import MedSelect from '@/components/MedSelect/Select'
import MedSelectField from '@/components/MedSelect/SelectField'
import MedNumberField from '@/components/MedText/NumberField'
import MedPhoneField from '@/components/MedText/PhoneField'
import MedText from '@/components/MedText/Text'
import MedTextField from '@/components/MedText/TextField'
import MedSubtitle from '@/components/MedTitle/Subtitle'
import MedBpField from '@/components/MedBP/BpField'
import MedAddressField from '@/components/MedAddress/MedAddressField'
import MedUnitField from '@/components/MedText/MedUnitField'
import MedLayoutFlow from '@/components/MedLayout/Flow'
import MedBarChart from '@/components/MedChart/BarChart'
import MedLineChart from '@/components/MedChart/LineChart'
import MedPieChart from '@/components/MedChart/PieChart'
import MedGaugeChart from '@/components/MedChart/GaugeChart'
import MedAutocompleteField from '@/components/MedText/AutocompleteField'

export default {
  install: Vue => {
    Vue.component('med-checkbox', MedCheckbox)
    Vue.component('med-checkbox-field', MedCheckboxField)
    Vue.component('med-datetime', MedDatetime)
    Vue.component('med-datetime-field', MedDatetimeField)
    Vue.component('med-ecg-field', MedEcgField)
    Vue.component('med-radio', MedRadio)
    Vue.component('med-radio-field', MedRadioField)
    Vue.component('med-select', MedSelect)
    Vue.component('med-select-field', MedSelectField)
    Vue.component('med-number-field', MedNumberField)
    Vue.component('med-phone-field', MedPhoneField)
    Vue.component('med-text', MedText)
    Vue.component('med-text-field', MedTextField)
    Vue.component('med-subtitle', MedSubtitle)
    Vue.component('med-bp-field', MedBpField)
    Vue.component('med-address-field', MedAddressField)
    Vue.component('med-unit-field', MedUnitField)
    Vue.component('med-layout-flow', MedLayoutFlow)
    Vue.component('med-bar-chart', MedBarChart)
    Vue.component('med-line-chart', MedLineChart)
    Vue.component('med-gauge-chart', MedGaugeChart)
    Vue.component('med-pie-chart', MedPieChart)
    Vue.component('med-autocomplete-field', MedAutocompleteField)
  }
}
