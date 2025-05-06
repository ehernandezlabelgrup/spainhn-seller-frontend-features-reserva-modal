<template>  
    <div class="container-fluid px-0">
        <mdb-card id="tarifas-disponibles" class="d-flex pl-0 w-100 container px-0 px-md-0">

            <mdb-card-header class="text-start" style="text-align: start !important">
                <div class="text-start section-title mr-auto my-auto align-items-center">
                    <span class="mt-auto mb-auto"><font-awesome-icon icon="fa-people-group" class="mr-2 my-auto"/></span>
                    <span v-bind:class="{'d-none': cantidadDePersonas}">{{ $t('default.RESERVATION_PEOPLE_NUMBER') }}</span>
                    <span v-bind:class="{'d-none': !cantidadDePersonas }" class="clearfix">
                        <div class="float-right my-auto">
                            {{ (cantidadDePersonas > 0) ? cantidadDePersonas : null }}
                            <mdb-btn flat class="ml-3 py-0 px-0" @click="() => show ? show = false: show = true">
                                <font-awesome-icon role="button" class="circle-icon shadow" icon="fa-pen"/>
                            </mdb-btn>                            
                        </div>
                    </span>                    
                </div>
            </mdb-card-header>
            <mdb-card-body v-if="colapsar" v-bind:class="{'d-none': !colapsar}" class="animated fadeIn">
                <mdb-container class="border-bottom py-2 border-top" v-for="(precio, index) in precios" v-bind:key="index">
                    <mdb-row class="justify-content-between">
                        <mdb-col col="12" md="6">
                            <div class="d-flex flex-column mx-auto">
                                <!-- <div class="d-flex">
                                    <strong class="mx-auto px-2 spainhn-text border font-italic" style="min-width:50px !important;">{{selected[index].cantidad}}</strong>
                                </div> -->
                                <strong class="spainhn-text">
                                    {{ precio.descripciones[idiomaIndex] && precio.descripciones[idiomaIndex].texto }}
                                    <span v-if="precio.helpers && precio.helpers.length">
                                        <template v-if="precio.helpers.filter(h => h.idioma === selectedIdioma)[0] && precio.helpers.filter(h => h.idioma === selectedIdioma)[0].texto">
                                        <mdb-tooltip material trigger="hover">
                                            <span slot="tip">
                                            {{ precio.helpers.filter(h => h.idioma === selectedIdioma)[0] && precio.helpers.filter(h => h.idioma === selectedIdioma)[0].texto }}
                                            </span>
                                            <font-awesome-icon slot="reference" icon="question-circle" />
                                        </mdb-tooltip>
                                        </template>
                                    </span>
                                </strong>
                                
                                <!-- <small class="spainhn-text">{{(precio.precio).toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 } ) }} €</small> -->
                                <!-- <small class="spainhn-text">{{(priceCalculator(precio.precio)).toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 } ) }} €</small> -->
                                <small class="spainhn-text">{{(precio.precioMayorista).toLocaleString( 'es-ES', { style: 'currency', currency: 'EUR' } ) }}</small>
                            </div>
                        </mdb-col>
                        <mdb-col col="12" md="6">
                            <botones-reserva
                                ref="botoneras"
                                :min-personas="precio.minPersonas"
                                :precio="precio.precio"
                                :precio-con-comision="precio.precioMayorista"
                                :tarifa="index"
                                @change="(evt) => preciosEdit(evt)" 
                                :maximo-incremento="-1"
                                />
                        </mdb-col>

                    </mdb-row>
                </mdb-container>

                <div class="clearfix">
                    <div class="float-right mt-3">
                        <h3>Total {{totalAPagar.toLocaleString( 'es-ES', { style: 'currency', 'currency':'EUR' } ) }}</h3>
                    </div>
                </div>

                <div class="clearfix">
                    <div class="float-right">
                        <mdb-btn class="red darken-4 text-white" :disabled="disableButton" @click="agregarACarrito">FINALIZAR COMPRA</mdb-btn>
                    </div>
                </div>

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
            horarioId: null
        }
    },
    methods:{
        priceCalculator(precio, condicionComercial, iva){
            let $vm = this;
            let ivaMonumento = iva ?? 0.21;
            let descuento = 0;
            let acuerdoComercialSpainhn = 0;
            let valorComision = 0;
            let acuerdoComercialMayorista = 0;
            // Si se pasó una condicion comercial al evento, entonces 
            // utilizamos esa información para calcular el precio de venta
            if( condicionComercial ){

                if( condicionComercial.tipoDescuento === 'porcentaje' ){
                    descuento = ( condicionComercial.descuentoMayorista / 100 ) * precio;
                    acuerdoComercialMayorista = ( condicionComercial.descuentoMayorista / 100 );
                }
                else{
                    descuento = condicionComercial.descuentoMayorista;
                    acuerdoComercialMayorista = condicionComercial.descuentoMayorista;
                }

                const resultado = precio - descuento;

                if( condicionComercial.tipoAcuerdoComercialSpainhn === 'porcentaje' ){
                    // El valor en porcentaje del acuerdo comercial entre spainhn y el monumento
                    acuerdoComercialSpainhn = ( condicionComercial.spainhn / 100 ); 
                    // Importe que corresponderá a spainhn por esta venta
                    descuento = (condicionComercial.spainhn / 100 ) * precio ;
                }
                else{
                    comision = condicionComercial.spainhn;
                    descuento = comision;
                }

                const obj = {
                    precio : precio,
                    precioDeMayorista: resultado,
                    acuerdoComercialSpainhn: acuerdoComercialSpainhn,
                    descuentoMayorista: acuerdoComercialMayorista,
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
                    idPrecio: categorias[index]._id,
                    idPrecioSpainhn: categorias[index].oldId,
                    cantidad: tempCantidad ?? 0,
                    descripcion: categorias[index].descripciones[0].texto,
                    tipo_acuerdo_comercial_mayorista: this.condicionComercial.tipoDescuento,
                    tipo_acuerdo_comercial_spainhn: this.condicionComercial.tipoAcuerdoComercialSpainhn,
                    // descuentoMayorista: this.cobro ? this.condicionComercial.descuentoMayorista : null,
                    descuentoMayorista: categorias[index].descuentoMayorista,
                    // descuento: this.cobro == false ? this.condicionComercial.valor : null,
                    descuentoSpainhn: categorias[index].descuentoSpainhn,
                    precio: categorias[index].precio,
                    precioMayorista: categorias[index].precioMayorista,
                    total: categorias[index].precioMayorista * tempCantidad,
                    pvp: categorias[index].precioMayorista,
                    minPersonas: categorias[index].minPersonas,
                    importeBase: categorias[index].precio * tempCantidad,
                }
                return obj
            }).filter( r => r.cantidad > 0 );

            this.totalAPagar = this.resumenDeCompra.map( resumenPorCat => resumenPorCat.total ).reduce( (acc, curr) => acc + curr, 0);
        },
        async agregarACarrito( ){
            const payload = { items: this.resumenDeCompra, pvp: this.totalAPagar, plazas: this.cantidadDePersonas }
            this.$emit( 'addToCart', payload );
        }

    },
    watch:{
        tarifa( tarifa ){
            this.cantidades = [];
            this.cantidadDePersonas = 0;
            this.plazas = this.horariosInfo ? this.horariosInfo.plazas : null;
            this.plazasOcupadas = this.horariosInfo ? this.horariosInfo.plazasOcupadas : 0;
            this.plazasReservadas = this.horariosInfo ? this.horariosInfo.plazasReservadas: 0;
            this.horarioId = this.horariosInfo ? this.horariosInfo._id: null;
            tarifa.precios.forEach( p => this.cantidades.push(0) )
        }
    },
    computed:{
        disableButton() {
            if (this.cantidadDePersonas > 0 && 
                this.horariosInfo.hora == 'Horario Libre' && 
                this.horariosInfo.notesToMonument !== null && 
                this.horariosInfo.notesToMonument !== '') {
                return false;
            }
            console.log(this.cantidadDePersonas, this.horariosInfo.hora, this.horariosInfo.notesToMonument);
            return true;
        },
        colapsar(){
            if( this.tarifa.precios.length > 0 ){
                return true;
            }
            return false;
        },
        precios(){

            const precios = this.tarifa.precios ? this.tarifa.precios: [];

            precios.forEach( precio => {    
                const obj = this.priceCalculator( precio.precio, this.condicionComercial );
                precio.precioMayorista = obj.precioDeMayorista;
                precio.descuentoSpainhn = obj.acuerdoComercialSpainhn
                precio.acuerdoComercialSpainhn = obj.acuerdoComercialSpainhn
                precio.descuentoMayorista = obj.descuentoMayorista;
                precio.helpers = precio.helpers ? precio.helpers : [];
            })

            precios.sort( (a, b) => {
                return a.orden - b.orden;
            })
            return precios;
        },
        selectedIdioma() {
            return 'es'
        },
        idiomaIndex() {
            return 0
        },
    }
}
</script>