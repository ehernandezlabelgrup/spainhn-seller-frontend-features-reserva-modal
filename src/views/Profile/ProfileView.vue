<template>
    <home-layout>
        <mdb-breadcrumb class="py-2 ps-5">
            <mdb-breadcrumb-item><a href="/">INICIO</a></mdb-breadcrumb-item>
            <mdb-breadcrumb-item active>PERFIL</mdb-breadcrumb-item>
        </mdb-breadcrumb>
        <div class="home bg-white container border shadow my-5 py-5" style="min-width:350px;">
            <h3>Perfil</h3>
            <mdb-container>
                <form @submit.prevent="updateContactData" class="needs-validation">
                    <div class="d-flex">
                        <div class="my-auto flex-grow-1">
                            <mdb-input label="Teléfono de contacto" outline ref="emailInput" required v-model="form.telefono"/>
                        </div>
                        <!-- <div class="my-auto">
                            <mdb-btn color="primary" @click="editarEmail"> <mdb-icon icon="pen"/> </mdb-btn>
                        </div> -->
                    </div>
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <mdb-input label="Email" outline ref="phoneInput" required v-model="form.email"/>
                        </div>
                        <!-- <div class="my-auto">
                            <mdb-btn color="primary" @click="editarTelefono"> <mdb-icon icon="pen"/> </mdb-btn>
                        </div> -->
                    </div>
                    <mdb-btn type="submit" color="primary">Guardar cambios</mdb-btn>
                </form>
            </mdb-container>
        </div>
        <mdb-alert color="primary" v-if="cambiado" @closeAlert="cambiado=false" dismiss>
            <strong>Cambio existoso</strong>
        </mdb-alert>

    </home-layout>
</template>

<script>
import ApiSellerService from '../../services/ApiSeller.service';

    export default {
        data(){
            return{
                form:{
                    telefono: '',
                    email: '',
                },
                disablePhone: true,
                disableEmail: true,
                cambiado: false,
            }
        },
        methods:{
            editarTelefono(){
                this.disablePhone = false;
                this.$refs.phoneInput.focus();
            },
            editarEmail(){
                this.disableEmail = false;
                this.$refs.emailInput.focus();
            },
            async updateContactData(){
                try{
                    const result = await ApiSellerService.updateProfile( this.form );
                    this.cambiado = true;
                }
                catch( err ){
                    console.log( err );
                }

            }
        },
        async mounted(){
            try{
                const { telefono, email } = await ApiSellerService.getProfile();
                this.form.telefono = telefono;
                this.form.email = email;
            }
            finally{
                console.log('Datos guardados')
            }
        }
    }
</script>

<style scoped>

</style>