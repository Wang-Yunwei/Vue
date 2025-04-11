import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['configure']),
    voiceShowed() {
      return this.configure.voiceShowed
    }
  }
}
