<template>
  <div class="navbar">
    <ul>
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/heroku-logs">heroku logs</RouterLink>
      </li>
      <!-- <li><RouterLink to="/about">about</RouterLink></li> -->
    </ul>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  position: relative;
  background: #fefefe;
  width: 100%;

  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    list-style-type: none;
    padding: 0;
    width: 100%;


    li {
      padding: 10px 20px;
      border-left: 1px solid;
      font-size: 14px;
      transition: 350ms background-color ease-in;

      &:last-of-type {
        border-right: 1px solid;
      }

      a {
        text-decoration: none;
      }

      &:hover {
        background-color: rgba(100, 200, 50, 0.25)
      }
    }
  }
}

</style>
