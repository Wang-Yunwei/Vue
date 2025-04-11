/**
 * 获取医生列表
 * @deprecated
 */
export default {
  created() {
    this.getDoctors()
  },
  data() {
    return {
      doctors: [],
      doctorSearch: '',
      showDoctorPicker: false
    }
  },
  computed: {
    // 根据输入过滤医生
    doctorsSearchResult() {
      // 获取接诊医生的选择项
      const ret = []
      this.doctors.forEach(item => {
        // 搜索根据医生姓名搜索
        if (this.doctorSearch) {
          if (item.name.indexOf(this.doctorSearch) > -1) {
            // item.name  接诊医生的name中文属性
            ret.push(item.name)
          }
        } else {
          ret.push(item.name) // 没有搜索显示全部
        }
      })
      return ret
    }
  },
  methods: {
    // 获取医生列表
    getDoctors() {
      if (!this.dic?.doctorOpts || this.dic.doctorOpts.length === 0) {
        return
      }
      this.doctors = this.dic.doctorOpts.map(d => {
        return { name: d.label }
      })
    },
    changePicker(flag) {
      if (flag === 1) {
        this.doctorSearch = ''
      }
      this.showDoctorPicker = true
    }
  }
}
