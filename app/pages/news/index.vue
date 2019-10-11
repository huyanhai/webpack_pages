<template>
  <div>vue html123</div>
</template>
<script>
export default {
  created () {
    this.$ajax({
      method: 'get',
      url: '/user/userInfo'
    }).then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err)
    });
  }
}
</script>
<style scoped>
div {
  background: palegreen;
}
</style>