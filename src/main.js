import Vue from 'vue';
import App from './App.vue';
import Axios from './request/http';
import ElementUI from 'element-ui';
import router from '@/router/index';
import moment from 'moment'
import md5 from 'js-md5';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/style.css';

Vue.use(ElementUI);
Vue.use(Axios);

Vue.prototype.$md5 = md5;
Vue.prototype.$moment = moment;
// console.log('1')
// console.log(md5('hello world'))

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
    el: '#app',
    router,
    render: h => h(App),
}).$mount('#app')