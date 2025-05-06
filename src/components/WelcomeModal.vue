<template>
    <mdb-container>
        <mdb-modal :show="popupStart" @close="() => popupStart = false" centered class="shadow">
            <mdb-modal-body class="">
                <div class="py-5 px-3">
                <h3 class="font-weight-bold text-uppercase">{{ title }}</h3>
                <hr class="red unique-color-dark"/>
                <h5 class="text-uppercase">{{ subtitle }}</h5>

                <mdb-view v-if="imageUrl">
                    <img :src="`${imagePath}/visitas_castillos/${imageUrl}`" 
                        :alt="`${imageUrl} image cap`"
                        class="mx-auto"  
                        style="width: 320px; height: 320px; object-fit: cover"/>
                </mdb-view>

                <mdb-container v-bind:class="{'d-none': imageUrl === null }">
                    <mdb-btn class="mt-5" :color="color" size="lg" @click=" () => $emit('close')">CERRAR</mdb-btn>
                    <!-- <mdb-btn class="mt-5" :color="color" size="lg" @click=" () => $emit('goTo')">VER DETALLES</mdb-btn> -->
                </mdb-container>
                <mdb-container v-bind:class="{'d-none': imageUrl}">
                    <mdb-btn class="mt-5" :color="color" size="lg" @click=" () => $emit('close')">ACEPTAR</mdb-btn>
                </mdb-container>
                </div>
            </mdb-modal-body>
        </mdb-modal>
    </mdb-container>
</template>

<script>
export default{
    name: 'WelcomeModal',
    props:{
        popupStart: Boolean,
        title: String,
        subtitle: String,
        imageUrl:{ type: String, default: null},
        color: { type: String, default: 'primary'}
    },
    data(){
        return{
            imagePath: process.env.VUE_APP_IMAGES_URL,
        }
    }
}
</script>