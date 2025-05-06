<template>
    <monumento-layout>

        <mdb-container>
            <section class="text-uppercase">
                <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                    <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/reservas`">reservas</a></mdb-breadcrumb-item>
                    <mdb-breadcrumb-item active>pagar</mdb-breadcrumb-item>
                </mdb-breadcrumb>
            </section>
        </mdb-container>

        <mdb-container>
            <div class="text-center py-2">
                <p class="spainhn-title-text">{{monumentoNombre}}</p>
            </div>
        </mdb-container>

        <mdb-container>

            <!-- <mdb-alert color="warning" v-if="redireccionAlert">
                <strong>Será redireccionado a otra página para completar su pago, por favor, no cierre ni refresque la página</strong>
            </mdb-alert> -->

            <mdb-card class="overflow-auto my-4">
                <mdb-card-body style="min-width:920px">

                    <mdb-row class="spainhn-text-small border-bottom py-2 align-items-end text-center">
                        <mdb-col col="2" class="spainhn-small-text-table text-start">Loc.<br/>reserva</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Producto</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table ">Tickets</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Fecha <br/>del evento</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Referencia <br/>de distribuidor</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-table ">Fecha límite<br/>de pago</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-table ">Importe</mdb-col>
                    </mdb-row>


                    <mdb-row v-for="(item, index) in items" :key="index" class="py-2 text-start spainhn-small-text-cells align-items-center border-bottom">
                        <mdb-col col="2" class="spainhn-small-text-cells">{{item.identificador}}</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells">{{item.producto}}</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.tickets}}</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">
                            {{ moment(item.fechaDelEvento).format('DD-MM-YYYY') }}<br/>
                            {{item.horaDelEvento ? moment(item.horaDelEvento).format('HH:mm'):'Horario libre'}}
                        </mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{item.referenciaDeDistribuidor ? item.referenciaDeDistribuidor : "-"}}</mdb-col>
                        <mdb-col col="2" class="spainhn-small-text-cells text-center">{{ moment(item.fechaDelEvento).subtract(1,'days').format('DD-MM-YYYY') }}</mdb-col>
                        <mdb-col col="1" class="spainhn-small-text-cells text-center">{{item.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}}</mdb-col>
                    </mdb-row>

                    <mdb-row style="height:50px;">
                        <mdb-col col="7"></mdb-col>
                        <mdb-col col="4" class="clearfix pt-2 pb-0">
                            <h4 class="float-end pt-2">{{ $t('default.MENSAJE_IMPORTE_TOTAL') }}: {{ importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}</h4>
                        </mdb-col>
                    </mdb-row>

                </mdb-card-body>
            </mdb-card>

            <mdb-container class="mt-2" v-if="importe">
                <mdb-row>
                    <mdb-card>
                        <mdb-card-body>
                            <mdb-select label="Método de pago" :options="metodosDePagoOptions" @getValue="( evt ) => tipoDePago = evt" class="w-50" outline/>
                        </mdb-card-body>
                    </mdb-card>
                </mdb-row>
            </mdb-container>

            <mdb-modal frame position="bottom" direction="bottom" :show="redireccionAlert" hide-footer>
                <mdb-modal-body class="info-color">
                    <strong class="my-auto me-3">Será redireccionado a otra página para completar su pago, por favor, no cierre ni refresque la página</strong>
                    <b-spinner/>
                </mdb-modal-body>
            </mdb-modal>

        </mdb-container>

        <mdb-container>
            <mdb-row>
                <mdb-col class="clearfix">
                    <mdb-btn 
                        class="float-end spainhn-button fw-bold" 
                        outline="danger" 
                        size="lg" 
                        @click="pagarReserva" 
                        style="z-index: 99"
                        :disabled="loading">PAGAR</mdb-btn>
                </mdb-col>
            </mdb-row>
        </mdb-container>

        <mdb-container>
            <form name="redsys_form" :action="redsysUrl" method="post" id="redsys_form" ref="redsys_form">
                <input type="text" name="Ds_SignatureVersion" v-model="Ds_SignatureVersion" hidden />
                <input type="text" name="Ds_MerchantParameters" v-model="Ds_MerchantParameters" hidden />
                <input type="text" name="Ds_Signature" v-model="Ds_Signature" hidden />
            </form>
        </mdb-container>


    </monumento-layout>    
</template>

<script>
import moment from 'moment';
import ApiSellerService from '../services/ApiSeller.service';
export default{
    components:{

    },
    data(){
        return{
            moment: moment,
            monumentoNombre:null,
            // item: {
            //     importe: 0.0
            // },
            items: [],
            loading: false,
            Ds_SignatureVersion: null,
            Ds_MerchantParameters: null,
            Ds_Signature: "",
            redsysUrl: process.env.VUE_APP_REDSYS_URL,
            redireccionAlert: false,
            identificadores: [],
            importe: 0,
            metodosDePagoOptions: [
                { text: 'TPV', value:'redsys', selected: true },
                { text: 'Transferencia', value: 'transferencia' }
            ],
            tipoDePago: 'redsys'

        }
    },
    methods:{
        logout(){
            localStorage.removeItem('accessToken')
            this.$store.commit('setUser', "")
            this.$router.push('/login')
        },
        /**
         * Solicitamos la creación de las cadenas necesarias para pasar a redsys
         */
        async pagarReserva(){

            let $vm = this;
            let processPayment = false;

            this.loading = true;

            let result = null;
            
            try{

                result = await ApiSellerService.checkoutReserva( 
                    this.importe.toLocaleString( 'es-ES', 
                        { 
                            maximumFractionDigits:2, 
                            minimumFractionDigits:2 
                        } 
                    ), 
                    this.$route.query.reservationId, 
                    this.$route.params.monumentoNombre,
                    this.tipoDePago
                );
            }
            catch( err ){
                if( err.response.status === 403 ){
                    this.logout();
                }
            }

            const { Ds_MerchantParameters, Ds_SignatureVersion, Ds_Signature } = result.data;

            if( Ds_MerchantParameters ){

                if( this.tipoDePago === 'redsys' ){
                    this.redireccionAlert = true;
    
                    $vm.Ds_MerchantParameters = Ds_MerchantParameters;
                    $vm.Ds_SignatureVersion = Ds_SignatureVersion;
                    $vm.Ds_Signature = Ds_Signature;
                    // window.alert("Será redireccionado a una página externa para completar el pago, no recargue la página");
    
                    // Envía los datos al sistema redys para ser procesados
                    setTimeout(() => this.$refs.redsys_form.submit(), 1000);
                }
                else{

                    window.alert( 'Reserva pagada de manera correcta')
                    setTimeout(() => this.$router.push(`/${this.$route.params.monumentoNombre}/productos`), 1000);
                }

            }

            // this.loading = false;

        }
    },
    async created(){
        let $vm = this;

        $vm.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');
        let response = await ApiSellerService.getReservasByLocalizador('es', this.$route.query.reservationId);

        this.items = response.data;

        console.log( this.items );
        const metodosDePagoData = await ApiSellerService.getPaymentMethods( this.items[0].idVisita )
        const metodosDePagoAutorizados = metodosDePagoData.metodosDePago;
        this.metodosDePagoOptions = [];

        metodosDePagoAutorizados.forEach( mp => {
            if( mp === 'Redsys' ){
                this.metodosDePagoOptions.splice(0, 0, { text: 'TPV', value:'redsys', selected: false } ) 
            }
            if( mp === 'Transfer'){
                this.metodosDePagoOptions.push({ text: 'Transferencia', value: 'transferencia', selected: false })
            }
        })

        this.metodosDePagoOptions[0].selected = true;

        this.identificadores = this.items.map( item => item.localizador )

        this.importe = this.items.map( item => item.importe ).reduce( (acc, curr) => acc+curr, 0 )
        // console.log(response.data);

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

/* .spainhn-button:hover{
    background-color: #ff4444 !important;
} */

</style>