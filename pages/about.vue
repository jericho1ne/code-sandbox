<template>
  <NuxtPage page-key="about" />
  <h2>About</h2>
  <p>Repo can be found at <a
      href="https://github.com/jericho1ne/code-sandbox">https://github.com/jericho1ne/code-sandbox</a></p>
  <button id="contact-us" @click="activateConversion('bmg-contact-us')">Secondary Conversion Test</button>
  <button id="form-submit" @click="activateConversion('bmg-form-submit')">Primary Conversion Test</button>
</template>
<script setup>

const activateConversion = (eventName) =>  {
  try {
    var parentUrl = window.location.href
      ? window.location.href
      : document.location.href

    if (parentUrl.includes('utm_source=googleads')) {
      dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: eventName,
        conversionValue: 1,
      })
      console.warn(`🙌 >> ${eventName} fired.`)
    }
  } catch (e) {
    window.console && window.console.log(e)
  }
}

</script>

<style lang="scss" scoped>
#form-submit,
#contact-us {
  display: none;
}
</style>
