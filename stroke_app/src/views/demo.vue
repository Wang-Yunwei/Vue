<template>
  <div>
    <med-view-container
      title="标题1"
      return-label="back"
      @return="$router.push('/login')"
      scroll
      class="abc"
    >
      <van-button @click="showPopup">弹出 MedPopupContainer</van-button>
      <template #left-part>左插槽</template>
      <template #right-part>
        <div @click.stop>
          <van-popover
            v-model="showPopover"
            :actions="actions"
            trigger="click"
            placement="bottom-end"
            ref="reference"
          >
            <template #reference>
              <span><i class="iconfont iconicon1-151"/></span>
            </template>
          </van-popover>
        </div>
      </template>
      <template #bottom-part>
        <div style="text-align:center;">
          <van-button style="margin:20px;padding:20px;">
            viewContainer底部插槽
          </van-button>
        </div>
      </template>
      <!-- MedHintField Demo Start -->
      <med-hint-field
        link
        link-icon="star-o"
        hint-type="success"
        hint-message="手机号格式错误"
        required
        label="文本"
        v-model="hintField"
      >
        <template #link-icon>
          123
        </template>
      </med-hint-field>
      <med-hint-field
        ref="hintField"
        link-icon="star-o"
        required
        label="事件"
        v-model="hintField2"
        @change="() => hintFieldChange(123)"
        @link-click="hintFieldLinkClick"
      >
        <!-- <template #link-icon>
          自定义link
        </template> -->
        <template #input-part>
          4566
        </template>
      </med-hint-field>
      <!-- MedHintField Demo End -->
      <!-- MedNumberField Demo Start -->
      <med-number-field
        label="数字"
        placeholder="单位"
        unit="mg"
        scale="2"
        max="10"
        hint-type="cross"
        v-model="numberField"
        @change="numberFieldChange"
      >
        <!-- <div>
          单位插槽
        </div> -->
      </med-number-field>
      <!-- MedNumberField Demo End -->
      <!-- MedDatePicker Demo Start -->
      <med-date-picker
        v-model="datePicker"
        @change="changeTime"
        @changeTime="comfirmTime"
        :rules="[{ required: true, message: '请填写' }]"
        hint-type="success"
        hint-message="提示语"
        required
        ref="datePicker"
        clearable
      />
      <!-- MedDatePicker Demo End -->
      <!-- MedEcgField Demo Start -->
      <med-ecg-field
        label="上传"
        v-model="ecgField"
        auto-close
        prefix-url="https://baidu.com"
        :upload-url="$api.ecg.upload"
        :delete-url="$api.ecg.upload"
        :record-list="recordList"
        :readonly="false"
        listonly
        @submit="uploadSave"
        @delete-success="deleteSuccess"
      />
      <!-- MedEcgField Demo End -->
      <!-- MedEcgField Demo Start -->
      <med-bp-field label="收缩压" v-model="bpField"> </med-bp-field>
      <!-- MedEcgField Demo End -->
    </med-view-container>
    <med-popup-container
      v-model="show"
      title="popup标题"
      return-label="popup返回"
      @return="$router.push('/login')"
      scroll
      auto-bottom
    >
      <template #right-part>popup右插槽</template>
      <med-hint-field
        v-for="item in 20"
        :key="item"
        link
        link-icon="star-o"
        hint-type="cross"
        hint-message="手机号格式错误"
        required
        label="文本"
        v-model="hintField"
      >
        <template #right-part>
          123
        </template>
      </med-hint-field>
      <template #bottom-part>
        <div>
          viewContainer底部插槽
        </div>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Ecg } from '@model/commonModel'
export default {
  data() {
    return {
      ecg: Ecg(),
      show: false,
      showPopover: false,
      actions: [{ text: '选项一' }, { text: '选项二' }, { text: '选项三' }],
      hintField: '',
      hintField2: '',
      hintField3: '',
      numberField: '',
      ecgField: false,
      bpField: '1/3',
      datePicker: '',
      recordList: [
        {
          id: 'd7056688d508c18fa4961752512686c7',
          registId: '8f35df508eaf4319bb99d3ef2e3b4826',
          ecgFile:
            'http://192.168.0.96:8092/base/upload/stroke/image/2022-04-07/0239b054bade4764a773c13218ba19de.png',
          ecgTime: '2022-04-07 15:37',
          ecgDiagnosis: '0',
          ecgException: '4',
          ecgType: '1'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['dicData'])
  },
  methods: {
    showPopup() {
      this.show = true
      // this.$refs.popref.scrollBottom()
    },
    changeTime(val) {
      this.$refs.datePicker.showHint('主动展示提示语')
      console.log('changeTime', val)
    },
    comfirmTime(val) {
      console.log('comfirmTime', val)
    },
    hintFieldChange(val) {
      console.log('hintFieldChange', val)
    },
    hintFieldLinkClick() {
      this.$refs.hintField.showHint('我是提示语')
      console.log('hintFieldLinkClick')
    },
    numberFieldChange(val) {
      console.log('numberFieldChange', val)
    },
    uploadSave(type, params) {
      // type === true 为编辑保存
      // type === false 为新增保存
      console.log('uploadSave', type, params)
      // this.ecgField = false
    },
    deleteSuccess() {
      console.log('deleteSuccess')
    }
  },
  watch: {
    hintField(val) {
      console.log('HintField', val)
    }
  }
}
</script>
