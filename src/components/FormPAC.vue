<template>
    <ion-page class="main_page">
        <ion-header>
            <ion-toolbar>
                <ion-title>RépiHandi</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <h1>Ajouter un bénéficaire</h1>
            <form @submit.prevent="register">
            <ion-grid>
                <ion-row>
                <ion-col>
                    <ion-item>
                    <ion-label position="floating" class="label_perso">Prénom</ion-label>
                    <ion-input v-model="firstName" required></ion-input>
                    </ion-item>
                </ion-col>
                <ion-col>
                    <ion-item>
                    <ion-label position="floating" class="label_perso">Nom</ion-label>
                    <ion-input v-model="lastName" required></ion-input>
                    </ion-item>
                </ion-col>
                </ion-row>
            </ion-grid>
            <ion-item>
                <ion-label position="floating" class="label_perso">Description</ion-label>
                <ion-textarea v-model="desc"/>
            </ion-item>
            <ion-item>
                <ion-label position="stacked" class="label_perso">Date de naissance</ion-label>
                <ion-input v-model="birthdate" type="date" required></ion-input>
            </ion-item>
            <ion-item>
                <ion-label class="label_perso">Sa situation :</ion-label>
            </ion-item>
            
            <ion-item>
                <ion-checkbox label-placement="start" v-model="clean">Est-il propre ?</ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-checkbox label-placement="start" v-model="mobility">Peut-il se déplacer par lui même ?</ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-checkbox label-placement="start" v-model="talk">Peut-il communiquer ?</ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-checkbox label-placement="start" v-model="blind">Est-il malvoyant ?</ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-checkbox label-placement="start" v-model="deaf">Est-il malentendant ?</ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-checkbox label-placement="start" v-model="epilepsy">Fait-il des crises d'epilepsy ?</ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-button expand="full" @click="save">Ajouter</ion-button>
                <ion-button expand="full" @click="cancel">Annuler</ion-button>
            </ion-item>
                
            </form>
        </ion-content>
    </ion-page>    
</template>
<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar, IonItem, IonInput, IonButton, IonCheckbox, IonTextarea } from '@ionic/vue';
import { useStore } from 'vuex'
export default {
    name:"FormPAC",
    data(){
        return{
            id: -99,
            firstName: "",
            lastName: "",
            desc: "",
            birthdate: undefined,
            clean: false,
            mobility: false,
            talk: false,
            blind: false,
            deaf: false,
            epilepsy: false,
        }
    },
    components:{
        IonContent,
        IonHeader,
        IonPage,
        IonToolbar,
        IonItem,
        IonInput,
        IonButton,
        IonCheckbox,
        IonTextarea
    },
    mounted() {
        let data = JSON.parse(this.$route.query.data);
        this.loadData(data)
    },
    beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
    },
    methods: {
        cancel(){
            this.$router.back();
        },

        async save(){
            console.log(this.$store.getters.user)
            let newObj = {
                id: this.id,
                firstname: this.firstName,
                lastname: this.lastName,
                description: this.desc,
                birthdate: this.birthdate,
                clean: this.clean,
                mobility: this.mobility,
                talk: this.talk,
                blind: this.blind,
                deaf: this.deaf,
                epilepsy: this.epilepsy,
                iduser: this.$store.getters.user.id
            }
            console.log(newObj)
            const sent = await fetch('https://sae-repihandi-api.onrender.com/pac', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newObj)
            })
            this.$router.back();
        },

        //Put the new data inside the inputs
        loadData(data){
            if(data.id !== -99){
                this.id = data.id
                this.firstName = data.firstname
                this.lastName = data.lastname
                this.desc = data.description
                this.birthdate = data.birthdate
                this.clean = data.clean
                this.mobility = data.mobility
                this.talk = data.talk
                this.blind = data.blind
                this.deaf = data.deaf
                this.epilepsy = data.epilepsy
            }
        }
    },
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

ion-title {
    color: white; /* Couleur du texte du titre */
}


ion-button {
    --background: #007bff; /* Couleur de fond du bouton */
    color: white; /* Couleur du texte du bouton */
    margin-top: 10px; /* Espacement entre le bouton et les éléments précédents */
    --padding-start: 10px; /* Espacement à gauche du bouton */
    --padding-end: 10px; /* Espacement à droite du bouton */
    --padding-top: 10px; /* Espacement en haut du bouton */
    --padding-bottom: 10px; /* Espacement en bas du bouton */
    --border-radius: 100px; /* Bordure du bouton */
    --border-color : #007bff;
    margin-bottom: 10px; /* Espacement entre le bouton et les éléments suivants */
    margin-left: 10px; /* Espacement à gauche du bouton */
    margin-right: 10px; /* Espacement à droite du bouton */
    
}

ion-button:hover {
    --background: #0056b3; /* Couleur de fond du bouton au survol */
}

.label_perso {
    color: #007bff
}
h1 {
    color: white;
    text-align: center;
    margin-bottom: 20px;
}
ion-title {
    color: white;
    text-align: center;
    font-size: 25px;
}
.ion-text-center {
    text-align: center;
    color: white;
}

.error-message {
  font-size: 57%;
  user-select: none;
}

ion-input {
  --background: transparent;
  color: black;
}

ion-checkbox {
    color: black;
}
ion-textarea {
    color: black;
}

</style>