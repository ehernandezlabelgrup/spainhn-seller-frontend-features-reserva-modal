<template>
    <div>
        <mdb-row>
            <mdb-col>
                <mdb-btn :disabled="cantidad==0" color="red" class="red darken-3 text-white" @click="quitarPersonas">
                    <font-awesome-icon icon="fa-minus"/>
                </mdb-btn>
            </mdb-col>
            <mdb-col class="my-auto">
                <p class="my-auto">{{cantidadBoletos}}</p>
            </mdb-col>
            <mdb-col>
                <mdb-btn :disabled="noIncrement" color="red" class="red darken-3 text-white" @click="agregarPersonas">
                    <font-awesome-icon icon="fa-plus"/>
                </mdb-btn>
            </mdb-col>
        </mdb-row>
    </div>    
</template>

<script>
import EventBus from '../event-bus';
export default {
    props:{
        minPersonas: Number,
        tarifa: Number,
        maximoIncremento: Number,
        precio: Number,
        precioConComision: Number,
        initialValues: Object,
        idPrecio: String,
    },
    data(){
        return{
            cantidad: 0,
            // noIncrement: false
        }
    },
    methods:{
        reset(){
            this.cantidad = 0;
            this.$store.commit('resetBoletos')
        },
        quitarPersonas(){
            if(this.cantidad - 1 >= this.minPersonas){
                this.cantidad -= 1;
                this.$store.commit('quitarBoleto', 1);
            }
            else{
                this.$store.commit('quitarBoleto', this.minPersonas);
                this.cantidad = 0;
            }

            if(this.cantidad < 0){
                this.cantidad = 0;
            }

            this.$emit('change', { tarifa: this.tarifa, cantidad: this.cantidad, precioBase: this.precio, precioConComision: this.precioConComision } )
        },
        agregarPersonas(){
            if(this.cantidad + 1 <= this.minPersonas){
                this.cantidad = this.minPersonas;
                this.$store.commit('agregarBoleto', this.minPersonas)
            }
            else{
                this.cantidad += 1;
                this.$store.commit('agregarBoleto', 1)
            }
            this.$emit('change', { tarifa: this.tarifa, cantidad: this.cantidad, precioBase: this.precio, precioConComision: this.precioConComision } )
        }
    },
    computed:{
        noIncrement(){
            if( this.$store.getters.espacioParaBoletos == null ){
                return false;
            }
            else{
                let proximasPlazas = 0;

                if( this.cantidad == 0 ){

                    proximasPlazas = this.$store.getters.boletosAgregados + this.minPersonas;
                }
                else{
                    proximasPlazas = this.$store.getters.boletosAgregados + 1;
                }


                if( proximasPlazas > this.$store.getters.espacioParaBoletos ){
                    return true
                }
                else{
                    return false;
                }
            }
        },
        cantidadBoletos(){
            return this.cantidad;
        }
    },
    mounted(){
        EventBus.$on("resetBoletos", () => {
            this.reset();
        });

        this.cantidad = this.initialValues ? this.initialValues.cantidad : 0

        // if( this.initialValues[ this.idPrecio ] ){
        //     this.cantidad = this.initialValues[ this.idPrecio ].cantidad;
        // }
    }
}
</script>