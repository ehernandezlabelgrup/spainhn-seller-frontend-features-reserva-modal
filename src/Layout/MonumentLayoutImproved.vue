<template class="container-fluid">
    <div class="LayoutDefault container-fluid px-0" style="max-width: 100vw">

        <mdb-navbar slot="nav" tag="div" :toggler="false" position="top" class="bg-white">

            <!-- <mdb-navbar-nav left>
                <mdb-icon icon="bars" class="text-dark" size="2x" @click.native="show = !show" />
            </mdb-navbar-nav> -->


            <span class="ml-5 collapse navbar-collapse">
                <div class="d-flex">
                    <a class="navbar-brand ms-2" href="/" >
                        <img src="../assets/LOGO REPAHIS PNG.png" style="height:50px;width:auto;" class="align-text-top d-inline-block"/>
                    </a>

                    <p class="my-auto">Portal de distribuidor</p>
                </div>
            </span>

            <div class="collapse navbar-collapse ms-auto" id="navbarNavAltMarkup" style="position: relative">
                <ul class="ms-auto navbar-nav spainhn-main-menu-text text-monospace border-start">

                    <li class="nav-item dropdown my-auto border-start d-lg-inline-block d-none" v-if="mostrarCarrito" style="position: relative">
                        <a class="nav-link dropdown-toggle my-auto" style="color:rgb(77,77,77) !important;" href="#" id="carritoDropdownLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <b-icon-cart3></b-icon-cart3>
                            {{ticketsAmount}}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end text-black" aria-labelledby="serviceDropdownLink" style="position: absolute; z-index: 2000 !important;">
                            <li class="dropdown-item" v-for="(item) in itemsInCart" v-bind:key="item.uuid">
                                <entrada-resumen class="me-auto" :item="item"/>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <a class=" dropdown-item nav-link"><strong class="text-black">{{ $t('default.MENSAJE_IMPORTE_TOTAL') }} {{(totalAPagar).toLocaleString()}} €</strong></a>
                            </li>
                            <li class="mx-auto">
                                <a class="dropdown-item nav-link" :href="`/${this.$route.params.monumentoNombre}/reservar/resumenCompra`"><strong class="mx-auto text-black">{{ $t('default.MENSAJE_VER_CARRITO') }}</strong></a>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown my-auto border-start d-lg-inline-block d-none" >
                        <a class="nav-link dropdown-toggle my-auto" style="color:rgb(77,77,77) !important;" href="#" id="carritoDropdownLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <b-icon-person-circle></b-icon-person-circle>
                            Bienvenido<br> {{username}}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="serviceDropdownLink">
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
        </mdb-navbar>
        <mdb-side-nav-2 :data="navigation"
            :value="true"
            light
            push 
            slim 
            :slim-collapsed="slimCollapsed" 
            expand-on-hover
            :backdrop="false"
            @toggleSlim="slimCollapsed = $event" 
            color="danger darken-4"
            :sidenav-class="['border-right', 'shadow']"
            >

            <div slot="header">
                <!-- <a class="navbar-brand ms-2" href="/" >
                    <img src="../assets/LOGO REPAHIS PNG.png" style="height:50px;width:auto;" class="align-text-top d-inline-block"/>
                </a> -->
            </div>

            <main slot="main" style="margin-top:85px">
                <slot></slot>

                <div class="justify-content-start d-none fixed-button big-text me-4" v-bind:class="{'d-lg-flex': mostrarTiempo }" role="button">
                    <div class="p-2 bg-white rounded opacity-75 ms-3 mb-3 shadow-lg d-flex"  @click="() => { $router.push(`/${$route.params.monumentoNombre}/reservar/resumenCompra`) }">
                        <p class="ms-2 me-2 my-auto font-weight-bold" >{{ timeCounter }}</p>
                        <font-awesome-icon class="text-align-start" size="3x" icon="fa-clock me-auto ms-3 my-auto"></font-awesome-icon>
                    </div>
                </div>

                <div class="fixed-button d-lg-none d-flex" >
                    <div class="bg-white opacity-75 rounded ms-3 shadow-lg d-flex" ref="carrito" role="button" @click="() => { $router.push(`/${$route.params.monumentoNombre}/reservar/resumenCompra`) }">

                        <div v-bind:class="{'d-none': !mostrarTiempo }">
                            <small class="ms-auto me-2 big-text pe-2">{{ timeCounter }}</small>
                        </div>

                        <font-awesome-icon class="text-align-start my-2 ps-2" size="2x" icon="fa-cart-shopping me-auto" v-bind:class="{'fa-bounce':nuevoItemAgregado}"></font-awesome-icon>
                        <span class="big-text">{{ticketsAmountSmall}}</span>

                    </div>
                </div>

            </main>

        </mdb-side-nav-2>


        <footer slot="footer">

        </footer>

    </div>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import EntradaResumen from '../components/EntradaResumen.vue';
import moment from 'moment';
import { mdbResize } from "mdbvue"

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
            show: false,
            over: true,
            collapse: false,
            navigation: [
                // {
                //     name: "Getting started",
                //     icon: "mdb",
                //     fab: true,
                //     children: [{
                //         name: "Quick start",
                //         href: "https://mdbootstrap.com/docs/b4/vue/getting-started/quick-start/"
                //     },
                //     {
                //         name: "Technical Support",
                //         href: "https://mdbootstrap.com/support/"
                //     }
                //     ]
                // },
                {
                    name: "Menú",
                    icon: "chalkboard",
                    href: this.$route.params.monumentoNombre === 'general' ? `${process.env.VUE_APP_URL}/` : `${process.env.VUE_APP_URL}/${this.$route.params.monumentoNombre}/tablero`,
                },
                // {
                //     name: "Reservar/Comprar",
                //     icon: "shopping-cart",
                //     href: this.$route.params.monumentoNombre === 'general' ? `${process.env.VUE_APP_URL}/` : `${process.env.VUE_APP_URL}/${this.$route.params.monumentoNombre}/productos` ,
                // },
                {
                    name: "Mis reservas",
                    icon: "calendar-check",
                    // href: `${process.env.VUE_APP_URL}/${this.$route.params.monumentoNombre}/reservas`,
                    href: `${process.env.VUE_APP_URL}/general/reservas`,
                    class: "active"
                },
                {
                    name: "Historial de pagos",
                    icon: "receipt",
                    // href: `${process.env.VUE_APP_URL}/${this.$route.params.monumentoNombre}/payments`
                    href: `${process.env.VUE_APP_URL}/general/payments`
                },
                {
                    name: "Facturas",
                    icon: "file-invoice",
                    href: `${process.env.VUE_APP_URL}/general/invoices`
                },
                {

                }
            ],
            slimCollapsed: true,
            collapsed: true
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
        checkWidth() {
            this.over = window.innerWidth < 900;
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
    directives: {
      mdbResize
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
            // console.log(carritoHeight)
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
        // console.log($vm.$i18n.locale);
        if( $vm.$i18n.locale == null){
            $vm.$i18n.locale == 'es';
        }

        this.carritoUuid = $vm.$store.getters.cartStatus.uuid;

        // console.log(this.carritoUuid);

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
                console.log(err.response.data);
                if( err.response.data.message == 'Su sesión ha expirado' ){
                    this.logout()
                }
            })

    },
    mounted(){
        this.triggerTimer();

        if(this.$route.params.monumentoNombre){
            this.show = true;
        }
        else{
            this.show = false
        }

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
