<template>
<ion-page class="main_page">
    <ion-header>
      <ion-toolbar>
        <ion-title>RépiHandi</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="back">retour</ion-button>
        </ion-buttons>
        <h1 class="centrer">Information</h1>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding tout">
      <div>
        <hr>
        <div>
        <h2><b>{{ eventData.title }}</b></h2>   
      </div>
      <hr>
      <div class="cote">
        <div>
          <h2>{{ (eventData.start).toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year: "numeric",}) }}</h2>
        </div>
      <hr>
        <div>  
          <h2>Heure de l'évènement</h2>
          <h2>{{ (eventData.start).toTimeString().substring(0, 9) }} - {{ (eventData.end).toTimeString().substring(0, 9) }}</h2>
        </div>
      <hr>
        <div>  
          <h2>Capactité de l'évènement : {{ eventData.capacity }}</h2>
        </div> 
      <hr> 
        <div>
          <h2> Nombre de personnes inscrites :</h2><h2> {{ PACs.length }} /  {{ eventData.capacity }}</h2>
        </div>
        <ion-item>
          <ion-select
          placeholder="Selectionner Personne à charge"
          :compareWith="compareWith"
          @ionChange="currentPAC = $event.detail.value">
          <ion-select-option v-for="pac in userPACs" :value="pac">{{ pac.lastname }} {{ pac.firstname }}</ion-select-option>
          </ion-select>
        </ion-item>
      </div>
      </div>
        <ion-button expand="block" class="custom-button" :strong="true" @click="participe">Participer</ion-button>
        <ion-button expand="block" class="custom-button" color="danger" :strong="true" @click="supprimer" v-if="user.id == eventData.id_user">Supprimer</ion-button>
    </ion-content>
  </ion-page>
</template>
  
  <script lang="ts">
  import { IonPage, IonButton, modalController,IonSelect, IonSelectOption,IonItem, IonList } from '@ionic/vue';
  import { defineComponent, ref } from 'vue';
  import { useStore } from 'vuex';
  export default defineComponent({
    components: { IonItem, IonList, IonSelect, IonSelectOption },
    beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
        
    },
  data() {
    return {
      pacito : [],
      currentPAC: '',
      PACs: [],
      userPACs: [],
      user: this.$store.getters.user
    }
  },
  props: {
    eventData: {
      required: true,
    },
  },
  mounted(){
        this.refreshData();
  },
  methods: {
    compareWith(o1, o2) {
      return o1 && o2 ? o1.id === o2.id : o1 === o2;
    },
    /**
    * Asynchronously refreshes data by fetching user-specific PACs and PACs associated with the current event.
    * Filter out user-specific PACs that are already associated with the current event.
    */
    async refreshData(){
      let response = await fetch('https://sae-repihandi-api.onrender.com/pac/user/'+ this.$store.getters.user.id);
      response = await response.json();
      this.userPACs = response;
      console.log("userPACs : ",this.userPACs)

      response = await fetch('https://sae-repihandi-api.onrender.com/pac/activities/' + this.eventData.id);
      response = await response.json();
      this.PACs = response;
      console.log("PACs : ", this.PACs, this.PACs.length)

      this.userPACs = this.userPACs.filter((userPac) => !this.PACs.some(pac => JSON.stringify(userPac) === JSON.stringify(pac)));
      console.log("userPACs2 : ",this.userPACs);
      
    },

/**
 * Asynchronously handles the user's participation in an activity.
 */
async participe(){
    let id_act = this.eventData.id
    let idPAC = this.currentPAC.id;
    const mapa = {
      id_pac:idPAC,
      id_activities:id_act
    }
    console.log(mapa)
    const sent = await fetch('https://sae-repihandi-api.onrender.com/map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mapa)
            });
    modalController.dismiss({},'confirm');
  },
  /**
   * Asynchronously handles the deletion of an activity.
   */
  async supprimer(){
    console.log("Suppression de l'activité :"+this.eventData.id)
    const sent = await fetch('https://sae-repihandi-api.onrender.com/activities/'+this.eventData.id, {method: 'DELETE'});
    modalController.dismiss({},'confirm');
  }
  },

  
  setup(props) {
      console.log(props.eventData);
    const event_Name = ref('');

    const back = () => modalController.dismiss(null, 'cancel');

    return {
      back,
    };
  },
});
  </script>
<style scoped>
.main_page {
    background: url('../../public/img/background.png') no-repeat center center fixed;
    background-size: cover;
}
ion-page {
    height: 100%;
}

ion-content {
    --background: none;
}

ion-toolbar {
    --background: #88B2E3;
    text-align: center; /* Centrer le contenu de ion-toolbar */
}

ion-title {
    color: white;
    font-size: 1.5em; /* Ajuste la taille du texte du titre */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Ajoute une ombre sous ion-title */
}

h1{
    color: white;
}

ion-item {
    --background: #f8f8f8; /* Couleur de fond de l'item */
    --border-radius: 10px; /* Bordure de l'item */
    --border-color: #007bff; /* Couleur de la bordure de l'item */
    --padding-start: 10px; /* Espacement à gauche de l'item */
    --padding-end: 10px; /* Espacement à droite de l'item */
    --padding-top: 10px; /* Espacement en haut de l'item */
    --padding-bottom: 10px; /* Espacement en bas de l'item */
    margin-left: 10px; /* Espacement à gauche de l'item */
    margin-right: 10px; /* Espacement à droite de l'item */
    margin-top: 10px; /* Espacement en haut de l'item */
    margin-bottom: 10px; /* Espacement en bas de l'item */
}
div{
  text-align: center;
  background: #f8f8f8; /* Couleur de fond de l'item */
  border-radius: 10px;
  margin-left: 10px; /* Espacement à gauche de l'item */
  margin-right: 10px; /* Espacement à droite de l'item */
  margin-top: 10px; /* Espacement en haut de l'item */
  margin-bottom: 10px; /* Espacement en bas de l'item */
}

.cote{
  text-align: start;
  margin-left: 10px;
}
ion-button {
    color: rgb(70, 43, 169); /* Couleur du texte du bouton */
    --background: white; /* Couleur de fond du bouton */
    --border-color: white; /* Couleur de la bordure du bouton */
    border-radius: 10px;;
}

ion-button:hover {
    --background: #0056b3; /* Couleur de fond du bouton au survol */
}

ion-input {
  --background: transparent;
  color: black;
}

ion-textarea {
    color: black;
}
.tdout{
  /*max-width: 360px; */
  height: 560px;
}

.centrer{
  text-align: center;

}


</style>
  