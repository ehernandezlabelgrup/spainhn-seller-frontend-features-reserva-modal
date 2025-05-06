<template class="container-fluid bg-light">
    <div class="LayoutDefault px-0 pt-0" style="width:100%">
        <!-- <header> -->
        <nav class="navbar sticky-top navbar-light bg-light spainhNavbar py-3 navbar-expand-lg w-100 border-bottom" style="z-index:2">
                <div class="container-fluid ps-0 w-100">
                    <a class="navbar-brand ms-5" href="/" >
                        <img src="../assets/LOGO REPAHIS PNG.png" style="height:80px;width:auto;" class="align-text-top d-inline-block"/>
                    </a>

                    <span class="ms-2">
                        <div class="d-flex">
                            <p class="my-auto">Portal de distribuidor</p>
                            <!-- <form class="form-inline my-2 my-lg-0 ms-3">
                                <div class="d-flex">
                                    <input class="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Buscar">
                                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
                                        <b-icon-search></b-icon-search>
                                    </button>
                                </div>
                            </form> -->
                        </div>
                    </span>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse ms-auto" id="navbarNavAltMarkup">
                        <ul class="ms-auto navbar-nav spainhn-main-menu-text text-monospace border-start">

                            <!-- <li class="nav-item">
                                <a class="nav-link" style="color:rgb(77,77,77) !important;" href="/">INICIO</a>
                           </li>  -->

                            <li class="nav-item dropdown my-auto border-start d-lg-inline-block d-none" v-if="mostrarCarrito">
                                <a class="nav-link dropdown-toggle my-auto" style="color:rgb(77,77,77) !important;" href="#" id="carritoDropdownLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <b-icon-cart3></b-icon-cart3>
                                    {{ticketsAmount}}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="serviceDropdownLink">
                                    <li class="dropdown-item" v-for="(item) in itemsInCart" v-bind:key="item.uuid">
                                        <entrada-resumen class="me-auto" :item="item"/>
                                    </li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li>
                                        <a class=" dropdown-item nav-link"><strong>{{ $t('default.MENSAJE_IMPORTE_TOTAL') }} {{(totalAPagar).toLocaleString()}} €</strong></a>
                                    </li>
                                    <li class="mx-auto">
                                        <a class="dropdown-item nav-link" href="/carrito"><strong class="mx-auto">{{ $t('default.MENSAJE_VER_CARRITO') }}</strong></a>
                                    </li>
                                </ul>
                            </li>

                            <li class="nav-item dropdown my-auto border-start d-lg-inline-block d-none" >
                                <a class="nav-link dropdown-toggle my-auto" style="color:rgb(77,77,77) !important;" href="#" id="carritoDropdownLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <b-icon-person-circle></b-icon-person-circle>
                                    Bienvenido<br> {{username}}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="serviceDropdownLink">
                                    <li class="dropdown-item" role="button" @click="() => $router.push('/profile')">
                                        Editar perfil
                                    </li>
                                    <li class="dropdown-item" role="button" @click="() => $router.push('/profile/actualizar-password')">
                                        Actualizar Contraseña
                                    </li>    
                                    <li class="dropdown-item" role="button" @click="logout">
                                        Cerrar Sesión
                                    </li>
                                </ul>
                            </li>

                        </ul>

                    </div>
                </div>
        </nav>            
        <!-- </header> -->
        <main class="LayoutDefault__main bg-light container-fluid px-0">
            <slot/>

            <mdb-col md="auto" class="justify-content-start d-none fixed-bottom big-text me-4" style="z-index:2" v-bind:class="{'d-lg-flex': mostrarTiempo }" role="button">
                <div class="p-2 bg-white rounded opacity-75 ms-3 mb-3 shadow-lg d-flex"  @click="() => { $router.push(`/${this.$route.params.monumentoNombre}/reservar/resumenCompra`) }">
                    <p class="ms-2 me-2 my-auto font-weight-bold" >{{ timeCounter }}</p>
                    <font-awesome-icon class="text-align-start" size="3x" icon="fa-clock me-auto ms-3 my-auto"></font-awesome-icon>
                </div>
            </mdb-col>

            <div class="fixed-bottom d-lg-none d-flex" v-if="mostrarCarrito">
                <div class="bg-white opacity-75 rounded ms-3 shadow-lg d-flex" ref="carrito" role="button" @click="() => { $router.push(`/${this.$route.params.monumentoNombre}/reservar/resumenCompra`) }">
                    <div v-bind:class="{'d-none': !mostrarTiempo }">
                        <small class="ms-auto me-2 big-text pe-2">{{ timeCounter }}</small>
                    </div>

                    <font-awesome-icon class="text-align-start my-2 ps-2" size="2x" icon="fa-cart-shopping me-auto" v-bind:class="{'fa-bounce':nuevoItemAgregado}"></font-awesome-icon>
                    <span class="big-text">{{ticketsAmountSmall}}</span>
                </div>
            </div>

        </main>
        <footer class="LayoutDefault_footer bg-light text-black text-end me-3 border-top">
            <div>Powered by: <u>Spainheritage network v2.0</u></div>
        </footer>
    </div>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import EntradaResumen from '../components/EntradaResumen.vue';
import moment from 'moment';

/* eslint-disable vue/no-unused-components */
// observer.observe(el);
export default {
    name:"SpainHeritageAdminLayout",
    components:{
        EntradaResumen
    },
    data(){
        return{
            idioma: 'es',
            scrolling: false,
            username: null,
            numeroDeItems: 0,
            countdownID: null,
            countdownMinutes: 15,
            carritoUuid: null,
            expTime: "15:00:00",
            carritoTime: null,
            timeCounter: null,
            timerId: null,
        }
    },
    methods:{
        logout(){
            localStorage.removeItem('accessToken')
            this.$store.commit('setUser', "")
            this.$router.push('/login')
        },
        changeLanguage(){
            let $vm = this;
            if(this.$i18n.locale == 'es'){
                this.$i18n.locale="en";
                $vm.idioma = 'gb';
            }
            else if(this.$i18n.locale == 'en'){
                this.$i18n.locale = "fr";
                $vm.idioma = 'fr';
            }
            else if(this.$i18n.locale == 'fr'){
                this.$i18n.locale = "de";
                $vm.idioma = 'de';
            }
            else if(this.$i18n.locale == 'de'){
                this.$i18n.locale = "es";
                $vm.idioma = 'es';
            }
            
            $vm.$store.commit('setIdioma', this.$i18n.locale);
        },
        resetCountdown(){
            let $vm = this;
            $vm.countdownMinutes = 15;

            if( $vm.countdownID == null) {
                $vm.startCountd
            }
        },
        handleScroll(){
            if(window.pageYOffset > 10.0)
                this.scrolling = true;
            else
                this.scrolling = false;
        },

        /**
         * 
         */
        triggerTimer( expTime ){
            let $vm = this;

            if( !this.timerId ){

                this.carritoTime = moment.utc( this.$store.getters.getExp ?? 0 );

                this.timerId = setInterval( () => { 
                    let now = moment();
                    let diffTime = $vm.carritoTime - now;

                    let duration = moment.duration( diffTime - 1000, 'milliseconds' )

                    let minutes = duration.minutes();
                    let seconds = duration.seconds();

                    if( minutes < 10 ){
                        minutes = "0" + minutes;
                    }

                    if(seconds < 10){
                        seconds = "0" + seconds;
                    }
                    
                    $vm.timeCounter = (  minutes + ":" + seconds );

                    if( duration <= 0 ){
                        $vm.timeCounter = "0:00";
                        clearInterval( $vm.timerId );
                        $vm.timerId = null;
                        this.$store.commit('removeAllItems');

                        if(this.$route.name == "Carrito"){
                            this.$router.push(`/${this.$route.params.monumentoNombre}/productos`)
                        }
                    }
                    else if( this.$store.getters.itemsInCart.length == 0 ){
                        $vm.timeCounter = "0:00";
                        clearInterval( $vm.timerId );
                        $vm.timerId = null;
                    }
                }, 1000 )
            }
        }

    },
    computed: {
        ticketsAmount(){

            let amount = this.$store.getters.numberOfTickets;

            if(amount == 0){
                return this.$t('default.MAIN_MENU_CARRITO');
            }
            else{
                return amount + " Visita(s)";
            }
        },
        ticketsAmountSmall(){
            let amount = this.$store.getters.numberOfTickets;

            if(amount == 0){
                return "(0)";
            }
            else{
                return `(${amount})`;
            }

        },
        itemsInCart(){
            return this.$store.getters.itemsInCart;
        },
        nuevoItemAgregado(){
            return this.$store.getters.cartAnimation;
        },
        totalAPagar(){
            let totalAPagar = this.$store.getters.total;

            if(totalAPagar != null){
                return totalAPagar.toFixed(2);
            }
            else{
                return "ups"
            }
            // return this.$store.getters.total;
        },
        isFixed(){
            if(this.scrolling ) {
                return true;
            }
            else{
                return false;
            }
        },
        cartPosition(){
            let viewportHeight = window.innerHeight;
            // let carritoHeight = this.$refs.carrito.style.height;
            let position = `${viewportHeight - (viewportHeight * .46)}px `
            return position;
        },

        mostrarTiempo(){

            if( this.$store.getters.getExp ){
                this.triggerTimer( this.$store.getters.getExp )
                return true;
            }
            else{
                return false;
            }
    
        },

        mostrarCarrito(){
            if(this.$route.params.monumentoNombre == undefined){
                return false;
            }
            else{
                return true;
            }
        }
    },
    async created(){
        let $vm = this;
        $vm.$i18n.locale = $vm.$store.getters.getIdioma;
        if( $vm.$i18n.locale == null){
            $vm.$i18n.locale == 'es';
        }

        this.carritoUuid = $vm.$store.getters.cartStatus.uuid;


        // Si ya hay un carrito activo, preguntamos al backend si ya se pagó el carrito
        if( this.carritoUuid ){
            // Dependiendo de la respuesta, en caso de que se obtenga que el producto ya se pagó,
            // entonces se procede a eliminar el id del carrito, para que si se agrega una nueva reserva
            // se cree un nuevo carrito
            let carritoInfo = await ApiSellerService.getCarrito( this.carritoUuid )
        }
        // En caso de que no haya carrito activo, revisamos si hay items guardados y los eliminamos para 
        // que si se agregan nuevos productos, se haga asociado a un carrito nuevo
        else{
            if( this.$store.getters.numberOfTickets ){
                this.$store.commit('removeAllItems')
            }
        }
        $vm.$store.commit('setIdioma', this.$i18n.locale);
        window.addEventListener('scroll', this.handleScroll);

        if($vm.$i18n.locale == null){
            $vm.$i18n.locale = 'es';
        }
        if(this.$i18n.locale == 'en'){
            // this.$i18n.locale="es";
            $vm.idioma = 'gb';
        }
        else if(this.$i18n.locale == 'es'){
            // this.$i18n.locale = "en";
            $vm.idioma = 'es';
        }
        else if(this.$i18n.locale == 'fr'){
            $vm.idioma = 'fr';
        }
        else if(this.$i18n.locale == 'de'){
            $vm.idioma = 'de';
        }

        // De esta manera sabemos si se agregan o quitan items
        // La idea es que al agregar items, se reinicie el conteo,
        // pero si se quitan items, el conteo sigue igual
        $vm.numeroDeItems = $vm.$store.getters.numberOfTickets;

        ApiSellerService.me()
            .then( res => {
                this.username = res.data.payload.name;
            })
            .catch(err => {
                console.log(err);
            })

    },
    mounted(){
        this.triggerTimer();

    },
    destroyed(){
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>

<style scoped>
    .newsletter{
        /* background-image: `url(${require('@/assets/newsletter-background.jpg')})`; */
        /* background-image: url('../assets/newsletter-background.jpg'); */
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    /* styles for when the header is in sticky mode */
    .is-pinned {
        background-color: rgba(255,255,255,1) !important;
    } 

    .is-not-pinned{
        background-color: rgba(255,255,255,0.6) !important;
    }
</style>
