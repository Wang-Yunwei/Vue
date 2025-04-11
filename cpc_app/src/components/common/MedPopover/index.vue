<template>
  <van-popover
    v-model="show"
    v-bind="$attrs"
    v-on="$listeners"
    @close="onClose"
    @open="onOpen"
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </van-popover>
</template>

<script>
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.value
    }
  },
  computed: {},
  methods: {
    onOpen() {
      this.$backhelper.push(() => {
        this.$emit('input', false)
      })
    },
    onClose() {
      this.$backhelper.pop()
    }
  },
  watch: {
    value: function(val) {
      this.show = val
    }
  }
}
</script>
