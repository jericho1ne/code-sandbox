export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://gist.githubusercontent.com/bss/6dbc7d4d6d2860c7ecded3d21098076a/raw/244045d24337e342e35b85ec1924bca8425fce2e/sample.small.log')
    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
  }

})
