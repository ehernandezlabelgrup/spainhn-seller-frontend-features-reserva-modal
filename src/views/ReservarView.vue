<template>
    <monumento-layout>
        <section class="text-uppercase">
            <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/productos`" > visitas </a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item active>Reservar</mdb-breadcrumb-item>
            </mdb-breadcrumb>
        </section>

        <div class="text-center mt-2">
            <p class="spainhn-title-text">{{monumentoNombre}}</p>
        </div>

        <b-spinner style="position:absolute; z-index:2; left: 40%; top:30%; width: 10rem; height: 10rem;" variant="danger" v-bind:class="{'d-none':!loading}"></b-spinner>

        <div class="container-fluid px-5 mt-4 mb-4">
            <mdb-row>
                <div class="container-fluid px-0">
                    <mdb-card class="d-flex pe-0 w-100 container px-0 px-md-0 shadow">
                
                        <mdb-view class="d-flex my-auto py-3 px-3">

                            <div class="text-start">
                                <div class="justify-content-start">
                                    <p class="text-muted">Nombre de visita</p>
                                    <b-select class="py-2 px-3" :options="visitasDisponibles" 
                                     v-model="entradaInfo.spainhnId" @change="reloadReservar"></b-select>
                                </div>

                                <mdb-input label="REFERENCIA DE DISTRIBUIDOR" class="mt-5" v-model="referenciaDistribuidor" 
                                outline 
                                small="Es una referencia del mayorista, ejemplo: nombre del cliente final, nombre de agente, puede dejarlo sin rellenar"/>
                            </div>

                        </mdb-view>

                    </mdb-card>

                </div>

            </mdb-row>

            <mdb-row class="my-2 px-0">
                <reservation-date-picker
                    v-if="entradaInfo.id && !isLoading"
                    @getDate="setDate" 
                    :id-producto="entradaInfo.id" >
                </reservation-date-picker>
            </mdb-row>

            <mdb-row class="my-4">
                <schedule-picker
                    v-if="entradaInfo.id && !isLoading"
                    @getHour="setSchedule" 
                    :fecha="selectedDate" 
                    :mostrar-aforo="mostrarAforo"
                    :mostrar-plazas="mostrarPlazas"
                    :id-producto="entradaInfo.id"
                    :id-monumento="monumentoId"/>
            </mdb-row>

            <mdb-row class="my-4">
                <rates-picker
                    v-if="entradaInfo.id && !isLoading"
                    @addToCart="addToCart"
                    :condicionComercial="condicionComercial"
                    :horariosInfo="selectedHourInfo"
                    :tarifa="tarifa"/>
            </mdb-row>

        </div>

        <WelcomeModal
            :popup-start="showWelcome" 
            :title="welcome.message.title" 
            :subtitle="welcome.message.subtitle"
            :image-url="null"
            @close="showWelcome = false"
            :color="'danger'" />

    </monumento-layout>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import ReservationDatePicker from '../components/ReservationDatePicker.vue';
import SchedulePicker from '../components/SchedulePicker.vue'
import RatesPicker from '../components/RatesPicker.vue';

import EventBus from '../event-bus';
import CalendarioService from '../services/Calendario.service';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import WelcomeModal from '../components/WelcomeModal.vue'
export default {
    components: { 
        ReservationDatePicker,
        SchedulePicker,
        RatesPicker,
        WelcomeModal
    },
    data(){
        return{
            isLoading: false,
            moment: moment,
            monumentoNombre: null,
            monumentoNombres: [{texto:""}, {texto:""}, {texto:""}, {texto:""}],
            loading: false,
            referenciaDistribuidor: null,
            visitasDisponibles: [],
            simbolo: null,
            comision: null,
            descuento: null,
            tipoDeDescuento: null,
            // entradaId: null,
            entradaInfo: {
                nombres: [],
                cancelable: false,
                tipoDeEntrada: null,
                mostrarAforo: false,
                mostrarPlazas: false,
                id: null,
                spainhnId: null,
                daysToCancelReservation: null,
                maxTicketsResellers: null
            },
            selectedDate: null,
            limitPaymentDate: null,
            selectedHourInfo: null,
            mostrarAforo: false,
            mostrarPlazas: false,
            tarifa: {
                precios: [],
            },
            condicionComercial: null,
            itemUuid: null,
            errorPlazas: false,
            condicionesComerciales: {},
            tipoDePago: 'redsys',
            metodosDePagoOptions: [
                { text: 'TPV', value:'redsys', selected: true },
                { text: 'Transferencia', value: 'transferencia' }
            ],
            welcome: {
                active: false,
                message: {
                    title: '',
                    subtitle: ''
                }
            },
            showWelcome: false
        }
    },
    methods:{

        async setSchedule( evt ){
            this.selectedHourInfo = evt;
            const tempTarifa = {...evt.tarifa}

            // const precios = tempTarifa ?  tempTarifa.precios.filter( p => p.mayorista != false ) : [];
            const precios = tempTarifa ? tempTarifa.precios : [];
            tempTarifa.precios = precios;

            let preciosModificados = [];
            const idsPrecios = precios.map( p => p.oldId);
            try{

                const preciosModificadosResult = await ApiSellerService.getModificadoresDePrecios( idsPrecios );

                preciosModificados = [ ...preciosModificadosResult ];
            }
            catch(err){
                console.log(err);
            }

            // this.tarifa = evt.tarifa ? evt.tarifa : { precios: [] }

            if( preciosModificados.length ){

                tempTarifa.precios.forEach( p => {

                    let modificaciones = preciosModificados.filter( pm => pm.idPrecio == p.oldId );

                    let modificacionesPorFecha = modificaciones.filter( mp => mp.fechaDeModificador != null );

                    if( modificacionesPorFecha.length > 0 ){
                        modificacionesPorFecha.forEach( mp => {
                            const fechaDeDisparo = moment( mp.fechaDeModificador );
                            // const fechaSeleccionada = moment(this.selectedDate).utc().format('YYYY-MM-DD') 
                            const today = moment();

                            if( fechaDeDisparo.isSameOrBefore( today ) ){
                                p.precio = mp.valor;   
                            }
                        })
                    }
                })
            }
            this.tarifa = tempTarifa ? tempTarifa : { precios: [] }
        },
        /**
         * Preguntamos las visitas disponibles en este monumento
         * @param {String} monumentoId - Id del monumento que se está consultando
         */
        async getVisitas( monumentoId ){
            let resultado =  await ApiSellerService.getVisitas( 'es', monumentoId);
            const visitasDisponibles = resultado.data.map( v=> {
                let obj = { text: `${v.nombres[0].texto}`, value: v.oldId, 
                    welcomeActive: v.welcomeActive ?? false,
                    welcomeMessages: v.welcomeMessages ?? ( { title: v.welcomeMessages?.title, subtitle: v.welcomeMessages?.subtitle } ) }
                return obj;
            })

            return visitasDisponibles;
        },
        /**
         * Obtenemos la condición comercial de este monumento y esta entrada, relacionadas con este mayorista
         */
        async consultarCondicionesComerciales(){
            const condiciones = await ApiSellerService.getComision( this.monumentoId, this.entradaInfo.id)
            return condiciones.data;
        },

        async reloadReservar(){
            this.isLoading = true;
            console.log("Recargando reserva...")
            const monumentoNombre = this.$route.params.monumentoNombre;
            this.$router.push(`/${monumentoNombre}/reservar/visita:${this.entradaInfo.spainhnId}`)
            await this.consultarInfoParaReserva();
            this.visitasDisponibles = await this.getVisitas( this.monumentoId );
            this.nombreDeVisita = this.visitasDisponibles.filter( visita => visita.value == this.entradaInfo.spainhnId ).map( v => v.text );
            this.welcome = this.visitasDisponibles.filter( visita => visita.value == this.entradaInfo.spainhnId )
                .map( v => ( { active: v.welcomeActive ?? false, message: v.welcomeMessages ?? ({ title: '', subtitle: '' }) } ) )[0];
            console.log( this.welcome );
            if( this.welcome.active ){
                this.showWelcome = true;
            }
            this.isLoading = false;
        },

        /**
         * Configuramos la fecha seleccionada utilizando el valor devuelto por el selector de fechas
         * @param {String} evt - info about the date
         */
        setDate(evt){
            this.selectedDate = evt;
            const daysToSubtract = this.entradaInfo.daysToCancelReservation;
            this.limitPaymentDate = moment.utc( evt ).subtract( daysToSubtract, 'days' ).format('YYYY-MM-DD');
            this.tarifa = {
                precios: []
            }
        },

        async consultarInfoParaReserva(){
            let $vm = this;

            // Obtenemos la entrada
            this.entradaInfo.spainhnId = this.$route.params.visitaId;

            const entradaResult = await ApiSellerService.getEntradaById(this.entradaInfo.spainhnId, 'es');

            const entradaInfo = entradaResult.data;

            this.nombres = entradaInfo.nombres;
            this.monumentoNombres = entradaInfo.castilloNombres;
            this.monumentoId = entradaInfo.monumentoId;
            this.entradaInfo.cancelable = entradaInfo.cancelable;
            this.entradaInfo.tipoDeEntrada = entradaInfo.tipo;
            this.entradaInfo.mostrarAforo = entradaInfo.mostrarAforo;
            this.entradaInfo.mostrarPlazas = entradaInfo.mostrarPlazas;
            this.entradaInfo.id = entradaInfo._id;
            this.entradaInfo.daysToCancelReservation = entradaInfo.daysToCancelReservation ?? 1;
            this.entradaInfo.maxTicketsResellers = entradaInfo.maxTicketsResellers
            const condicionesComerciales = await this.consultarCondicionesComerciales();
            
            const { tipoAcuerdoComercialSpainhn, spainhn, descuentoComercial, tipoDescuento, descuentoMayorista, idMayorista } = condicionesComerciales;

            this.condicionComercial = {...condicionesComerciales};
            this.simbolo = tipoDescuento !== 'porcentaje' ? '€' : '%';
            this.comision = spainhn;
            this.descuento = descuentoMayorista;
            this.tipoDeDescuento = tipoDescuento;  
        },

        async addToCart( evt ){
            const { items, pvp, plazas } = evt;

            try{
                const plazasResult = await CalendarioService.consultarDisponibilidadParaHorario( this.selectedHourInfo.id )

                if( plazasResult.data && plazasResult.data < plazas && plazasResult.data != null){
                    this.errorPlazas = true;
                    EventBus.$emit('consultarHorarios')
                    this.$store.commit('guardarPlazas', 0)
                    EventBus.$emit('resetBoletos')
                    this.tarifa.precios = [];
                    return;
                }
                
            }
            catch( err ){
                console.log(err);
                this.$store.commit('guardarPlazas', 0)
                EventBus.$emit('resetBoletos')
                return;
            }

            const itemUuid = uuidv4()
            const comisionTotal = items.filter( i => i.tipo_comision != null ).map( item => ( item.total - item.importeBase ) ).reduce( (acc, curr) => acc + curr, 0 );
            const descuentoTotal = items.map( item => ( item.descuentoSpainhn * item.importeBase * item.cantidad ) ).reduce( ( acc, curr ) => acc + curr, 0 );
            const baseTotal = items.map( item => item.importeBase ).reduce( ( acc, curr ) => acc + curr, 0 )

            let tipoCobro = false;
            if( comisionTotal > 0 ){
                tipoCobro = true;
            }

            let carritoItem = {
                itemIDVisita: this.entradaInfo.id,
                itemOldIdVisita: this.entradaInfo.spainhnId,
                itemUuid: itemUuid, 
                itemComisionTotal: comisionTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } ),
                itemDescuentoTotal: descuentoTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } ),
                itemBaseTotal: baseTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } ),
                itemHorario: this.selectedHourInfo.horaFull,
                notesToMonument: this.selectedHourInfo.notesToMonument,
                itemFecha: this.selectedDate,
                itemFechaLimiteDePago: this.limitPaymentDate,
                itemTotal: pvp,
                itemTickets: items, 
                itemVisita: this.nombres, 
                itemMonumento: this.monumentoNombres,
                itemComision: this.condicionComercial.valor,
                itemTipoCobro: tipoCobro,
                itemComisionPorcentaje: this.condicionComercial.tipo,
                cancelable: this.cancelable,
                seguroCancelacion: false,
                montoCancelacion: 0,
                timestamp: new Date(),
                pos: this.pos,
                carritoUuid: null,
                reservationId: null,
                itemID: this.selectedHourInfo.id,
                pedidoExterno: true,
                accionDePago: 'reservar',
                metodoDeFacturacion: 'visita'
            }

            await this.$store.dispatch( 'addToCart', carritoItem );    
              
            carritoItem.carritoUuid = this.$store.getters.cartStatus.uuid;
            
            this.$store.commit('guardarPlazas', 0)
            EventBus.$emit('resetBoletos')
            // this.$router.push('/checkout');
            this.$router.push(`/${this.$route.params.monumentoNombre}/reservar/resumenCompra`)

        }

    },
    async created(){
        this.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');

        this.entradaInfo.spainhnId = this.$route.params.visitaId

        await this.consultarInfoParaReserva();

        this.visitasDisponibles = await this.getVisitas( this.monumentoId );

        this.nombreDeVisita = this.visitasDisponibles.filter( visita => visita.value == this.entradaInfo.spainhnId ).map( v => v.text );

        this.welcome = this.visitasDisponibles.filter( visita => visita.value == this.entradaInfo.spainhnId )
            .map( v => ( { active: v.welcomeActive ?? false, message: v.welcomeMessages ?? ({ title: '', subtitle: '' }) } ) )[0];

        console.log( this.welcome );
        if( this.welcome.active ){
            this.showWelcome = true;
        }
    }
}
</script>