<script>
import { getRedirectUrl } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'UserSetting',
  computed: {
    ...mapGetters(['token2'])
  },
  created() {
    this.getUrl()
  },
  methods: {
    async getUrl() {
      const { result } = await getRedirectUrl({
        commonPath: 'authManage/infoManage/user'
      })

      if (result) window.open(result)
    }
  },
  render: function(h) {
    return h()
  }
}
</script>
