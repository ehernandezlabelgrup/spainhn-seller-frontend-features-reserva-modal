<template>
    <monumento-layout>

        <mdb-container>
            <section class="text-uppercase">
                <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                    <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/reservas`">reservar/comprar</a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item active>Resultado compra</mdb-breadcrumb-item>
                </mdb-breadcrumb>
            </section>
        </mdb-container>

        <mdb-container>
            <div class="text-center py-2">
                <p class="spainhn-title-text fw-bold">{{monumentoNombre}}</p>
            </div>
        </mdb-container>

        <mdb-container class="mt-4">
            <mdb-row >

                <mdb-card class="overflow-auto">
                    <mdb-card-body style="min-width:920px">

                        <mdb-row class="spainhn-text-small border-bottom py-2 align-items-center text-start">
                            <mdb-col col="2" class="spainhn-small-text-table">Loc.<br/>reserva</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-table ">Producto</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-table ">Tickets</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-table ">Fecha <br/>del evento</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-table ">Hora <br/>del evento</mdb-col>
                            <mdb-col col="1" class="spainhn-small-text-table ">Importe</mdb-col>
                        </mdb-row>


                        <mdb-row v-for="(item, index) in items" :item="item" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                            <mdb-col col="2" class="spainhn-small-text-cells">{{ item.numeroDePedido }}</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-cells">{{item.visitaNombre}}</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-cells">{{ item.descripcion.map( d => d.cantidad).reduce( (acc, curr) => acc + curr, 0 ) }}</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-cells text-start">{{ moment(item.fecha).format('DD-MM-YYYY') }}</mdb-col>
                            <mdb-col col="2" class="spainhn-small-text-cells text-start">{{item.hora ? moment(item.hora).utc().format('HH:mm'):'Horario libre'}}</mdb-col>
                            <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.descripcion.map( d => d.total ).reduce( ( acc, curr ) => acc + curr, 0 ).toLocaleString('es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 })}} €</mdb-col>
                        </mdb-row>

                        <mdb-row style="height:40px;">
                            <mdb-col col="8"></mdb-col>
                            <mdb-col col="4" class="clearfix py-2">
                                <h4 class="float-start">{{ $t('default.MENSAJE_IMPORTE_TOTAL') }}: {{ totalAPagar.toLocaleString('es-ES', { style:'currency', currency: 'EUR' }) }}</h4>
                            </mdb-col>
                        </mdb-row>

                    </mdb-card-body>

                </mdb-card>

            </mdb-row>

        </mdb-container>


        <mdb-container>
            <div class="text-center border py-4">
                <h4 class="text-success fw-bold">Pago realizado</h4>
            </div>
        </mdb-container>

    </monumento-layout>
</template>

<script>
import ApiSellerService from '../services/ApiSeller.service';
import moment from 'moment';
export default {
    setup() {
        
    },
    data(){
        return{
            monumentoNombre: null,
            items:[],
            moment: moment,
        }
    },
    async created(){
        let $vm = this;
        this.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');

        this.Ds_Signature = this.$route.query.Ds_Signature;
        this.Ds_SignatureVersion = this.$route.query.Ds_SignatureVersion;
        this.Ds_MerchantParameters = this.$route.query.Ds_MerchantParameters;

        let response = await ApiSellerService.getReservasByDsMerchantParameter( this.Ds_MerchantParameters, this.Ds_SignatureVersion, this.Ds_Signature )

        console.log( response.data );

        this.items = response.data;

    },
    computed:{
        totalAPagar(){
            let $vm  = this;

            // const paraPagar = this.items.filter( entrada => entrada.accionDePago === 'pagar' ).map( e => e.itemTotal ).reduce( (acc, curr) => acc + curr, 0 )
            const paraPagar = this.items.map( e => e.descripcion ).reduce( (acc, curr) => acc.concat( curr ), [] ).map( e => e.total ).reduce( (acc, curr) => acc + curr, 0 );

            // $vm.Ds_Mount = $vm.$store.getters.total.toFixed(2).toLocaleString()
            // $vm.Ds_Mount = paraPagar.toFixed(2).toLocaleString('es-ES');

            return paraPagar;
        },

    }
}
</script>