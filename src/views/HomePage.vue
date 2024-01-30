<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button>
            <ion-icon :icon="notifications"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">RépiHandi</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div :fullscreen="true" class="main-calendar">
        <div class="ion-padding">
          <div class="ion-text-center flex-container">
            <div v-for="(day, index) in nextSevenDays" :key="index" class="flex-item">
              <ion-button @click="selectDay(index)" class="day-button">
                {{ getDayOfWeek(new Date(day)) }}<br>
                {{ new Date(day).getDate() }}
              </ion-button>
            </div>
          </div>
          <div class="flex-container">
            <button @click="previousDay()" class="day-button plus-less-button"><ion-icon :icon="less" class="txtBtn"></ion-icon></button>
            <!-- affiche la date selectionner -->
            <p>{{ selectedDate }}</p>
            <button @click="nextDay()" class="day-button plus-less-button"><ion-icon :icon="add" class="txtBtn"></ion-icon></button>
          </div>
          <vue-cal ref="vuecal" small hide-view-selector active-view="day"
            :disable-views="['years', 'year', 'month', 'week']" :selected-date="selectedDate"
            class="vuecal--blue-theme centre" style="max-width: 360px; height: 560px;" :time-from="8 * 60"
            :time-to="19 * 60" locale="fr" :events="event" :min-date="new Date()" :hideTitleBar=true :on-event-click="onEventClick"><template
              #time-cell="{ hours}">
              <div :class="{ 'vuecal__time-cell-line': true}">
                <strong style="font-size: 15px; color: #000000;">{{ hours }}:00</strong>
              </div>
            </template>
            <template #cell-content="{ view, events}">
    <span class="vuecal__no-event" v-if="['day'].includes(view.id) && !events.length" style="color: #000000;">Aucun événement</span>
  </template>
          </vue-cal>
          


          <ion-button expand="block" class="custom-button" @click="openModal">Ajouter un créneau</ion-button>
          
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonModal, modalController,IonItem, IonList, IonSelect, IonSelectOption } from '@ionic/vue';
import Modaleevent from '../components/Modaleevent.vue';
import VueCal from 'vue-cal';
import { notifications, removeOutline,  addOutline} from 'ionicons/icons';
import 'vue-cal/dist/vuecal.css';
import PrintEventModal from '@/components/PrintEventModal.vue';
import { useStore } from 'vuex';

export default {
    name:"HomePage",
    beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
        
    },
    data(){
        return{
            nextSevenDays: [],
            tttt: null,
            selectedDate: new Date().toISOString().substr(0, 10),
            less: removeOutline,
            add: addOutline,
            event: []
        }
    },
    components:{
      IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonModal, modalController,
      PrintEventModal, VueCal, Modaleevent
    },
    mounted(){
      this.getUpcomingSevenDays();
      //this.refreshData();
    },
    beforeMount(){
      //this.getUpcomingSevenDays();
      this.refreshData();
    },
    methods:{
      selectToday(){
        this.selectedDate = new Date().toISOString().substr(0, 10);
      },

      nextDay(){
        const currentDate = new Date(this.selectedDate); // Convertit la chaîne en objet Date
        currentDate.setDate(currentDate.getDate() + 1); // Ajoute un jour
        this.selectedDate = currentDate.toISOString().substr(0, 10); // Réaffecte la valeur à selectedDate.value
        this.refreshData();
      },

      previousDay(){
        const currentDate = new Date(this.selectedDate); // Convertit la chaîne en objet Date
        //regarde si currentDate est egale a la date du jour
        if (currentDate.getDate() == new Date().getDate()) {
          //si oui on ne fait rien
        } else {
          //sinon on enleve un jour
          currentDate.setDate(currentDate.getDate() - 1); // Ajoute un jour
          this.selectedDate = currentDate.toISOString().substr(0, 10); // Réaffecte la valeur à selectedDate.value
          this.refreshData();
        }
        
      },
/**
 * Updates the selected date based on the provided index.
 * @param {number} index - The index of the next seven days array to set as the selected date.
 * 
 */
      selectDay(index){
         this.selectedDate = this.nextSevenDays[index];
      },

      getDayOfWeek(date){
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        return days[date.getDay()];
      },

      getUpcomingSevenDays(){
        const days = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          days.push(date.toISOString().substr(0, 10));
        }
        this.nextSevenDays = days;
      },
      /**
      * Opens a modal for displaying events and handles the data returned from the modal.
      * 
      */
      async openModal(){
        const modal = await modalController.create({
          component: Modaleevent,
          componentProps: { 
            activities: this.event,
            bar: this.selectedDate
          }
        });
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role === 'confirm') {
          this.refreshData();
        }
      },
      /**
       * Handles the click event on a calendar event.
       * @param event 
       * Create an instance of a modal asynchronously
       * 
       */
      async onEventClick(event){
        console.log(event);
        const modal = await modalController.create({
          component: PrintEventModal,
          componentProps: {
            eventData: event, // Passer l'événement au composant PrintEventModal
          }
        });
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role === 'confirm') {
          this.refreshData();
        }
      },
      /**
      * Asynchronously refreshes data by fetching activities for the selected date.
      */
      async refreshData(){
      let newObj = { date : this.selectedDate } 
      let response = await fetch('https://sae-repihandi-api.onrender.com/activities/date', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(newObj)
                                        })
      response = await response.json();
      this.event = response;
      this.event = this.managedate(this.event);
      console.log(this.event)
    },
    /**
    * Modifies date-related properties of each event in the event list.
    * @param {Array} eventList - The list of events to be processed.
    * @returns {Array} - The modified event list.
    */
    managedate(eventliste){
      for(const event of eventliste){
        event.title =  event.name;
        event.start = event.start.substring(0, 10) + " " + event.start.substring(11, 16);
        event.end = event.end.substring(0, 10) + " " + event.end.substring(11, 16);
        event.class = 'pink-event';
      }
      return eventliste;
    }
    }
  }
  
</script>

<style scoped>
.centre {
  margin-left: auto;
  margin-right: auto;
}

ion-content {
  --background: none;
}

.pink-event {
  background-color: pink;
}

.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
}

.flex-container button {
  margin-bottom: 10px;
}
.vuecal__time-cell-label{
  color: aquamarine;
}
.vuecal__no-event{
  color: red !important;
}


.day-button {
  background-color: #ffffff;
  color: #000000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 12px;
  padding: 0;
  margin: 0;
}

.ion-padding {
  padding: 0;
}

.pink-event {
  background-color: rgb(178, 25, 50);
}

.ion-header {
  --background: #ffffff;
}

.titleHour {
  margin-top: 10px;
}

.plus-less-button{
  font-size: 25px;
}

.txtBtn{
  position: relative;
  top:2px;
}

.vuecal__time-cell-label {
  background-color: brown;
}</style>