<template>
    <monumento-layout>

        <div class="container bg-light d-flex mb-3 px-3 my-2">
            <div class="me-2">
                <span><a href="/">Inicio </a> >> </span>
            </div>

            <div class="me-2">
                <span><a :href="`/${$route.params.monumentoNombre}/tablero`" > {{monumentoNombre}} </a> >> </span>
            </div>

            <div class="me-2">
                <span><a :href="`/${$route.params.monumentoNombre}/productos`" > visitas </a> >> </span>
            </div>

            <div class="me-2">
                <span><a :href="'#'" > reservar </a> </span>
            </div>

        </div>



        <div class="text-center mt-2">
            <p class="spainhn-title-text">{{monumentoNombres[0] ? monumentoNombres[0].texto: ""}}</p>
        </div>

        <b-spinner style="position:absolute; z-index:2; left: 40%; top:30%; width: 10rem; height: 10rem;" variant="danger" v-bind:class="{'d-none':!loading}"></b-spinner>

        <div class="container-fluid px-5 mt-4 mb-4 bg-light" v-bind:class="{'d-none':(visitaFirstDate == null)}">

            <b-card class="shadow">
                
                <div class="text-start">
                    <div class="justify-content-start">
                        <p class="text-muted">Nombre de visita</p>
                        <b-select class="py-2 px-3" :options="visitasDisponibles" v-model="entradaId" @change="reloadReservar"></b-select>
                    </div>
                </div>

            </b-card>

            <div class="d-flex pe-0 w-100">
                <div class="text-start pt-3 pe-3" style="width:100%">
                    <!-- <h4 class="my-auto pb-0 mb-0 spainhn-title" role="button"><strong> {{monumentoNombres[idiomaIndex].texto}}</strong> </h4>
                    <h5 class="mb-0"><strong class="spainhn-subtitle">{{nombres[idiomaIndex].texto}}</strong></h5> -->
                </div>
            </div>

            <b-card class="d-flex pe-0 w-100">
                <div class="d-flex my-auto pb-3">
                    <div class="text-start">
                        <font-awesome-icon icon="fa-calendar" class="fa-2x ms-2"/>
                    </div>
                    <div class="d-flex">
                        <p class="my-auto ms-3 fw-bold">Fecha de tu Reserva</p>
                    </div>

                    <div class="d-flex ms-auto" v-bind:class="{'d-none':selectedDate == null}">
                        <div class="d-flex my-auto">
                            <div class="ms-auto d-flex">
                                <p class="my-auto fw-bold">{{ selectedDate ? selectedDate.toLocaleDateString('es-ES'):null }}</p>
                            </div>
                            <div class="ms-3">
                                <font-awesome-icon role="button" v-b-toggle.calendar class="circle-icon shadow" icon="fa-pen"/>
                            </div>
                        </div>
                    </div>
                </div>

                <b-collapse id="calendar" class="border-top mt-2" style="border-color: rgb(165, 61, 57) !important; border-width: 2px !important;" v-model="visibleDate">
                    <div class="col-7 mx-auto px-4" style="">
                    <div class="w-100 spainhn-text spainhn-solid-red-background pt-2 pb-2 px-2"><strong>1.- {{ $t('default.CART_INSTRUCTIONS_1') }}</strong></div>
                    <!-- <vc-calendar v-model="selectedDate" :attributes="attrs" is-expanded></vc-calendar> -->
                    <vc-date-picker :color="'red'" @update:to-page="newMonth($event)" :disabled-dates="[{ start: null }]" :timezone="'UTC'" :available-dates="enabledDates"
                        v-model='selectedDate' is-expanded @dayclick="daySelected($event)" ref="calendario" is24hr :min-date="new Date()"/>
                    <!-- <div class="spainhn-text-subtitle d-flex fw-bold" v-bind:class="{'d-none':horarios[0].hora == null}">Elige hora de visita:</div> -->
                    <div  class="d-flex py-2 my-2" v-for="(horario, index) in horarios" v-bind:key="index" v-bind:class="{'d-none':(horario.hora == null)}">
                        <div style="background-color:#fcf8e3; width: 100%;" class="text-start py-2 d-flex" v-bind:class="{'horario-selected':isThisHorarioSelected(horario.hora)}">
                            <b-button size="md" @click="setTarifa(horario)" class="spainhn-button my-auto" v-bind:class="{'fa-bounce':(horarioSelected == null)}">
                                <!-- <font-awesome-icon icon="fa-clock" v-bind:class="{'fa-shake':(horarioSelected == null)}" size="1x"></font-awesome-icon> -->
                                {{new Date(horario.hora).toLocaleTimeString( 'es-ES', {'timeZone':'UTC', hour:'2-digit', minute:'2-digit' } )}}
                            </b-button> 
                            <small class="spainhn-text my-auto ms-2">{{ $t("default.MENSAJE_AFORO") }} <strong>{{horario.plazas}}</strong> {{ $t("default.MENSAJE_PERSONAS") }}</small>
                        </div>
                    </div>  
                    <p class="text-start" v-bind:class="{'d-none':horariosLimitados}"><small class="spainhn-small-text">{{ $t('default.CART_STEP1_NOTES_1') }}<br>({{ $t('default.CART_STEP1_NOTES_2') }})</small></p>
                     
                </div>

                </b-collapse>
            </b-card>

            <div class="d-flex pe-0 w-100">
                <div class="text-start pt-3 pe-3" style="width:100%">
                    <!-- <h4 class="my-auto pb-0 mb-0 spainhn-title" role="button"><strong> {{monumentoNombres[idiomaIndex].texto}}</strong> </h4>
                    <h5 class="mb-0"><strong class="spainhn-subtitle">{{nombres[idiomaIndex].texto}}</strong></h5> -->
                </div>
            </div>


            <b-card class="d-flex pe-0 w-100">
                <div class="d-flex my-auto pb-3">
                    <div class="text-start h-100">
                        <font-awesome-icon icon="fa-clock" class="fa-2x ms-2 my-auto"/>
                    </div>
                    <div class="d-flex my-auto">
                        <p class="my-auto ms-3 fw-bold">Hora de visita</p>
                    </div>

                    <div class="d-flex ms-auto" v-bind:class="{'d-none':selectedDate == null}">
                        <div class="d-flex my-auto">
                            <div class="ms-auto d-flex">
                                <p class="text-start" v-bind:class="{'d-none':horariosLimitados}"><small class="spainhn-small-text">{{ $t('default.CART_STEP1_NOTES_1') }}<br>({{ $t('default.CART_STEP1_NOTES_2') }})</small></p>
                            </div>
                            <div class="ms-3">
                                <font-awesome-icon role="button" v-b-toggle.calendar class="circle-icon shadow" icon="fa-pen"/>
                            </div>
                        </div>
                    </div>
                </div>

                <b-collapse id="calendar" class="border-top mt-2" style="border-color: rgb(165, 61, 57) !important; border-width: 2px !important;" v-model="visibleHours">
                    <div class="col-7 mx-auto px-4" style="">
                        <div class="w-100 spainhn-text spainhn-solid-red-background pt-2 pb-2 px-2"><strong>1.- {{ $t('default.CART_INSTRUCTIONS_1') }}</strong></div>
                        <!-- <vc-calendar v-model="selectedDate" :attributes="attrs" is-expanded></vc-calendar> -->

                        <div  class="d-flex py-2 my-2" v-for="(horario, index) in horarios" v-bind:key="index" v-bind:class="{'d-none':(horario.hora == null)}">
                            <div style="background-color:#fcf8e3; width: 100%;" class="text-start py-2 d-flex" v-bind:class="{'horario-selected':isThisHorarioSelected(horario.hora)}">
                                <b-button size="md" @click="setTarifa(horario)" class="spainhn-button my-auto" v-bind:class="{'fa-bounce':(horarioSelected == null)}">
                                    <!-- <font-awesome-icon icon="fa-clock" v-bind:class="{'fa-shake':(horarioSelected == null)}" size="1x"></font-awesome-icon> -->
                                    {{new Date(horario.hora).toLocaleTimeString( 'es-ES', {'timeZone':'UTC', hour:'2-digit', minute:'2-digit' } )}}
                                </b-button> 
                                <small class="spainhn-text my-auto ms-2">{{ $t("default.MENSAJE_AFORO") }} <strong>{{horario.plazas}}</strong> {{ $t("default.MENSAJE_PERSONAS") }}</small>
                            </div>
                        </div>  
                        <p class="text-start" v-bind:class="{'d-none':horariosLimitados}"><small class="spainhn-small-text">{{ $t('default.CART_STEP1_NOTES_1') }}<br>({{ $t('default.CART_STEP1_NOTES_2') }})</small></p>
 
                    </div>

                </b-collapse>
            </b-card>

            <div class="d-flex pe-0 w-100">
                <div class="text-start pt-3 pe-3" style="width:100%">
                    <!-- <h4 class="my-auto pb-0 mb-0 spainhn-title" role="button"><strong> {{monumentoNombres[idiomaIndex].texto}}</strong> </h4>
                    <h5 class="mb-0"><strong class="spainhn-subtitle">{{nombres[idiomaIndex].texto}}</strong></h5> -->
                </div>
            </div>


            <b-card class="d-flex pe-0 w-100">
                <div class="d-flex my-auto pb-3">
                    <div class="text-start h-100">
                        <font-awesome-icon icon="fa-ticket" class="fa-2x ms-2 my-auto"/>
                    </div>
                    <div class="d-flex my-auto">
                        <p class="my-auto ms-3 fw-bold">Entradas</p>
                    </div>

                    <div class="d-flex ms-auto" v-bind:class="{'d-none':(horarioSelected == null || selectedDate == null)}">
                        <div class="d-flex my-auto">
                            <div class="ms-auto d-flex">
                                <p class="text-start"><small class="spainhn-small-text"></small></p>
                            </div>
                            <div class="ms-3">
                                <font-awesome-icon role="button" v-b-toggle.calendar class="circle-icon shadow" icon="fa-pen"/>
                            </div>
                        </div>
                    </div>
                </div>

                <b-collapse id="calendar" class="border-top mt-2" style="border-color: rgb(165, 61, 57) !important; border-width: 2px !important;" v-model="visibleTickets">
                    <div class="col-7 mx-auto px-4" style="">

                        <div class="w-100 spainhn-text spainhn-solid-red-background pt-2 pb-2 px-2">
                            <strong>2.- {{ $t('default.CART_INSTRUCTIONS_2') }}</strong>
                        </div>

                        <div class="w-100 pe-3 text-wrap text-start spainhn-small-text" v-bind:class="{'d-none':!tipoCobro}">
                            <small>{{ $t("default.MENSAJE_PRECIOS_INCLUYEN") }} {{comision}} {{simbolo}}+IVA {{ $t("default.MENSAJE_EN_CONCEPTO") }} </small> <br>
                            <small> Se aplica un descuento del 5% </small>
                        </div>

                        <div v-bind:class="{'d-none':!precios.length}" id="precios-disponibles">
                            <div class="d-flex text-start border-top border-bottom py-2" v-for="(precio, index) in precios" v-bind:key="index">
                                <div class="w-50 d-flex flex-column">
                                    <strong class="spainhn-text">{{precio.descripciones[idiomaIndex].texto}}</strong>
                                    <small class="spainhn-text">{{(priceCalculator(precio.precio)).toLocaleString()}} €</small>
                                </div>
                                <div class="w-50 ms-auto">
                                    <!-- <b-form-spinbutton id="demo-sb" v-model="selected[index].cantidad"  min="0" @change="validarNumeroEntradas($event, index)"/> -->
                                    <!-- <b-input-group>
                                        <b-input-group-prepend>
                                        <b-button variant="outline-dark" class="py-0" size="sm" @click="valueChange((selected[index].cantidad - 1), index)">
                                            <b-icon-dash></b-icon-dash>
                                        </b-button>
                                        </b-input-group-prepend>

                                        <b-form-input
                                        :id="'demo-sb'"
                                        size="md"
                                        type="number"      
                                        min="0"
                                        class="border-secondary text-center my-auto"
                                        number
                                        style="height:26px"
                                        v-model="selected[index].cantidad"
                                        @input="validarNumeroEntradas($event, index)"
                                        autocomplete="off"
                                        />

                                        <b-input-group-append>
                                        <b-button variant="outline-dark" class="py-0" size="sm" @click="valueChange((selected[index].cantidad + 1), index)">
                                            <b-icon-plus></b-icon-plus>
                                        </b-button>
                                        </b-input-group-append>
                                    </b-input-group> -->

                                    <b-form-select :options="precio.options"></b-form-select>
                                </div>
                            </div>
                        </div>

                        <b-button v-bind:class="{'d-none':!precios.length}" class="spainhn-button mt-1 mb-2 mx-auto" size="sm" @click="editarResumen" :disabled="productoAgregado"><strong>{{ $t('default.SPAINHN_BUTTON_ADD_CART') }}</strong></b-button>  
                        
                    </div>

                </b-collapse>
            </b-card>


            <!-- <div class="row mt-4 justify-content-around bg-light" id="horarios-disponibles">
                <div class="col-7 mx-auto px-4" style="">
                    <div class="w-100 spainhn-text spainhn-solid-red-background pt-2 pb-2 px-2"><strong>1.- {{ $t('default.CART_INSTRUCTIONS_1') }}</strong></div>
                    <div  class="d-flex py-2 my-2" v-for="(horario, index) in horarios" v-bind:key="index" v-bind:class="{'d-none':(horario.hora == null)}">
                        <div style="background-color:#fcf8e3; width: 100%;" class="text-start py-2 d-flex" v-bind:class="{'horario-selected':isThisHorarioSelected(horario.hora)}">
                            <b-button size="md" @click="setTarifa(horario)" class="spainhn-button my-auto" v-bind:class="{'fa-bounce':(horarioSelected == null)}">
                                {{new Date(horario.hora).toLocaleTimeString( 'es-ES', {'timeZone':'UTC', hour:'2-digit', minute:'2-digit' } )}}
                            </b-button> 
                            <small class="spainhn-text my-auto ms-2">{{ $t("default.MENSAJE_AFORO") }} <strong>{{horario.plazas}}</strong> {{ $t("default.MENSAJE_PERSONAS") }}</small>
                        </div>
                    </div>  
                    <p class="text-start" v-bind:class="{'d-none':horariosLimitados}"><small class="spainhn-small-text">{{ $t('default.CART_STEP1_NOTES_1') }}<br>({{ $t('default.CART_STEP1_NOTES_2') }})</small></p>
                     
                </div>

                <div class="col-12">
                    <div class="row">

                        <div class="col-7 ps-2 mb-4 mx-auto">
                            <div class="w-100 spainhn-text spainhn-solid-red-background pt-2 pb-2 px-2">
                                <strong>2.- {{ $t('default.CART_INSTRUCTIONS_2') }}</strong>
                            </div>
                            <div class="w-100 pe-3 text-wrap text-start spainhn-small-text" v-bind:class="{'d-none':!tipoCobro}">
                                <small>{{ $t("default.MENSAJE_PRECIOS_INCLUYEN") }} {{comision}} {{simbolo}}+IVA {{ $t("default.MENSAJE_EN_CONCEPTO") }} </small> <br>
                                <small> Se aplica un descuento del 5% </small>
                            </div>
                                <div v-bind:class="{'d-none':!precios.length}" id="precios-disponibles">
                                    <div class="d-flex text-start border-top border-bottom py-2" v-for="(precio, index) in precios" v-bind:key="index">
                                        <div class="w-50 d-flex flex-column">
                                            <strong class="spainhn-text">{{precio.descripciones[idiomaIndex].texto}}</strong>
                                            <small class="spainhn-text">{{(priceCalculator(precio.precio)).toLocaleString()}} €</small>
                                        </div>
                                        <div class="w-50 ms-auto">
                                        <b-input-group>
                                            <b-input-group-prepend>
                                            <b-button variant="outline-dark" class="py-0" size="sm" @click="valueChange((selected[index].cantidad - 1), index)">
                                                <b-icon-dash></b-icon-dash>
                                            </b-button>
                                            </b-input-group-prepend>

                                            <b-form-input
                                            :id="'demo-sb'"
                                            size="md"
                                            type="number"      
                                            min="0"
                                            class="border-secondary text-center my-auto"
                                            number
                                            style="height:26px"
                                            v-model="selected[index].cantidad"
                                            @input="validarNumeroEntradas($event, index)"
                                            autocomplete="off"
                                            />

                                            <b-input-group-append>
                                            <b-button variant="outline-dark" class="py-0" size="sm" @click="valueChange((selected[index].cantidad + 1), index)">
                                                <b-icon-plus></b-icon-plus>
                                            </b-button>
                                            </b-input-group-append>
                                        </b-input-group>
                                        </div>
                                    </div>
                                </div>
                                <b-button v-bind:class="{'d-none':!precios.length}" class="spainhn-button mt-1 mb-2 mx-auto" size="sm" @click="editarResumen" :disabled="productoAgregado"><strong>{{ $t('default.SPAINHN_BUTTON_ADD_CART') }}</strong></b-button>  
                            

                                <div v-bind:class="{'d-none':precios.length}" class="mt-2 border px-3 py-4 border-warning mb-3" style="background-color:#fcf8e3">
                                    <div class="row">
                                        <div class="col-md-2 col-12 my-auto">
                                            <div class="d-flex">
                                            </div>
                                        </div>
                                        <div class="col-10 mx-auto">
                                            <p><strong class="text-spainhn my-auto">{{ $t("default.MENSAJE_SELECCIONAR_HORARIO") }}</strong></p>
                                        </div>
                                    </div>
                                </div>                   
                            </div>

                            <div class="col-7 ps-2 pe-2 mx-auto" style="" id="resumen-general">
                                <div class="w-100 spainhn-text spainhn-solid-red-background pt-2 pb-2 px-2"><strong>3.- {{ $t('default.CART_INSTRUCTIONS_3') }}</strong></div>
                                <div class="w-100 pe-3 text-wrap text-center spainhn-title"><strong>{{ $t('default.CART_STEP3_RESUME') }}</strong></div>
                                <b-table class="spainhn-text text-center text mb-0" :fields="resumenFields" :items="resumen">
                                    <template #cell(precio) = "data">
                                        <div>
                                            {{(data.value).toLocaleString()}} €
                                        </div>
                                    </template>
                                    <template #cell(total) = "data">
                                        <div>
                                            {{(data.item.total).toLocaleString()}} €
                                        </div>
                                    </template>
                                </b-table>

                                <div class="w-100 d-flex border-bottom">
                                    <strong class="py-3 text-start ps-2 flex-grow-1">{{ $t('default.CART_STEP3_TOTAL') }}</strong>
                                    <div class="px-3 py-3 spainhn-solid-red-background h-100">{{ (total.toFixed(2)).toLocaleString() }} €</div>
                                </div>
                            </div>
                            
                        </div>                    
                </div>
            </div>

            <div class="spainhn-solid-red-background mt-2 ps-0 d-flex" style="min-height:5rem; width:100%" ref="checkout">
                <div class="d-flex ps-0 px-md-5 my-auto container text-center">
                    <p class="my-auto pb-0 mb-0 spainhn-title py-2 mx-auto">{{ $t('default.CART_INSTRUCTIONS_4') }}</p>
                </div>
            </div>

            <div class="d-flex flex-lg-row flex-column justify-content-around spainhn-title text-white pt-4">
                <div class="row w-100 mx-auto">

                    <div class="col-md-4 py-2 order-md-last order-first me-auto mx-auto" role="button">
                        <div class="py-3 d-flex flex-column mx-auto" style="border-radius:10px; background-color:rgba(116,209,129,255);" role="button" @click="goToCarrito">
                            <p class="spainhn-text" style="font-size:16pt; font-weight:600;">{{ $t('default.CART_INSTRUCTIONS_4_OPTION3') }}</p>
                            <b-icon-cart-check-fill class="mx-auto" style="width:80px; height:80px;"></b-icon-cart-check-fill>

                        </div>
                    </div>
                </div>

            </div> -->


        </div>
        <success-alert :show="itemAgregado" @close="cerrarConfirmacion" :mensaje="'Se agregaron las entradas a su carrito'"></success-alert>
        <error-alert :show="itemEliminado" @close="()=> itemEliminado = false" :mensaje="'Se han eliminado entradas de su carrito'"></error-alert>
        <error-alert :cancel="true" :carrito="true" :show="itemDuplicadoAlert" @close="duplicarItem" @cancelar="cancelarOperacion" :mensaje="'Ya tiene otra entrada para la misma fecha y misma visita. \n¿Desea Continuar?'" />
    </monumento-layout>
</template>

<script>
import ApiService from '../services/ApiSeller.service';
import { v4 as uuidv4 } from 'uuid';
import SuccessAlert from '../components/SuccessAlert.vue';
import ErrorAlert from '../components/ErrorAlert.vue';
import ClorianService from '../services/ClorianService';

export default {
    components:{
    // IconBase,
    // IconCasttle,
    // Cards,
    SuccessAlert,
    ErrorAlert,
},
    data(){
        return{
            visitasDisponibles: null,
            selectedDate:null,
            monumentoNombres: [{texto:"Castillo de Belmonte"}, {texto:""}, {texto:""}, {texto:""}],
            enabledDates:[],
            monumentoId: null,
            visitaId: null,
            nombres: [{texto:"Visita Castillo de Belmonte"}, {texto:""}, {texto:""}, {texto:""}],
            idiomaIndex:0,
            precios:[],
            resumen:[],
            selected:[],
            eventosRecomendados:[],
            tipoDeEntrada: null,
            disponibilidadInfo: null,
            cargandoDisponibilidad: true,
            horariosInfo:[],
            horarioSelected:null,
            itemUuid: null,
            tipoComision:null,
            comision:null,
            visitaFirstDate:null,
            fechasDesactivadas: [{'start':null}],
            resumenFields:[
                {key:"cantidad", label:'Cantidad'},
                {key:"descripcion", label: "Tipo"},
                {key:"precio", label: "Precio Ud."},
                {key:"total", label: "Precio Total"}
            ],
            attrs:[{}],
            total:0,
            baseTotal:0,
            comisionTotal:0,
            descuentoTotal: 0,
            condicionComercial: null,
            tipoCobro: true,
            iva:0.21,
            cancelable: false,
            loading:true,
            imagenesUrl: null,
            simbolo: "%",
            productoAgregado: false,
            itemAgregado: false,
            itemEliminado: false,
            carritoItemTemp: null,
            itemDuplicadoAlert: false,
            entradaId2: null,
            visibleDate: true,
            calendar: null,
            visibleHours: false,
            visibleTickets: false,
        }
    },
    created(){
        this.imagenesUrl = process.env.VUE_APP_IMAGES_URL;
    },
    methods:{
        async reloadReservar(evt){
            let $vm = this;
            console.log(evt);
            $vm.$router.push(`/${$vm.$route.params.monumentoNombre}/reservar/visita:${evt}`)
            await $vm.consultarInfoParaReserva();
            $vm.entradaId = $vm.$route.params.visitaId;

            const entradaInfo = await ApiService.getEntradaById($vm.entradaId, 'es')

        },
        cerrarConfirmacion(){
            let $vm = this;
            $vm.itemAgregado = false;
        },
        isThisHorarioSelected(hora){
            let $vm = this;
            // console.log(hora);
            if( $vm.horarioSelected ){
                // console.log($vm.horarioSelected.hora)
                if($vm.horarioSelected.hora == hora){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        },
        valueChange (newValue, index) {
            let $vm = this;
            // console.log($vm.horarioSelected);
            if (newValue <= 0) {
                // this.$emit('input', 0)
                this.selected[index].cantidad = 0;
            } else {
                // this.$emit('input', newValue)
                let prev = this.selected[index].cantidad;
                this.selected[index].cantidad = newValue;

                let cantidadTotal = this.selected.map( cant => cant.cantidad).reduce( (acc, prev) => acc + prev);
                if( cantidadTotal > $vm.horarioSelected.plazas && ($vm.horarioSelected.plazas != 0 && $vm.horarioSelected.plazas != null ) ){
                    this.selected[index].cantidad = prev;
                }
                // console.log(cantidadTotal);
            }            
            this.validarNumeroEntradas( this.selected[index].cantidad, index );
        },
        // Guarda el elemento en el carrito, podemos utilizar el id de la fecha para identificar las entradas
        editarResumen(){
            // console.log("Editar resumen")
            let $vm = this;

            $vm.resumen = [];
            
            // Selected es la variable que guarda el número seleccionado de entradas para cada una de los diferentes
            // precios
            $vm.selected.map( item => {
                if(item.cantidad > 0){
                    $vm.resumen.push(item);
                }
            })

            // Procesamos el costo de los tickets seleccionados
            // let comisionValor = $vm.comision;
            $vm.resumen.map( item =>{
                // console.log(item)
                let importeBase = item.cantidad * (item.pvp);
                item.importeBase = importeBase.toFixed(2);
                item.total = item.cantidad * item.precio;
                // item.total = item.cantidad * ($vm.priceCalculator(item.pu));
                // item.total.toFixed(2);
                // item.comision = comisionValor;

            })

            // Así calculamos el total de la compra si hay más de una tarifa seleccionada
            if($vm.resumen.length > 1){
                $vm.total = $vm.resumen.map( resumen => resumen.total ).reduce((acc, prev) => {
                    // console.log(previousValue.total);
                    return acc + prev;
                })
                $vm.baseTotal = $vm.resumen.map( resumen => resumen.importeBase ).reduce((acc, prev) => {
                    // console.log(previousValue.total);
                    return parseFloat(acc) + parseFloat(prev);
                })

                console.log($vm.total);
                console.log($vm.baseTotal);

                // $vm.comisionTotal = $vm.resumen.reduce((previousValue, currentValue) => {
                //     // console.log(previousValue.total);
                //     return parseFloat(previousValue.comision) + parseFloat(currentValue.comision);
                // })
            }

            else{
                $vm.total = $vm.resumen[0].total;
                $vm.baseTotal = parseFloat($vm.resumen[0].importeBase);
                // $vm.comisionTotal = parseFloat($vm.resumen[0].comision);
            }

            if($vm.tipoCobro){
                $vm.comisionTotal = parseFloat($vm.total - $vm.baseTotal);
                $vm.descuentoTotal = 0;
            }
            else{
                $vm.comisionTotal = 0;
                $vm.descuentoTotal = ($vm.comision/100 * ($vm.total)) * (1 + $vm.iva);
            }

            // let itemUuid = uuid.v1();
            $vm.itemUuid = uuidv4()
            // console.log($vm.selected);

            let comisionComercial = null;
            let descuentoComercial = null;
            if($vm.tipoCobro == true){
                comisionComercial = $vm.comision;
            }
            else{
                descuentoComercial = null;
            }

            let carritoItem = {
                itemID: $vm.horarioSelected._id,
                itemIDVisita: $vm.entradaId2,
                itemUuid:$vm.itemUuid, 
                itemComisionTotal: $vm.comisionTotal.toFixed(2),
                itemDescuentoTotal: $vm.descuentoTotal.toFixed(2),
                itemBaseTotal: $vm.baseTotal.toFixed(2),
                itemHorario: $vm.horarioSelected.hora, 
                itemFecha: $vm.selectedDate, 
                itemTotal: $vm.total, 
                itemTickets: $vm.resumen, 
                itemVisita: $vm.nombres, 
                itemMonumento: $vm.monumentoNombres,
                itemComision: $vm.comision,
                itemTipoCobro: $vm.tipoCobro,
                itemComisionPorcentaje: $vm.tipoComision,
                cancelable: $vm.cancelable,
                seguroCancelacion: false,
                montoCancelacion: 0
            }

            // console.log(carritoItem.itemUuid);
            if( !$vm.verificarDuplicidad( carritoItem ) ){
                $vm.$store.commit('addToCart', carritoItem);
                
                // Esta variable hace que no se puedan agregar más entradas con estos mismos datos
                $vm.productoAgregado = true;
                // Esta entrada hace que el icono de carrito parpadeé para llamar la atención;
                $vm.itemAgregado = true;
                
                var element = this.$refs['checkout'];
                var top = element.offsetTop;
                // console.log(top - 20);
                // window.scrollTo(0, top);
                document.getElementById('resumen-general').scrollIntoView({ behavior:'auto', block:'start', inline:"start" })
            }
            else{
                // window.alert("Ya ha agregado a su carrito entradas para esta misma visita y esta misma fecha")
                $vm.carritoItemTemp = carritoItem;
                $vm.itemDuplicadoAlert = true;
            }
            
            // window.alert("Entradas agregadas al carrito")
            // $vm.$refs['checkout'].focus();
        },
        removeEntrada(){
            let $vm = this;
            // console.log($vm.itemUuid);
            $vm.resumen = [];
            if($vm.itemUuid){
                $vm.$store.commit('removeFromCart', $vm.itemUuid);
                // window.alert("Item eliminado del carrito");
                $vm.itemEliminado = true;
            }

            $vm.total = 0;
            $vm.productoAgregado = false;
        },
        verificarDuplicidad( nuevoItem ){
            let $vm = this;
            let entradas = $vm.$store.getters.itemsInCart;
            let entradasDuplicadas = [];
            entradasDuplicadas = entradas.filter( entrada => {
                if(  ( entrada.itemIDVisita == nuevoItem.itemIDVisita ) && ( entrada.itemFecha == nuevoItem.itemFecha ) ){
                    return true;
                }
                else{
                    return false;
                }
            } )

            if(entradasDuplicadas.length > 0){
                return true;
            }
            else{
                return false;
            }
        },
        goToCastillosYPalacios(){
            let $vm = this;
            $vm.$router.push('/castillos')
        },
        goToCastillos(){
            let $vm = this;
            $vm.$router.push('/castillos/' + $vm.monumentoNombres[0].texto)
        },
        goToCarrito(){
            let $vm = this;
            $vm.$router.push('/carrito')
        },
        goToEntrada(evento){
            let $vm = this;
            // console.log($vm.monumentoNombres[0].texto);
            $vm.$router.push("/castillos/tarifas/" + $vm.monumentoNombres[0].texto + '/' + evento)
        },
        goToEntradas(evento){
            let $vm = this;
            // console.log(evento)
            if($vm.tipoDeEntrada == "Experiencia"){
                $vm.$router.push("/experiencias-exclusivas/" + $vm.monumentoNombres[0].texto)
            }
            else if($vm.tipoDeEntrada == "Evento"){
                $vm.$router.push("/eventos-singulares/" + $vm.monumentoNombres[0].texto)
            }
            else{
                $vm.$router.push("/castillos/tarifas/" + $vm.monumentoNombres[0].texto)
            }
        },
        goToContact(){
            let $vm = this;
            $vm.$router.push({
                name: 'contactReserva',
                query: {
                    monumento: $vm.monumentoNombres[$vm.idiomaIndex].texto,
                    tipo: $vm.tipoDeEntrada,
                    visita: $vm.nombres[$vm.idiomaIndex].texto
                }
            } )
        },
        masRutas(){
            let $vm = this;
            $vm.$router.push("/castillos/rutas/" + $vm.monumentoId)
        },
        // Este evento es disparado cuando se detecta un cambio de mes en el calendario.
        newMonth(event) {
            let $vm = this;
            // console.log(event)
            let today = new Date();
            let fromDate = null;
            let mesActual = today.getMonth() + 1;
            let yearInCourse = today.getFullYear();
            let month = event.month;
            let year = event.year;
            // Si el mes es igual al mes en el que estamos, limitamos la consulta a la fecha actual.
            if(month == mesActual){
                if(yearInCourse == year){
                    fromDate = today;
                }
                else{
                    fromDate = new Date(year, month, 1);
                }
            }
            // Si es un mes superior al actual, pedimos la información desde el primer día del mes
            else if(month > mesActual){
                fromDate = new Date(year, month-1, 1);
            }
            // console.log(fromDate);
            // $vm.getFechas(fromDate)

        },
        getDisponiblidad(){
            
        },
        // Obtenemos las fechas disponibles para el mes con el que se está trabajando
        getFechas(fromDate){
            // let fromDateStandard = fromDate.setHours(0,0,0,0);
            let fromDateStandard = new Date();
            fromDateStandard.setUTCDate(fromDate.getDate());
            fromDateStandard.setUTCMonth(fromDate.getMonth());

            fromDateStandard.setUTCHours(0);
            fromDateStandard.setUTCMinutes(0);
            fromDateStandard.setUTCSeconds(0);
            fromDateStandard.setUTCMilliseconds(0);

            // console.log(fromDateStandard.toUTCString());
            let $vm = this;
                
            $vm.loading = true;
            
            $vm.enabledDates = [];
            // Hacemos la consulta al servidor, le pasamos como datos el idioma, el id de la entrada que queremos conocer y
            // la fecha a partir de la que se quiere consultar, nos va a devolver los valores para dos meses seguidos

            ApiService.getFechaByVisitaId($vm.$i18n.locale, $vm.entradaId2, fromDateStandard)
                .then( result => {
                    $vm.loading = false
                    // La información de dispoinibilidad se utiliza para determinar que fechas se van a marcar como disponibles en el calendario
                    $vm.disponibilidadInfo = [...result.data.fecha];
                    $vm.visitaFirstDate = result.data.visitaExist;
                    // Esta información se utiliza en caso de que la entrada tenga habilitada la compra por horarios
                    $vm.horariosInfo = [...$vm.disponibilidadInfo[0].horarios];

                    // console.log($vm.horariosInfo);

                    $vm.disponibilidadInfo.forEach(element => {
                        let dateObject = {'start': element.fecha, 'end':element.fecha};
                        $vm.enabledDates.push(dateObject);
                    });

                    // console.log($vm.disponibilidadInfo);
                    // El tipo de entrada se muestra en la barra de resultados
                    $vm.tipoDeEntrada = $vm.disponibilidadInfo[0].tipo;

                    // Si es una entrada abierta, la hora de visita puede ser cualquiera y solo hay una
                    // hora en la información devuelta, por lo que se fija la tarifa disponible de manera automática
                    if($vm.disponibilidadInfo[0].horarios.length == 1 && $vm.disponibilidadInfo[0].horarios[0].hora == null){
                        // $vm.precios = $vm.disponibilidadInfo[0].horarios[0].tarifa.precios;
                        $vm.setTarifa($vm.disponibilidadInfo[0].horarios[0]);
                    }

                    // const calendar = $vm.$refs['calendario'];
                    let fecha = null;

                    // calendar.focusDate(new Date())
                    if( $vm.disponibilidadInfo[0].fecha != undefined ){
                        // console.log($vm.disponibilidadInfo);
                        try{
                            $vm.calendar.focusDate($vm.disponibilidadInfo[0].fecha)
                        }
                        catch{
                            console.log($vm.calendar)
                        }
                    }
                    // $vm.selectedDate = $vm.disponibilidadInfo[0].fecha;

                    $vm.cargandoDisponibilidad = false;

                    // document.getElementById('horarios-disponibles').scrollIntoView({ behavior:'auto', block:'start', inline:"start" })
                    
                    // console.log($vm.selected);
                })
                .catch( err=> {
                    $vm.loading = false
                    console.log(err);
                })
        },
        setTarifa(horario){
            let $vm = this;
            $vm.loading = true;
            // console.log("Estoy aquí")
            // console.log("Calculando las tarifas");
            $vm.horarioSelected = horario;

            $vm.visibleTickets = true;

            let preciosTemp = [...horario.tarifa.precios]

            console.log(preciosTemp)

            // console.log(preciosTemp)
            $vm.precios = preciosTemp.filter( precio => { 
                // console.log(precio);
                if( precio.activo == null || precio.activo == true) {
                    return true;
                }
                else{
                    return false;
                }
            } )
            // console.log($vm.precios)

            $vm.selected = []

            $vm.precios.sort( ( a, b ) => {
                return a.orden - b.orden;
            })

            $vm.precios.forEach( item => {
                let precio = $vm.priceCalculator(item.precio);
                let comision = null;
                let descuento = null;

                if($vm.tipoCobro){
                    comision = $vm.comision;
                }
                else{
                    descuento = $vm.comision
                }
                $vm.selected.push({'cantidad':0, descripcion: item.descripciones[$vm.idiomaIndex].texto, tipo_comision:$vm.tipoComision, comision: comision, descuento: descuento, precio: precio, total:0, pvp:(item.precio).toString(), minPersonas: item.minPersonas })
            })

            $vm.precios.forEach( item => {
                console.log(item)
                item.options = [];
                if( item.minPersonas == null || item.minPersonas == 0 ){
                    for( let x = 1; x < 50; x++ ){
                        item.options.push( {'value':x, 'text': x} )
                    }
                }
                else{
                    for( let x = item.minPersonas; x < item.minPersonas + 50 ; x++ ){
                        item.options.push( {'value':x, 'text': x} )
                    }                    
                }
            })

            console.log($vm.precios)
            $vm.loading = false;
            // $vm.precios.forEach( item=>{
            //     // item.precio = item.precio + 1.21;
            //     $vm.selected.push({'cantidad':0, 'pu':item.precio, 'nombre':item.descripciones[$vm.idiomaIndex].texto, 'total':null, tipoComision: $vm.tipoComision, comision: $vm.comision})
            // })

        },
        priceCalculator(precio){
            let $vm = this;
            // console.log($vm.comision);

            if($vm.tipoCobro == true){
                if($vm.tipoComision == 1){
                    return (precio * 0.95) + ($vm.comision * (1 + $vm.iva) )
                }
                else{
                    let porcentajeExtra = precio * ($vm.comision/100);
                    return (precio * 0.95) + ( (porcentajeExtra) * (1 + $vm.iva) )
                }
            }
            else{
                return precio * 0.95;
            }
            // if($vm.tipoCobro == 1){
            //     return precio + ($vm.comision * 1.21);
            // }
            // else if($vm.tipoComision == 0){
            //     return precio;
            // }
            // else if($vm.tipoComision == 6 || $vm.tipoComision == 7){
            //     let comisionP = precio * $vm.comision;
            //     let comisionIva = comisionP * 0.21;

            //     let comisionTotal = comisionP + comisionIva;
            //     return precio + comisionTotal;
            // }
        },
        cancelarOperacion(){
            let $vm = this;
            $vm.itemDuplicadoAlert = false;
            $vm.carritoItemTemp = null;
        },
        duplicarItem(){
            let $vm = this;
    
            $vm.itemDuplicadoAlert = false;

            $vm.$store.commit('addToCart', $vm.carritoItemTemp);
            
            // Esta variable hace que no se puedan agregar más entradas con estos mismos datos
            $vm.productoAgregado = true;
            // Esta entrada hace que el icono de carrito parpadeé para llamar la atención;
            $vm.itemAgregado = true;
            
            var element = this.$refs['checkout'];
            var top = element.offsetTop;

            $vm.carritoItemTemp = null;
            // console.log(top - 20);
            // window.scrollTo(0, top);
            document.getElementById('resumen-general').scrollIntoView({ behavior:'auto', block:'start', inline:"start" })

        },
        daySelected(day){
            let $vm = this;
            // console.log(day);
            let daySelected = new Date(day.id).toUTCString();
            let infoParaFecha = $vm.disponibilidadInfo.filter( fecha => {
                let date1 = new Date(fecha.fecha).toUTCString()

                return date1 == daySelected;
            })
            // console.log(infoParaFecha[0]);
            $vm.horariosInfo = [...infoParaFecha[0].horarios];

            $vm.horarioSelected = null;

            $vm.visibleTickets = false;

            let moreThanOneHour = true;

            if(this.horariosInfo){
                if(this.horariosInfo.length){
                    if(this.horariosInfo[0].hora == null){
                        moreThanOneHour = false;
                        $vm.visibleTickets = true;
                    }
                    else{
                        moreThanOneHour = true;
                    }
                }
                else{
                    $vm.visibleTickets = true;
                    moreThanOneHour = true;
                }
            }

            // console.log($vm.horariosInfo)
            if($vm.horariosInfo.length == 1 && $vm.horariosInfo[0].hora == null){
                // console.log()
                $vm.setTarifa($vm.horariosInfo[0]);
            }
            else{
                $vm.selected = []
                $vm.precios = []
            }
            // console.log($vm.selectedDate)
            if( $vm.selectedDate == null ){
                $vm.visibleDate = true;
                $vm.visibleHours = false;
            }
            else{
                $vm.visibleDate = false;

                if( moreThanOneHour ){
                    $vm.visibleHours = true;
                }
                else{
                    $vm.visibleHours = false;
                }

            }
            // document.getElementById('horarios-disponibles').scrollIntoView({ behavior:'smooth', block:'start' })
            // console.log($vm.horariosInfo);
            // $vm.attrs[0].dates = new Date(day.id);
        },
        validarNumeroEntradas(event, index){
            let $vm = this;
            // console.log(index);
            // console.log($vm.selected)
            // let cantidad = $vm.selected[index].cantidad;
            let cantidad = event;
            let minPersonas = $vm.selected[index].minPersonas;
            if(cantidad > 0){
                // if( event <  )
                if( cantidad == (minPersonas - 1) ){
                    cantidad = 0;
                }
                else if(cantidad < minPersonas){
                    cantidad = minPersonas;
                }
                $vm.selected[index].cantidad = cantidad;

                
                let cantidadTotal = this.selected.map( cant => parseInt(cant.cantidad) ).reduce( (acc, prev) => acc + prev);

                if( cantidadTotal > $vm.horarioSelected.plazas && ($vm.horarioSelected.plazas != 0 && $vm.horarioSelected.plazas != null)){
                    this.selected[index].cantidad = 0;
                }

            }
            else{
                cantidad = 0;
                $vm.selected[index].cantidad = 0;
            }
        },
        /**
         *  
         */
        consultarInfoParaReserva(){
            let $vm = this;
            $vm.entradaId = $vm.$route.params.visitaId;

            ApiService.getEntradaById($vm.entradaId, 'es')
            .then( result=> {
                $vm.nombres = result.data.nombres
                $vm.monumentoNombres = result.data.castilloNombres;
                $vm.monumentoId = result.data.monumentoId;
                $vm.cancelable = result.data.cancelable;
                $vm.tipoDeEntrada = result.data.tipo;
                $vm.entradaId2 = result.data._id;
                // ApiService.getEdificacion()
                $vm.getFechas(new Date())


                ApiService.getComision($vm.monumentoId, $vm.entradaId2)
                    .then( result=> {
                        let condicionComercialMonumento = result.data.condicion_comercial_monumento;
                        let condicionComercialVisita = result.data.condicion_comercial_visita


                        if(condicionComercialVisita.tipoComision != null || condicionComercialVisita.tipoDescuento != null){
                            if(condicionComercialVisita.tipoComision)
                            {
                                $vm.tipoCobro = true;
                                $vm.comision = condicionComercialVisita.tipoComision.valor;
                                $vm.tipoComision = condicionComercialVisita.tipoComision.tipo;
                                if($vm.tipoComision == 1){
                                    $vm.simbolo = '€';
                                }
                                else{
                                    $vm.simbolo = "%";
                                }
                            }
                            else{
                                $vm.tipoCobro = false;
                                $vm.comision = condicionComercialVisita.tipoDescuento.valor
                                $vm.tipoComision = condicionComercialVisita.tipoDescuento.tipo;
                            }
                        }
                        else{
                            if(condicionComercialMonumento.tipoDescuento){
                                $vm.tipoCobro = true;
                                $vm.comision = condicionComercialMonumento.tipoComision.valor;
                                $vm.tipoComision = condicionComercialMonumento.tipoComision.tipo;

                                if($vm.tipoComision == 1){
                                    $vm.simbolo = '€';
                                }
                                else{
                                    $vm.simbolo = "%";
                                }

                            }
                            else{
                                $vm.tipoCobro = false;
                                $vm.comision = condicionComercialMonumento.tipoDescuento.valor;
                                $vm.tipoComision = condicionComercialMonumento.tipoDescuento.tipo;
                            }
                        }

                        return result;
                                                
                    })
                    .catch(err=>{
                        console.log(err);
                        return err;
                    })                
            })
            .catch( err=> {
                console.log(err);
            })

        },
        consultarInfoClorian(){
            let $vm = this;
            let monumento = $vm.$route.query.monumento; 
            let productId = $vm.$route.params.entradaId;

            let today = new Date();
            let tempYear = today.getUTCFullYear();
            let tempMonth = today.getUTCMonth();

            let year = tempYear.toString();

            let month = (tempMonth + 1).toString();

            if( month.length < 2){
                month = '0' + month;
            }

            ClorianService.consultarFechasProducto(productId, monumento, year, month)
            .then( res => {
                console.log(res);
            })
            .catch( err=> {
                console.log(err);
            })
        }

    },
    setup() {
        
    },
    computed: {
        horarios(){
            return this.horariosInfo;
        },
        horariosLimitados(){
            if(this.horariosInfo){
                if(this.horariosInfo.length){
                    if(this.horariosInfo[0].hora == null){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    return true;
                }
            }
            else{
                return true;
            }
            // return false
        },
        selectedIdiomaIndex(){
            let $vm=this;
            let idiomaIndex = 0;
            if($vm.$i18n.locale == 'es'){
                idiomaIndex = 0;
            }
            else if($vm.$i18n.locale == 'en'){
                idiomaIndex = 1;
            }
            else if($vm.$i18n.locale == 'fr'){
                idiomaIndex = 2;
            }
            else if($vm.$i18n.locale == 'de'){
                idiomaIndex = 3;
            }
            return idiomaIndex;
        },
        selectedIdioma(){
            let $vm=this;
            
            return $vm.$i18n.locale;
        },

    },
    async mounted(){
        let $vm = this;
        // $vm.monumentoNombre = $vm.$route.params.monumentoNombre;
        // $vm.monumentoNombre = "Castillo de Belmonte";
        $vm.entradaId = $vm.$route.params.entradaId;

        $vm.calendar = $vm.$refs['calendario'];


        $vm.cargandoDisponibilidad = true;
        // $vm.getFechas(new Date())
        
        let nombreDeMonumentoQuery = $vm.$route.query.monumento;

        if(nombreDeMonumentoQuery == null ){
            await $vm.consultarInfoParaReserva();
            $vm.entradaId = $vm.$route.params.visitaId;

            const entradaInfo = await ApiService.getEntradaById($vm.entradaId, 'es')

            // await ApiService.getEntradaById(entradaInfo.data.monumentoId);

            const result = await ApiService.getVisitas( 'es', entradaInfo.data.monumentoId  )
            this.visitasDisponibles = result.data.map( v => {
                let obj = { text: `${v.oldId} - ${v.nombres[0].texto}`, value: v.oldId }
                return obj;
            } );

            // this.visita = this.visitas[0].value;

        }
        else{
            console.log("Consultar clorian")
            await $vm.consultarInfoClorian();
        }
        
    }
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* -webkit-appearance: none; */
  margin: 0;
}

.horario-selected {
    background-color: rgba(204, 255, 255, 0.5) !important;
}

.circle-icon{
    background: #d3d3d3;
    padding: 10px;
    border-radius: 50%;
}

</style>