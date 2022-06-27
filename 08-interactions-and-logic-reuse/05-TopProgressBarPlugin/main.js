import Vue from 'vue';
import App from './App.vue';
import './assets/styles/index.css';
import { router } from './router';
import TopProgressBarPlugin from './plugins/TopProgressBar/plugin';

Vue.use(TopProgressBarPlugin, { router });

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
