import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['hospitalId', 'curHospitalArea'])
  },
  methods: {
    hospitalAndArea() {
      return `${this.hospitalId}_${this.curHospitalArea}`
    }
  }
}
