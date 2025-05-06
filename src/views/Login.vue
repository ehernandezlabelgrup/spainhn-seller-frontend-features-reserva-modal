<template>
    <div>
        <nav class="navbar sticky-top navbar-light bg-light spainhNavbar py-3 navbar-expand-lg w-100 border-bottom">
            <div class="container-fluid ps-0 w-100">
                <a class="navbar-brand ms-5" href="/" >
                    <img src="../assets/LOGO REPAHIS PNG.png" style="height:80px;width:auto;" class="align-text-top d-inline-block"/>
                </a>
            </div>
            <span>
                <h1 class="mb-4">{{$t('default.TITULO_ACCESO')}} </h1>
            </span>
        </nav>
        <div class="container-sm">

            <div class="d-flex justify-content-center pt-5">
                <b-form @submit="loginSubmit" class="py-4 spainhn-bg-gris-caja px-4 fw-bold rounded">

                    <h5 class="mx-auto mb-3 font-weight-bold">ACCESO RESTRINGIDO</h5>

                    <b-form-group
                    id="user-name-group"
                    label="Usuario o Email"
                    label-for="usuario"
                    class="mb-2"
                    >
                        <b-form-input
                        id="usuario"
                        v-model="form.name"
                        placeholder="Nombre de usuario o email"
                        required
                        >
                        </b-form-input>
                    </b-form-group>
                    <b-form-group
                    id="user-password-group"
                    label="Contraseña"
                    label-for="contraseña"
                    >
                        <b-form-input
                        id="contraseña"
                        v-model="form.password"
                        type="password"
                        placeholder="Contraseña"
                        required
                        >
                        </b-form-input>
                    </b-form-group>

                    <div class="mt-4">
                        <b-button  class="me-3" type="submit" variant="danger" :disabled="sending">ENVIAR</b-button>
                        <b-button type="reset" variant="danger" href="/password-reset">REESTABLECER</b-button>
                    </div>
                </b-form>
            </div>
            
            <error-alert :show="badLogin" :mensaje="mensajeError" @close="cerrarAlerta"></error-alert>

        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import ErrorAlert from '../components/ErrorAlert.vue'
import ApiSellerService from '../services/ApiSeller.service';

export default {
    name: 'Login',
    components: {
        ErrorAlert
    },
    data(){
        return {
            form:{
                name: '',
                password:''
            },
            sending: false,
            badLogin: false,
            mensajeError: null,
        }
    },
    methods:{
        ...mapActions([
            'fetchAccessToken'
        ]),
        // Enviamos la solicitud de inicio de sesión
        loginSubmit(event){
            let $vm = this;
            event.preventDefault();
            $vm.sending = true;
            // Trimeamos el nombre de usuario
            this.form.name = this.form.name.trim();
            ApiSellerService.login(JSON.stringify(this.form))
                .then(result => {

                    $vm.sending = false;
                    if( result.data.accessToken ){
                        localStorage.setItem('accessToken', JSON.stringify(result.data.accessToken));                        
                        
                        // Obtenemos los módulos que tiene permitidos este usuario, para saber si redirigimos a 
                        // home o si redirigimos a reservar

                        this.fetchAccessToken();
                        // Esto nos indica si el usuario puede acceder a home
                        this.$router.push('/')
                    }
                    else if(result.data.error){
                        $vm.mensajeError = "Lo sentimos, hay un problema con su cuenta, por favor, contacte con spainhneritagenetwork"
                        $vm.badLogin = true;
                    }
                })
                .catch(e => {

                    if(e.response.status == 400){

                        $vm.mensajeError = e.response.data.error;
                    } else if(e.response.status == 403){
                        $vm.mensajeError = "Usuario o contraseña incorrectos, intente nuevamente"
                    }
                    $vm.sending = false;
                    $vm.badLogin = true;
                })
        },
        cerrarAlerta(){
            let $vm = this;
            $vm.badLogin = false;
        }
    },
    mounted(){
        // console.log("Usuario es: ");
        // console.log(localStorage.getItem('user'))
        // this.$store.commit()
        // console.log("I'm Here");
        // console.log(this.$store.getters.isAuthenticated);
    }
}
</script>