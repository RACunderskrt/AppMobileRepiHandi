<template>
    <ion-page class="main_page">
    <ion-header>
        <ion-toolbar>
                <ion-title>RépiHandi</ion-title>
        </ion-toolbar>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button @click="cancel">Annuler</ion-button>
            </ion-buttons>
            <h1>Ajouter un créneau</h1>
            <ion-buttons slot="end">
                <ion-button :strong="true" @click="confirm">Confirm</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>
            <ion-label position="stacked">Nom de l'évènement</ion-label>
            <ion-input v-model="event_Name" placeholder="Entrer le nom de l'évènement"
                maxlength="32"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="stacked">Description de l'évènement</ion-label>
            <ion-textarea ref = "eventDescrip" v-model="eventDescrip" placeholder="Entrer la description de l'évènement"></ion-textarea>
        </ion-item>

        <!--ion-item>
            <ion-label position="stacked">Date du début de l'évènement :</ion-label>
            <ion-datetime v-model="startDate" class="titleHour" @ionChange="handleChange($event)" presentation="time" picker-format="HH:mm">
            <ion-datetime-button ref="datetimeButton"></ion-datetime-button></ion-datetime>
        </ion-item-->


        <ion-item>
            <ion-label position="stacked">Date du début de l'évènement :</ion-label>
            <ion-datetime v-model="startDate" class="titleHour" @ionChange="windowAvailable" presentation="time" picker-format="HH:mm"
                hour-values="8,9,10,11,12,13,14,15,16,17"></ion-datetime>
        </ion-item>
        <ion-item>
            <ion-label position="stacked">Date de fin de l'évènement :</ion-label>
            <ion-datetime v-model="endDate" class="titleHour" @ionChange="windowAvailable" presentation="time" picker-format="HH:mm"
                hour-values="8,9,10,11,12,13,14,15,16,17,18"></ion-datetime>
        </ion-item>
        <ion-item>
            <ion-label position="stacked">Nombre de bénéficiaires</ion-label>
            <ion-select v-model="selectCapacite" @ionChange="handleChange(selectCapacite)">
                <ion-select-option v-for="n in numberOfPAC" :value="n" v-bind:key="n">{{n}}</ion-select-option>
            </ion-select>
        </ion-item>
        <!--ion-item>
            <ion-label position="stacked">Adresse de l'évènement :</ion-label>
            <ion-input v-model="event_adresse" placeholder="Entrer l'adresse de l'évènement"
                maxlength="32"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="stacked">Code postal</ion-label>
            <ion-input type="text" v-model="codePostal" pattern="[0-9]{5}"></ion-input>
            <ion-note color="danger" v-if="!isPostalCodeValid()">Code postal invalide</ion-note>
        </ion-item-->
    </ion-content>
    </ion-page>
</template>
<script>
import {IonContent,IonHeader,IonTitle,IonToolbar,IonPage,IonButtons,IonButton,IonItem,IonInput,modalController, IonSelect, IonTextarea, IonDatetime} from '@ionic/vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
export default {
    beforeCreate() {
      // Get our store
      const store = useStore()
      // use store.commit to run any mutation. Below we are running the loadStore mutation
      store.commit('loadStore');      
    },
    name:"ModaleEvent",
    data(){
        return{
            currentDate : new Date(),
            event_Name: "",
            eventDescrip: "",
            startDate: this.bar+"T08:30:00",
            endDate: this.bar+"T09:30:00",
            selectCapacite: 0,
            numberOfPAC: 5
        }
    },
    props:{
        bar:String,
        activities: Array
    },
    components:{
        IonContent,IonHeader,IonTitle,IonToolbar,IonPage,IonButtons,IonButton,IonItem,IonInput,modalController, IonSelect, IonTextarea, IonDatetime
    },
    methods:{
        cancel(){
            modalController.dismiss(null, 'cancel')
        },

        fin(event){
            this.endDate = event.target.value;
        },

        handleChange(event){
            console.log('ionChange fired with value: ' + event);
            this.windowAvailable()
        },
        /**
         * Asynchronously handles the confirmation of creating a new event.
         */
        async confirm(){
            console.log(this.bar,this.foo);
            console.log(this.event_Name, this.eventDescrip, this.endDate, this.selectCapacite)
            let nom_event = this.event_Name;
            console.log("-----------------------")
            let date_event = this.bar;
            //date_event = date_event.substring(0, 10);
            console.log("aaaaaaa : ", date_event)
            console.log("-----------------------")

            let desc_event = this.eventDescrip;
            let start_event = date_event + " " + this.startDate.substring(11, 16);
            let end_event = date_event + " " + this.endDate.substring(11, 16);
            let capacit_event = this.selectCapacite;
            console.log(nom_event,desc_event,capacit_event,start_event,end_event)

            //let adresse_event = event_adresse.value;
            //let codePostal_event = codePostal.value;
            let duree = (new Date(end_event)) - (new Date(start_event));
            
            if (!nom_event) {
                alert('Le nom de l\'évènement est obligatoire.');
                return;
            }
            if (!capacit_event) {
                alert('La capacité de l\'évènement est obligatoire.');
                return;
            }
            if (new Date(end_event) <= new Date(start_event)) {
                console.log(new Date(end_event), new Date(start_event));
                alert('La date de fin doit être après à la date de début.');
                return;
            }
            if (duree < 3600000) {
                alert('La durée de l\'évènement doit être d\'au moins 1 heure.');
                return;
            }

            const newEvent = {
                start: start_event,
                end: end_event ,
                title: nom_event,
                description: desc_event,
                capacity: capacit_event,
                content: 0 + ' / ' + capacit_event,
                //address:adresse_event,
                //postalcode: codePostal_event,
                class: 'pink-event',
                iduser: this.$store.getters.user.id,
                //iduser: 4
            };

            const newEvent2 = {
                id:-99,
                start: start_event,
                end: end_event ,
                name: nom_event,
                description: desc_event,
                capacity: capacit_event,
                content: 0 + ' / ' + capacit_event,
                address:"la maison de répit",
                postalcode: "13200",
                class: 'pink-event',
                id_user: this.$store.getters.user.id,
                //iduser: 4
            }
            console.log(newEvent);
            const sent = await fetch('https://sae-repihandi-api.onrender.com/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent2)
            });
            modalController.dismiss(newEvent, 'confirm');
            //this.$router.back();
        },
        /**
         * Determines the available capacity in the time window considering existing activities.
         */
        windowAvailable(){
            let actBuf = JSON.parse(JSON.stringify(this.activities)); //deep copy
            let activitieBuf = {start: this.bar + " " + this.startDate.substring(11, 16), end:this.bar + " " + this.endDate.substring(11, 16), capacity:0}
            actBuf.push(activitieBuf)
            let tstemp = []
            for(let a of actBuf){
                this.isInArray(tstemp, a.start) ? null : tstemp.push(a.start)
                this.isInArray(tstemp, a.end) ? null : tstemp.push(a.end)
            }
            tstemp.sort()
            let resArr = [];
            for(let i = 0; i< tstemp.length-1; i++){
                const found = actBuf.filter((element) => (tstemp[i] <= element.start && element.start < tstemp[i+1]) ||  (tstemp[i] < element.end && element.end <= tstemp[i+1]));
                let res = 5
                found.forEach((element) => res -= element.capacity)
                resArr.push(res);
            }
            console.log(tstemp);
            console.log(resArr)
            let t1 = tstemp.indexOf(activitieBuf.start)
            let t2 = tstemp.indexOf(activitieBuf.end)
            this.numberOfPAC = Math.min(...resArr.slice(t1,t2))
        },
        /**
         * Checks if a given value is present in an array.
         * @param {Array} array - The array to check for the presence of the value.
         * @param {*} value - The value to check for in the array.
         * @returns {boolean} - True if the value is found in the array, otherwise false.
         */
        isInArray(array, value) {
            return !!array.find(item => {return item == value});
        }

    }
}

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

ion-button {
    color: white; /* Couleur du texte du bouton */
    --background: white; /* Couleur de fond du bouton */
    --border-color: white; /* Couleur de la bordure du bouton */
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

</style>
