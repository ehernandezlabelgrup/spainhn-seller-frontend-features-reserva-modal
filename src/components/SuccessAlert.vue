<template>
    <div>
        <b-modal size="lg" v-model="show" aria-label="" hide-header hide-footer>
            <div class="border px-5 py-5 border-success mb-3" style="background-color:rgba(204, 255, 204, 0.5)">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="d-flex justify-content-center">
                            <font-awesome-icon class="my-auto text-success me-2" icon="fa-check-circle" size="3x"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="col-12">
                            <p class="spainhn-subtitle-small text-center"><strong class="text-spainhn">{{mostrarAlerta}}</strong></p>
                    </div>
                </div>
                <div class="d-flex w-100">
                    <div class="mx-auto">
                        <b-button @click="cerrarModal">ACEPTAR</b-button>
                    </div>
                </div>
            </div>                   
        </b-modal>
    </div>
</template>

<script>
export default {
    props:{
        mensaje: String,
        show: Boolean,
    },
    methods: {
        cerrarModal(){
            this.$emit('close')
            // this.$refs['alerta-modal'].hide();
            
        }
    },
    computed:{
        mostrarAlerta(){
            return this.mensaje;
        }
    }
}
</script>