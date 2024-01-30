<template>
    <ion-page >
      <ion-header>
        <ion-toolbar>
          <ion-title>Personnes à charge</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="carte">
          <ion-item v-for="d in data" :key="index" >
            <ion-avatar slot="start">
              <ion-img :src="`../../public/img/personne.png`"></ion-img>
            </ion-avatar>
            <ion-label>
              <h2>{{ d.firstname }} {{ d.lastname }}</h2>
              
            </ion-label>
            <ion-button slot="end" @click="modifierPAC(index)"><ion-icon :icon="create"></ion-icon></ion-button>
          </ion-item>
      </ion-content>
      <ion-footer>
        <div class="ajouter-button-container">
          <ion-button class="ajouter-button" @click="formPAC"><ion-icon :icon="addcircle"></ion-icon></ion-button>
        </div>
      </ion-footer>
  
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton , IonIcon} from '@ionic/vue';
  import { defineComponent } from 'vue';
  import {create, createOutline, addCircle} from 'ionicons/icons';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  
  export default defineComponent({
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton },
    beforeCreate() {
      // Get our store
      const store = useStore()
      // use store.commit to run any mutation. Below we are running the loadStore mutation
      store.commit('loadStore');      
    },
    data() {
      return {
        data:[],
        create: createOutline,
        addcircle:addCircle  ,
      };
    },
    mounted(){
        this.refreshData();
    },
    methods: {
      /**
       * Navigates to the PAC creation or modification form.
       */
      formPAC() {
        const route = useRoute();
        this.$router.push({ path: '/formPAC'});
      },
      /**
       * Navigates to the PAC modification form for a specific PAC.
       * @param {number} index - The index of the PAC to be modified.
       */
      modifierPAC(index: number) {
        const route = useRoute();
        this.$router.push({ path: '/formPAC', query: { index: 1 } });
      },
      /**
       * Asynchronously refreshes PAC data for the current user from the server.
       */
      async refreshData(){
        let response = await fetch('https://sae-repihandi-api.onrender.com/pac/user/'+ this.$store.getters.user.id);
        response = await response.json();
        this.data = response;
      },
    }
});
  </script>
  
  <style scoped>
  
  .page {
    background-image: url('../../public/img/background.png');
    background-size: cover;
  }
  
  .carte {
      --background: none;
      border: gray;
  }
  ion-avatar {
    --border-radius: 50%;
  }
  
  ion-card-content{
    display: flex;
    justify-content: end;
  }
  ion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 5px;
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  ion-label {
    flex: 1;
    margin-left: 10px;
  }
  .photo{
    width: 50%;
    height: 50%;
    border-radius: 50%;
    margin-left: 25%;
    margin-right: auto;  
  }
  .centre{
    margin-left: auto;
    margin-right: auto;
  }
  .ajouter-button-container {
    display: flex;
    justify-content: center;
  
  }
  
  ion-button {
    --background: #007bff;
    --color: #fff;
    background-color:none;
  }
  
  .ajouter-button {
    width: 200px;
    
  }
  
  ion-button[aria-label="Modifier"] {
    --background: #28a745;
    --color: #fff;
  }
  
  </style>
  