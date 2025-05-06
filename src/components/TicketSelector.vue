<template>  
    <div class="container-fluid px-0">
        <mdb-card id="tarifas-disponibles" class="d-flex pl-0 w-100 container px-0 px-md-0">

            <mdb-card-header class="text-start" style="text-align: start !important">
                <div class="text-start section-title mr-auto my-auto align-items-center">
                    <slot>
                        <span class="mt-auto mb-auto"><font-awesome-icon icon="fa-people-group" class="mr-2 my-auto"/></span>
                        <span v-bind:class="{'d-none': cantidadDePersonas}">{{ $t('default.RESERVATION_PEOPLE_NUMBER') }}</span>
                        <span v-bind:class="{'d-none': !cantidadDePersonas }" class="clearfix">
                            <div class="float-right my-auto font-weight-bold">
                                {{ (cantidadDePersonas > 0) ? cantidadDePersonas : null }}
                                <mdb-btn flat class="ml-3 py-0 px-0" @click="() => show ? show = false: show = true">
                                    <font-awesome-icon role="button" class="circle-icon shadow" icon="fa-pen"/>
                                </mdb-btn>                            
                            </div>
                        </span>                    
                    </slot>
                </div>
            </mdb-card-header>
            <mdb-card-body v-if="show" v-bind:class="{'d-none': !show}" class="animated fadeIn">
                <mdb-container class="border-bottom py-2 border-top" v-for="(precio, index) in preciosDisponibles" v-bind:key="index">
                    <mdb-row class="justify-content-between">
                        <mdb-col col="12" md="6">
                            <div class="d-flex flex-column mx-auto">
                                <!-- <div class="d-flex">
                                    <strong class="mx-auto px-2 spainhn-text border font-italic" style="min-width:50px !important;">{{selected[index].cantidad}}</strong>
                                </div> -->
                                <strong class="spainhn-text">{{precio.descripciones[0].texto}}</strong>
                                <!-- <small class="spainhn-text">{{(precio.precio).toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 } ) }} €</small> -->
                                <!-- <small class="spainhn-text">{{(priceCalculator(precio.precio)).toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 } ) }} €</small> -->
                                <!-- <small class="spainhn-text">{{(precio.precioConComision).toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 } ) }} €</small> -->
                                <small class="spainhn-text">{{(precio.precioConComision).toLocaleString( 'es-ES', { 'style':'currency', 'currency': 'EUR' } ) }}</small>
                            </div>
                        </mdb-col>
                        <mdb-col col="12" md="6">
                            <botones-reserva
                                ref="botoneras"
                                :id-precio = precio._id
                                :initial-values="originalTickets[ precio.descripciones[0].texto ] ? originalTickets[ precio.descripciones[0].texto ] : { cantidad: 0}"
                                :min-personas="precio.minPersonas"
                                :precio="precio.precio"
                                :precio-con-comision="precio.precioConComision"
                                :tarifa="index"
                                @change="(evt) => preciosEdit(evt)" 
                                :maximo-incremento="-1"
                                />
                        </mdb-col>

                    </mdb-row>
                </mdb-container>
            </mdb-card-body>

        </mdb-card>
    </div>
</template>

<script>
/* eslint-disable */
import BotonesReserva from './BotonesReserva.vue';
export default{
    name: 'RatesPicker',
    components:{
        BotonesReserva
    },

    props:{
        tarifa:{
            type: Object,
            required: true
        },
        condicionComercial: Object,
        horariosInfo: Object,
        initialValues: Array,
        initialTickets: Number,
        initialDetails: Array
    },

    data(){
        return{
            cantidadDePersonas: 0,
            show: false,
            cantidades: [],
            cobro: false,
            descuento: false,
            totalAPagar: 0,
            resumenDeCompra: [],
            horarioId: null,
            originalTickets: {}
        }
    },
    
    methods:{

        priceCalculator(precio, condicionComercial, iva){
            let $vm = this;

            let ivaMonumento = iva ?? 0.21;
            let descuento = 0;
            let comision = 0;
            let valorComision = 0;
            // Si se pasó una condicion comercial al evento, entonces 
            // utilizamos esa información para calcular el precio de venta
            if( condicionComercial ){
                if( condicionComercial.tipoDescuento == 'porcentaje' ){
                    descuento = ( condicionComercial.descuentoMayorista / 100 ) * precio;
                }
                else{
                    descuento = condicionComercial.descuentoMayorista;
                }

                const resultado = precio - descuento;

                if( condicionComercial.tipoComisionSpainhn == 'porcentaje' ){
                    comision = ( condicionComercial.spainhn / 100 ) * precio; 
                    valorComision = condicionComercial.spainhn / 100;
                }
                else{
                    comision = condicionComercial.spainhn;
                    valorComision = comision;
                }

                const obj = {
                    precio : resultado,
                    descuentoSpainhn: valorComision
                }
                return obj;

            }
            // En caso contrario, no se aplica ningún cálculo extra 
            else{
                return precio;
            }
        },
        preciosEdit(evt){

            this.cantidades[evt.tarifa] = evt.cantidad;

            this.cantidadDePersonas = this.cantidades.reduce( (acc, curr) =>  acc + curr, 0 );

            this.resumenDeCompra = [];

            // const categorias = this.tarifa.precios;
            const categorias = this.precios;

            this.resumenDeCompra = this.cantidades.map( ( cantidad, index) => {
                const tempCantidad = cantidad ?? 0;
                const obj = {
                    cantidad: tempCantidad ?? 0,
                    descripcion: categorias[index].descripciones[0].texto,
                    tipo_comision: this.condicionComercial.tipo,
                    comision: this.cobro ? this.condicionComercial.valor : null,
                    // descuento: this.cobro == false ? this.condicionComercial.valor : null,
                    descuento: categorias[index].descuento,
                    precio: categorias[index].precioConComision,
                    total: categorias[index].precioConComision * tempCantidad,
                    pvp: (categorias[index].precio).toLocaleString( 'es-ES', {maximumFractionDigits: 2}),
                    minPersonas: categorias[index].minPersonas,
                    importeBase: (categorias[index].precio * tempCantidad).toLocaleString('es-ES', {maximumFractionDigits: 2}),
                    idPrecio: categorias[index]._id,
                    idPrecioSpainhn: categorias[index].oldId
                }
                return obj
            }).filter( r => r.cantidad > 0 );

            this.totalAPagar = this.resumenDeCompra.map( resumenPorCat => resumenPorCat.total ).reduce( (acc, curr) => acc + curr, 0);

            this.$emit( 'resumenUpdate', { total: this.totalAPagar, resumen: this.resumenDeCompra } )
        },

        async agregarACarrito( ){
            const payload = { items: this.resumenDeCompra, pvp: this.totalAPagar, plazas: this.cantidadDePersonas }
            this.$emit( 'addToCart', payload );
        }

    },
    watch:{
        tarifa( tarifa ){
            this.cantidades = [];

            const detallesDeTickets = {}

            this.initialDetails.forEach( d => {
                detallesDeTickets[ d.descripcion ] = { cantidad: d.cantidad, id: d.idPrecio ?? d._id };
            })

            this.originalTickets = detallesDeTickets;

            // this.cantidadDePersonas = 0;
            this.plazas = this.horariosInfo ? this.horariosInfo.plazas : null;
            this.plazasOcupadas = this.horariosInfo ? this.horariosInfo.plazasOcupadas : 0;
            this.plazasReservadas = this.horariosInfo ? this.horariosInfo.plazasReservadas: 0;
            this.horarioId = this.horariosInfo ? this.horariosInfo._id: null;

            tarifa.precios.forEach( p => {
                const initCantidad = detallesDeTickets[ p.descripciones[0].texto ] ? detallesDeTickets[ p.descripciones[0].texto ].cantidad : 0;
                this.cantidades.push(initCantidad)
            } )


            tarifa.precios.forEach( (p, index) => {
                const initCantidad = detallesDeTickets[ p.descripciones[0].texto ] ? detallesDeTickets[ p.descripciones[0].texto ].cantidad : 0;
                this.preciosEdit( { cantidad: initCantidad, tarifa: index } )
            })
            
        },

        initialValues( initialValues ){

            this.cantidadDePersonas = initialValues.map( p => p.cantidad ).reduce( (prev, curr) => prev + curr, 0)
            // this.cantidades.forEach( c => {
            //     console.log( c );
            // })

            // this.originalTickets = {};
            // initialValues.forEach( ticket => {
            //     this.originalTickets[ ticket.idPrecio ] = {
            //         cantidad: ticket.cantidad,
            //         descripcion: ticket.descripcion
            //     }
            // } )
        }
    },
    computed:{
        preciosDisponibles(){
            return this.precios;
        },
        colapsar(){
            return false;
        },
        precios(){
            const precios = this.tarifa.precios ? this.tarifa.precios: [];
            precios.forEach( precio => {
                const obj = this.priceCalculator( precio.precio, this.condicionComercial );
                precio.precioConComision = obj.precio;
                precio.descuento = obj.descuentoSpainhn
            })
            return precios;

            return precios;
        },
        cantidadDeTickets(){
            const tickets = this.initialDetails.map( t => t.cantidad ).reduce( (acc, curr) => acc + curr, 0 );
            return tickets;
        }
    }
}
</script>