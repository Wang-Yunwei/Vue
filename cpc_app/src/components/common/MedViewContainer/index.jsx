import './index.less'
import MedHeader from './../MedHeader'
import {
  getClass,
  getStyle,
  initDefaultProps,
  getListeners,
  getOptionProps
} from '../../_utils/props-util'
const selfProps = (defaultProps = {}) => {
  return initDefaultProps(
    {
      ...MedHeader.props,
      returnLabel: {
        type: String,
        required: false,
        default: '返回'
      },
      hideHeader: {
        type: Boolean,
        default: false
      },
      scroll: {
        type: Boolean,
        default: false
      }
    },
    defaultProps
  )
}
export default {
  name: 'MedViewContainer',
  inheritAttrs: false,
  components: { MedHeader },
  props: selfProps({}),
  data() {
    return {
      headerHeight: 0,
      clientHeight: 0,
      nowHeight: 0
    }
  },
  methods: {
    onClickLeft() {
      const obj = getListeners(this)
      if (obj && (obj['backClick'] || obj['return'])) {
        obj['backClick'] && obj['backClick']()
        obj['return'] && obj['return']()
      } else {
        this.$router.go(-1)
      }
    },
    initHeight() {
      const headerHeight = this.$refs.header.$el.offsetHeight || 0
      const footerHeight = this.$refs.footer.offsetHeight || 0
      this.clientHeight = document.documentElement.clientHeight || 0
      this.headerHeight = headerHeight
      this.footerHeight = footerHeight
    }
  },
  watch: {
    nowHeight: function() {
      if (this.nowHeight !== this.clientHeight) {
        this.initHeight()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initHeight()
    })

    window.onresize = () => {
      this.nowHeight = document.documentElement.clientHeight
      // console.log('onresize', this.nowHeight)
    }
  },
  render() {
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const ChildProps = {
      attrs: this.$attrs,
      props: {
        ...getOptionProps(this),
        leftText: this.returnLabel
      },
      on: {
        ...getListeners(this),
        backClick: this.onClickLeft
      }
      // scopedSlots: this.$scopedSlots
    }
    const bodySlots = Object.keys(this.$slots).map(slot => {
      if (slot === 'default') return this.$slots[slot]
    })
    const headerSlots = Object.keys(this.$slots).map(slot => {
      if (slot === 'title') {
        return <template slot={'title'}>{this.$slots[slot]}</template>
      }
      if (slot === 'left-part' || slot === 'left') {
        return <template slot={'left'}>{this.$slots[slot]}</template>
      }
      if (slot === 'right-part' || slot === 'right') {
        return <template slot={'right'}>{this.$slots[slot]}</template>
      }
    })
    const bodyHeight =
      this.clientHeight - this.headerHeight - this.footerHeight

    const html = document.querySelector('html')
    const htmlFontSize = parseFloat(html.style.fontSize)
    const RemHeaderHeight = (this.headerHeight - 3) / htmlFontSize
    const RemBodyHeight = bodyHeight / htmlFontSize
    return (
      <div
        class={{
          'med-view-container-wrapper': true,
          'med-view-container-disable-scroll': !this.scroll
        }}
        {...TProps}
      >
        <med-header ref="header" v-show={!this.hideHeader} {...ChildProps}>
          {headerSlots}
        </med-header>
        <div
          class="med-view-container-body"
          style={{
            paddingTop: RemHeaderHeight + 'rem',
            height: RemBodyHeight + 'rem'
          }}
        >
          {bodySlots}
        </div>
        <div
          ref="footer"
          class={{
            'med-view-container-bottom': this.$slots['bottom-part'],
            'med-view-container-bottom-hidden': !this.$slots['bottom-part']
          }}
        >
          {this.$slots['bottom-part']}
        </div>
      </div>
    )
  }
}
