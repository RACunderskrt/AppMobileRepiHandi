<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Activités</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div v-for="d in data" v-bind:key="d.id">
          <activities-comp 
            :data="d"
            @delete="openVerify"
          />
        </div>
        
      </ion-content>
    </ion-page>
  </template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton , IonIcon, IonAlert, alertController} from '@ionic/vue';
import { defineComponent } from 'vue';
import {closeCircleOutline} from 'ionicons/icons';
import { useStore } from 'vuex'
import  ActivitiesComp from '../components/ActivitiesComp.vue'

export default defineComponent({
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ActivitiesComp, IonIcon, IonAlert, alertController},
  beforeCreate() {
      // Get our store
      const store = useStore()
      // use store.commit to run any mutation. Below we are running the loadStore mutation
      store.commit('loadStore');      
  },
  data() {
    return {
      data: [],
      delete: closeCircleOutline,
      usersPAC: [],
      alertButtons: [
      {
        text: 'Annuler',
        handler: () => {
        }
      },
      {
        text: 'Valider',
        handler: () => {
          // Call the API to delete the PAC
          this.deleteAct(this.toDelete); // Assuming you want to delete the currently selected PAC
        }
      }
    ]
    };
  },
  mounted(){
    this.refreshData();
  },
  methods:{
    /**
    * Asynchronously refreshes data by fetching PAC and associated activity information for the current user.
    */
    async refreshData(){
      this.data = []
      let response = await fetch('https://sae-repihandi-api.onrender.com/pac/user/'+ this.$store.getters.user.id)
      response = await response.json()
      this.usersPAC = response

      for(let pac of this.usersPAC){
        response = await fetch('https://sae-repihandi-api.onrender.com/activities/pac/'+ pac.id)
        response = await response.json()
        for(let buf of response){
          let bufObj = {
            id: buf.id,
            title: buf.name,
            start: buf.start.substring(11, 16),
            end: buf.end.substring(11, 16),
            date: buf.start.substring(0, 10), 
            id_pac: pac.id,
            firstname: pac.firstname,
            lastname: pac.lastname
          }
          this.data.push(bufObj)
        } 
      }
      this.data.sort(this.sortArr)
    },
    /**
     * Custom sorting function for sorting activities based on date and start time.
     *  a - The first activity object to compare.
     *  b - The second activity object to compare.
     * - A negative value if 'a' should be sorted before 'b', a positive value if 'b' should be sorted before 'a', and 0 if they are equal.
     */
    sortArr(a,b){
      let res = 0
      a.date < b.date ? res = -1 : res = 1
      if(a.date === b.date)
        a.start < b.start ? res = -1 : res = 1
      return res
    },
/**
 * Deletes an activity associated with a PAC.
 * @param {Object} obj - The object containing information about the activity to be deleted.
 * @property {number} obj.id_pac - The PAC ID associated with the activity.
 * @property {number} obj.id - The ID of the activity to be deleted.
 * @returns {Promise<void>} - A Promise that resolves when the deletion is complete and data is refreshed.
 */
    async deleteAct(obj){
      let newObj = {
        id_pac: obj.id_pac,
        id_activities: obj.id
      }

      await await fetch('https://sae-repihandi-api.onrender.com/map', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newObj)
              })
      this.refreshData()
    },

    async openVerify(data){
      this.toDelete=data;
      const alert = await alertController.create({
      header:'Êtes-vous sûr ?',
      buttons: this.alertButtons,
    });
      if (alert) {
        (await alert).present();
      }
    }
  }

})
    </script>
  <style scoped>
  ion-page {
    /* Utilisation de la variable pour le fond */
    background-image: var(--background-image);
  
    /* Ajustez d'autres propriétés au besoin */
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    
    min-height: 100vh;
  }
  ion-content {
    --background: none;
}
  </style>