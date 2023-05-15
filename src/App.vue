<template>
  <router-view />
  <img class="d-none" src="https://s11.flagcounter.com/count/vrtC/bg_FFFFFF/txt_000000/border_CCCCCC/columns_1/maxflags_12/viewers_3/labels_0/pageviews_1/flags_0/percent_0">
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';

.error_style {
  background-color: red;
  color: white;
  font-size: 0.9rem;
  margin: 0.7em 0.6em;
  border-radius: 5px;
  padding: 0.5em 0.3em;
  text-align: center;
}
.button-icon {
  margin-bottom: 0.3em;
  margin-right: 0.46em;
  fill: white;
  width: 1.3em;
  height: 1.3em;
}
.clients_chart_bg {
  background-image: url('../src/assets/images/Untitled-1.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
}
img.avatar-img {
  width: 100%;
  height: 100%;
  border: 2px solid rgb(25, 98, 233);
}
</style>
