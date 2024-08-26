<template>
  <NuxtPage page-key="about" />
  <h2>About</h2>
  <p>Repo can be found at <a href="https://github.com/jericho1ne/code-sandbox">https://github.com/jericho1ne/code-sandbox</a></p>
  <button id="form-submit" @click="activateConversion">Conversion Test</button>
</template>
<script setup>

const activateConversion = () =>  {
  try {
    var parentUrl = window.location.href
      ? window.location.href
      : document.location.href

    if (parentUrl.includes('utm_source=googleads')) {
      dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'bmg-form-submit',
        conversionValue: 1,
        formId: 'pardot-form',
      })
      console.warn('🙌 >> form-submit fired.')
    }
  } catch (e) {
    window.console && window.console.log(e)
  }
}

</script>

<style lang="scss" scoped>
#form-submit {
  display: none;
}
</style>
