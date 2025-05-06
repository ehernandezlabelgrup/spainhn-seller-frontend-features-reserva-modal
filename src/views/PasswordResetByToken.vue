<template>
    <div class="container-sm">
        <div class="d-flex justify-content-center pt-5">
            <b-form @submit="resetSubmit" class="py-4 spainhn-bg-gris-caja px-4 fw-bold rounded">

                <h1 class="mb-4">Gestión Comercial</h1>
                <h5 class="mx-auto mb-3 font-weight-bold">Reestablecer contraseña</h5>

                <b-form-group
                    id="user-name-group"
                    label="password"
                    label-for="password"
                    class="mb-2"
                >
                    <b-form-input
                        id="password"
                        v-model="form.password"
                        type="password"
                        placeholder="Nueva contraseña"
                        required
                    >
                    </b-form-input>
                </b-form-group>

                <div class="mt-4">
                    <b-button  class="me-3" type="submit" variant="danger" :disabled="sending">ENVIAR</b-button>
                    <b-button  type="submit" variant="danger" :disabled="sending" @click="goLogin">CANCELAR</b-button>
                </div>
            </b-form>
        </div>
        
        <sucess-alert :show="resetOk" :mensaje="mensajeReset" @close="cerrarAlerta"></sucess-alert>
        <error-alert :show="resetErr" :mensaje="mensajeError" @close="cerrarAlerta"></error-alert>

    </div>
</template>

<script>
import AuthService from "../services/auth.service";
import {mapActions} from 'vuex';
import SucessAlert from '../components/SuccessAlert.vue'
import ErrorAlert from '../components/ErrorAlert.vue'

export default {
    name: 'PasswordResetToken',
    components: {
        SucessAlert,
        ErrorAlert
    },
    data(){
        return {
            form:{
                password: null,
                token: null,
                user: null
            },
            sending: false,
            resetOk: false,
            resetErr: false,
            mensajeReset: null,
            mensajeError: null
        }
    },
    methods:{
        ...mapActions([
            'fetchAccessToken'
        ]),
        goLogin(){
            let $vm = this;
            $vm.$router.push('/login')
        },
        // Enviamos la solicitud de inicio de sesión
        resetSubmit(event){
            let $vm = this;
            event.preventDefault();
            $vm.sending = true;

            $vm.form.user = $vm.$route.query.id;
            $vm.form.token = $vm.$route.query.token;

            AuthService.resetPasswordByToken( JSON.stringify(this.form) )
                .then( () => {
                    $vm.sending = false;
                    $vm.resetOk = true;

                    $vm.mensajeReset = "Su contraseña se cambió con éxito";
                    // $vm.goLogin();
                })
                .catch(() => {
                    $vm.mensajeError = "Hubo un problema, intentelo más tarde"
                    $vm.sending = false;
                    $vm.resetErr = true;
                })
        },
        cerrarAlerta(){
            let $vm = this;
            if($vm.resetOk){
                $vm.resetOk = false;
                $vm.goLogin();
            }
            $vm.resetErr = false;
        }
    },
    created(){
        console.log("Aquí")
    }
}
</script>