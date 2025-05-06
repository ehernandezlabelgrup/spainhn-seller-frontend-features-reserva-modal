<template>
    <monumento-layout>
        <div class="container bg-light d-flex mb-3 px-3 my-2">
            <div class="me-2">
                <span><a href="/">Inicio </a> >> </span>
            </div>

            <div class="me-2">
                <span><a :href="`/${$route.params.monumentoNombre}/tablero`" > {{monumentoNombre }} </a> >> </span>
            </div>

            <div class="me-2">
                <span><a :href="`/${$route.params.monumentoNombre}/productos`" > visitas </a> >> </span>
            </div>

            <div class="me-2">
                <span><a :href="'#'" > Finalizar compra </a> </span>
            </div>

        </div>

        <div class="text-center mt-2">
            <p class="spainhn-title-text">{{monumentoNombre}}</p>
        </div>

        <div class="container-fluid">

            <mdb-container>
                <mdb-row>
                    <mdb-card>
                        <mdb-card-body>

                            <mdb-row>
                                <mdb-col col="12" class="text-start">
                                    <label for="language-selector" class="fw-bold">Selecciona el idioma para las comunicaciones y los tickets</label>
                                    <mdb-select v-model="idiomasOptions" id="language-selector" class="fw-bold" label="IDIOMA*" outline @getValue="(evt) => idiomaSelected = evt"></mdb-select>
                                </mdb-col>
                            </mdb-row>

                            <mdb-row class="mt-2">
                                <mdb-col col="12" class="text-start">
                                    <label class="fw-bold mb-4">Detalles adicionales</label>
                                    <mdb-input id="ocultar-precio" name="ocultar-precio" v-model="ocultarPrecio" type="checkbox" class="mt-2" size="lg" label="Ocultar el precio en el ticket" outline></mdb-input>
                                </mdb-col>
                            </mdb-row>

                        </mdb-card-body>
                    </mdb-card>
                </mdb-row>

            </mdb-container>


            <mdb-container class="mt-4">
                <mdb-row >

                    <mdb-card class="overflow-auto">
                        <mdb-card-body style="min-width:920px">

                            <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-start">
                                <mdb-col col="1"></mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-table">Loc.<br/>reserva</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Producto</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-table ">Tickets</mdb-col>
                                <mdb-col col="1" md="auto" class="spainhn-small-text-table ">Fecha <br/>del evento</mdb-col>
                                <mdb-col col="1" md="auto" class="spainhn-small-text-table ">Hora <br/>del evento</mdb-col>
                                <mdb-col class="spainhn-small-text-table text-center">Límite de pago</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-table ">Importe</mdb-col>
                                <mdb-col class="spainhn-small-text-table ">Acciones de pago</mdb-col>
                            </mdb-row>


                            <mdb-row v-for="(item, index) in itemsToShow" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                                <mdb-col col="1" class="d-flex">
                                    <div class="d-flex flex-column">
                                        <font-awesome-icon type="button" @click="removeFromCart(item)" icon="fa-trash" class="mx-auto fa-lg text-danger"/>
                                        <small class="font-weight-bold mt-1">ELIMINAR</small>
                                    </div>
                                </mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-cells">{{ item.localizador }}</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells">{{item.itemVisita[0].texto}}</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.totalDePersonas}}</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-cells text-start">{{ moment(item.itemFecha).format('DD-MM-YYYY') }}</mdb-col>
                                <mdb-col col="1" md="auto" class="spainhn-small-text-cells text-center">{{item.itemHorario ? moment(item.itemFecha).format('HH:mm'):'Horario libre'}}</mdb-col>
                                <mdb-col class="spainhn-small-text-cells text-center">{{ moment(item.itemFechaLimiteDePago).format('DD-MM-YYYY') }}</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.itemTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 })}} €</mdb-col>
                                <mdb-col class="spainhn-small-text-cells">
                                    <!-- <b-select :options="item.fechaLimiteDePago > moment.utc() ? item.accionesDePago : item.accionesDePagoReducidas" size="sm" v-model="item.accionDePago" @change="(evt) => configurarAccionDePago(evt, item)"/> -->
                                    <!-- <b-select :options="item.accionesDePago " size="sm" v-model="item.accionDePago" @change="(evt) => configurarAccionDePago(evt, item)"/> -->
                                    <!-- <mdb-select v-model="item.accionesDePago" @getValue="(evt) => configurarAccionDePago( evt, item )" outline/> -->
                                    <select v-model="item.accionDePago" class="custom-select">
                                        <option value="pagar">
                                            Pagar
                                        </option>
                                        <option value="reservas" :disabled="!getAvailableOptions(item.itemFecha, daysLimitToPayReservation, item.itemFechaLimiteDePago)">
                                            Reservar
                                        </option>
                                    </select>
                                </mdb-col>

                            </mdb-row>

                            <mdb-row style="height:40px;">
                                <mdb-col col="8"></mdb-col>
                                <mdb-col col="4" class="clearfix py-2">
                                    <h4 class="float-start">{{ $t('default.MENSAJE_IMPORTE_TOTAL') }}: {{ (totalAPagar).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }} </h4>
                                </mdb-col>
                            </mdb-row>

                            <table-footer 
                                :rows="items" 
                                @actualizarElementos="actualizarTabla"/>

                        </mdb-card-body>

                    </mdb-card>

                </mdb-row>

            </mdb-container>

            <mdb-container class="mt-2" v-if="totalAPagar">
                <mdb-row>
                    <mdb-card>
                        <mdb-card-body>
                            <mdb-select label="Método de pago" :options="metodosDePagoOptions" @getValue="( evt ) => tipoDePago = evt" class="w-50" outline/>
                            <div v-if="tipoDePago === 'transferencia'" class="text-start">
                                Los datos para los depósitos bancarios por transferencia son los siguientes:
                                <br>
                                <small>- Titular: {{ transferData.holder }}</small>
                                <br>
                                <small>- IBAN: {{ transferData.iban }}</small>
                                <br>
                                <small>- email para recepción de comprobante: {{ transferData.email }}</small>
                            </div>
                        </mdb-card-body>
                    </mdb-card>
                </mdb-row>
            </mdb-container>

            <mdb-container class="mt-4" v-if="items.length > 0">
                <mdb-row>
                    <mdb-card>
                        <mdb-card-body>
                            <mdb-row class="mt-2">
                                <mdb-col col="12" class="text-start">
                                    <mdb-input id="acepto-condiciones" name="acepto-condiciones" v-model="aceptoCondiciones" type="checkbox" class="mt-2" size="lg" label="Acepto las condiciones generales del servicio*" outline></mdb-input>
                                    <p>(*) Campo obligatorio</p>

                                    <div class="mt-3 text-start">
                                        <p class="spainhn-text pb-0 mb-0">
                                            <small class="fw-bold">{{ $t("default.TITULO_TRATAMIENTO_DATOS") }}</small>
                                        </p>
                                        <p class="mt-0 pt-0"><small>{{ $t("default.MENSAJE_RESPONSABLE_DE_DATOS") }}</small></p>

                                        <ul>
                                            <li><small>{{ $t("default.MENSAJE_EXPLICACION_DE_DATOS_1") }}</small></li>
                                            <li><small>{{ $t("default.MENSAJE_EXPLICACION_DE_DATOS_2") }}</small></li>
                                            <li><small>{{ $t("default.MENSAJE_EXPLICACION_DE_DATOS_3") }}</small></li>
                                            <li><small>{{ $t("default.MENSAJE_EXPLICACION_DE_DATOS_4") }}</small></li>
                                            <li><small>{{ $t("default.MENSAJE_EXPLICACION_DE_DATOS_5") }}</small></li>
                                        </ul>
                                        <a :href="conditions" target="_blank">{{ $t("default.MENSAJE_EXPLICACION_DE_DATOS_6") }}</a>

                                    </div>

                                </mdb-col>
                            </mdb-row>

                        </mdb-card-body>

                    </mdb-card>
                </mdb-row>
            </mdb-container>

            <mdb-container v-if="items.length > 0">
                <form name="redsys_form" :action="redsysUrl" method="post" id="redsys_form" ref="redsys_form" @submit="sendToRedsys">
                    <input type="text" name="Ds_SignatureVersion" v-model="Ds_SignatureVersion" hidden />
                    <input type="text" name="Ds_MerchantParameters" v-model="Ds_MerchantParameters" hidden />
                    <input type="text" name="Ds_Signature" v-model="Ds_Signature" hidden />
                    <div class="clearfix">
                        <mdb-btn :disabled="!aceptoCondiciones || loading" size="lg" class="mt-4 mb-4 spainhn-button float-right" style="z-index: 99" type="submit"> 
                            CREAR RESERVA <span v-bind:class="{'d-none':!totalAPagar}"> Y PAGAR</span>
                        </mdb-btn>
                    </div>
                </form>
            </mdb-container>

        </div>


        <mdb-modal frame position="bottom" direction="bottom" :show="registroExitoso" hide-footer>
            <mdb-modal-body>
                <span>Se registraron sus reservas exitosamente</span>
                <mdb-btn class="spainhn-button" color="danger" @click="registroExitoso = false">ACEPTAR</mdb-btn>
            </mdb-modal-body>
        </mdb-modal>

        <div class="container-fluid spainhn-bg-gris-cajas w-100 py-5 px-4 my-4 rounded" v-bind:class="{'d-none':items.length}">
            <div class="spainhn-subtitle">{{ $t('default.CART_EMPTY_CART') }}</div>
            <mdb-btn @click="navigateToProductos" class="spainhn-button" color="danger" size="lg">Regresar a reservaciones</mdb-btn>
        </div>

        <b-modal @ok="quitarReservas">
            <div>
                {{ $t('default.CART_REMOVE_ALL') }}
            </div>
        </b-modal>

        <b-modal ref="confirmModal">
            <div>
                Muy pronto podrás completar el proceso de compra
            </div>
        </b-modal>

    </monumento-layout>
</template>

<script>
// import axios from 'axios'
import ApiService from '../services/ApiSeller.service'
import moment from 'moment';
import TableFooter from '../components/TableFooter.vue';

export default {
    components:{
        TableFooter
    },
    data(){
        return{
            ocultarPrecio: false,
            moment: moment,
            redsysUrl: process.env.VUE_APP_REDSYS_URL,
            Ds_SignatureVersion:null,
            Ds_MerchantParameters:null,
            Ds_Signature:null,
            Ds_Mount: '0',
            clienteNombre:null,
            idCliente: null,
            country:"ES",
            tipoId: "DNI",
            emailCliente: null,
            emailConfirmation:null,
            telefonoCliente: null,
            provinciaCliente:null,
            zipCodeCliente: null,
            aceptoTerminos:false,
            aceptoNewsletter: false,
            loading:false,
            entradas: [],
            itemsToShow: [],
            accionesDePago: [
                { text: 'Reservar', value:'reservar', selected: false },
                { text: 'Pagar', value: 'pagar', selected: false }
            ],
            idiomasOptions:[
                { text: 'Español', value:'es', selected: true },
                { text: 'Inglés', value: 'en' }
            ],
            metodosDePagoOptions: [
                { text: 'TPV', value:'redsys', selected: true },
                // { text: 'Transferencia', value: 'transferencia' }
            ],
            accionDePago:'reservar',
            // monumentoNombres: [ {texto: ""}, {texto:""},{ texto: ""}, {texto: ""} ]
            monumentoNombre: null,
            idiomaSelected: 'es',
            aceptoCondiciones: false,
            registroExitoso: false,
            tipoDePago: 'redsys',
            daysLimitToPayReservation: 0,
            transferData: {

            },
            conditions: process.env.VUE_APP_CONDITIONS
        }
    },
    methods:{
        logout(){
            localStorage.removeItem('accessToken')
            this.$store.commit('setUser', "")
            this.$router.push('/login')
        },
        navigateToProductos() {
            this.$router.push(`/${this.$route.params.monumentoNombre}/productos`);
        },
        configurarAccionDePago( event, item ){
            item.accionDePago = event;

            // const itemId = item.itemUuid
            const payload = {
                uuid: item.itemUuid,
                accion: event
            }
            this.$store.commit( 'updateActionType',  payload );
        },
        actualizarTabla(event){
            this.itemsToShow = event;
        },
        goToCalendar(event){
            let $vm = this;
            if( $vm.items.length == 0){
                $vm.$router.push( `/castillos/reservar/idvisita:${event.idVisita}` );
            }
        },
        validarFechaDeEntrada(fechaDeEntrada){

            // Calculamos el día de hoy y le agregamos la hora máxima establecida por
            // cada monumento para  hacer la compra de esta entrada en particular

            let hoy = new Date();
            let diaUTC = hoy.getDate();
            let mesUTC = hoy.getMonth();
            let yearUTC = hoy.getFullYear();

            // Removemos el componente de horas, para saber si estamos en el mismo día que la fecha de entrada
            let hoyEstandarizado = new Date( yearUTC, mesUTC, diaUTC );

            let entradaFechaLocal = new Date( fechaDeEntrada );

            let entradaDiaUTC = entradaFechaLocal.getUTCDate();
            let entradaMesUTC = entradaFechaLocal.getUTCMonth();
            let entradaYearUTC = entradaFechaLocal.getUTCFullYear();
            
            let fechaMaximaEstablecidaPorMonuento = new Date( yearUTC, mesUTC, diaUTC, 20, 0, 0, 0 );

            let entradaFechaEstandard = new Date( entradaYearUTC, entradaMesUTC, entradaDiaUTC, 0, 0, 0 );

            if( entradaFechaEstandard == hoyEstandarizado ){
                if( Date.now() < fechaMaximaEstablecidaPorMonuento ){
                    return true;
                }
                else{
                    return false;
                }
            }
            else if( entradaFechaEstandard > hoyEstandarizado ){
                return true;
            }
            else if( entradaFechaEstandard < hoyEstandarizado ){
                return false;
            }
            else if(entradaDiaUTC == diaUTC && entradaMesUTC == mesUTC){
                if( Date.now() < fechaMaximaEstablecidaPorMonuento ){
                    return true;
                }
                else{
                    console.log("La entrada está fuera de horario")
                    return false;
                }            
            }
            else{
                return false;
            }
        },
        quitarReservas( itemsToRemove = null ){
            let $vm = this;
            if( itemsToRemove ){
                itemsToRemove.forEach( item => {
                    this.$store.commit('removeFromCart', { itemUuid: item })
                })
            }
            else{
                $vm.$store.commit('removeAllItems');
            }
        },


        async sendToRedsys(evt){
            let $vm = this;

            evt.preventDefault();

            let merchantData = []
 
            let ticketsInvalidos = this.items.filter( item => {
                return this.validarFechaDeEntrada(item.itemFecha);
            } )

            if(ticketsInvalidos.length == 0){
                processPayment = false;
                alert("Lo sentimos, la fecha para uno o más de sus entradas ya pasó")
            }

            this.entradas = this.items;

            $vm.entradas.forEach( entrada => {
                let entradaObject = {};

                entradaObject.reservaUuid = entrada.itemUuid

                entrada.idioma = this.idiomaSelected;
                entrada.ocultarPrecio = this.ocultarPrecio
                
                merchantData.push(entradaObject);
            })


            let cartInfo = $vm.$store.getters.cartStatus;

            let processPayment = false;

            this.loading = true;

            let result = null;
            try{
                result = await ApiService.checkoutProcess( cartInfo.uuid, $vm.entradas, $vm.totalAPagar.toString(), this.$route.params.monumentoNombre, this.tipoDePago );
            }
            catch( err ){
                console.log( err );
                if( err.response.status === 403 ){
                    this.logout();
                }
            }

            if( result.data.clearCarrito === true){

                if( result.data.itemsToRemoveFromCart ){
                    this.quitarReservas( result.data.itemsToRemoveFromCart );
                }
                if( result.data.reservasAgendadas ){
                    this.registroExitoso = true;
                }
            }

            this.loading = false;

            const { Ds_MerchantParameters, Ds_SignatureVersion, Ds_Signature } = result.data.responseObject

            if( Ds_MerchantParameters == null ){
                window.alert('Se registraron las reservas de manera exitosa');
                setTimeout( () => this.$router.push(`/${this.$route.params.monumentoNombre}/productos`), 200 );
            }
            else{
                processPayment = true;
            }

            if( this.tipoDePago === 'transferencia' && processPayment === true ){
                this.loading = false;
                window.alert('Se registraron las reservas de manera exitosa');

                setTimeout(() => this.$router.push(`/${this.$route.params.monumentoNombre}/productos`), 200);
            }
            // $vm.Ds_Mount = $vm.$store.getters.total.toFixed(2).toLocaleString();
            // this.$refs.redsys_form.submit()
            else if(processPayment){
                $vm.loading = true;

                $vm.Ds_MerchantParameters = Ds_MerchantParameters;
                $vm.Ds_SignatureVersion = Ds_SignatureVersion;
                $vm.Ds_Signature = Ds_Signature;
                window.alert("Será redireccionado a una página externa para completar el pago, no recargue la página");

                // Envía los datos al sistema redys para ser procesados
                setTimeout(() => this.$refs.redsys_form.submit(), 200);
            }

            
        },

        removeFromCart(item){
            this.$store.dispatch('reservaDelete', item)
        },

        getAvailableOptions(itemDate, diasParaPagar, fechaLimiteDePago ){
            if( diasParaPagar ){
                // const fechaLimiteDePago = e.fecha
                const fechaDeVisita = moment(itemDate).endOf('day');
                const today = moment();
                const fechaLimiteDePago = fechaDeVisita.subtract(  diasParaPagar, 'days' );

                if( fechaLimiteDePago.isSameOrAfter( today ) ){
                    return true;
                }else{
                    return false;
                }
            }
            else{
                const _fechaLimiteDePago = fechaLimiteDePago ? moment(fechaLimiteDePago) : moment( itemDate );
                const today = moment.utc();
                
                if( _fechaLimiteDePago.isSameOrAfter( today )){
                    return false
                }else{
                    return true;
                }
                // if( fechaLimiteDePago.isSameOrAfter( today ) ) {
                //     options.unshift( { text: 'Reservar', value: 'reservar', selected: false, disabled: false } )
                //     // e.accionDePago = 'pagar';
                // }
                // else{
                //     e.accionDePago = 'reservar'
                // }
            }
        }
    },
    async mounted(){
        await this.$store.dispatch('fetchAccessToken');        
    },
    async created(){
        let $vm = this;

        // Preguntamos que entradas hay disponibles en el carrito
        $vm.monumentoNombre = $vm.$route.params.monumentoNombre.replaceAll('-', ' ');

        $vm.entradas = $vm.$store.getters.itemsInCart;
        const result = await ApiService.getPaymentMethods( this.entradas[0].itemIDVisita )

        const metodosDePagoAutorizados = result.metodosDePago;
        const diasParaPagar = result.daysLimitToPayReservation;

        this.daysLimitToPayReservation = diasParaPagar;
        // const metodosDePagoAutorizados = await ApiService.getPaymentMethods( this.entradas[0].itemIDVisita )
        this.metodosDePagoOptions = [];

        this.transferData = result.transferData;

        metodosDePagoAutorizados.forEach( mp => {
            if( mp === 'Redsys' ){
                this.metodosDePagoOptions.splice(0, 0, { text: 'TPV', value:'redsys', selected: false } ) 
            }
            if( mp === 'Transfer'){
                this.metodosDePagoOptions.push({ text: 'Transferencia', value: 'transferencia', selected: false })
            }
        })

        if( this.metodosDePagoOptions.length === 0 ){
            this.metodosDePagoOptions.splice(0, 0, { text: 'TPV', value:'redsys', selected: false } )
        }

        this.metodosDePagoOptions[0].selected = true;


        // Revisamos que todas las entradas que están guardas en el carrito se puedan comprar todavía
        if( $vm.entradas.length > 0){
            // En esta variable guardamos las entradas que ya caducaron
            let entradasPorQuitar = $vm.entradas.filter( entrada => {
                return !$vm.validarFechaDeEntrada(entrada.itemFecha)
            }).map( item => {
                return item.itemUuid;
            } )

            if( entradasPorQuitar.length > 0 ){
                window.alert("Cuenta en su carrito con entradas fuera de horario, por lo que se eliminarán de su carrito")
                $vm.$store.commit('removeOldItemsFromCart', entradasPorQuitar);
            }

            $vm.entradas = $vm.$store.getters.itemsInCart;
        }

        $vm.Ds_Mount = $vm.$store.getters.total.toFixed(2).toLocaleString();

    },
    computed:{
        idiomaIndex(){
            let $vm = this;
            return $vm.$store.getters.idiomaIndex;
        },
        items(){
            let $vm = this;
            // $vm.entradas = $vm.$store.getters.itemsInCart;

            const entradas = $vm.$store.getters.itemsInCart;
            
            entradas.forEach( e => {
                e.totalDePersonas = e.itemTickets.map( ( t => t.cantidad ) ).reduce( (prev, curr) => prev + curr , 0 )
                
                let options = [
                    { text: 'Pagar', value: 'pagar', selected: true, disabled: false },
                    { text: 'Reservar', value: 'reservar', selected: false, disabled: true }
                ];

                // if( this.daysLimitToPayReservation ){
                //     // const fechaLimiteDePago = e.fecha
                //     const fechaDeVisita = moment(e.itemFecha).endOf('day');
                //     const today = moment();
                //     const fechaLimiteDePago = fechaDeVisita.subtract( 'days', this.daysLimitToPayReservation );

                //     if( fechaLimiteDePago.isSameOrAfter( today ) ){
                //         options.unshift( { text: 'Reservar', value: 'reservar', selected: false, disabled: false } )
                //     }
                //     e.accionDePago = 'pagar';
                //     e.accionesDePago = [...options];
                //     // if( fechaDeVisita ){

                //     // }
                //     // console.log( fechaDeVisita );
                // }
                // else{
                //     const fechaLimiteDePago = e.itemFechaLimiteDePago ? moment(e.itemFechaLimiteDePago) : moment( e.itemFecha );
                //     const today = moment.utc();
        
                //     // if( fechaLimiteDePago.isSameOrAfter( today ) ) {
                //     //     options.unshift( { text: 'Reservar', value: 'reservar', selected: false, disabled: false } )
                //     //     // e.accionDePago = 'pagar';
                //     // }
                //     // else{
                //     //     e.accionDePago = 'reservar'
                //     // }
                //     e.accionDePago = 'pagar';
                //     e.accionesDePago = [...options];
                // }
                e.accionDePago = 'pagar';
                e.accionesDePago = [ ...options ];
            })
            return entradas;
        },
        cancelable(){
            let $vm = this;
            if($vm.$store.getters.totalCancelacion > 0){
                return true;

            }
            else
                return false;
        },

        seguroDeCancelacion(){
            let $vm = this;
            return $vm.$store.getters.seguroDeCancelacion;
        },

        totalAPagar(){
            let $vm  = this;

            const paraPagar = this.items.filter( entrada => entrada.accionDePago === 'pagar' ).map( e => e.itemTotal ).reduce( (acc, curr) => acc + curr, 0 )

            // $vm.Ds_Mount = $vm.$store.getters.total.toFixed(2).toLocaleString()
            $vm.Ds_Mount = paraPagar.toFixed(2).toLocaleString('es-ES');

            return paraPagar;
        },

        totalCancelacion(){
            let $vm = this;
            let total = $vm.$store.getters.totalCancelacion;
            // total = 0;
            return (total).toLocaleString('es-ES', {maximumFractionDigits:2});
        }
        
    }
}
</script>

<style scoped>
.spainhn-small-text-table{
    font-size: 0.65rem !important;
    font-weight: 700;
    color: #9e9e9e;
}

.spainhn-small-text-cells{
    font-size: 0.6rem !important;
    font-weight: 500;
    color: #616161 ;
}

.spainhn-button:hover{
    background-color: #ff4444 !important;
}

.custom-select{
  width: 100%;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
}
</style>