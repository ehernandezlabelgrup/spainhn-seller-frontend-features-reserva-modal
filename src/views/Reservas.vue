<template>
<monumento-layout>
    <section class="text-uppercase">
        <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
            <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item active>reservas</mdb-breadcrumb-item>
        </mdb-breadcrumb>
    </section>

    <!-- <div id="loader" class="center" v-if="creatingPDF">
        <img src="../assets/SimboloCastilloRojoCorporativa.svg" style="height:400px; width:auto;" class="center animated flip infinite"/>
    </div> -->

    <LoaderComponent :class="{'d-none': !creatingPDF && !sending }" style="z-index: 99999"/>
    <mdb-container class="">
        <div class="text-center py-2">
            <p class="spainhn-title-text">{{monumentoNombre}}</p>
        </div>

        <mdb-card class="my-4">
            <mdb-card-body>

                <mdb-alert color="warning" v-if="p1" @closeAlert="p1=false" dismiss>
                    Seleccione al menos una opción
                </mdb-alert>

                <mdb-row>
                    <mdb-col md="5" col="12">
                        <mdb-input id="localizador-reserva" :label="'LOC. RESERVA'" :placeholder="' '" outline v-model="filtros.localizador"></mdb-input>
                    </mdb-col>
                    <mdb-col md="7" col="12" class="text-start">
                        <span class="block text-gray-600 text-sm text-left font-bold mb-2">Fecha de visita</span>
                        <vc-date-picker
                            v-model="filtros.range"
                            mode="date"
                            :masks="masks"
                            is-range
                        >
                            <template v-slot="{ inputValue, inputEvents, isDragging }">
                            <div class="d-flex justify-start items-center">
                                <div class=" ">
                                <input
                                    class="bg-gray-100 py-1 border rounded w-100"
                                    :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                                    :value="inputValue.start"
                                    v-on="inputEvents.start"
                                />
                                </div>
                                <font-awesome-icon icon="fa-arrow-right" class="my-auto mx-1"></font-awesome-icon>
                                <div class="">
                                <input
                                    class="bg-gray-100 border py-1 rounded w-100"
                                    :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                                    :value="inputValue.end"
                                    v-on="inputEvents.end"
                                />
                                </div>
                            </div>
                            </template>
                        </vc-date-picker>
                    </mdb-col>

                    <mdb-col md="6" col="12">
                        <mdb-select id="fecha-reserva" v-model="fechasOptions" :label="'CREACIÓN DE LA RESERVA'" @getValue="(evt) => filtros.fechaDeReserva = evt " :placeholder="' '" outline></mdb-select>
                    </mdb-col>

                    <mdb-col md="6" col="12">
                        <mdb-select id="fecha-compra" v-model="fechasOptionsCompra" :label="'FECHA COMPRA'" :placeholder="' '" @getValue="(evt) => filtros.fechaDeCompra = evt" outline></mdb-select>
                    </mdb-col>

                    <mdb-col md="6" col="12">
                        <mdb-select id="estado-reserva" v-model="estadoOptions" @getValue="(evt) => filtros.estado = evt " :label="'ESTADO'" :placeholder="' '" outline></mdb-select>
                    </mdb-col>

                    <mdb-col md="6" col="12">
                        <mdb-input id="referencia-distribuidor" :label="'REFERENCIA DISTRIBUIDOR'" :placeholder="' '" outline></mdb-input>
                    </mdb-col>

                    <mdb-col col="12">
                        <mdb-btn class="float-right" color="danger" @click="buscarReservas" :disabled="sending">
                            BUSCAR
                            <span><mdb-spinner :class="{'d-none': !sending}"/></span>
                        </mdb-btn>
                    </mdb-col>

                </mdb-row>
            </mdb-card-body>
        </mdb-card>

        <mdb-card class="overflow-auto my-4">
            <mdb-card-body style="min-width:980px">

                <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                    <mdb-col col="1" class="spainhn-small-text-table text-start">Loc.<br/>reserva</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-table ">Producto</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Estado</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Tickets</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Fecha <br/>de reserva</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Fecha <br/>del evento</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Días <br/>para pago</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table text-center">Referencia<br/>distribuidor</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Importe</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-table ">Acciones</mdb-col>
                </mdb-row>

                <mdb-row v-for="(item, index) in itemsToShow" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                    <mdb-col col="1" class="spainhn-small-text-cells">{{item.localizador}}</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-cells">{{item.visitaNombre}}</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells ">
                        <div class="success-color text-center rounded py-1 text-white" 
                           v-bind:class="getColor(item.bookingStatus)"
                        >
                           {{ getStatus(item.bookingStatus) }}
                        </div>
                    </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">
                        <div>
                            <span v-bind:class="{ 'cancelados': item.ticketsCancelados }">
                                {{item.subtotalDePersonas}}
                            </span>
                            <span v-if="item.ticketsCancelados">
                                <br/>
                                {{ item.totalDePersonas }}
                            </span>
                        </div>
                    </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ moment(item.itemFechaReserva).format('DD-MM-YYYY') }}</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ moment(item.itemFecha).format('DD-MM-YYYY') }}<br/>{{item.itemHorario ? moment(item.itemHorario).format('HH:mm'):'Horario libre'}}<br/> </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ item.diasParaPago }} </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ item.referenciaDeDistribuidor }}</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">
                        <div>
                            <span v-bind:class="{ 'cancelados': item.ticketsCancelados }">
                                {{item.itemSubtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
                            </span>
                            <span v-if="item.devolucionRealizada">
                                <br/>
                                {{ (item.itemTotal).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' } ) }}
                            </span>
                        </div>
                    </mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-cells">
                        <div class="d-flex justify-content-center" v-if="item.itemOptions.length > 0" style="gap: 0.5rem; flex-wrap: wrap;">
                            <b-button v-if="item.itemOptions.find(o => o.value === 'pagar')" 
                                    size="sm" variant="primary" pill
                                    v-b-tooltip.hover title="Pagar"
                                    class="button-icon"
                                    @click="reservaAction({...item, accionDePago: 'pagar'})">
                                <font-awesome-icon icon="fa-credit-card" style="font-size: 10px;" />
                            </b-button>
                            <b-button v-if="item.itemOptions.find(o => o.value === 'editar')" 
                                    size="sm" variant="warning" pill
                                    v-b-tooltip.hover title="Editar"
                                    class="button-icon"
                                    @click="reservaAction({...item, accionDePago: 'editar'})">
                                <font-awesome-icon icon="fa-pen" style="font-size: 10px; " />
                            </b-button>
                            <b-button v-if="item.itemOptions.find(o => o.value === 'detalles')" 
                                    size="sm" variant="info" pill
                                    v-b-tooltip.hover title="Ver detalles"
                                    class="button-icon"
                                    @click="showDetails(item)">
                                <font-awesome-icon icon="fa-eye" style="font-size: 10px; color: white;" />
                            </b-button>
                            <b-button v-if="item.itemOptions.find(o => o.value === 'download')" 
                                    size="sm" variant="success" pill
                                    v-b-tooltip.hover title="Descargar PDF"
                                    class="button-icon"
                                    @click="reservaAction({...item, accionDePago: 'download'})">
                                <font-awesome-icon icon="fa-file-pdf" style="font-size: 10px;" />
                            </b-button>
                            <b-button v-if="item.itemOptions.find(o => o.value === 'proform')" 
                                    size="sm" variant="secondary" pill
                                    v-b-tooltip.hover title="Descargar proforma"
                                    class="button-icon"
                                    @click="reservaAction({...item, accionDePago: 'proform'})">
                                <font-awesome-icon icon="fa-file-invoice" style="font-size: 10px;" />
                            </b-button>
                            <b-button v-if="item.itemOptions.find(o => o.value === 'cancelar')" 
                                    size="sm" variant="danger" pill
                                    v-b-tooltip.hover title="Cancelar"
                                    class="button-icon"
                                    @click="reservaAction({...item, accionDePago: 'cancelar'})">
                                <font-awesome-icon icon="fa-ban" style="font-size: 10px;" />
                            </b-button>
                            <b-button v-if="item.itemOptions.find(o => o.value === 'partial_refund')" 
                                    size="sm" variant="danger" pill
                                    v-b-tooltip.hover title="Devolución parcial"
                                    class="button-icon"
                                    @click="reservaAction({...item, accionDePago: 'partial_refund'})">
                                <font-awesome-icon icon="fa-money-bill-transfer" style="font-size: 10px;" />
                            </b-button>
                        </div>
                    </mdb-col>
                </mdb-row>

                <table-footer :page="1" :rows="items" @actualizarElementos="actualizarTabla"/>
            </mdb-card-body>
        </mdb-card>

    </mdb-container>

    <detalles-de-reserva-modal 
        :show="showDetallesModal"
        :localizador="selectedLocalizador"
        @close="showDetallesModal = false"
    />

    <editar-reserva-modal
        :show="showEditarModal"
        :localizador="selectedLocalizador"
        @close="showEditarModal = false"
    />

    <mdb-modal :show="devolucionParcial" @close="()=>devolucionParcial=false" style="z-index: 1999 !important" size="lg" centered>
        <form @submit.prevent="() => doRefund( selectedBooking )">
            <mdb-modal-header>
                <mdb-modal-title>Solicitar devolución parcial</mdb-modal-title>
            </mdb-modal-header>
            <mdb-modal-body>
                <div>
                    <ul class="list-group text-start">
                        <li class="list-group-item">
                            <span class="font-weight-bold">Fecha de reserva:</span> {{ selectedBooking.fecha }} - {{selectedBooking.hora}}
                        </li>
                        <li class="list-group-item">
                            Localizador: {{ selectedBooking.locator }}
                        </li>
                        <li class="list-group-item">
                            Tickets Originales: <span class="font-weight-bold">{{ selectedBooking.originalTickets }}</span>
                        </li> 
                        <li class="list-group-item">
                            Importe original: <span class="font-weight-bold">{{ selectedBooking.importeTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR'}) }}</span>
                        </li>
                    </ul>
                </div>
                <hr>
                <h5>¿Cuántos tickets se devolveran?</h5>
                <div v-for="(detail, index) of selectedBooking.sourceDetails" :key="index">
                    <mdb-input 
                        outline
                        :label="detail.descripcion" type="number"
                        :min="0"
                        :max="detail.cantidad" v-model="detallesDeDevolucion[detail._id]"/>
                </div>
                <mdb-input label="MOTIVO" v-model="selectedBooking.motivo" required/>
    
            </mdb-modal-body>
            <mdb-modal-footer>
                <mdb-btn color="primary" type="submit" :disabled="!totalToRefund">SOLICITAR DEVOLUCIÓN POR: {{ totalToRefundString }}</mdb-btn>
                <mdb-btn color="warning" @click="() => devolucionParcial = false">CANCELAR</mdb-btn>
            </mdb-modal-footer>
        </form>
    </mdb-modal>
    <mdb-modal :show="cancelForm" @close="() => cancelForm = false" style="z-index: 2000 !important" size="lg">
        <form>
            <mdb-modal-header class="">
                <h4 class="text-center mx-auto font-weight-bold">Confirmar cancelación de reserva</h4>
            </mdb-modal-header>
            <mdb-modal-body class="text-start">
                <small>Se invalidarán todas las entradas de la reserva y NO se devolverán los pagos realizados. ¿Está seguro de que quiere continuar con la cencelación de esta reserva?</small>

                <mdb-select 
                    v-model="motivosDeCancelacion" 
                    ref="motivoSelect" 
                    id="motivo-cancelacion" 
                    label="MOTIVO *" 
                    placeholder=" " 
                    outline 
                    @getValue="(evt) => dataForm.motivoCancelacion = evt "
                    validation/>

                <mdb-input  type="textarea" label="OBSERVACIONES" placeholder=" " outline v-model="dataForm.observaciones"/>

                <mdb-input type="checkbox" label="Enviar correo" id="enviar-correo" v-model="dataForm.enviarCorreo"/>

            </mdb-modal-body>

            <mdb-modal-footer>
                <mdb-btn color="danger" :disabled="sending" @click="enviarCancelacion">CANCELAR RESERVA</mdb-btn>
            </mdb-modal-footer>
        </form>
    </mdb-modal>

    <mdb-modal frame position="bottom" direction="bottom" :show="cancelacionOk" @close="cancelacionOk = false" style="z-index: 2000 !important">
        <div class="d-flex py-3">
            <p class="font-weight-bold my-auto mx-auto">Se canceló la reserva con éxito</p>
            <mdb-btn color="danger" class="mr-5" @click=" $event=> cancelacionOk = false">ACEPTAR</mdb-btn>
        </div>
    </mdb-modal>

</monumento-layout>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import moment from 'moment'
import * as printJS from 'print-js';
import TableFooter from '../components/TableFooter.vue'
import SelectorDeOpciones from '../components/SelectorDeOpciones.vue';
import LoaderComponent from "../components/LoaderComponent.vue";
import DetallesDeReservaModal from '../components/DetallesDeReservaModal.vue';
import EditarReservaModal from '../components/EditarReservaModal.vue';

export default {
  components: { TableFooter, LoaderComponent, DetallesDeReservaModal, EditarReservaModal },
  data(){
    return{
        p1:false,
        monumentoNombre: null,
        date: '',
        date2:'',
        range: {
            start: null,
            end: null,
        },
        masks: {
            input: 'DD-MMMM-YYYY',
        },
        moment:moment,
        fechasOptions: [
            { text:'', value:null},
            { text:'Hoy', value: 0 },
            { text:'Ayer', value: 1 },
            { text:'últimos 2 días', value: 2 },
            { text:'últimos 5 días', value: 3 },
            { text:'últimos 7 días', value: 4 },
        ],
        fechasOptionsCompra: [
            { text:'', value:null},
            { text:'Hoy', value: 0 },
            { text:'Ayer', value: 1 },
            { text:'últimos 2 días', value: 2 },
            { text:'últimos 5 días', value: 3 },
            { text:'últimos 7 días', value: 4 },
        ],
        estadoOptions: [
            { text:'', value:null},
            { text:'Confirmada', value: 0 },
            { text:'Reservada', value: 1 },
            { text:'Devuelta', value: 2 },
            { text:'Cancelada', value: 3 },
            { text:'Auto cancelada', value: 4 },
            { text:'Sin confirmar', value: 5 },
        ],
        accionesDePago: [
            { text:'Selecciona una opción', value: null},
            { text:'Pagar', value: 0},
            { text:'Editar', value: 1 },
            { text: 'Ver detalles', value: 2 },
            { text: 'Descargar proforma', value: 5 },
            { text:'Cancelar reserva', value: 3 }
        ],
        accionesMinimo: [
            { text:'', value: null},
            { text: 'Ver detalles', value: 2 },
            { text: 'Descargar PDF', value: 4}
        ],
        accionesCancelacion: [
            { text:'', value: null},
            // TODO: Quitar esta opción de aquí
            { text: 'Descargar proforma', value: 5 },
            { text: 'Ver detalles', value: 2 },
        ],
        items: [],
        itemsToShow:[],
        entradas: [],
        filtros:{
            estado:null,
            localizador: null,
            fechaDeCompra: null,
            referencia: null,
            fechaDeReserva: null,
            range: {
                start: moment().subtract(6, 'months').toDate(),
                end: moment().toDate()
            }
        },
        creatingPDF: false,
        cancelForm: false,
        motivosDeCancelacion: [
            { text: '', value: null },
            { text: 'Error de compra', value: 1 },
            { text: 'Fuerza Mayor', value: 2 },
            { text: 'Cambio Planificación', value: 3 },
            { text: 'Solicitud del Organizador', value: 4},
            { text: 'Otros', value: 5 }
        ],
        dataForm:{
            motivoCancelacion: null,
            observaciones: null,
            enviarCorreo: false,
            refund: false,
        },
        sending: false,
        itemToCancelLocalizer: null,
        cancelacionOk: false,
        bookingStatus: {
            '0': { text: 'No confirmado', color: 'warning-color-dark' },
            '1': { text: 'Reservada', color: 'info-color-dark' },
            '2': { text: 'Pagado', color: 'sucess-color' },
            '3': { text: 'Cancelado', color: 'danger-color-dark' },
            '4': { text: 'Auto cancelado', color: 'warning-color-dark' },
            '5': { text: 'Pagado sin confirmar', color: 'unique-color' },
        },
        allOptions: [
            { text:'Selecciona una opción', value: null},
            { text:'Pagar', value: 'pagar'},
            { text:'Editar', value: "editar" },
            { text: 'Ver detalles', value: "detalles" },
            { text: 'Descargar pdf', value: "download" },
            { text: 'Descargar proforma', value: "proform" },
            { text:'Cancelar reserva', value: "cancelar" },
            { text: 'Devolución parcial', value: 'partial_refund'}
        ],
        refund: false,
        devolucionParcial: false,
        selectedBooking: { 
            fecha: '',
            locator: '',
            detalles: '',
            importeTotal: '0',
            motivo: '',
            sourceDetails: [],
        },
        detallesDeDevolucion: {},
        showDetallesModal: false,
        showEditarModal: false,
        selectedLocalizador: null
    }
  },
  methods:{
    getColor(status){
        return this.bookingStatus[status].color
    },
    getStatus(status){
        return this.bookingStatus[status].text
    },
    enviarCancelacion(){
        this.$refs.motivoSelect.validate();
        if( this.dataForm.motivoCancelacion ){
            this.cancelarReserva();
        }
    },
    async cancelarReserva(){
        this.sending = true;

        if( this.refund  ){
            console.log( "Aquí")
            try{
                const requestBody = {
                    type: "REFUND",
                    cancellationReason: this.dataForm.observaciones || 
                        (this.motivosDeCancelacion.find( m => m.value === this.dataForm.motivoCancelacion)?.text ?? ''),
                    cencellationDetails: [],
                }
                const result = await ApiSellerService.triggerRefundRequest( this.itemToCancelLocalizer, requestBody );

                const tempItems = this.items.map( i => {
                    const item = {...i};
                    if( item.localizador === this.itemToCancelLocalizer ){
                        item.solicitudDeCancelacionActiva = true;
                    }
                    return item;
                });

                this.items = tempItems;
                this.$toast("Su solicitud para cancelar la reserva se ha enviado");
                
            }catch( err ){
                this.$toast.error("No se pudo solicitar la cancelación");
            }
        }else{

            try{
                // await ApiSellerService.cancelReservation( this.itemToCancelLocalizer, this.dataForm );
                this.cancelacionOk = true;
    
                this.items.forEach( e => {
    
                    if( e.localizador == this.itemToCancelLocalizer ){
                        e.accionDePago = null;
                        e.cancelado = true;
                        e.bookingStatus = "3";
                    }
                })
                this.$toast.success('Se canceló de manera correcta');
            }
            catch(err){
                this.$toast.error("No se pudo cancelar la reserva");
                console.log(err);
            }
        }
        this.sending = false;
        this.cancelForm = false;
    },
    async doRefund(_selectedBooking){
        if( !this.totalToRefund ){
            this.$toast.error("Revise el importe de devolución");
            throw Error("Importe incorrecto")
        }

        const _locator = _selectedBooking.locator;

        const payloadData = {
            type: 'PARTIAL_REFUND',
            cancellationReason: _selectedBooking.motivo,
            cancellationDetails: Object.entries( this.detallesDeDevolucion ).map( d => {
                const detail = {
                    entryId: d[0],
                    ticketsToCancel: d[1],
                }
                return detail;
            })
        }

        if( payloadData.cancellationDetails.reduce( (acc, curr) => acc + curr.ticketsToCancel, 0 ) === this.selectedBooking.sourceDetails.reduce( ( acc, curr ) => acc + curr.totalDePersonas, 0 ) ){
            payloadData.type= "REFUND"
        }
        this.sending = true;
        try {
            const result = await ApiSellerService.triggerRefundRequest( _locator, payloadData );
            this.$toast.success("Su solicitud fue enviada con éxito");
            this.devolucionParcial = false;

            this.items.forEach( i => {
                if( i.localizador === payloadData.localizador ){
                    i.solicitudDeCancelacionActiva = true;
                }
            })
            this.selectedBooking = {
                fecha: '',
                locator: '',
                detalles: '',
                importeTotal: '0',
                motivo: '',
                sourceDetails: [],
            }

            this.detallesDeDevolucion = {};

        } catch (error) {
            console.log( error );
            this.$toast.error("No pudimos procesar su solicitud");
        }finally{
            this.sending = false;
        }
    },
    actualizarTabla(evt){
        this.itemsToShow = evt;
    },
    validarBusqueda(){

        let validacionExitosa = false;

        if( this.filtros.estado != null || this.filtros.localizador != null || this.filtros.fechaDeCompra != null || 
            this.filtros.referencia != null || this.filtros.fechaDeReserva != null || this.filtros.fechaDeCompra != null || 
            ( this.filtros.range.start != null && this.filtros.range.end != null)
            ){
            validacionExitosa = true;
        }
        return validacionExitosa;
    },
    async buscarReservas(){

        const filtrosValidos = this.validarBusqueda();
        if( !filtrosValidos ){
            this.p1 = true;
            return;            
        }
        try{
            this.sending = true;
            let resultado = await ApiSellerService.getReservas( this.filtros, this.$route.params.monumentoNombre )
            // const reservas = resultado.data.filter( r => r.monumentoNombre.toLowerCase() === this.monumentoNombre.toLowerCase() );
            const reservas = resultado.data;

            this.items = reservas.map( r => {
                let diasCalculados = 0;

                if( r.fechaLimiteDePago == null ){
                    diasCalculados = 0;
                    diasCalculados = 'Vencido'
                }
                else{
                    const today = moment();

                    const fecha = moment( r.fechaLimiteDePago );

                    const fechaLimite = moment( r.fechaLimiteDePago );

                    diasCalculados = fechaLimite.diff( today, 'days');

                    if( diasCalculados < 0 ){
                        diasCalculados = 'Vencido'
                    }
                }

                const diasParaPago = r.pagado || r.cancelado ? '-' : diasCalculados;
                const subtotal = r.descripcion.reduce( (acc, curr) => acc + curr.total, 0 );
                const devoluciones = r.descripcion.reduce( ( acc, curr ) => acc + (curr.devolucionRealizada ?? 0), 0  );
                const subtotalDeTickets = r.descripcion.reduce( ( acc, curr) => acc + curr.cantidad, 0 );
                const ticketsCancelados = r.descripcion.reduce( (acc, curr) => acc + (curr.ticketsCancelados ?? 0) , 0 );


                const selectorConfig = {
                    pagar: r.bookingStatus === '1' || r.bookingStatus === '0',
                    editar: r.bookingStatus === '2' || r.bookingStatus === '1' || r.bookingStatus === '0' || r.bookingStatus === '5',
                    detalles: true,
                    download: r.bookingStatus === '2' || r.bookingStatus === '5',
                    proform: r.bookingStatus === '1' || r.bookingStatus === '0',
                    cancelar: r.bookingStatus === '1' || r.bookingStatus === '0' || ( (r.bookingStatus === '2' || r.bookingStatus === '5') && r.solicitudDeCancelacionActiva !== true ),
                    partial_refund: r.bookingStatus === '2' &&r.solicitudDeCancelacionActiva !== true
                }

                const itemOptions = this.allOptions.filter( o => {
                    if( !o.value ){
                        return false
                    }
                    if(selectorConfig[o.value]){
                        return true;
                    }
                    return false;

                })

                const itemObj = {
                    selected: false,
                    localizador: r.localizador,
                    visitaNombre: r.visitaNombre,
                    totalDePersonas: subtotalDeTickets - ticketsCancelados,
                    subtotalDePersonas: subtotalDeTickets,
                    itemFechaReserva: r.createdAt,
                    itemFecha: r.fecha,
                    itemHorario: r.hora,
                    itemTotal: subtotal - devoluciones,
                    itemSubtotal: subtotal,
                    accionDePago: null,
                    pagado: r.pagado,
                    cancelado: r.cancelado,
                    autoCancelado: r.autoCancelado ?? false,
                    referenciaDeDistribuidor: r.referenciaDeDistribuidor,
                    diasParaPago:  diasParaPago,
                    tipoPago: r.tipoPago,
                    ticketsCancelados: ticketsCancelados,
                    devolucionRealizada: devoluciones,
                    facturadoMayorista: r.facturadoMayorista,
                    solicitudDeCancelacionActiva: r.solicitudDeCancelacionActiva,
                    itemOptions: itemOptions,
                    bookingStatus: r.bookingStatus,
                    sourceDetails: r.descripcion
                }
                return itemObj;
            })

        }
        catch(err){
            if( err.response.status == 401 || err.response.status === 403){
                this.$router.push("/")
            }
            return {};
        }
        finally{
            this.sending = false;
        }

    },
    async reservaAction(evt){
        this.reservaToPrint = evt.localizador;
        if(evt.accionDePago === 'pagar'){
            this.$router.push(`reservations-payment/payment?reservationId=${evt.localizador}`)
        }else if( evt.accionDePago === 'editar' ){
            this.selectedLocalizador = evt.localizador;
            this.showEditarModal = true;
        }
        else if(evt.accionDePago === 'detalles'){
            this.showDetails(evt);
        }
        else if( evt.accionDePago === 'cancelar'){
            this.cancelForm = true;
            if( evt.bookingStatus === '2' ){
                this.refund = true;
            }else{
                this.refund = false;
            }
            this.itemToCancelLocalizer = evt.localizador;
        }
        else if( evt.accionDePago === 'download' ){
            await this.getEntradaPdf( this.reservaToPrint );
        }
        else if( evt.accionDePago === 'proform' ){
            try{
                await this.getProforma( this.reservaToPrint )
            }
            finally{
                this.creatingPDF = false;
            }
        }
        else if( evt.accionDePago === 'partial_refund'){
            this.devolucionParcial = true;
            const obj = {};
            obj.fecha = moment( evt.itemFecha ).utc().format("DD-MM-YYYY");
            obj.hora = evt.itemHorario ? moment( evt.itemFecha ).utc().format("HH:mm") : "Horario libre"
            obj.locator = evt.localizador;
            obj.importeTotal = evt.itemTotal;
            obj.originalTickets = evt.totalDePersonas;
            obj.devolucion = 0;
            obj.ticketsQueSeCancela = 0;
            obj.motivo = ""; 
            this.detallesDeDevolucion = evt.sourceDetails.reduce( (acc, curr) => {
                const obj = {...acc};
                obj[curr._id] = 0;
                return obj;
            }, {} )
            obj.sourceDetails = evt.sourceDetails;
            this.selectedBooking = obj;
        }
        evt.accionDePago = null;
    },

    async getEntradaPdf(reserva){
        // let reservaData = { ...reserva };

        this.creatingPDF = true;

        let pdf = await ApiSellerService.getReservaPdf( reserva );
        const pdfBlob = new Blob([pdf.data], { type: "application/pdf" })
        const url = URL.createObjectURL(pdfBlob)
        printJS({
            printable: url,
            type: 'pdf'
        })
        URL.revokeObjectURL(pdfBlob)

        this.creatingPDF = false;            
    },

    async getProforma( reserva ){
        this.creatingPDF = true;

        let pdf = await ApiSellerService.getPdfProforma( reserva );
        const pdfBlob = new Blob([pdf.data], { type: "application/pdf" })
        const url = URL.createObjectURL(pdfBlob)
        printJS({
            printable: url,
            type: 'pdf'
        })
        URL.revokeObjectURL(pdfBlob)

        this.creatingPDF = false;            

    },

    showDetails(item) {
        this.selectedLocalizador = item.localizador;
        this.showDetallesModal = true;
    }
  },
  created(){
    let $vm = this;
    $vm.monumentoNombre = $vm.$route.params.monumentoNombre.replaceAll('-', ' ');
  },
  mounted() {
    this.buscarReservas();
  },
  computed:{
    totalAPagar(){
        let $vm  = this;

        const paraPagar = $vm.entradas.filter( entrada => entrada.accionDePago === 'pagar' ).map( e => e.itemTotal ).reduce( (acc, curr) => acc + curr, 0 )
        // $vm.Ds_Mount = $vm.$store.getters.total.toFixed(2).toLocaleString()
        // this.Ds_Mount = paraPagar.toFixed(2).toLocaleString('es-ES');
        return paraPagar;
    },
    totalToRefund(){
        const detalles = this.detallesDeDevolucion;
        const detallesOriginales = this.selectedBooking.sourceDetails;

        const _itObj = Object.entries( detalles );
        let moneyToRefund = 0;
        for( const item of _itObj ){
            const itemData = detallesOriginales.find( i => i._id === item[0] );
            const moneyToRefundForThisTicket = (itemData.precioMayorista || itemData.precio) * item[1];
            moneyToRefund += moneyToRefundForThisTicket;
        }
        return moneyToRefund ?? 0;
    },
    totalToRefundString(){
        return parseFloat( this.totalToRefund ).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
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

.cancelados{
    text-decoration: line-through;
    color: red;
}

.center {
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 50%;
    right: 0;
    /* margin: auto; */
    transform: translate(-50%, -50%);
    z-index: 10;
}

.info-color-dark{
    background-color: #e0e0e0 !important;
    color: #333333 !important;
}

.button-icon{
    width: 24px; 
    height: 24px; 
    padding: 0; 
    margin: 0;
    display: flex; 
    align-items: center; 
    justify-content: center; 
    flex-shrink: 0;
}
</style>