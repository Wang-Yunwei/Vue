const vueReadonly = {}
vueReadonly.install = Vue => {
  Vue.directive('readonly', {
    inserted(el, binding) {
      if (binding.value === true) {
        const inputEl = el.querySelector('input')
        if (inputEl) inputEl.setAttribute('readonly', true)
      }
    }
  })
}

export default vueReadonly

