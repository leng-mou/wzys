<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {initDynamicRoutes} from '@/router'
export default {
  name:'app',
  created(){
    initDynamicRoutes()
  },
  mounted(){
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      window.addEventListener('hashchange', () => {
          let currentPath = window.location.hash.slice(1)
          if (this.$route.path !== currentPath) {
              this.$router.push(currentPath);
          }
      }, false);
  }
}
}
</script>

<style lang="scss"></style>
