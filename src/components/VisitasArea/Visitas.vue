<template>
    <div class="justify-content-start">
        <p class="text-muted">Nombre de visita</p>
        <b-select class="py-2 px-3" :options="visitas" v-model="visita"></b-select>
    </div>
</template>

<script>

export default{
    name: "VisitasArea",
    props:{
        visitas: Array
    },
    data(){
        return{
            visita: null,
        }
    },
    
    methods:{

    },
}

</script>
