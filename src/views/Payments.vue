<template>
    <monumento-layout>
        <section class="text-uppercase">
            <mdb-container>
                <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                    <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                        <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                        <mdb-breadcrumb-item active>Pagos</mdb-breadcrumb-item>
                </mdb-breadcrumb>

            </mdb-container>
        </section>
        
        <mdb-container>
            <mdb-card class="my-4">
                <mdb-card-body>
                    <mdb-alert color="warning" v-if="p1" @closeAlert="p1=false" dismiss>
                        Seleccione al menos una opción
                    </mdb-alert>

                    <mdb-row>
                        <mdb-col md="4" col="12" class="text-start">
                            <span class="block text-gray-600 text-sm text-left font-bold mb-2">Fecha de pago</span>
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

                        <mdb-col md="4" lg="4" col="12">
                            <mdb-select id="estado-pago" v-model="estadoOptions" @getValue="(evt) => filtros.estado = evt " :label="'ESTADO'" :placeholder="' '" outline></mdb-select>
                        </mdb-col>

                        <mdb-col col="12">
                            <mdb-btn class="float-right" color="danger" @click="buscarReservas">BUSCAR</mdb-btn>
                        </mdb-col>

                    </mdb-row>

                </mdb-card-body>
            </mdb-card>

            <mdb-card class="overflow-auto my-4">
                <mdb-card-body style="min-width:920px">
                    <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                        <mdb-col col="1" class="spainhn-small-text-table text-center">Fecha<br/>de<br/>pago</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table ">Importe</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Método<br/>de pago</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Estado</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table ">Referencia<br/>de pago</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Usuario</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table text-center">Saldo<br/>previo</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table ">Saldo<br/>actual</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table ">Acciones</mdb-col>
                    </mdb-row>

                    <mdb-row v-for="(item, index) in itemsToShow" :item="item" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                        <mdb-col col="1" class="spainhn-small-text-cells">{{ moment(item.itemFecha).format('DD-MM-YYYY HH:mm:ss') }}</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.itemTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 })}} €</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">
                            {{item.tipoDePago}}
                        </mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">
                            <div :class="`text-center rounded py-1 text-white ${coloresEstado[item.estado]}`">
                                {{item.estado}}
                            </div>
                            <!-- <div class="success-color text-center rounded py-1 text-white" 
                                v-bind:class="{'sucess-color':item.fechaCargo, 'danger-color-dark':!item.fechaCargo}"
                                >{{item.fechaCargo ? 'CONFIRMADO':'PENDIENTE'}}
                            </div> -->
                        </mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.localizador}}</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{item.nombre}}</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center"> - </mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center"> - </mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">
                            <font-awesome-icon class="fa-2x" icon="fas fa-search" role="button" @click="consultarDetalles(item.localizadores, item)"/>
                            <!-- <b-select :options="opciones" @change="detallesDePago(item)"/> -->
                        </mdb-col>
                    </mdb-row>

                    <table-footer :rows="items" @actualizarElementos="actualizarTablaDePagos"/>

                </mdb-card-body>
            </mdb-card>

            <mdb-modal :show="modalDetallesDePago" centered size="lg" :style="{zIndex: '1062'}">
                <mdb-modal-header>
                    <mdb-modal-title>Detalles del pago</mdb-modal-title>
                </mdb-modal-header>

                <mdb-modal-body>
                    <mdb-card class="overflow-auto my-4">

                        <mdb-card-body style="min-width:750px">
                            <mdb-row class="border-bottom" style="border-color:var(--spainhn-rojo-corporativo)!important">
                                <div class="text-start">
                                    <h5 class="float-start">Pago</h5>
                                </div>
                            </mdb-row>

                            <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                                <mdb-col col="2" class="spainhn-small-text-table text-center">Referencia</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Fecha</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Importe</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Estado</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Método<br/>de<br/>pago</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-table text-center">Saldo<br/>previo</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-table ">Saldo<br/>actual</mdb-col>
                            </mdb-row>

                            <mdb-row class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom" v-for="(item, index) in pagosDetallados" :key="index">
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">{{item.localizador}}</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">{{moment(item.itemFecha).format('DD-MM-YYYY HH:mm:ss')}}</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">{{item.itemTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 })}} €</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">
                                    <div :class="`text-center rounded py-1 text-white ${coloresEstado[item.estado]}`">
                                        {{item.estado}}
                                    </div>
                                </mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">
                                    {{item.tipoDePago}}
                                </mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-cells text-center">-</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-cells ">-</mdb-col>
                            </mdb-row>
                        </mdb-card-body>
                    </mdb-card>

                    <mdb-card class="overflow-auto my-4">

                        <mdb-card-body style="min-width:850px" class="">
                            <mdb-row class="border-bottom" style="border-color:var(--spainhn-rojo-corporativo)!important">
                                <div class="text-start">
                                    <h5 class="float-start">Reservas</h5>
                                </div>
                            </mdb-row>

                            <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                                <mdb-col col="1" class="spainhn-small-text-table text-center">Loc.<br/>Reserva</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Estado</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Referencia</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Evento/Visita</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Fecha<br/>creación</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-table ">Fecha evento</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-table text-center">Importe</mdb-col>
                            </mdb-row>

                            <mdb-row v-for="(item, index) in reservasToShowAsociadasAlPago" :item="item" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                                <mdb-col col="1" class="spainhn-small-text-cells">{{item.identificador}}</mdb-col>
                                <mdb-col col="2" :class="`text-center rounded py-1 text-white ${coloresEstado[item.estado]}`">{{item.estado}}</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">
                                    {{item.referenciaDeDistribuidor}}
                                </mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">
                                        {{item.producto}}
                                </mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">{{moment(item.fechaReserva).format('DD-MM-YYYY HH:mm:ss')}}</mdb-col>
                                <mdb-col col="2" class="spainhn-small-text-cells text-center">{{moment(item.fechaDelEvento).format('DD-MM-YYYY')}} <br/> {{item.horaDelEvento ? moment(item.horaDelEvento).format('HH:mm'):'Horario libre'}}</mdb-col>
                                <mdb-col col="1" class="spainhn-small-text-cells text-center">
                                    {{item.importe.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 })}} €
                                    <!-- <b-select :options="opciones" @change="detallesDePago(item)"/> -->
                                </mdb-col>
                            </mdb-row>

                            <table-footer :rows="reservasAsociadasAlPago" @actualizarElementos="actualizarTablaDeReservas"></table-footer>
                        </mdb-card-body>
                    </mdb-card>
                    
                </mdb-modal-body>

                <mdb-modal-footer>
                    <mdb-btn color="danger darken-4" @click.native="modalDetallesDePago = false">Cerrar</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>

        </mdb-container>

    </monumento-layout>
</template>

<script>
import moment from 'moment';
import ApiSellerService from '../services/ApiSeller.service';
import TableFooter from '../components/TableFooter.vue';

export default {
    components: { TableFooter },
    data(){
        return{
            p1: false,
            monumentoNombre: null,
            masks: {
                input: 'DD-MMMM-YYYY',
            },
            moment:moment,
            estadoOptions: [
                { text:'', value:null},
                { text:'Confirmado', value: 0 },
                { text:'Pendiente', value: 1 },
                { text:'Rechazado', value: 2 },
                { text:'Cancelado', value: 3 },
            ],
            items: [],
            itemsToShow: [],
            entradas: [],
            filtros:{
                estado:null,
                range: {
                    start:null,
                    end:null
                }
            },
            opciones: [
                { text:'', value: null},
                { text:'Ver Detalles', value:1}
            ],
            modalDetallesDePago: false,
            coloresEstado: {'PENDIENTE':'warning-color', "CONFIRMADO":'success-color', "CANCELADO":'danger-color', 'RESERVADO':'secondary-color'},
            pagosDetallados: [],
            reservasAsociadasAlPago: [],
            reservasToShowAsociadasAlPago: []
        }
    },
    methods:{
        actualizarTablaDeReservas(evt){
            this.reservasToShowAsociadasAlPago = evt;
        },
        actualizarTablaDePagos(evt){
            this.itemsToShow = evt;
        },
        async consultarDetalles( localizadores, pago ){

            let localizadoresUrl = localizadores.map( localizador => localizador.localizador ).reduce( (acc, curr) => curr + "," + acc, "")

            localizadoresUrl = localizadoresUrl.slice(0, -1);
            console.log(localizadoresUrl);

            const resultado = await ApiSellerService.getReservasByLocalizador('es', localizadoresUrl, true)

            this.reservasAsociadasAlPago = resultado.data;

            this.reservasAsociadasAlPago.forEach( r => {
                let estado = "PENDIENTE";

                if( r.fechaDeConfirmacion == true ){
                    estado ="CONFIRMADO"
                }
                else if( r.fechaDeConfirmacion && r.cancelado == true){
                    estado = "CANCELADO"
                }
                else if( r.fechaCargo == null ){
                    estado = "RESERVADO"
                }

                r.estado = estado;
            })
            this.pagosDetallados = [];
            this.pagosDetallados.push( pago )
            this.modalDetallesDePago = true;
            console.log(resultado.data)
        },
        validarBusqueda(){
            let validacionExitosa = false;

            if( this.filtros.range.start != null || this.filtros.range.end != null){
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
            let resultado = await ApiSellerService.getPagos( this.filtros, this.$route.params.monumentoNombre )

            // const reservas = resultado.data.filter( r => r.monumentoNombre.toLowerCase() === this.monumentoNombre.toLowerCase() );
            const pagos = resultado.data;

            this.items = pagos.map( r => {

                let tipoDePago = "";

                let estado = "PENDIENTE";

                if( r.cancelado == true ){
                    estado ="CANCELADO"
                }
                else if( r.fechaCargo && r.pagado == true){
                    estado = "CONFIRMADO"
                }
                else if( r.fechaCargo && r.pagado == false ){
                    estado = "RECHAZADO"
                }

                if(r.tipoPago === 'redsys'){
                    tipoDePago = 'Tarjeta TPV'
                }
                const itemObj = {
                    localizador: r.localizador,
                    nombre: r.nombre,
                    totalDePersonas: r.pax,
                    itemFecha: r.fecha,
                    itemHorario: r.hora,
                    itemTotal: r.total,
                    accionDePago: null,
                    tipoDePago: tipoDePago, 
                    pagado: r.pagado,
                    localizadores: r.tarifa,
                    estado: estado
                }

                return itemObj;
            })
        },
    },
    created(){
        let $vm = this;
        $vm.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');
    },
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