<template>
    <monumento-layout>
        <section class="text-uppercase">
            <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item active>{{monumentoNombre}}</mdb-breadcrumb-item>
            </mdb-breadcrumb>
        </section>

        <div class="container bg-white">
            <div class="text-center">
                <p class="spainhn-title-text">{{monumentoNombre}}</p>
            </div>

            <div class="text-start container px-4">
                <contenido-colapsable>
                    <div v-html="descripcion"></div>
                </contenido-colapsable>
            </div>

            <div class="container px-4">
                <div class="border bg-light">
                    <div class="grid-container">

                        <div class="grid-item">
                            <div class="card-item d-flex flex-column grey lighten-4 rounded py-5 shadow" role="button" @click="goToProductos">
                                <b-icon-cart-fill class="mx-auto rounded-circle" style="width: 50px; height: 50px;"></b-icon-cart-fill>
                                <div class="mt-2">
                                    <p>Reservar / Comprar</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <div class="card-item d-flex flex-column py-5 shadow grey lighten-4 rounded" role="button" @click="() => $router.push(`/${$route.params.monumentoNombre}/reservas`)">
                                <b-icon-calendar-check-fill class="mx-auto rounded-circle" style="width: 50px; height: 50px;"></b-icon-calendar-check-fill>
                                <div class="mt-2">
                                    <p>Mis Reservas</p>
                                </div>

                            </div>
                        </div>

                        <div class="grid-item">
                            <div class="card-item d-flex py-5 shadow grey lighten-4 rounded flex-column" role="button" @click="() => $router.push(`/${$route.params.monumentoNombre}/payments`)">
                                <b-icon-cash-coin class="mx-auto" style="width: 50px; height: 50px;"></b-icon-cash-coin>
                                <div class="mt-2">
                                    <p>Historial de Pagos</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <div class="card-item d-flex flex-column py-5 shadow grey lighten-4 rounded" role="button" @click="() => $router.push(`/${$route.params.monumentoNombre}/invoices`)">
                                <b-icon-receipt class="mx-auto" style="width: 50px; height: 50px;"></b-icon-receipt>
                                <div class="mt-2">
                                    <p>Facturas</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </monumento-layout>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import ContenidoColapsable from '../components/ContenidoColapsable.vue';
export default{
    name:"TableroPrincipal",
    components:{
    ContenidoColapsable
},
    data(){
        return{
            monumentoNombre: null,
            descripcion: null,
            podcast: null
        }
    },
    methods:{
        goToProductos(){
            let $vm = this;

            if( this.$route.params.monumentoNombre !== 'general' ){
                this.$router.push({ name:'Productos', params:{ monumentoNombre: $vm.$route.params.monumentoNombre } })
            }
            else{
                this.$router.push('/');
            }
        },
        logout(){
            localStorage.removeItem('accessToken')
            this.$store.commit('setUser', "")
            this.$router.push('/login')
        },
    },
    async created(){
        let $vm = this;
        $vm.monumentoNombre = $vm.$route.params.monumentoNombre.replaceAll('-', ' ');

        // let reservas = ApiSellerService.getCarrito();

        try{
            const res = await ApiSellerService.getDescripcion('es', $vm.$route.params.monumentoNombre);

            if( res.data.id ){
                const tableroData = await ApiSellerService.getBoard( res.data.id );
                this.descripcion = res.data.descripcion;
                this.podcast = res.dada.podcastUrl;
            }
        }
        catch( err ){
            if( err.response.status === 403 ){
                this.logout();
            }
        }

    }
}
</script>

<style scoped>
.spainhn-title-text{
    font-size:1.8rem;
    font-weight:800;
    text-transform: uppercase;
    color: var(--spainhn-rojo-corporativo);
    /* background: -webkit-linear-gradient(rgba(242,90,85,1),  rgba(115,43,40,1)); */
    /* background: linear-gradient(90deg,rgba(242,90,85,1),  rgba(115,43,40,1)); */
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.grid-item {
    padding: 1rem;
}

.card-item{
    cursor: pointer;
    transition: all 0.3s ease;
}

.card-item:hover{
    transform: scale(1.05);
}

</style>
