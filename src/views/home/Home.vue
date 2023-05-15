<template>
  <div class="text-center mt-5">
    <button
      @click="this.$router.push({ name: 'Login' })"
      class="btn btn-primary"
    >
      {{ $t('Members') }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'DefaultPage',
}
</script>
