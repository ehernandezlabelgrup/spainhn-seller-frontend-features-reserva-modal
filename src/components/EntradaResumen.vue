<template>
    <div class="w-100" style="min-width:20rem;">
        <div class="row">
            <div class="col-6 flex-wrap">
                <strong class="spainhn-small-text text-wrap">{{item.itemMonumento[0].texto}}</strong>
                <p class="spainhn-small-text mb-0 pb-0 text-wrap">{{item.itemVisita[0].texto}}</p>
                <small class="spainhn-small-text"> {{fecha}}</small>
            </div>
            <div class="col-3 d-flex">
                <strong class="spainhn-text my-auto">X {{ticketsPorEntrada}}</strong>
            </div>
            <div class="col-3 d-flex">
                <strong class="spainhn-text my-auto">{{totalPorEntrada.toLocaleString( 'es-ES', {maximumFractionDigits:2} )}} €</strong>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        item:Object
    },
    data(){
        return{

        }
    },
    setup() {
        
    },
    created(){
    },
    computed:{
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
        ticketsPorEntrada(){
            return this.item.itemTickets.map( item => item.cantidad).reduce( (total, amount) => total + amount);
        },
        totalPorEntrada(){
            return this.item.itemTickets.map( item => item.total).reduce( (total, amount) => total + amount);
        },
        
    }
}
</script>