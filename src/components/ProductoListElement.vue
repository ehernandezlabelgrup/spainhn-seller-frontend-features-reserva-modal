<template>
    <div class="border px-3 py-2 bg-white">
        <div class="row">
            <!-- <div class="imagen-container col my-auto" style="width:150px; height:120px" v-bind:style="{backgroundImage: image}"></div> -->
            <div style="width: 180px; height: 160px;">
                <!-- <mdb-carousel :interval="2000" :items="imagenes">
                    <mdb-carousel-item 
                        v-for="( item, index) of imagenes" 
                        :key="index" 
                        :src="`${imagenesUrl}/visitas_castillos/${visitaId}/${ encodeURIComponent(item.name) }`">
                    </mdb-carousel-item>
                </mdb-carousel> -->
                <vue-slick-carousel :arrows="false" :dots="false" :autoplay="true">
                    <img v-for="( item, index) of imagenes"  
                        class="list-element"
                        :key="index"
                        :src="`${imagenesUrl}/visitas_castillos/${visitaId}/${ encodeURIComponent(item.name) }`"
                        />
                </vue-slick-carousel>   
            </div>
            <div class="col-md-8 col-12 text-start px-md-4 my-2">
                <p class="spainhn-subtitle-text mb-0">{{nombre}}</p>
                <contenido-colapsable 
                    :titulo="nombre"
                    :description="descripcion"
                    :schedule="horarios"
                    :discounts="descuentos"
                    @comprar=" () => $router.push(`/${$route.params.monumentoNombre}/reservar/visita:${visitaId}`)"
                    :details="detalles">
                    <!-- <p v-html="descripcion" class="d-inline-block text-nowrap text-truncate" style="max-width:100%"></p> -->
                </contenido-colapsable>
            </div>
            <div class="col-12 my-auto clearfix">
                <mdb-btn 
                    color="danger" 
                    class="float-right" 
                    :disabled="!disponible"
                    @click=" () => $router.push(`/${$route.params.monumentoNombre}/reservar/visita:${visitaId}`)">
                    {{ disponible ? 'Comprar': 'Próximamente' }}
                </mdb-btn>
            </div>
        </div>
    </div>
</template>

<script>
import ContenidoColapsable from './ContenidoColapsable.vue'
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
  // optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
    name:"Productos",
    props:{
        imageUrl: String,
        nombre: String,
        descripcion: String,
        horarios: String,
        detalles: String,
        visitaId: String,
        descuentos: String,
        disponible: { type: Boolean, default: true },
        imagenes: {type: Array, default: () => []}
    },
    components:{
        ContenidoColapsable,
        VueSlickCarousel
    },
    data(){
        return{
            imagenesUrl: process.env.VUE_APP_IMAGES_URL
        }
    },
    methods:{

    },
    computed:{
        image(){
            return `url(${ this.imageUrl })`;
        },
    }
}
</script>

<style scoped>
    .imagen-container{
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        align-items: center;
        height: 250px;
        width: 250px;
    }

    .spainhn-subtitle-text{
        font-size:1.4rem;
        font-weight:600;
        color: var(--spainhn-rojo-corporativo);
        /* background: -webkit-linear-gradient(rgba(242,90,85,1),  rgba(115,43,40,1)); */
        /* background: linear-gradient(90deg,rgba(242,90,85,1),  rgba(115,43,40,1)); */
    }

    .list-element{
    width: 180px;
    height: 160px;
    object-fit: cover; 
    overflow: hidden;
    vertical-align: middle;
}
</style>