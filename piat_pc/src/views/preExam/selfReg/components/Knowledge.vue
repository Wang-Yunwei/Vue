<template>
  <div class="pre-exam-knowledge-wrapper">
    <med-s-card title="知识库" class="container-card no-divider">
      <template #extra>
        <systemlevel :level="sharedData.sysLevel.knowledge" />
      </template>
      <div class="main-types">
        <med-s-radio
          :optionList="mainTypeList"
          @change="handleMainTypeChange"
          buttonType
          :value="mainType"
          continuous
        />
      </div>
      <br />
      <div class="shortcuts" ref="shortcuts">
        <med-s-radio
          :optionList="shortcuts"
          @change="
            id =>
              openBasisDirectly(
                id,
                shortcuts.find(el => el.value === id),
                true
              )
          "
          buttonType
          :key="shortcut"
          :initialValue="shortcut"
        />
      </div>
      <div class="tabs">
        <a-tabs :active-key="activeTab" @change="handleSwitchTab">
          <a-tab-pane key="1" class="complaint-classification">
            <div slot="tab" class="tab-title">1-主诉分类</div>
            <template>
              <div class="search-box">
                <auto-complete
                  allow-clear
                  class="main-category-search"
                  dropdown-class-name="main-category-search-dropdown"
                  :dropdown-match-select-width="false"
                  placeholder="搜索主诉"
                  style="width:100%"
                  @select="(val, opt) => openBasisDirectly(val, opt.data.attrs['data-option'])"
                  v-model="queries[0].keyword"
                >
                  <template slot="dataSource">
                    <a-select-opt-group v-for="group in queries[0].result" :key="group.key">
                      <span slot="label">
                        {{ group.title }}
                      </span>
                      <a-select-option
                        v-for="opt in group.children"
                        :key="opt.value"
                        :value="opt.value"
                        :hidden="opt.disabled"
                        :data-option="opt"
                      >
                        {{ opt.label }}
                      </a-select-option>
                    </a-select-opt-group>
                  </template>
                  <a-input @change="handleMainSearch">
                    <a-icon slot="suffix" :type="queries[0].searching ? 'loading' : 'search'" class="search-icon" />
                  </a-input>
                </auto-complete>
              </div>
              <div class="content-box" :style="{ height: contentHeight }">
                <med-s-radio
                  :optionList="mainComplaintList"
                  @change="handleSelectMainComplaint"
                  buttonType
                  :value="mainComplaint"
                />
              </div>
            </template>
          </a-tab-pane>
          <a-tab-pane key="2" class="patient-complaint">
            <div slot="tab" class="tab-title">2-患者主诉</div>
            <template>
              <div class="search-box">
                <a-input allow-clear v-model="queries[1].keyword" placeholder="分诊知识库">
                  <a-icon slot="suffix" type="search" />
                </a-input>
              </div>
              <div class="content-box" :style="{ height: contentHeight }">
                <med-s-radio
                  :optionList="patientComplaintList | filterByKeyword(queries[1].keyword)"
                  @change="handleSelectPatientComplaint"
                  buttonType
                  :value="patientComplaint"
                />
              </div>
            </template>
          </a-tab-pane>
          <a-tab-pane key="3" class="triage-basis">
            <div slot="tab" class="tab-title">3-分诊依据</div>
            <template>
              <div class="search-box">
                <a-input allow-clear v-model="queries[2].keyword" placeholder="分诊知识库">
                  <a-icon slot="suffix" type="search" />
                </a-input>
              </div>
              <div class="content-box" ref="basisList" :style="{ height: contentHeight }">
                <a-list
                  size="small"
                  bordered
                  :data-source="basisList | filterByKeyword(queries[2].keyword)"
                  class="basis-list"
                >
                  <a-list-item
                    slot="renderItem"
                    slot-scope="item"
                    @click="handleSelectBasis(item)"
                    :class="selectedBasis === item.value ? 'active' : ''"
                  >
                    <div :class="`basis-level-${item.level}`">{{ item.label }}</div>
                  </a-list-item>
                </a-list>
              </div>
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>

      <template #actions>
        <div>
          <a-textarea v-model="secondSubjective" placeholder="第二主诉" :auto-size="{ minRows: 3 }" />
          <ul class="flex-c-s steps">
            <div>当前步骤 : &nbsp;</div>
            <li v-for="step in curStep" :key="step.value">{{ step.label }}</li>
          </ul>
        </div>
      </template>
    </med-s-card>
  </div>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import Systemlevel from './Systemlevel'
import sharedData from '../sharedData'
import { getOftenKnowledgeBase, knowledgeBase, searchknowledgebase } from '@/api/preExam/Knowledge'

export default {
  name: 'PreExamKnowledge',
  components: {
    Systemlevel,
    AutoComplete
  },
  props: {
    regId: { type: String, default: '' },
    detailInfo: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      mainType: '1', // 选中的知识库大类
      shortcut: '', // 选中的快捷方式
      mainComplaint: '', // 选中的主诉分类
      patientComplaint: '', // 选中的患者主诉
      selectedBasis: '', // 选中的分诊依据

      mainTypeList: [], // 知识库大类列表
      shortcuts: [], // 快捷方式列表
      mainComplaintList: [], // 主诉分类列表
      patientComplaintList: [], // 患者主诉列表
      basisList: [], // 分诊依据列表

      activeTab: '1',
      curStep: [],
      queries: [
        { keyword: '', searching: false, result: [] },
        {
          keyword: ''
        },
        {
          keyword: ''
        }
      ],
      contentHeight: 'auto',
      secondSubjective: '',
      sharedData
    }
  },
  // 钩子方法
  created() {
    // 初始化知识库大类数据源,快捷方式数据源和主诉分类数据源
    this.initKnowledgeBase()
  },
  methods: {
    // 获取顶部大类
    async getMainTypeList() {
      const res = await knowledgeBase('0', '', '')
      const mainTypeList = (res?.body?.label || []).map(item => {
        /* if (item.medicineType=='1'){
           value='内伤'
         }*/
        const obj = ['', '外伤', '内伤', '儿科', '小儿科']
        return {
          label: obj[item.medicineType],
          value: item.medicineType
        }
      })
      return mainTypeList
    },
    // 获取快捷链接
    async getShortcuts(mainType) {
      if (!mainType) return []
      const res = await getOftenKnowledgeBase('1', mainType)
      const shortcuts = (res?.body?.OftenPrincipalComplaint || []).map(item => {
        return {
          label: item.triageFastName,
          value: item.patientSayid,
          ...item
        }
      })
      return shortcuts
    },
    // 获取主诉分类列表
    async getMainComplaintList(mainType) {
      if (!mainType) return []
      const res = await knowledgeBase('1', mainType)
      const mainComplaintList = (res?.body?.GeneralCategory || []).map(item => {
        return {
          label: item.categoryName,
          value: item.categoryId
        }
      })
      return mainComplaintList
    },
    // 获取患者主诉列表 (根据主诉分类)
    async getPatientComplaintList(mainComplaint) {
      if (!mainComplaint) return []
      const res = await knowledgeBase('2', mainComplaint)
      const patientComplaintList = (res?.body?.ChiefComplaint || []).map(item => {
        return {
          label: item.description,
          value: item.patientSayid
        }
      })
      return patientComplaintList
    },
    // 获取分诊依据列表 (根据患者主诉)
    async getBasisList(patientComplaint) {
      if (!patientComplaint) return []
      const res = await knowledgeBase('3', patientComplaint)
      const basisList = res.body.basis.map(item => {
        return {
          label: item.knowledgeDetail,
          value: item.knowledgeId,
          level: item.systemLevel,
          categoryId: item.categoryId,
          knowledgeId: item.knowledgeId,
          patientSayid: item.patientSayid,
          medicineType: item.medicineType
        }
      })
      return basisList
    },
    //初始化默认大类,快捷方式,主诉列表
    async initKnowledgeBase() {
      const promises = [
        this.getMainTypeList(),
        this.getShortcuts(this.mainType),
        this.getMainComplaintList(this.mainType)
      ]
      const [mainTypeList, shortcuts, mainComplaintList] = await Promise.all(promises)
      this.mainTypeList = mainTypeList
      this.shortcuts = shortcuts
      this.mainComplaintList = mainComplaintList
    },
    //切换大类 查询大类下的快捷方式和主诉分类
    async handleMainTypeChange(val) {
      this.mainType = val
      this.shortcut = ''
      this.mainComplaint = ''
      this.patientComplaint = ''
      this.queries = this.queries.map(q => ({ ...q, keyword: '' }))
      this.activeTab = '1'

      const promises = [this.getShortcuts(val), this.getMainComplaintList(val)]
      const [shortcuts, mainComplaintList] = await Promise.all(promises)
      this.shortcuts = shortcuts
      this.mainComplaintList = mainComplaintList
    },
    //选中主诉分类
    async handleSelectMainComplaint(id) {
      this.activeTab = '2'
      this.mainComplaint = id
      this.shortcut = ''
      this.patientComplaintList = await this.getPatientComplaintList(id)
      const selected = this.mainComplaintList.find(ele => ele.value === id)
      if (selected) {
        this.curStep = [selected]
      }
    },
    //选中患者主诉
    async handleSelectPatientComplaint(id) {
      this.activeTab = '3'
      this.patientComplaint = id
      this.shortcut = ''
      this.sharedData.sysLevel.knowledge = 0

      this.basisList = await this.getBasisList(id)
      const selected = this.patientComplaintList.find(ele => ele.value === id)
      if (selected && this.curStep.length) {
        this.curStep.push(selected)
      }
    },
    //查询主诉
    async getOftenKnowledgeBase() {
      const resl = await getOftenKnowledgeBase()
      this.shortcuts = resl.body.ChiefComplaint.map(item => {
        return {
          label: item.description,
          value: item.patientSayid
        }
      })
    },
    //直接打开分诊依据/来自搜索结果或者快捷方式点击
    async openBasisDirectly(id, opt, isShortcut) {
      this.activeTab = '3' // 先切换页签,避免迟钝感
      this.shortcut = isShortcut ? id : ''

      this.patientComplaint = id
      this.mainComplaint = opt.categoryId

      this.basisList = [] // 防止在搜索时点错旧的数据

      this.basisList = await this.getBasisList(id)
      this.patientComplaintList = await this.getPatientComplaintList(opt.categoryId)

      const selectedMainComplaint = this.mainComplaintList.find(ele => ele.value === opt.categoryId)
      const sourceList = isShortcut ? this.shortcuts : this.patientComplaintList
      const patientComplaint = sourceList.find(ele => ele.value === id)

      this.curStep = [selectedMainComplaint, patientComplaint]
    },
    // 切换页签
    handleSwitchTab(curTab) {
      if (!this.curStep.length || (this.curStep.length < 2 && curTab === '3')) {
        return
      }
      this.activeTab = curTab
    },
    // 在主诉分类下搜索
    handleMainSearch(e) {
      const keyword = (e.target.value || '').trim()
      this.queries[0].keyword = keyword
      if (!keyword) return
      clearTimeout(this.mainSearchTimer)
      // 停止输入后500ms开始搜索
      this.mainSearchTimer = setTimeout(async () => {
        this.queries[0].searching = true
        const { body } = await searchknowledgebase(keyword, this.mainType)
        const groupedResult = []

        body.forEach(ele => {
          const { categoryId } = ele
          const item = {
            label: ele.description,
            value: ele.patientSayid,
            ...ele
          }
          const curCategory = this.mainComplaintList.find(c => c.value === categoryId)
          if (curCategory) {
            const group = groupedResult.find(r => r.key === curCategory.value)
            if (group) {
              group.children.push(item)
            } else {
              groupedResult.push({
                title: curCategory.label,
                key: curCategory.value,
                children: [item]
              })
            }
          }
        })
        if (groupedResult.length) {
          this.queries[0].result = groupedResult
        } else {
          this.queries[0].result = [
            {
              title: '没有找到相关结果',
              key: '',
              children: [{ disabled: true }]
            }
          ]
        }
        this.queries[0].searching = false
      }, 500)
    },
    // 选中分诊依据
    handleSelectBasis({ level, value }) {
      this.selectedBasis = value
      this.sharedData.sysLevel.knowledge = Number(level)
    },
    // 提交数据
    formSubmit() {
      return {
        secondSubjective: this.secondSubjective, // 第二主诉
        subjective: this.patientComplaint, // 患者主诉
        knowledgeId: this.selectedBasis // 分诊依据ID
      }
    },
    // 获取患者信息回显
    async regDetails() {
      const { secondSubjective, subjective, knowledgeId } = this.detailInfo
      this.secondSubjective = secondSubjective // 显示第二主诉

      if (knowledgeId) {
        this.activeTab = '3' // 切换到第三个页签
        this.selectedBasis = knowledgeId // 高亮对应分诊依据
      } else if (subjective) {
        this.activeTab = '2' // 切换到第三个页签
      }

      this.basisList = await this.getBasisList(subjective)
      if (this.basisList[0]) {
        const { categoryId, medicineType } = this.basisList[0]
        this.mainType = medicineType // 高亮对应的大类
        this.mainComplaint = categoryId // 高亮对应的主诉分类

        if (knowledgeId) {
          const basisItem = this.basisList.find(ele => ele.knowledgeId === knowledgeId)
          if (basisItem) {
            // 角标显示
            this.sharedData.sysLevel.knowledge = Number(basisItem.level)

            // // 列表长的时候 默认滚动到选中的那一项
            // setTimeout(() => {
            //   const { basisList } = this.$refs
            //   if (basisList) {
            //     console.log(basisList)
            //     const activeItem = basisList.querySelector('.active')
            //     if (activeItem) {
            //       activeItem.scrollIntoView()
            //     }
            //   }
            // }, 10)
          }
        }

        // 获取数据源
        const promises = [
          this.getShortcuts(medicineType),
          this.getMainComplaintList(medicineType),
          this.getPatientComplaintList(categoryId)
        ]
        const [shortcuts, mainComplaintList, patientComplaintList] = await Promise.all(promises)
        this.shortcuts = shortcuts
        this.mainComplaintList = mainComplaintList
        this.patientComplaintList = patientComplaintList
        
        this.patientComplaint = subjective // 高亮对应患者主诉


        // 设置当前步骤
        const selectedMainComplaint = mainComplaintList.find(ele => ele.value === categoryId)
        const selectedPatientComplaint = patientComplaintList.find(ele => ele.value === subjective)
        if (selectedMainComplaint && selectedPatientComplaint) {
          this.curStep = [selectedMainComplaint, selectedPatientComplaint]
        }
      }
    }
  },

  watch: {
    // 调整下方容器高度
    shortcuts(val) {
      setTimeout(() => {
        const shortcutsBoxHeight = this.$refs.shortcuts.offsetHeight
        this.contentHeight = `${413 - shortcutsBoxHeight}px`
      }, 100)
    },
    detailInfo() {
      if (this.detailInfo) {
        this.regDetails()
      }
    }
  },
  filters: {
    // 根据关键词筛选列表
    filterByKeyword(list, keyword) {
      const lowerCaseKeyword = (keyword || '').toLowerCase().trim()
      return list.filter(li => {
        const lowerCaseLabel = (li.label || '').toLowerCase()
        return lowerCaseLabel.includes(lowerCaseKeyword)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
.container-card {
  // height: 746px;
  /deep/ .ant-card-body {
    padding-top: 0;
    margin-top: -24px;
    height: calc(100% - 152px);
    overflow: auto;
  }
  /deep/ .ant-card-actions {
    margin: 0 20px 0;
    background: none;
  }

  .main-types {
    text-align: center;

    /deep/ .ant-radio-button-wrapper {
      min-width: 80px;

      &:first-child {
        border-radius: 6px 0 0 6px;
      }

      &:last-child {
        border-radius: 0 6px 6px 0;
      }
    }
  }

  .shortcuts {
    margin-bottom: 10px;
    max-height: 110px;
    overflow: auto;
    /deep/ .ant-radio-button-wrapper {
      border-radius: 6px;
      margin-bottom: 10px;
      min-width: 100px;
    }
  }

  .tabs {
    .tab-title {
      margin: -12px -16px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      background-color: lighten(@primary-color, 38%);
      &::before,
      &::after {
        content: ' ';
        border-style: solid;
        width: 0px;
        height: 0px;
        position: absolute;
        top: -8px;
        border-width: 22px 0px 22px 14px;
        border-color: transparent;
        border-left-color: #fff;
        right: -18px;
        z-index: 1;
      }

      &::after {
        right: -13px;
        border-left-color: lighten(@primary-color, 38%);
      }
    }
    /deep/ .ant-tabs-bar {
      margin-bottom: 10px;
      border: none;
      .ant-tabs-nav {
        width: 100%;
        .ant-tabs-tab {
          width: calc(33% - 3px);
          margin-right: 0;
          &:last-child {
            .tab-title {
              &::before {
                content: none;
              }
            }
          }
        }
      }
      .ant-tabs-tab-active {
        .tab-title {
          color: #fff;
          background-color: @primary-color;
          &::after {
            border-left-color: @primary-color;
          }
        }
      }
      .ant-tabs-ink-bar {
        visibility: hidden;
      }
    }

    .search-box {
      margin-bottom: 10px;
    }

    .content-box {
      overflow: auto;
      /deep/ .ant-radio-button-wrapper {
        margin-bottom: 10px;
        min-width: 114px;
      }
    }
  }
  .steps {
    padding-left: 0px;
    line-height: 36px;
    color: #888;
    li {
      margin-right: 20px;
      position: relative;
      &:not(:last-child):after {
        content: '>';
        position: absolute;
        right: -15px;
      }
    }
  }

  .basis-list {
    li {
      cursor: pointer;
      &:hover {
        background-color: rgb(246, 249, 250);
      }
      &.active {
        background-color: #ebeeef;
      }
    }
    .basis-level {
      &-1 {
        color: @level-color-1;
      }
      &-2 {
        color: @level-color-2;
      }
      &-3 {
        color: @level-color-3;
      }
      &-4 {
        color: @level-color-4;
      }
    }
  }

  .search-icon {
    /deep/ .anticon-spin {
      animation-duration: 0.2s;
    }
  }
}
</style>
