<template>
    <div>
        <mdb-modal :show="show" frame position="bottom" direction="bottom" @close="() => $emit('close')" class="on-top">
            <div class="d-flex justify-content-center px-4 py-4">
                <font-awesome-icon class="my-auto text-success me-2" icon="fa-check-circle" size="3x" />
                <div class="my-auto ms-4 me-4">
                    <p class="spainhn-subtitle-small text-center my-auto"><strong class="text-spainhn">{{mostrarAlerta}}</strong></p>
                </div>

                <mdb-btn @click="cerrarModal" color="success">ACEPTAR</mdb-btn>
            </div>

        </mdb-modal>
    </div>
</template>

<script>
export default {
    name: 'SuccessAlertFrame',
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

<style scoped>
    .on-top{
        z-index: 2000 !important;
    }
</style>