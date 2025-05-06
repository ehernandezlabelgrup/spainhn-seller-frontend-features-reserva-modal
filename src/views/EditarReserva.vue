<template>
    <monumento-layout>
        <LoaderComponent :class="{'d-none': !loading}"/>
        <section class="text-uppercase">
            <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-0 py-2 ps-md-3">
                <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item><a
                        :href="`/${$route.params.monumentoNombre}/tablero`">{{ monumentoNombre }}</a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item active>reservas</mdb-breadcrumb-item>
            </mdb-breadcrumb>
        </section>

        <div class="ms-4">
            <h3 class="text-uppercase font-weight-bolder text-start">{{ monumentoNombre }}</h3>
        </div>

        <div class="container-fluid mt-4 mb-4">
            <mdb-row>
                <div class="container-fluid px-0">
                    <mdb-card class="d-flex pe-0 w-100 container px-0 px-md-0 shadow">

                        <mdb-view class="d-flex my-auto py-3 px-3">

                            <div class="text-start">
                                <div class="justify-content-start my-auto">
                                    <p class="text-muted">Loc. reserva: <span class="font-weight-bold">{{
                                            localizadorReserva }}</span> - {{ eventoInfo.nombre }}</p>
                                </div>

                            </div>

                        </mdb-view>

                    </mdb-card>

                </div>
            </mdb-row>

            <mdb-row class="my-2 px-0">
                <reservation-date-picker-hours v-bind:class="{ 'd-none': eventoInfo.id == null }" v-if="eventoInfo.id"
                    @getProduct="setProduct" :id-producto="eventoInfo.id" :originalDate="reserva.fechaDelEvento"
                    :initialDate="reserva.fechaDelEvento" :initialHour="reserva.horaDelEvento"
                    :initialProduct="reserva.productoId">
                    <template v-if="disputaAbierta || reserva.facturadoMayorista">
                        <h5 class="text-danger">
                            {{ departureData }}
                        </h5>
                    </template>
                </reservation-date-picker-hours>
            </mdb-row>

            <mdb-row class="my-4">
                <ticket-selector @resumenUpdate="(evt) => updateTicketDetails(evt)" :initial-details="reserva.detalles"
                    :initial-values="reserva.detalles" :condicionComercial="condicionComercial"
                    :limit-to-max="reserva.bookingStatus === '2' || reserva.bookingStatus === '5'"
                    :horarioInfo="selectedHourInfo" :tarifa="tarifa">
                    <template v-if="disputaAbierta">
                        <h5 class="text-danger">
                            {{ reserva.tickets }}
                        </h5>
                    </template>
                </ticket-selector>
            </mdb-row>

            <mdb-container>
                <h3 class="font-weight-bold text-end">{{ (reserva.importe).toLocaleString('es-ES', {
                    style: 'currency',
                    'currency':
                    'EUR'} ) }}</h3>
            </mdb-container>

        </div>

        <mdb-container class="flexbox">
            <mdb-btn class="float-left" flat size="lg" @click="$router.go(-1)"><u>VOLVER</u></mdb-btn>
            <mdb-btn class="float-right" color="danger" size="lg" :disabled="sending||noChange" @click="confirmarCambios = true">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                    v-bind:class="{ 'd-none': !sending }"></span>
                GUARDAR
            </mdb-btn>
        </mdb-container>

        <mdb-modal :show="confirmarCambios" @close="confirmarCambios = false" style="z-index:2000 !important;"
            size="lg">
            <mdb-modal-header>
                <h3>Cambios en la reserva</h3>
            </mdb-modal-header>

            <mdb-modal-body>
                <p v-bind:class="{ 'd-none': showChanges }">No hay cambios en la reserva</p>

                <div v-bind:class="{ 'd-none': !showChanges }">
                    <mdb-row>
                        <mdb-col>
                            <p class="font-weight-bold">Fecha Orginal</p>
                            <p>{{ moment(reservaOriginal.fechaDelEvento).format('DD/MM/YYYY') }}</p>
                            <small class="">{{ reservaOriginal.hora == null ? 'HORARIO LIBRE' : reservaOriginal.hora
                                }}</small>
                        </mdb-col>

                        <mdb-col class="my-auto">
                            <font-awesome-icon icon="fa-long-arrow-alt-right" />
                        </mdb-col>

                        <mdb-col>
                            <p class="font-weight-bold">Nueva Fecha</p>
                            <p>{{ moment(reserva.fechaDelEvento).format('DD/MM/YYYY') }}</p>
                            <small>{{ reserva.hora == null ? 'HORARIO LIBRE' : reservaOriginal.hora }}</small>
                        </mdb-col>
                    </mdb-row>
                    <hr>
                    <mdb-row>
                        <mdb-col>
                            <p class="font-weight-bold">Reserva Original</p>
                            <div v-for="(detalle, index) of reservaOriginal.detalles" :key="`ro-${index}`">
                                <p>{{ detalle.descripcion }} - {{ detalle.cantidad }}</p>
                            </div>
                        </mdb-col>

                        <mdb-col class="my-auto">
                            <font-awesome-icon icon="fa-long-arrow-alt-right" />
                        </mdb-col>

                        <mdb-col>
                            <p class="font-weight-bold">Modificación a reserva</p>
                            <div v-for="(detalle, index) of reserva.detalles" :key="index">
                                <p>{{ detalle.descripcion }} - {{ detalle.cantidad }}</p>
                            </div>
                        </mdb-col>
                    </mdb-row>
                    <hr>

                    <mdb-row>

                        <mdb-col>
                            <p class="font-weight-bold">IMPORTE ORIGINAL</p>
                            <p>{{ reservaOriginal.importe.toLocaleString('es-ES', {
                                style: 'currency', 'currency':
                                'EUR'} ) }}
                            </p>
                        </mdb-col>

                        <mdb-col class="my-auto">
                            <font-awesome-icon icon="fa-long-arrow-alt-right" />
                        </mdb-col>

                        <mdb-col>
                            <p class="font-weight-bold">NUEVO IMPORTE</p>
                            <p>{{ reserva.importe.toLocaleString('es-ES', { style: 'currency', 'currency': 'EUR' }) }}
                            </p>
                        </mdb-col>

                    </mdb-row>
                </div>
            </mdb-modal-body>

            <mdb-modal-footer>
                <div>
                    <mdb-btn color="warning" @click="confirmarCambios = false">
                        CANCELAR
                    </mdb-btn>
                    <mdb-btn color="danger" @click="() => doUpdateReservation()">
                        CONFIRMAR
                    </mdb-btn>
                </div>
            </mdb-modal-footer>
        </mdb-modal>

        <success-alert-frame :show="successUpdate" :mensaje="'La reserva se actualizó con éxito'"
            @close="() => successUpdate = false" />

    </monumento-layout>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import ReservationDatePickerHours from '../components/ReservationDatePickerHours.vue';
import moment from 'moment';
import TicketSelector from '../components/TicketSelector.vue';
import CalendarioService from '../services/Calendario.service';
import UpdatesServices from '../services/Updates.service';

import SuccessAlertFrame from '../components/SuccessAlertFrame.vue'
import LoaderComponent from '../components/LoaderComponent.vue';
export default {
    name: 'ReservationEdit',
    components: {
        ReservationDatePickerHours,
        TicketSelector,
        SuccessAlertFrame,
        LoaderComponent,
    },
    data() {
        return {
            moment: moment,
            monumentoNombre: null,
            localizadorReserva: null,
            reservaInfo: {
                visita: null
            },
            eventoInfo: {
                spainhnId: null,
                cancelable: false,
                tipoDeEntrada: null,
                mostrarAforo: null,
                mostrarPlazas: null,
                id: null,
                daysToCancelReservation: null,
                nombre: null
            },
            // Aquí guardamos los cambios que se realicen en la reserva
            reserva: {
                fechaDelEvento: null,
                hora: null,
                productoId: null,
                importe: 0,
                tickets: 0,
                detalles: [],
                visitaId: null,
                producto: null,
                idMonumento: null
            },
            // Los datos originales de la reserva;
            reservaOriginal: {
                fechaDelEvento: null,
                hora: null,
                productoId: null,
                importe: 0,
                tickets: 0,
                detalles: [],
                visitaId: null,
                producto: null
            },
            selectedDate: null,
            limitPaymentDate: null,
            tarifa: {
                precios: []
            },
            sending: false,
            selectedHourInfo: {

            },
            condicionComercial: null,
            confirmarCambios: false,
            successUpdate: false,
            disputaAbierta: false,
            disputaData: null,
            loading: false
        }
    },
    methods: {
        /**
         * Send the query to the backend to update the Reservation
         */
        async doUpdateReservation() {
            console.log("Enviando actualización de reserva ");
            await UpdatesServices.doUpdateReservation(this.localizadorReserva, this.reserva);
            this.confirmarCambios = false;
            this.successUpdate = true;
        },

        async consultarInfoParaReserva() {
            let $vm = this;

            // Obtenemos la entrada

            const entradaResult = await ApiSellerService.getEntradaById(this.eventoInfo.spainhnId, 'es');

            const eventoInfo = entradaResult.data;

            this.eventoInfo.cancelable = eventoInfo.cancelable;
            this.eventoInfo.tipoDeEntrada = eventoInfo.tipo;
            this.eventoInfo.mostrarAforo = eventoInfo.mostrarAforo;
            this.eventoInfo.mostrarPlazas = eventoInfo.mostrarPlazas;
            this.eventoInfo.id = eventoInfo._id;
            this.eventoInfo.daysToCancelReservation = eventoInfo.daysToCancelReservation ?? 1;
            this.eventoInfo.maxTicketsResellers = eventoInfo.maxTicketsResellers;

            const condicionesComerciales = await this.consultarCondicionesComerciales();

            this.condicionComercial = condicionesComerciales;

            const { tipoComisionSpainhn, spainhn, descuentoComercial, tipoDescuento } = condicionesComerciales;

            this.simbolo = tipoComisionSpainhn !== 'porcentaje' ? '€' : '%';

            this.comision = spainhn;

            this.descuento = descuentoComercial;

            this.tipoDeDescuento = tipoDescuento;

        },

        async buscarReserva() {
            const resultado = await ApiSellerService.getReservaByLocalizador('es', this.localizadorReserva, true);
            return resultado.data;
        },
        async searchLinkedCancellationRefunds(locator) {
            const resultado = await ApiSellerService.getCancellationRequestsForBooking(locator);
            return resultado;
        },

        async consultarCondicionesComerciales() {
            const condiciones = await ApiSellerService.getComision(this.reserva.idMonumento, this.eventoInfo.id)
            return condiciones.data;
        },

        /**
         * Configuramos la fecha seleccionada utilizando el valor devuelto por el selector de fechas
         * @param {String} evt - info about the date
         */
        setProduct(evt) {
            this.selectedDate = evt.date;
            this.selectedHourInfo = evt.hour;
            // En reserva vamos a guardar la nueva fecha y el nuevo horario
            this.reserva.fechaDelEvento = this.selectedDate;
            this.reserva.productoId = this.selectedHourInfo.id;
            this.reserva.hora = this.selectedHourInfo.hora == 'Horario Libre' ? null : this.selectedHourInfo.hora;

            const daysToSubtract = this.eventoInfo.daysToCancelReservation ?? 1;

            this.limitPaymentDate = moment(evt).subtract(daysToSubtract, 'days').format('YYYY-MM-DD');

            this.tarifa = evt.tarifa;

            // this.tarifa.splice( 0, 0);
        },

        updateTicketDetails(evt) {
            const tempDetalles = [...this.reserva.detalles]

            // Primero actualizamos los precios que ya existen
            tempDetalles.forEach(t => {
                evt.resumen.forEach(r => {
                    if (r.descripcion == t.descripcion) {
                        t.cantidad = r.cantidad;
                        t.comision = r.comision;
                        t.descuento = r.descuento;
                        t.idPrecio = r.idPrecio;
                        t.idPrecioSpainhn = r.idPrecioSpainhn;
                        t.importeBase = r.importeBase;
                        t.precio = r.precio;
                        t.pvp = r.pvp;
                        t.tipo_comision = r.tipo_comision;
                        t.total = r.total;
                    }
                })
            })

            const existingTickets = tempDetalles.map(d => d.descripcion)

            // Luego agregamos los precios nuevos
            evt.resumen.forEach(r => {
                if (existingTickets.includes(r.descripcion) == false) {
                    const obj = {
                        cantidad: r.cantidad,
                        comision: r.comision,
                        descripcion: r.descripcion,
                        descuento: r.descuento,
                        idPrecio: r.idPrecio,
                        idPrecioSpainhn: r.idPrecioSpainhn,
                        importeBase: r.importeBase,
                        minPersonas: r.minPersonas,
                        precio: r.precio,
                        pvp: r.pvp,
                        tipo_comision: r.tipo_comision,
                        total: r.total,
                    }

                    tempDetalles.push(obj);
                }
            })

            // Por último, removemos los precios que ya no existen

            const tarifasEnResumen = evt.resumen.map(r => r.descripcion);
            existingTickets.forEach((d, index) => {
                if (tarifasEnResumen.includes(d) == false) {
                    tempDetalles.splice(1, index);
                }
            })

            this.reserva.detalles = [...tempDetalles]
            this.reserva.importe = evt.total;

        }

    },
    async created() {
        this.loading = true;
        try{

            this.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');
            this.localizadorReserva = this.$route.params.localizador;
    
            const queryResult = await this.buscarReserva()
    
            // Guardamos los valores iniciales de la reserva
            this.reserva.fechaDelEvento = queryResult.fechaDelEvento;
    
            this.reserva.productoId = queryResult.productoId;
    
            this.reserva.importe = queryResult.importe;
    
            this.reserva.tickets = queryResult.tickets;
    
            this.reserva.detalles = [...queryResult.descripcionDeTickets];
    
            this.reserva.visitaId = queryResult.visitaId;
    
            this.reserva.producto = queryResult.producto;
    
            this.reserva.idMonumento = queryResult.idMonumento;
    
            this.reserva.hora = queryResult.horaDelEvento;
            this.reserva.bookingStatus = queryResult.bookingStatus;

            console.log( this.reserva.bookingStatus );
    
            // Estos datos los usaremos luego para compararlos con las modificaciones que se hayan realizado
    
            this.reservaOriginal.fechaDelEvento = queryResult.fechaDelEvento;
    
            this.reservaOriginal.productoId = queryResult.productoId;
    
            this.reservaOriginal.importe = queryResult.importe;
    
            this.reservaOriginal.tickets = queryResult.tickets;

            this.reservaOriginal.bookingStatus = queryResult.bookingStatus;
    
            this.disputaAbierta = queryResult.solicitudDeCancelacionActiva;
    
            this.reservaOriginal.detalles = []
            this.reservaOriginal.facturadoMayorista = queryResult.facturadoMayorista;
    
            queryResult.descripcionDeTickets.forEach(d => {
                this.reservaOriginal.detalles.push({ cantidad: d.cantidad, descripcion: d.descripcion, comision: d.comision, descuento: d.descuento, idPrecio: d.idPrecio, idPrecioSpainhn: d.idPrecioSpainhn, importeBase: d.importeBase, precio: d.precio, pvp: d.pvp, tipo_comision: d.tipo_comision, total: d.total })
            });
    
            this.reservaOriginal.visitaId = queryResult.visitaId;
    
            this.reservaOriginal.producto = queryResult.producto;
    
            this.reservaOriginal.hora = queryResult.horaDelEvento;
    
            if (this.disputaAbierta) {
                this.disputaData = await this.searchLinkedCancellationRefunds(this.localizadorReserva);
            }
    
    
            this.condicionComercial = await this.consultarCondicionesComerciales();
    
            const result = await CalendarioService.buscarTarifasDeProducto(this.reserva.productoId);
    
            this.tarifa = result.data.tarifaData;
    
            const horario = result.data.horarioData;
            this.selectedHourInfo = horario
    
            let plazasDisponibles = null;
    
            const plazasReservadas = horario.plazasReservadas ?? 0;
            const plazasOcupadas = horario.plazasOcupadas ?? 0
    
            if (horario.plazas > 0) {
                plazasDisponibles = horario.plazas - (plazasReservadas + plazasOcupadas)
            }
    
            this.$store.commit('guardarPlazas', plazasDisponibles);
    
            this.eventoInfo.id = this.reserva.visitaId;
    
            this.eventoInfo.nombre = this.reserva.producto;
    
            this.selectedDate = this.reserva.fechaDelEvento;
        }
        catch( err ){
            console.log( err );
            this.$toast.error("No se pudieron consultar los datos de la reserva, intente más tarde")
        }finally{
            this.loading = false;
        }

    },
    computed: {
        showChanges() {
            if (this.reserva.productoId != this.reservaOriginal.productoId) {
                return true;
            }
            else if (this.reserva.importe != this.reservaOriginal.importe) {
                return true;
            }
            else if (this.reserva.tickets != this.reservaOriginal.tickets) {
                return true;
            }
            else {
                return false;
            }
        },
        departureData() {
            const bookingDate = this.eventoInfo.fechaDelEvento;
            const bookingHour = this.eventoInfo.horaDelEvento;
            const prettyDate = moment(bookingDate).utc().format("DD-MM-YYYY");
            let prettyHour = "";

            if ( bookingHour ) {
                prettyHour = moment( bookingHour ).utc().format('HH:mm')
            }
            else{
                prettyHour = "Horario libre"
            }
            return `${prettyDate} - ${prettyHour}`; 
        },
        noChange(){
            return ( (this.reservaOriginal.productoId === this.reserva.productoId) && 
                (this.reservaOriginal.tickets === this.reserva.detalles.reduce((acc, curr) => acc + curr.cantidad, 0 ) ) )
        }
    }
}
</script>