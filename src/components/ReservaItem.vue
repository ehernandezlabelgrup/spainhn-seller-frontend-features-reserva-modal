<template>
    <div class="spainhn-bg-gris-cajas w-100 py-4 px-4 my-4 rounded">
        <div class="text-start spainhn-subtitle-2-black"><strong>{{item.itemMonumento[idiomaIndex].texto}}</strong></div>
        <!-- <div class="text-start spainhn-subtitle-2-black"><strong>Castillo de Belmonte</strong></div>
        <div class="text-start spainhn-subtitle mt-2 mb-2">Visita Castillo de Belmonte</div> -->
        
        <div class="text-start spainhn-subtitle mt-2 mb-2">{{item.itemVisita[idiomaIndex].texto}}</div>
        <div class="text-start text-black py-2 d-flex" v-bind:class="{'d-none':!item.cancelable}">
            <font-awesome-icon icon="fa-hand-holding-dollar" size="2x"></font-awesome-icon>
            <p class="text-start spainhn-subtitle-2-black ms-3 my-auto" style="font-size:13pt;">Añade el seguro de cancelación</p>
        </div>
        <div class="spainhn-solid-red-background py-3 d-flex" style="width:100%">
            <p class="my-auto pb-0 mb-0 spainhn-text-lg text-start ps-3" role="button"><strong>Lista de entradas para el día {{fecha}} - {{horario}} </strong></p>
        </div>

        <div class="spainhn-subtitle-2-black text-start mt-2"><strong>Resumen</strong></div>

        <b-table class="spainhn-text text-center text mb-0" :fields="resumenFields" :items="resumen">
            <template #cell(precio) = "data">
                <div>
                    {{(data.value).toLocaleString('es-ES', {maximumFractionDigits:2}) }} €
                </div>
            </template>
            
            <template #cell(total) = "data">
                <div class="text-end">
                    {{(data.value).toLocaleString('es-ES', {maximumFractionDigits:2} )}} €
                </div>
            </template>
        </b-table>

        <div class="row" v-bind:class="{'d-none':!item.seguroCancelacion}">
            <div class="col text-start spainhn-text-lg">
                <p>Monto de Cancelación</p>
            </div>

            <div class="col text-end spainhn-text-lg">
                <p>{{item.montoCancelacion.toLocaleString('es-ES', {maximumFractionDigits:2} )}} €</p>
            </div>
        </div>

        <div class="row">
            <div class="col text-start spainhn-text-lg fw-bold"><strong>TOTAL</strong></div>
            <div class="col text-end">{{ (item.itemTotal + item.montoCancelacion).toLocaleString( 'es-ES', {maximumFractionDigits:2}) }} €</div>
        </div>

        <mdb-btn class="spainhn-button mt-2" @click="quitarReserva">¿Quitar reserva?</mdb-btn>

    </div>    
</template>

<script>
export default {
    props:{
        item:Object
    },
    data(){
        return{
            resumenFields:[
                {key:"cantidad", label:'Cantidad'},
                {key:"descripcion", label: "Tipo"},
                {key:"precio", label: "Precio Ud."},
                {key:"total", label: "Precio Total"}
            ],

            resumen: []
        }
    },
    methods:{
        quitarReserva(){
            let $vm = this;
            $vm.$store.commit('removeFromCart', $vm.item.itemUuid)

            $vm.$emit('itemRemoved', { idVisita: $vm.item.itemIDVisita, monumento: $vm.item.itemMonumento[$vm.idiomaIndex].texto } )
        }
        // get
    },
    created(){
        this.resumen = this.item.itemTickets;
    },
    computed:{
        idiomaIndex(){
            return this.$store.getters.idiomaIndex;
        },
        fecha(){
            let fecha = new Date(this.item.itemFecha);
            // let fechaUTC = Date.UTC()
            let utcDate = fecha.getUTCDate();
            let utcHours = fecha.getUTCHours();
            let utcMonth = fecha.getUTCMonth();

            fecha.setDate(utcDate);
            fecha.setHours(utcHours);
            fecha.setMonth(utcMonth);
            return fecha.toLocaleDateString('es-Es');
        },
        horario(){
            if(this.item.itemHorario == null){
                return this.$t("default.FREE_SCHEDULE_LABEL");
            }
            else{
                let horas = this.item.itemHorario.split("T")[1];
                return horas.slice(0,5);
            }
        }
    }
}
</script>