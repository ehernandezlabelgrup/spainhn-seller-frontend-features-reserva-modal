<template>
    <div>
        <nav class="navbar sticky-top navbar-light bg-light spainhNavbar py-3 navbar-expand-lg w-100 border-bottom">
            <div class="container-fluid ps-0 w-100">
                <a class="navbar-brand ms-5" href="/" >
                    <img src="../assets/LOGO REPAHIS PNG.png" style="height:80px;width:auto;" class="align-text-top d-inline-block"/>
                </a>
            </div>
            <span>
                <h1 class="mb-4">{{$t('default.TITULO_ACCESO')}}</h1>
            </span>
        </nav>
        <div class="container-sm">

            <div class="d-flex justify-content-center pt-5">
                <b-form @submit="resetSubmit" class="py-4 spainhn-bg-gris-caja px-4 fw-bold rounded">

                    <h5 class="mx-auto mb-3 font-weight-bold">¿Olvidaste tu contraseña?</h5>

                    <b-form-group
                    id="user-name-group"
                    label="Email"
                    label-for="email"
                    class="mb-2"
                    >
                        <b-form-input
                        id="email"
                        v-model="form.email"
                        placeholder="Email"
                        required
                        >
                        </b-form-input>
                    </b-form-group>


                    <div class="mt-4">
                        <b-button  class="me-3" type="submit" variant="danger" :disabled="sending">ENVIAR</b-button>
                        <b-button type="reset" variant="danger" href="/password-reset">CANCELAR</b-button>
                    </div>
                </b-form>
            </div>
            
            <success-alert :show="successLogin" mensaje="Recibirá un correo con las intrucciones para reestablecer su contraseña" @close="() => successLogin=false"></success-alert>
            <error-alert :show="badLogin" mensaje="No se encontró este correo" @close="cerrarAlerta"></error-alert>

        </div>
    </div>
</template>

<script>
import AuthService from "../services/auth.service";
import {mapActions} from 'vuex';
import ErrorAlert from '../components/ErrorAlert.vue'
import SuccessAlert from "../components/SuccessAlert.vue"

export default {
    name: 'Login',
    components: {
        ErrorAlert,
        SuccessAlert
    },
    data(){
        return {
            form:{
                email: '',
            },
            sending: false,
            badLogin: false,
            mensajeError: null,
            successLogin: false
        }
    },
    methods:{
        ...mapActions([
            'fetchAccessToken'
        ]),
        // Enviamos la solicitud de inicio de sesión
        resetSubmit(event){
            let $vm = this;
            event.preventDefault();
            $vm.sending = true;
            AuthService.requestPasswordReset(JSON.stringify(this.form))
                .then(result => {
                    $vm.sending = false;
                    this.successLogin = true;
                })
                .catch(e => {
                    console.log(e);
                    $vm.sending = false;
                    this.badLogin = true;
                })
        },
        cerrarAlerta(){
            let $vm = this;
            $vm.badLogin = false;
        }
    },
    mounted(){
        
    }
}
</script>