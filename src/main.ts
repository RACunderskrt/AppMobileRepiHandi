import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createStore } from 'vuex'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

const store = createStore({
  state () {
      return {
          user: { id: undefined, mail: undefined }
          
      }
  },
  getters: {
      user (state) {
          return state.user;
      }
  },
  mutations: {
    addUser(state, newUser) {
      if(newUser.id !== undefined && newUser.mail !== undefined && typeof newUser.mail == 'string') {
          state.user = newUser
        }
    },

    loadStore() {
      if(localStorage.getItem('store')) {
          try {
              this.replaceState(JSON.parse(localStorage.getItem('store')));
          }
          catch(e) {
              console.log('Could not initialize store', e);
          }
      }
  }

  }
});

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
})



const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store);
  
router.isReady().then(() => {
  app.mount('#app');
});