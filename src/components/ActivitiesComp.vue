<template>
    <div class="obj">
        <div class="data">
            <div class="name">
                <h3>{{ data.firstname }}</h3>
                <h3>{{ data.lastname }}</h3>
            </div>
            <div>
                <h2 class="title">{{ data.title }}</h2>
                <h2>{{ data.start }}-{{ data.end }}</h2>
                <h2>{{ data.date }}</h2>
            </div>
        </div>
        <ion-button @click="deleteAct">Annuler</ion-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {closeCircleOutline} from 'ionicons/icons';

export default defineComponent({
    name: "ActivitiesComp",
    props: {
        data: Array
    },
    data(){
        return{
            delete: closeCircleOutline,
        }
    },
    methods:{
        deleteAct(){
            this.$emit('delete', this.data)
        }
    }
})
</script>
<style scoped>
.obj{
    background: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin:5px;
    border-radius: 5px;
    padding: 5px;
}
.data{
    display: grid;
    grid-template-columns: 9em auto;
}
.title{
    font-weight: bold;
}
.name{
    position:relative;
    top:20%;
}
</style>
