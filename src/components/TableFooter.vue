<template>
    <mdb-row class="py-2 text-end spainhn-small-text justify-content-end">
        <mdb-col class="ms-auto">

        </mdb-col>
        <mdb-col class="ms-auto">
            <mdb-row>
                <mdb-col class="my-auto">
                    <p class="my-auto spainhn-small-text">Registros/pág:</p>
                </mdb-col>
                <mdb-col col="auto">
                    <b-select v-model="numeroDeOpciones" @change="segmentarFilas" class="spainhn-small-text" :options="tableOptions" size="sm"/>
                </mdb-col>
            </mdb-row>
        </mdb-col>
        <mdb-col col="auto" class="my-auto">
            <p class="spainhn-small-text my-auto">{{startElement}} - {{endElement}} de {{length}}</p>
        </mdb-col>
        <mdb-col col="auto" class="my-auto">
            <div class="d-flex my-auto">
                <font-awesome-icon icon="fas fa-chevron-left" class="me-2" role="button" @click="cambiarPagina('prev')"></font-awesome-icon>
                <font-awesome-icon icon="fas fa-chevron-right" class="ms-2 me-2" role="button" @click="cambiarPagina('next')"></font-awesome-icon>
            </div>
        </mdb-col>
    </mdb-row>
</template>

<script>
export default {
    props:{
        page: {type: Number },
        rows: { type: Array }
    },
    // watch:{
    //     page: function(newVal, oldVal){
    //         // this.$emit('actualizarElementos', filasToShow);
    //         let filas = newVal;

    //         const startElement = 0;
    //         const endElelement = this.numeroDeOpciones;

    //         const filasToShow = filas.splice(startElement, endElelement);

    //         this.$emit('actualizarElementos', filasToShow)
    //     }
    // },
    data(){
        return{
            tableOptions: [

                { text:'5', value:5 },
                { text:'10', value:10 },
                { text:'15', value:15 },
                { text:'100', value:100 }
            ],
            numeroDeOpciones: 10,
            currentPage: 1,
            startElement: 0,
            endElement: 0,
            lastPage: 1
        }
    },
    methods:{
        segmentarFilas( rows ){
            const filas =this.rows ?  [...this.rows] : [];
            const startElement = (this.currentPage - 1) * this.numeroDeOpciones;
            const endElement = (this.currentPage * this.numeroDeOpciones) > (this.rows?.length ?? 0 ) ? (this.rows?.length ?? 0) : (this.currentPage * this.numeroDeOpciones);
            const filasToShow = filas.splice(startElement, endElement)

            this.startElement = startElement;
            this.endElement = endElement;
            this.$emit('actualizarElementos', filasToShow)
        },

        calcularUltimaPagina(){
            let last = this.rows ? this.rows.length / this.numeroDeOpciones : 0;
            this.lastPage = Math.ceil(last);
        },

        cambiarPagina( direccion ){
            this.calcularUltimaPagina();
            if(direccion == 'next'){
                if(this.currentPage < this.lastPage){
                    this.currentPage += 1;
                }
            }
            else{
                if(this.currentPage > 1){
                    this.currentPage -= 1;
                }
            }

            this.segmentarFilas();
        }
    },
    computed:{
        length(){
            let numeroElementos = this.rows?.length ?? 0;
            this.calcularUltimaPagina();
            // this.lastPage =( numeroElementos / this.numeroDeOpciones);
            this.segmentarFilas();

            return numeroElementos;
        }
    },
    created(){
        this.calcularUltimaPagina();
        this.segmentarFilas( this.rows );
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