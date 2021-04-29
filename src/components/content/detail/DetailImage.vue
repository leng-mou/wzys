<template>
  <div class="detail_image">
      <div v-if="isUploads">暂无图片</div>
      <viewer :images="images_uploads">
          <img v-for="src in images_uploads" :src="$http.defaults.baseURL+src" :key="src" width="195" height="120">
      </viewer>
  </div>
</template>

<script>
export default {
    name:'DetailImage',
    props:{
        images_uploads:{
            type:Array,
            default(){
                return []
            }
        }
    },
    data(){
        return {}
    },
    computed:{
        isUploads(){
            if(this.images_uploads.length==0){
              return true
            }else{
              return false
            }
        }
    }
}

</script>
<style scoped lang="scss">
.detail_image{
    img{
        margin:5px;
    }
}
</style>