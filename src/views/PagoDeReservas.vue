<template>
<monumento-layout>
    <section class="text-uppercase">
        <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
            <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item active>reservas</mdb-breadcrumb-item>
        </mdb-breadcrumb>
    </section>

    <mdb-container>
        <div class="text-center py-2">
            <p class="spainhn-title-text">{{monumentoNombre}}</p>
        </div>

        <mdb-card class="my-4">
            <mdb-card-body>

                <mdb-alert color="warning" v-if="p1" @closeAlert="p1=false" dismiss>
                    Seleccione al menos una opción
                </mdb-alert>

                <mdb-row>
                    <mdb-col md="5" lg="2" col="12">
                        <mdb-input id="localizador-reserva" :label="'LOC. RESERVA'" :placeholder="' '" outline v-model="filtros.localizador"></mdb-input>
                    </mdb-col>
                    <mdb-col md="7" lg="4" col="12" class="text-start">
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

                    <mdb-col md="6" lg="2" col="12">
                        <mdb-select id="fecha-reserva" v-model="fechasOptions" :label="'CREACIÓN DE LA RESERVA'" @getValue="(evt) => filtros.fechaDeReserva = evt " :placeholder="' '" outline></mdb-select>
                    </mdb-col>

                    <mdb-col md="6" lg="2" col="12">
                        <mdb-input id="referencia-distribuidor" :label="'REFERENCIA DISTRIBUIDOR'" :placeholder="' '" outline></mdb-input>
                    </mdb-col>

                    <mdb-col col="12">
                        <mdb-btn class="float-right" color="danger" @click="buscarReservas">BUSCAR</mdb-btn>
                    </mdb-col>

                </mdb-row>
            </mdb-card-body>
        </mdb-card>

        <mdb-card class="overflow-auto my-4">
            <mdb-card-body style="min-width:920px">

                <div class="clearfix">
                    <mdb-btn class="float-end spainhn-button fw-bold" size="sm" v-bind:class="{'d-none':!mostrarBotonPagoMultiple}" @click="goToMultiplePayment">PAGAR SELECCIÓN</mdb-btn>
                </div>
                <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                    <mdb-col col="auto">
                        <b-form-checkbox v-model="toggleAll" @change="toggleSelectedStatus" :disabled="!items.length"></b-form-checkbox>
                    </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table text-start">Loc.<br/>reserva</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-table ">Producto</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-table ">Fecha <br/>del evento</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Personas</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-table text-center">Referencia <br/> distribuidor</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Importe</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table text-center">Días<br/>pendientes<br/>pago </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-table ">Acciones</mdb-col>
                </mdb-row>


                <mdb-row v-for="(item, index) in itemsToShow" :item="item" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                    <mdb-col col="auto" class="border-end">
                        <b-form-checkbox v-model="item.selected"></b-form-checkbox>
                    </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells">{{item.localizador}}</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-cells">{{item.visitaNombre}}</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-cells text-center">
                        {{ moment(item.itemFecha).format('DD-MM-YYYY') }}<br/> 
                        {{item.itemHorario ? moment(item.itemFecha).format('HH:mm'):'Horario libre'}}
                    </mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.totalDePersonas}}</mdb-col>
                    <mdb-col col="2" class="spainhn-small-text-cells text-center">{{item.referenciaPersonalizada ? item.referenciaPersonalizada : "-"}}</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.itemTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 })}} €</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ moment(item.itemFecha).subtract(1,'days').format('DD-MM-YYYY') }}</mdb-col>
                    <mdb-col col="1" class="spainhn-small-text-cells">
                        <!-- <b-select :options=" item.pagado ?accionesMinimo:accionesDePago" size="sm" v-model="item.accionDePago" @change="reservaAction(item)"/> -->
                        <mdb-btn color="danger" rounded @click="goToPayment(item)">PAGAR</mdb-btn>
                    </mdb-col>

                </mdb-row>

                <table-footer :rows="items" @actualizarElementos="actualizarTabla"/>
            </mdb-card-body>

        </mdb-card>


    </mdb-container>
</monumento-layout>
</template>

<script>
// import HomeLayout from '../Layout/HomeLayout.vue'
import ApiSellerService from '../services/ApiSeller.service';
import moment from 'moment';
import TableFooter from '../components/TableFooter.vue'

export default {
    components: { TableFooter },
    data(){
        return{
            p1:false,
            monumentoNombre: null,
            moment: moment,

            masks: {
                input: 'DD-MMMM-YYYY',
            },
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
            ],
            accionesDePago: [
                { text:'', value: null},
                { text:'Pagar', value: 0},
                { text:'Editar', value: 1 },
                { text: 'Ver detalles', value: 2 },
                { text:'Cancelar reserva', value: 3 }
            ],
            accionesMinimo: [
                { text:'', value: null},
                { text:'Editar', vlue: 1 },
                { text: 'Ver detalles', value: 2 },
                { text:'Cancelar reserva', value: 3 }
            ],
            items: [],
            itemsToShow:[],
            entradas: [],
            filtros:{
                estado: null,
                localizador: null,
                fechaDeCompra: null,
                referencia: null,
                fechaDeReserva: null,
                range: {
                    start:null,
                    end:null
                },
                pagado: false,
                cancelado: false,
                pendientesDePago: true
            },
            toggleAll: false
        }
    },
    methods: {
        actualizarTabla(evt){
            this.itemsToShow = evt;
        },
        validarBusqueda(){

            let validacionExitosa = false;

            if( this.filtros.estado != null || this.filtros.localizador != null || this.filtros.fechaDeCompra != null || 
                this.filtros.referencia != null || this.filtros.fechaDeReserva != null || this.filtros.fechaDeCompra != null || 
                ( this.filtros.range.start != null && this.filtros.range.end != null) ){
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
            let resultado = await ApiSellerService.getReservas( this.filtros, this.$route.params.monumentoNombre )

            // const reservas = resultado.data.filter( r => r.monumentoNombre.toLowerCase() === this.monumentoNombre.toLowerCase() );
            const reservas = resultado.data;

            this.items = reservas.map( r => {
                const itemObj = {
                    selected: false,
                    localizador: r.localizador,
                    visitaNombre: r.visitaNombre,
                    totalDePersonas: r.pax,
                    itemFecha: r.fecha,
                    itemHorario: r.hora,
                    itemTotal: r.descripcion.map( desc => desc.total ).reduce( (acc, curr) => acc + curr, 0 ),
                    accionDePago: null,
                    referenciaPersonalizada: r.referenciaDeDistribuidor,
                    pagado: r.pagado
                }

                return itemObj;
            })
        },
        goToPayment(evt){
            this.$router.push(`reservations-payment/payment?reservationId=${evt.localizador}`)
        },
        goToMultiplePayment(){
            let localizadores = this.items.filter( item => item.selected == true).map( item => item.localizador ).reduce( (acc, curr) => acc + ","  + curr, "" )

            localizadores = localizadores.slice(1);
            this.$router.push(`reservations-payment/payment?reservationId=${localizadores}`)
        },
        toggleSelectedStatus(evt){
            if(evt === false || evt === true){
                this.items.forEach( item => {
                    item.selected = evt;
                })
            }
        }

    },
    created(){
        let $vm = this;
        $vm.monumentoNombre = $vm.$route.params.monumentoNombre.replaceAll('-', ' ');
    },
    computed:{
        mostrarBotonPagoMultiple(){

            const localizadoresSeleccionados = this.items.filter( item => item.selected == true );
            return localizadoresSeleccionados.length;
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