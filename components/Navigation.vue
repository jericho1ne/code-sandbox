<template>
  <div class="navbar">
    <ul>
      <RouterLink to="/">
        <li>home</li>
      </RouterLink>
      <RouterLink to="/heroku-logs">
        <li>heroku logs</li>
      </RouterLink>
      <RouterLink to="/about">
        <li>about</li>
      </RouterLink>
    </ul>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  margin-bottom: 16px;
  position: relative;
  background: linear-gradient(to top, #09203f 0%, #537895 100%);
  width: 100%;

  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%;

    a {
      color: white;
      font-size: 14px;
      text-decoration: none;
      border-right: 1px solid #bababa;
    }

    li {
      padding: 10px 20px;
      transition: 250ms background-color ease-out;

      &:last-of-type {
        border-right: none;
      }

      &:hover {
        background-color: rgba(100, 200, 50, 0.25)
      }
    }
  }
}

</style>
