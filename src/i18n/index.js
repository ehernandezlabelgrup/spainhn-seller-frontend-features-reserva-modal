import Vue from 'vue';
import VueI18n from 'vue-i18n';
import * as es from './es.json';
import * as en from './en.json';
import * as fr from './fr.json';
Vue.use(VueI18n);

const messages = {
    'es': {
        ...es
    },
    'en':{
        ...en
    },
    'fr':{
        ...fr
    }
}

// export default messages;
export default new VueI18n({
    locale: 'en',
    messages,
})