import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import VCalendar from 'v-calendar';


import HomeLayout from './Layout/HomeLayout.vue'
import MonumentLayout from './Layout/MonumentLayoutImproved.vue'
import GeneralLayout from './Layout/GeneralLayout.vue';

import VueI18n from 'vue-i18n';

import * as es from './i18n/es.json';

import * as en from './i18n/en.json';

import * as fr from './i18n/fr.json';

import * as de from './i18n/de.json';


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/customStyles.css';

import { library } from '@fortawesome/fontawesome-svg-core'

import { faFortAwesome } from '@fortawesome/free-brands-svg-icons';

import { faCalendar, faPen, faClock, faCartShopping, faSignsPost, faCircleExclamation, faTriangleExclamation, faRectangleXmark, faLongArrowAltRight,
  faTicket, faSearch, faCheck, faCheckCircle, faTrash, faArrowRight, faEllipsisH, faHandHoldingDollar, faChevronLeft, 
  faChevronRight, faAngleDoubleLeft, faAngleDoubleRight, faTimesCircle, faPlus, faMinus, faPeopleGroup,faQuestionCircle, faEye, faCreditCard, faFileInvoice, faFilePdf, faMoneyBillTransfer, faBan } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

library.add( faFortAwesome, faCalendar, faPen, faClock, faCartShopping, faSignsPost, faTriangleExclamation, faCircleExclamation, faRectangleXmark, 
  faTicket, faSearch, faCheck, faCheckCircle, faTrash, faHandHoldingDollar, faArrowRight, faEllipsisH, faChevronLeft, 
  faChevronRight, faAngleDoubleLeft, faAngleDoubleRight, faTimesCircle, faPlus, faMinus, faPeopleGroup, faLongArrowAltRight, faQuestionCircle, faCreditCard, faFileInvoice, faFilePdf, faMoneyBillTransfer, faBan, faEye );

Vue.config.productionTip = false

Vue.component('home-layout', HomeLayout);
Vue.component('monumento-layout', MonumentLayout);
Vue.component('general-layout', GeneralLayout )

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use( Toast, { timeout: 4000, theme: 'colored' } );

Vue.use(VueI18n);

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VCalendar, {
  componentPrefix: 'vc'
});

const messages = {
  'en' : {...en},
  'es' : {...es},
  'fr' : {...fr},
  'de' : {...de}
}

import Notify from 'mdbvue/lib/components/Notify'
Vue.use(Notify)

import * as mdbvue from 'mdbvue'
for (const component in mdbvue) {
  Vue.component(component, mdbvue[component])
}

const i18n = new VueI18n({
  locale: 'es',
  fallbackLocale: 'es',
  messages
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
