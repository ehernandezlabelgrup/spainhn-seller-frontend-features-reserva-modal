<template>
    <monumento-layout>

        <section class="text-uppercase">
            <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/reservas`">reservas</a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item active>detalles</mdb-breadcrumb-item>
            </mdb-breadcrumb>
        </section>

        <mdb-container>
            <div class="text-center py-2">
                <p class="spainhn-title-text">{{monumentoNombre}}</p>
            </div>

            <div class="text-start">
                <p>Loc. de reserva: <strong>{{$route.query.reservationId}}</strong></p>
            </div>

            <div class="px-0">
                <b-card no-body class="px-0">
                    <b-tabs 
                        pills 
                        card
                        active-nav-item-class="font-weight-bold text-uppercase red darken-4"
                        class="px-0"
                    >
                        <b-tab title="Detalles" class="overflow-auto my-4">
                            <div class="text-start px-0">
                                <h4 class="border-bottom fw-bold border-danger px-0 pb-2">Detalles de la reserva</h4>
                                <mdb-row class="px-2 spainhn-md-text">

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Loc. reserva</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p>{{reserva.identificador}}</p>
                                    </mdb-col>
                                    
                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Producto</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{reserva.producto}}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Fecha visita</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{moment(reserva.fechaDelEvento).format('DD-MM-YYYY')}}  {{reserva.horaDelEvento ? moment(reserva.horaDelEvento).format('HH:mm'):'Horario libre'}}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Tickets</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{ reserva.tickets }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Tickets válidos</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{ reserva.cancelado ? 0 : reserva.tickets }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Importe</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <!-- <p class="">{{ reserva.importe ? reserva.importe.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 }) : "" }}€</p> -->
                                        <p class="">{{ reserva.importe ? reserva.importe.toLocaleString('es-ES', {style:'currency', currency: 'EUR'}) : "" }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Tickets válidos</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{ reserva.tickets }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Fecha reserva</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{ reserva.fechaReserva ? moment(reserva.fechaReserva).format('DD-MM-YYYY'):"-" }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Estado</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="8">
                                        <!-- <p class="">{{ reserva.fechaDeConfirmacion ? "Pagado":"Reservado" }}</p> -->
                                        <mdb-btn :color="colorEstado">{{ estadoReserva }}</mdb-btn>
                                    </mdb-col>


                                    <mdb-col lg="12" xl="3" v-bind:class="{'d-none': estadoReserva != 'CANCELADO'}">
                                        <p class="fw-bold">Motivo de Cancelación</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="8" v-bind:class="{'d-none': estadoReserva != 'CANCELADO'}">
                                        <!-- <p class="">{{ reserva.fechaDeConfirmacion ? "Pagado":"Reservado" }}</p> -->
                                        <p>{{ reserva.motivoCancelacion }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3" v-bind:class="{'d-none': estadoReserva != 'CANCELADO'}">
                                        <p class="fw-bold">Fecha de cancelación</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="8" v-bind:class="{'d-none': estadoReserva != 'CANCELADO'}">
                                        <!-- <p class="">{{ reserva.fechaDeConfirmacion ? "Pagado":"Reservado" }}</p> -->
                                        <p>{{ reserva.fechaDeCancelacion }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Fecha confirmacion</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{ reserva.fechaDeConfirmacion ? moment(reserva.fechaDeConfirmacion).format('DD-MM-YYYY'):"-" }}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Ref. factura</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{ reserva.factura }}</p>
                                    </mdb-col>

                                </mdb-row>

                                <h4 class="border-bottom fw-bold border-danger px-0 mt-2 pb-2">Datos de la compra</h4>
                                <mdb-row class="spainhn-md-text">
                                    
                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Nombre</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p>{{mayorista.nombre}}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Email</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p>{{mayorista.email}}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Teléfono</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p>{{mayorista.telefono}}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Idioma</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p>{{mayorista.idioma}}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">País</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p>{{mayorista.country}}</p>
                                    </mdb-col>

                                    <!-- <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Código postal</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p>{{mayorista.zipCode}}</p>
                                    </mdb-col> -->

                                </mdb-row>

                                <div class="d-flex border-bottom border-danger mt-2 pb-0">
                                    <h4 class=" px-0 fw-bold">Datos de la compra</h4>
                                    <div class="clearfix ms-auto my-auto">
                                        <div class="d-flex my-auto" role="button" @click="() => showRefEdit = true">
                                            <font-awesome-icon transform="grow-5" icon="fa-pen"/>
                                            <p class="ms-3">Editar</p>
                                        </div>
                                    </div>
                                </div>

                                <mdb-row class="spainhn-md-text mt-2" v-bind:class="{'d-none': showRefEdit }">

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Ref. distribuidor</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="3">
                                        <p class="">{{reserva.refDistribuidor}}</p>
                                    </mdb-col>

                                </mdb-row>

                                <mdb-row class="spainhn-md-text mt-2" v-bind:class="{'d-none': !showRefEdit }">

                                    <mdb-col lg="12" xl="3">
                                        <mdb-input label="Ref. distribuidor" type="text" outline placeholder=" " v-model="newReference"/>
                                    </mdb-col>

                                    <div class="flexbox">
                                        <mdb-btn class="float-left" flat size="lg" @click="() => {showRefEdit = false; newReference = originalRef}"><u>CANCELAR</u></mdb-btn>
                                        <mdb-btn class="float-right" color="danger" size="lg" @click="doReferenceEdit" :disabled="sending">
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-bind:class="{'d-none': !sending}"></span>
                                            GUARDAR
                                        </mdb-btn>
                                    </div>

                                </mdb-row>

                                <h4 class="border-bottom fw-bold border-danger px-0 mt-2 pb-2">Detalle de la visita</h4>
                                <mdb-row class="spainhn-md-text mt-2">
                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Monumento</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{reserva.nombreDeMonumento}}</p>
                                    </mdb-col>

                                    <mdb-col lg="12" xl="3">
                                        <p class="fw-bold">Fecha visita</p>
                                    </mdb-col>
                                    <mdb-col lg="12" xl="8">
                                        <p class="">{{moment(reserva.fechaDelEvento).format('DD-MM-YYYY')}}<br/>{{reserva.horaDelEvento ? moment(reserva.horaDelEvento).format('HH:mm'):'Horario libre'}}</p>
                                    </mdb-col>

                                </mdb-row>

                                <div class="d-flex border-bottom border-danger mt-2 pb-0">
                                    <h4 class=" px-0 fw-bold">Detalle de los tickets</h4>
                                    <div class="clearfix ms-auto my-auto">
                                        <div class="d-flex my-auto" role="button" @click="() => hidePriceEdit = true">
                                            <font-awesome-icon transform="grow-5" class="" icon="fa-pen"></font-awesome-icon>
                                            <p class="ms-3">Editar</p>
                                        </div>
                                    </div>
                                </div>

                                <mdb-row class="text-center mt-3 mb-3 spainhn-md-text">

                                    <div v-bind:class="{'d-none':!hidePriceEdit}" class="mb-4">
                                        <div>
                                            <mdb-input class="text-start" type="checkbox" label="Ocultar precio" id="mostrar-precio-edit" v-model="newHidePrice"/>
                                        </div>
                                        <div class="flexbox">
                                            <mdb-btn class="float-left" flat size="lg" @click="() => {hidePriceEdit = false; newHidePrice = originalHide }"><u>CANCELAR</u></mdb-btn>

                                            <mdb-btn class="float-right" color="danger" size="lg" @click="doOcultarPrecioEdit" :disabled="sending">

                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-bind:class="{'d-none': !sending}"></span>
                                                GUARDAR
                                            </mdb-btn>
                                        </div>

                                    </div>
                                    <p v-for="(ticket, index) in reserva.descripcionDeTickets" :key="index" class="my-0 font-weight-bold">
                                        {{ticket.descripcion}} x {{ticket.cantidad}}
                                    </p>

                                </mdb-row>

                                <mdb-card-body style="min-width:920px">

                                    <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                                        <mdb-col col="1" class="spainhn-small-text-table text-start">Loc.<br/>reserva</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-table ">Nombre</mdb-col>
                                        <mdb-col col="1" class="spainhn-small-text-table ">Tipo</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-table ">Tarifa</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-table ">Importe</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-table ">Estado</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-table text-center">Acuerdo comercial</mdb-col>
                                    </mdb-row>


                                    <mdb-row v-for="(item, index) in reserva.descripcionDeTickets" :item="item" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                                        <mdb-col col="1" class="spainhn-small-text-cells">{{reserva.identificador}}</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{reserva.nombreDeMonumento}}</mdb-col>
                                        <mdb-col col="1" class="spainhn-small-text-cells text-center">normal</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{ item.descripcion }}</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{ parseFloat(item.importeBase).toLocaleString('es-ES',  { style: 'currency', 'currency': 'EUR' } ) }}</mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-cells ">
                                            <div :class="`text-center rounded py-1 text-white ${coloresEstado[item.estado]}`" 
                                                >{{item.estado}}
                                            </div>
                                        </mdb-col>
                                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{ `Acuerdo dist. ${reserva.acuerdoComercial}`}}</mdb-col>
                                    </mdb-row>

                                </mdb-card-body>

                            </div>
                        </b-tab>

                        <b-tab title="Pagos" class="overflow-auto my-4 px-0">
                            <mdb-row class="border-bottom" style="border-color:var(--spainhn-rojo-corporativo)!important">
                                <div class="text-start">
                                    <h5 class="float-start">Lista de pagos</h5>
                                </div>
                            </mdb-row>
                            <mdb-card-body style="min-width:920px">

                                <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                                    <mdb-col col="1" class="spainhn-small-text-table text-start">Referencia</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-table ">Tipo</mdb-col>
                                    <mdb-col col="1" class="spainhn-small-text-table ">Fecha pago</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-table ">Método de pago</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-table ">Importe</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-table ">Estado</mdb-col>
                                </mdb-row>


                                <mdb-row v-for="(item, index) in listaDePagosToShow" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                                    <mdb-col col="1" class="spainhn-small-text-cells">{{item.referencia}}</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-cells text-center">Total"</mdb-col>
                                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.fechaDeCompra ? moment(item.fechaDeCompra).format("DD-MM-YYYY HH:mm:ss") : "-"}}</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-cells text-center">Tarjeta TPV</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-cells text-center">{{ reserva.importe ? reserva.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : "" }}</mdb-col>
                                    <mdb-col col="2" class="spainhn-small-text-cells ">
                                        <div :class="`text-center rounded py-1 text-white ${coloresEstado[item.estado]}`" 
                                            >{{item.estado}}
                                        </div>
                                    </mdb-col>
                                </mdb-row>

                                <table-footer :page="1" :rows="listaDePagos" @actualizarElementos="actualizarTablaDePagos"/>

                            </mdb-card-body>
                        </b-tab>

                        <b-tab title="Devoluciones">
                            <mdb-row class="border-bottom" style="border-color:var(--spainhn-rojo-corporativo)!important">
                                <div class="text-start">
                                    <h5 class="float-start">No hay devoluciones asociadas a esta reserva</h5>
                                </div>
                            </mdb-row>
                        </b-tab>

                        <b-tab title="Facturas">
                            <mdb-row class="border-bottom" style="border-color:var(--spainhn-rojo-corporativo)!important">
                                <div class="text-start">
                                    <h5 class="float-start">No hay facturas asociadas a esta reserva</h5>
                                </div>
                            </mdb-row>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>

        </mdb-container>

        <mdb-modal frame position="bottom" direction="bottom" :show="edicionOk" @close="edicionOk = false" style="z-index: 2000 !important">
            <div class="d-flex py-3">
                <p class="font-weight-bold my-auto mx-auto"> Se editó con éxito la reserva</p>
                <mdb-btn color="danger" class="mr-5" @click=" $event=> edicionOk = false">ACEPTAR</mdb-btn>
            </div>
        </mdb-modal>

    </monumento-layout>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import moment from 'moment';
import TableFooter from '../components/TableFooter.vue';
export default {
  components: { TableFooter },
    data(){
        return{
            monumentoNombre: null,
            reserva: {},
            localizador: null,
            moment: moment,
            mayorista: {},
            coloresEstado: {'PENDIENTE':'warning-color', "CONFIRMADO":'success-color', "CANCELADO":'danger-color', 'RESERVADO':'secondary-color', "RECHAZADO":'danger-color'},
            listaDePagos: [],
            listaDePagosToShow: [],
            hidePriceEdit: false,
            showRefEdit: false,
            newHidePrice: null,
            newReference: null,
            edicionOk: false,
            sending: false,
            originalRef: null,
            originalHide: false
        }
    },
    methods:{
        async doOcultarPrecioEdit(){

            this.sending = true 

            const payload = {
                precio: true,
                referencia: false,
                newPriceStatus: this.newHidePrice,
                newReference: null
            }

            try{
                const resultado = await ApiSellerService.editHidePrice( this.localizador, payload )
                this.edicionOk = true;
                this.originalHide = this.newHidePrice;
            }
            catch(err){
                console.log( err );
            }

            this.sending = false;
        },
        async doReferenceEdit(){
            this.sending = true;

            const payload = {
                precio: false,
                referencia: true,
                newPriceStatus: null,
                newReference: this.newReference
            }

            try{
                const resultado = await ApiSellerService.editReference( this.localizador, payload )
                this.edicionOk = true;
                this.originalRef = this.newReference
            }
            catch(err){
                console.log( err );
            }

            this.sending = false;
        },
        async consultarPagos(){
            const resultado = await ApiSellerService.consultarPagos( this.localizador )

            console.log( resultado.data );
            return resultado.data
        },
        async buscarReserva(){
            const resultado = await ApiSellerService.getReservaByLocalizador( 'es', this.localizador, true );
            return resultado.data;
        },
        async obtenerInfoDelMayorista(){
            const resultado = await ApiSellerService.mayoristaInfo();
            return resultado.data;
        },
        actualizarTablaDePagos(evt){
            this.listaDePagosToShow = evt;
        }
    },
    async created(){

        let $vm = this;
        $vm.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');
        $vm.localizador = this.$route.query.reservationId;
        $vm.reserva = await this.buscarReserva();

        this.reserva.descripcionDeTickets.forEach( ticket => {
            if( this.reserva.cancelado ){
                ticket.estado = "CANCELADO"
            }
            else if( this.reserva.fechaDeConfirmacion ){
                ticket.estado = "CONFIRMADO"
            }else{
                ticket.estado = "RESERVADO"
            }
        })

        this.newHidePrice = this.reserva.ocultarPrecio;
        this.originalHide = this.reserva.ocultarPrecio;
        this.originalRef = this.reserva.referencia;

        console.log( this.originalRef );
        this.newReference = this.reserva.referencia;

        $vm.mayorista = await this.obtenerInfoDelMayorista();

        console.log( this.mayorista );
        $vm.listaDePagos = await this.consultarPagos();
    },
    computed: {
        estadoReserva(){
            let estado = null;
            console.log( this.reserva );
            if( this.reserva.cancelado ){
                estado ="CANCELADO"
            }
            else if( this.reserva.fechaDeConfirmacion ){
                estado = "CONFIRMADO"
            }else{
                estado = "RESERVADO"
            }

            return estado;
        },
        colorEstado(){
            if( this.reserva.cancelado ){
                return 'danger'
            }
            else if( this.reserva.fechaDeConfirmacion ){
                return 'success';
            }
            else{
                return 'secondary'
            }
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

</style>