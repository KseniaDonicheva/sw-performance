<template>
  <div>
    <h1>Content 1</h1>
    <div class="row">
    <img v-for = "n in 10" :key="n" v-bind:src="`../assets/${n}.jpg`">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Content1'
}

</script>
<style scoped>
img {
  width: 50%;
}
</style>
