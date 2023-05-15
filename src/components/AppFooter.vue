<template>
  <CFooter>
    <div class="ms-auto">
      <div>
        {{ $t('Copyright') }}
        <span class="ms-1"
          >{{ new Date().getFullYear() }} {{ $t('All rights reserved.') }}</span
        >
      </div>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>
