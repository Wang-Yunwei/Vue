<template>
  <fieldset class="med-fieldset">
    <slot
name="legend"
      ><legend>{{ legend }}</legend></slot
    >
    <slot></slot>
  </fieldset>
</template>

<script>
export default {
  name: 'MedFieldset',
  props: ['legend']
}
</script>

<style lang="less" scoped>
.med-fieldset {
  border-radius: 0.15rem;
  border: 1px solid #a0acff;
  margin: 0.2rem 0.4rem;
  padding: 0.34rem 0.28rem;
  max-width: calc(100% - 0.8rem);
  legend {
    background-color: #5e74fe;
    color: #fff;
    font-size: 0.33rem;
    letter-spacing: 0.02rem;
    padding: 0.1rem 0.3rem;
    border-radius: 0.15rem;
  }
}
</style>
