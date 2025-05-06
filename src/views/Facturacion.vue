<template>
    <monumento-layout>
        <section class="text-uppercase">
            <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item active>Facturación</mdb-breadcrumb-item>
            </mdb-breadcrumb>
        </section>

        <mdb-container>
            <mdb-card class="my-4">
                <mdb-card-body>
                    <mdb-alert color="warning" v-if="p1" @closeAlert="p1=false" dismiss>
                        Seleccione al menos una opción
                    </mdb-alert>

                    <mdb-row>
                        <mdb-col md="4" lg="4" col="12">
                            <mdb-input id="numero-emision" v-model="searchFields.numeroEmision" :label="'NÚMERO DE EMISIÓN'" :placeholder="' '" outline></mdb-input>
                        </mdb-col>

                        <mdb-col md="4" lg="4" col="12">
                            <mdb-input id="localizador-reserva" v-model="searchFields.localizadorReserva" :label="'LOC. RESERVA'" :placeholder="' '" outline></mdb-input>
                        </mdb-col>

                        <mdb-col md="4" col="12" class="text-start">
                            <span class="block text-gray-600 text-sm text-left font-bold mb-2">Fecha de emisión</span>
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

                        <mdb-col col="12">
                            <mdb-btn class="float-right" color="danger" @click="buscarFacturas">BUSCAR</mdb-btn>
                        </mdb-col>

                    </mdb-row>

                </mdb-card-body>
            </mdb-card>

            <small style="color: rgb(165, 61, 57)">Las factura serán emitidas a los 7 días de realizada la visita</small>
            <mdb-card class="overflow-auto my-4">
                <mdb-card-body style="min-width:920px">

                    <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                        <mdb-col col="1" class="spainhn-small-text-table text-start">Núm. factura</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table">Emisor</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table text-start">Fecha de emisión</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Base</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table ">IVA</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Total</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table text-center">Estado</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Acciones</mdb-col>
                    </mdb-row>


                    <mdb-row v-for="(item, index) in items" :item="item" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                        <mdb-col col="1" class="spainhn-small-text-cells">{{item.numeroEmision}}</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{ item.emisor }}</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ moment(item.fecha).format('DD-MM-YY') }}</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{item.importeBase.toLocaleString( 'es-ES', { style: 'currency', 'currency': 'EUR'} ) }}</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ item.importeIva.toLocaleString( 'es-ES', { style: 'currency', 'currency': 'EUR'} ) }}<br/> </mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{ item.importeTotal.toLocaleString( 'es-ES', { style: 'currency', 'currency': 'EUR'} ) }}<br/> </mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">{{ item.estado }}</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">
                            <mdb-btn size="sm" outline="info" @click="consultarInvoice( item.numeroEmision )">CONSULTAR</mdb-btn>
                        </mdb-col>
                    </mdb-row>

                    <table-footer />
                </mdb-card-body>
            </mdb-card>

        </mdb-container>

        <warning-alert-frame @close="searchFieldsAlert = false" :show="searchFieldsAlert" :mensaje="'Debe ingresar al menos un filtro para la búsqueda'"/>
    </monumento-layout>
</template>

<script>
import moment from 'moment';
import * as printJS from 'print-js';
import ApiSellerService from '../services/ApiSeller.service';
import FacturacionService from '../services/Facturacion.service';
import TableFooter from '../components/TableFooter.vue'
import WarningAlertFrame from '../components/WarningAlertFrame.vue';

export default {
    components:{ TableFooter, WarningAlertFrame },
    data(){
     
        return{
            monumentoNombre: null,
            p1: false,
            masks: {
                input: 'DD-MMMM-YYYY',
            },
            moment:moment,
            items: [],
            entradas: [],
            filtros:{
                estado:null,
                range: {
                    start:null,
                    end:null
                }
            },
            searchFields: {
                numeroEmision: null,
                localizadorReserva: null,
                startDate: null,
                endDate: null
            },
            invoiceOptions: [
                { text: 'Ver factura', value: 'ver'},
                { text: 'Ver factura', value: 'ver'},
            ],
            consultandoFactura: false,
            filterAlert: false,
            numeroEmision: null,
            searchFieldsAlert: false,
            localizadorReserva: null,
            coloresEstado: {'PENDIENTE':'warning-color', "CONFIRMADO":'success-color', "CANCELADO":'danger-color', 'RESERVADO':'secondary-color'},
        }
    },
    methods:{
        async consultarInvoice( numeroEmision ){

            this.consultandoFactura = true;
            let pdf = await FacturacionService.consultarInvoice( numeroEmision )

            const pdfBlob = new Blob( [ pdf ], { type: "application/pdf" } );
            const url = URL.createObjectURL( pdfBlob );
            
            printJS({
                printable: url,
                type: 'pdf'
            })
            URL.revokeObjectURL(pdfBlob);
            this.creatingPDF = false;

            this.consultandoFactura = false;
        },
        async buscarFacturas(){
            this.searchFields.startDate = moment(this.filtros.range.start).startOf('day').format('yyyy-MM-DDTHH:mm:ss');
            this.searchFields.endDate = moment(this.filtros.range.end).endOf('day').format('yyyy-MM-DDTHH:mm:ss');

            if( this.searchFields.numeroEmision == null 
                && this.searchFields.localizadorReserva == null && 
                this.searchFields.startDate == null
                && this.searchFields.endDate == null )
            {
                this.searchFieldsAlert = true;
            }
            const facturas = await FacturacionService.searchInvoices( this.searchFields, this.$route.params.monumentoNombre )
            
            console.log( facturas );
            this.items = facturas.map( f => {
                const obj = {
                    numeroEmision: f.invoiceNumber,
                    emisor: f.emisor,
                    fecha: f.fecha,
                    importeBase: f.importeBase,
                    importeIva: f.iva ,
                    importeTotal: f.total,
                    // estado: f.status ? 'Activa' : 'Cancelada',
                    estado: 'Activa',
                    acciones: null
                }
                return obj;
            }) 
           
        }
    },
    created(){
        let $vm = this;
        $vm.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');
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