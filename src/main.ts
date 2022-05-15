import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { startApp } from './app.ts';
startApp();

new Vue({
  render: h => h(App),
}).$mount('#app');
