<template>
    <monumento-layout>

        <section class="text-uppercase">
            <mdb-breadcrumb class="breadcrumb-with-double-arrows mt-2 py-2 ps-md-3">
                <mdb-breadcrumb-item><a href="/">Inicio </a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/tablero`">{{monumentoNombre}}</a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item><a :href="`/${$route.params.monumentoNombre}/productos`" > visitas </a></mdb-breadcrumb-item>
                <mdb-breadcrumb-item active>Reservar</mdb-breadcrumb-item>
            </mdb-breadcrumb>
        </section>


        <div class="text-center mt-2">
            <p class="spainhn-title-text">{{monumentoNombre}}</p>
        </div>
  
        <b-spinner style="position:absolute; z-index:2; left: 40%; top:30%; width: 10rem; height: 10rem;" variant="danger" v-bind:class="{'d-none':!loading}"></b-spinner>
  
        <div class="container-fluid px-5 mt-4 mb-4" v-bind:class="{'d-none':( (visitaFirstDate == null) )}">
  
          <div class="container-fluid mt-4" id="horarios-disponibles">

            <mdb-card class="d-flex pe-0 w-100 container px-0 px-md-0 shadow">
                
                <mdb-view class="d-flex my-auto py-3 px-3">

                    <div class="text-start">
                        <div class="justify-content-start">
                            <p class="text-muted">Nombre de visita</p>
                            <b-select class="py-2 px-3" :options="visitasDisponibles" v-model="entradaId" @change="reloadReservar"></b-select>
                        </div>

                        <mdb-input label="REFERENCIA DE DISTRIBUIDOR" class="mt-5" v-model="referenciaDistribuidor" outline/>
                    </div>

                </mdb-view>

            </mdb-card>
            
            <mdb-row class="my-2">
                <reservation-date-picker
                    v-if="idProducto"
                    @getDate="setDate"
                    :id-producto="idProducto" >
                </reservation-date-picker>
            </mdb-row>
  
            <mdb-card class="d-flex pe-0 w-100 container px-0 px-md-0" narrow>
                <mdb-view class="d-flex my-auto py-3 px-3">
                    <div class="text-start h-100">
                        <font-awesome-icon icon="fa-calendar" class="fa-2x ms-2 my-auto"/>
                    </div>
                    <div class="d-flex my-auto" v-bind:class="{'d-none':selectedDate}">
                        <p class="my-auto ms-3 fw-bold">Fecha para tu reserva</p>
                    </div>

                    <div class="d-flex ms-auto" v-bind:class="{'d-none':selectedDate == null}">
                        <div class="d-flex my-auto">
                            <div class="ms-auto d-flex">
                                <p class="my-auto fw-bold">{{ selectedDate ? selectedDate.toLocaleDateString('es-ES', { timeZone:'UTC'} ):null }}</p>
                            </div>
                            <div class="ms-3">
                                <font-awesome-icon role="button" v-b-toggle.calendar class="circle-icon shadow" icon="fa-pen"/>
                            </div>
                        </div>
                    </div>
                </mdb-view>
                <mdb-card-body>
                    <b-collapse id="calendar" class="border-top mt-2" style="border-color: rgb(165, 61, 57) !important; border-width: 2px !important;" v-model="visibleDate">
                      <div class="col-md-6 col-12 mx-auto mt-4 p-md-3">
                          <strong>{{ $t('default.CART_INSTRUCTIONS_1') }}</strong>
                          <vc-date-picker :color="'red'" @update:to-page="newMonth($event)" :disabled-dates="[{ start: null }]" :timezone="'UTC'" :available-dates="enabledDates"
                              v-model='selectedDate' is-expanded @dayclick="daySelected($event)" ref="calendario" is24hr :min-date="new Date()"/>
  
                      </div>
                  </b-collapse>
                </mdb-card-body>
  
              </mdb-card>
              
              <div class="d-flex pe-0 w-100">
                  <div class="text-start pt-3 pe-3" style="width:100%">
                      <!-- <h4 class="my-auto pb-0 mb-0 spainhn-title" role="button"><strong> {{monumentoNombres[idiomaIndex].texto}}</strong> </h4>
                      <h5 class="mb-0"><strong class="spainhn-subtitle">{{nombres[idiomaIndex].texto}}</strong></h5> -->
                  </div>
              </div>
  
              <b-card class="d-flex pe-0 w-100 container">
                  <div class="d-flex my-auto pb-3">
                      <div class="text-start h-100">
                          <font-awesome-icon icon="fa-clock" class="fa-2x ms-2 my-auto"/>
                      </div>
                      <div class="d-flex my-auto" v-bind:class="{'d-none':horarioSelected}">
                          <p class="my-auto ms-3 fw-bold">Hora de visita</p>
                      </div>
  
                      <div class="d-flex ms-auto" v-bind:class="{'d-none':horarioSelected == null}">
                          <div class="d-flex my-auto">
                              <div class="ms-auto d-flex">
                                  <!-- <p class="text-start" v-bind:class="{'d-none':horariosLimitados}"><small class="spainhn-small-text">{{ $t('default.CART_STEP1_NOTES_1') }}<br>({{ $t('default.CART_STEP1_NOTES_2') }})</small></p> -->
                                  <p class="text-start my-auto"><strong>
                                      {{horarioParaResumen}}
                                  </strong></p>
                              </div>
                              <div class="ms-3">
                                  <font-awesome-icon role="button" v-b-toggle.hours class="circle-icon shadow" icon="fa-pen"/>
                              </div>
                          </div>
                      </div>
                  </div>
  
                  <b-collapse id="hours" class="border-top mt-2" style="border-color: rgb(165, 61, 57) !important; border-width: 2px !important;" v-model="visibleHours">
                      <div class="col-md-7 col-12 mx-auto px-4" style="">
                          <div class="w-100 spainhn-text pt-2 pb-2 px-2"><strong>Seleccione un horario para su visita</strong></div>
                          <!-- <vc-calendar v-model="selectedDate" :attributes="attrs" is-expanded></vc-calendar> -->
  
                          <div class="d-flex flex-wrap">
  
                              <div class="d-flex py-2 my-2 mx-md-2 mx-auto" v-for="(horario, index) in horarios" v-bind:key="index" v-bind:class="{'d-none':( horario.hora == null || loadingSchedule == true )}">
                                  <div style="background-color:#fcf8e3; width:100%" class="text-start py-2 px-4" v-bind:class="{'horario-selected':isThisHorarioSelected(horario.hora)}">
                                      <mdb-btn color="indigo" size="lg" @click="setTarifa(horario)" class="spainhn-button my-auto" v-bind:class="{'fa-bounce':(horarioSelected == null) }"  :disabled="(horario.pausado == true)">
                                          <font-awesome-icon icon="fa-clock" v-bind:class="{'fa-shake':(horarioSelected == null)}" size="1x"></font-awesome-icon>
                                          {{new Date(horario.hora).toLocaleTimeString( 'es-ES', {'timeZone':'UTC', hour:'2-digit', minute:'2-digit' } )}}
                                      </mdb-btn> 
                                      <small class="spainhn-text my-auto ms-2 w-100"><span v-bind:class="{'d-none':!mostrarAforo}">{{ $t("default.MENSAJE_AFORO") }}</span> <strong v-bind:class="{'d-none':!mostrarPlazas}">{{ $t("default.MENSAJE_AFORO2") }}
                                          <span class="text-danger">{{ getPlazasDisponibles(horario.plazas, horario.plazasOcupadas, horario.plazasReservadas) }}</span> entradas</strong><span> {{horario.notaDeVenta}}</span> </small>
                                  </div>
                              </div>
  
                          </div>
  
                          <div v-bind:class="{'d-none':( horarios.length > 0 || loadingSchedule == true )}">
                              <p class="text-danger">No hay más horarios disponibles para esta fecha</p>
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
  
  
              <mdb-card class="d-flex pe-0 w-100 container px-0 px-md-0" narrow>
                  <!-- <div class="d-flex my-auto pb-3"> -->
                    <mdb-view class="d-flex my-auto py-3 px-3">
                        <div class="text-start h-100">
                          <font-awesome-icon icon="fa-ticket" class="fa-2x ms-2 my-auto"/>
                      </div>
                      <div class="d-flex my-auto" v-bind:class="{'d-none':getTicketsAmount > 0}">
                          <p class="my-auto ms-3 fw-bold">¿Cuántas personas vienen?</p>
                      </div>
  
                      <div class="d-flex ms-auto" v-bind:class="{'d-none': getTicketsAmount == 0}">
                          <div class="d-flex my-auto">
                              <div class="ms-auto d-flex">
                                  <!-- <p class="text-start" v-bind:class="{'d-none':horariosLimitados}"><small class="spainhn-small-text">{{ $t('default.CART_STEP1_NOTES_1') }}<br>({{ $t('default.CART_STEP1_NOTES_2') }})</small></p> -->
                                  <p class="text-start my-auto">
                                      <strong>{{getTicketsAmount}}</strong>
                                  </p>
                              </div>
                              <div class="ms-3">
                                  <font-awesome-icon role="button" v-b-toggle.tickets class="circle-icon shadow" icon="fa-pen"/>
                              </div>
                          </div>
                      </div>

                    </mdb-view>
                  <!-- </div> -->
  
                  <b-collapse id="tickets" class="border-top mt-2" style="border-color: rgb(165, 61, 57) !important; border-width: 2px !important;" v-model="ticketsVisible">
  
                      <div class="col-12 col-md-12 col-lg-6 ps-2 mb-4 mx-auto" v-bind:class="{'d-none':loading}">
                          <div class="w-100 spainhn-text pt-2 pb-2 px-2"><strong>Seleccione el número de tickets que necesita</strong></div>
                          <!-- <div class="w-100 pe-3 text-wrap text-start spainhn-small-text"><small>{{ $t('default.CART_STEP2_NOTES_1') }}</small></div> -->
                          <!-- <div class="w-100 pe-3 text-wrap text-start spainhn-small-text" v-bind:class="{'d-none':!tipoCobro}"><small>{{ $t("default.MENSAJE_PRECIOS_INCLUYEN") }} {{comision}}{{simbolo}} {{ $t("default.MENSAJE_EN_CONCEPTO") }} </small></div> -->
                          <div v-bind:class="{'d-none':!precios.length}" id="precios-disponibles">
  
                              <div class="d-flex flex-wrap text-start border-top border-bottom py-2" v-for="(precio, index) in precios" v-bind:key="index">
                                  <div class="w-50 d-flex flex-column">
                                      <strong class="spainhn-text">{{precio.descripciones[idiomaIndex] ? precio.descripciones[0].texto : ""}}</strong>
                                      <small class="spainhn-text">{{(priceCalculator(precio.precio)).toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 } ) }} €</small>
                                  </div>
                                  <div class="d-flex">
                                      <b-form-spinbutton size="sm" class="text-center" 
                                          :min="0"
                                          v-model="selected[index].cantidad" :disabled="productoAgregado"
                                          @input="validarNumeroEntradas($event, index, selected[index].cantidad)"></b-form-spinbutton>
                                  </div>
                              </div>
  
                              <div class="clearfix">
                                  <mdb-btn color="" v-bind:class="{'d-none':!precios.length}" class="spainhn-button mt-3 mb-2 ms-auto float-right" size="lg" @click="editarResumen" :disabled="productoAgregado || !getTicketsAmount"><strong>{{ $t('default.SPAINHN_BUTTON_ADD_CART') }}</strong></mdb-btn>  
                              </div>
  
                          </div>
                          <!-- Este botón agrega las entradas al carrito -->
                          
  
                          <div v-bind:class="{'d-none':precios.length}" class="mt-2 border px-3 py-4 border-warning mb-3" style="background-color:#fcf8e3">
                              <div class="row">
                                  <div class="col-md-2 col-12 my-auto">
                                      <div class="d-flex">
                                      <font-awesome-icon class="my-auto text-warning mx-auto" icon="fa-circle-exclamation" size="3x"></font-awesome-icon>
                                      </div>
                                  </div>
                                  <div class="col-10 mx-auto">
                                      <p><strong class="text-spainhn my-auto">{{ $t("default.MENSAJE_SELECCIONAR_HORARIO") }}</strong></p>
                                  </div>
                              </div>
                          </div>                   
                    </div>
  
  
                  </b-collapse>
              </mdb-card>
  
              <div class="d-flex pe-0 w-100">
                  <div class="text-start pt-3 pe-3" style="width:100%">
                      <!-- <h4 class="my-auto pb-0 mb-0 spainhn-title" role="button"><strong> {{monumentoNombres[idiomaIndex].texto}}</strong> </h4>
                      <h5 class="mb-0"><strong class="spainhn-subtitle">{{nombres[idiomaIndex].texto}}</strong></h5> -->
                  </div>
              </div>
  
              <b-card class="d-flex pe-0 w-100 container">
                  <div class="d-flex my-auto pb-3">
                      <div class="text-start h-100">
                          <font-awesome-icon icon="fa-check" class="fa-2x ms-2 my-auto"/>
                      </div>
                      <div class="d-flex my-auto">
                          <p class="my-auto ms-3 fw-bold">Finaliza tu pedido</p>
                      </div>
  
                  </div>
  
                  <b-collapse id="checkout" class="border-top mt-2" style="border-color: rgb(165, 61, 57) !important; border-width: 2px !important;" v-model="visibleCheckout">
  
  
                      <div class="w-100 d-flex border-bottom py-4">
                          <h3 class="text-start ms-auto me-2 text-muted fw-bold my-auto">{{ $t('default.CART_STEP3_TOTAL') }}</h3>
                          <h4 class="px-3 h-100 fw-bold my-auto">{{ total.toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFractionDigits:2 } ) }} €</h4>
                      </div>
  
                      <div class="clearfix">
                          <mdb-btn color=""  class="float-right spainhn-button" size="lg" @click="goToCarrito">
                              <div class="py-2">
                                  <font-awesome-icon size="3x" class="mb-3" icon="fa-cart-shopping"></font-awesome-icon>
                                  <p class="spainhn-text" style="font-size:16pt; font-weight:600;">{{ $t('default.CART_INSTRUCTIONS_4_OPTION3') }}</p>
                              </div>
                          </mdb-btn>
                      </div>
  
                  </b-collapse>
              </b-card>
  
            </div>

        </div>
  
        <b-modal v-model="reservaCancelada" id="mensajes" class="col-md-4 col-md-offset-4 col-xs-8 col-xs-offset-2" hide-footer hide-header>
            <div class="col-xs-12" style="text-align: right;">
                <button @click="() => reservaCancelada = false" type="button">
                    <img src="@/assets/close.svg" width="14px" height="14px">
                </button>
            </div>
            <p class="alert sys-message" role="alert"></p>
            <div class="col-xs-12 justify-content-center">
                <div class="d-flex">
                    <img class="mx-auto" src="@/assets/cancel-face.svg" width="50px" height="50px">
                </div>
                <div class="d-flex">
                    <p class="mx-auto spainhn-text">Se ha cancelado la reserva correctamente</p>
                </div>
                <div class="d-flex">
                    <mdb-btn color="" class="mx-auto spainhn-button" @click="() => reservaCancelada = false">Aceptar</mdb-btn>
                </div>
            </div>
        </b-modal>
        <success-alert :show="itemAgregado" @close="cerrarConfirmacion" :mensaje="'Se agregaron las entradas a su carrito'"></success-alert>
        <error-alert :show="itemEliminado" @close="() => itemEliminado = false" :mensaje="'Se han eliminado entradas de su carrito'"></error-alert>
        <error-alert :cancel="true" :carrito="true" :show="itemDuplicadoAlert" @close="duplicarItem" @cancelar="cancelarOperacion" :mensaje="'Ya tiene otra entrada para la misma fecha y misma visita. \n¿Desea Continuar?'" />
    </monumento-layout>
  </template>
  
  <script>
  import ApiService from '../services/ApiSeller.service';
  import SuccessAlert from '../components/SuccessAlert.vue';
  import ErrorAlert from '../components/ErrorAlert.vue';
  import ClorianService from '../services/ClorianService';
  import { v4 as uuidv4 } from 'uuid';
  import ReservationDatePicker from '../components/ReservationDatePicker.vue';
  
  import moment from 'moment'
    
  export default {
    components:{
    SuccessAlert,
    ErrorAlert,
    ReservationDatePicker
  },
    data(){
        return{
            visitasDisponibles: null,
            selectedDate:null,
            monumentoNombres: [{texto:""}, {texto:""}, {texto:""}, {texto:""}],
            enabledDates:[],
            monumentoId: null,
            visitaId: null,
            nombres: [{texto:""}, {texto:""}, {texto:""}, {texto:""}],
            idiomaIndex:0,
            precios:[],
            resumen:[],
            selected:[],
            eventosRecomendados:[],
            tipoDeEntrada: "Tarifas",
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
            baseTotalMayorista:0,
            comisionTotal:0,
            comisionTotalMayorista: 0,
            descuentoTotal: 0,
            condicionComercial: null,
            descuentoComercial: null,
            tipoCobro: true,
            iva:0.21,
            cancelable: false,
            loading:true,
            loadingSchedule: false,
            imagenesUrl: null,
            simbolo: "%",
            productoAgregado: false,
            itemAgregado: false,
            itemEliminado: false,
            carritoItemTemp: null,
            itemDuplicadoAlert: false,
            mostrarAforo: false,
            reservaCancelada: false,
            mostrarPlazas: false,
            clorianRatesInfo: null,
            dateSelected: new Date(),
            clorian: false,
            pos: null,
            visibleDate: true,
            visibleHours: false,
            ticketsVisible: false,
            visibleCheckout: false,
            entradaId2: null,
            entradaId: null,
            tipoDeDescuento: null,
            descuento: null,
            nombreDeVisita: null,
            monumentoNombre:null,
            referenciaDistribuidor: ""
        }
    },
    mounted(){
        this.imagenesUrl = process.env.VUE_APP_IMAGES_URL;
    },
    methods:{

        async reloadReservar(evt){
            let $vm = this;

            $vm.loading = true;

            $vm.selectedDate = null;

            $vm.horarioSelected = null;

            $vm.resumen = [];

            $vm.selected = [];

            $vm.visibleDate = true;

            $vm.visibleHours = false;

            $vm.ticketsVisible = false;

            $vm.visibleCheckout = false;

            $vm.cargandoDisponibilidad = true;

            $vm.entradaId = $vm.$route.params.visitaId;

            $vm.$router.push(`/${$vm.$route.params.monumentoNombre}/reservar/visita:${evt}`)
            await $vm.consultarInfoParaReserva();

            const entradaInfo = await ApiService.getEntradaById($vm.entradaId, 'es')

            $vm.nombreDeVisita = $vm.visitasDisponibles.filter( visita => visita.value === $vm.entradaId ).map( v => v.text );


        },

        // Or create a reusable function
        padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        },
        convertMsToTime(milliseconds) {
            let seconds = Math.floor(milliseconds / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
  
            seconds = seconds % 60;
            minutes = minutes % 60;
  
            // 👇️ If you don't want to roll hours over, e.g. 24 to 00
            // 👇️ comment (or remove) the line below
            // commenting next line gets you `24:00:00` instead of `00:00:00`
            // or `36:15:31` instead of `12:15:31`, etc.
            hours = hours % 24;
  
            return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(seconds)}`;
        },
        
        getPlazasDisponibles(plazas, plazasOcupadas, plazasReservadas){
            if(plazas != null){
                // console.log("Estoy aquí")
                let ocup = plazasOcupadas ?? 0;
                let reserv = plazasReservadas ?? 0;
  
                if(reserv < 0){
                    reserv = 0;
                }

                return plazas - ocup - reserv;
            }
            else{
                return 'Sin límite'
            }
        },
  
        cerrarConfirmacion(){
            let $vm = this;
            $vm.itemAgregado = false;
        },
  
        isThisHorarioSelected(hora){
            let $vm = this;
            if( $vm.horarioSelected ){
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
  
            let valorAnterior = this.selected[index].cantidad;
  
            if (newValue < 0) {
                // this.$emit('input', 0)
                this.selected[index].cantidad = 0;
            } else {
                // this.$emit('input', newValue)
                let prev = this.selected[index].cantidad;
                this.selected[index].cantidad = newValue;
  
                // console.log(this.selected);
  
                let cantidadTotal = this.selected.map( cant => cant.cantidad).reduce( (acc, prev) => acc + prev);
  
                let plazasOcupadas = $vm.horarioSelected.plazasOcupadas ?? 0;
  
                let plazasReservadas = $vm.horarioSelected.plazasReservadas ?? 0;
  
                if( cantidadTotal > ( $vm.horarioSelected.plazas - plazasOcupadas - plazasReservadas) && ($vm.horarioSelected.plazas != 0 && $vm.horarioSelected.plazas != null ) ){
                    
                    this.selected[index].cantidad = prev;
                }
            }            
            this.validarNumeroEntradas( this.selected[index].cantidad, index, valorAnterior );
        },
  
        // Guarda el elemento en el carrito, podemos utilizar el id de la fecha para identificar las entradas
        async editarResumen(){
            let $vm = this;
  
            // Aquí se guardan los tipos de entradas que quiere adquirir el cliente
            $vm.resumen = [];
            
            // Selected es la variable que guarda el número seleccionado de entradas para cada una de los diferentes
            // precios
            $vm.selected.map( item => {
  
                // console.log(item);
                if(item.cantidad > 0){
                    $vm.resumen.push(item);
                    let importeBase = null;
                    if(typeof item.pvp === "string"){
                        importeBase = item.cantidad * parseFloat(item.pvp);
                    }
                    else{
                        importeBase = item.cantidad * item.pvp
                    }

                    if( this.simbolo === '%'){
                        item.comisionMayorista = importeBase * this.comision / 100;
                    }
                    else{
                        item.comisionMayorista = item.cantidad * this.comision;
                    }

                    item.importeBase = importeBase.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } );
                    item.total = item.cantidad * item.precio;

                }
            })
  
            // Así calculamos el total de la compra si hay más de una tarifa seleccionada
            if($vm.resumen.length > 1){
                $vm.total = $vm.resumen.map( resumen => resumen.total ).reduce((acc, prev) => {
                    return acc + prev;
                })
                $vm.baseTotal = $vm.resumen.map( resumen => resumen.importeBase ).reduce((acc, prev) => {
                    if(typeof acc === "string"){
                        return parseFloat(acc.replace(',', '.')) + parseFloat(prev.replace(',', '.'));
                    }
                    else{
                        return acc + parseFloat(prev.replace(',', '.'));
                    }
                })

                let descuento = 0;
                let comision = 0;

                // if( this.tipoDeDescuento === 'porcentaje'){
                //     descuento = this.descuento * precio / 100;
                // }
                // else{
                //     descuento = this.descuento;
                // }

                if(this.tipoDeDescuento === 'porcentaje'){
                    this.baseTotalMayorista = this.baseTotal * ( 1 - ( this.descuento / 100 ) );
                }
                else{
                    this.baseTotalMayorista = this.baseTotal - this.descuento;
                }

            }
  
            // En caso de que solo se haya comprado un tipo de ticket, entonces se utilizará este monto como el total
            else{
                $vm.total = $vm.resumen[0].total;
                $vm.baseTotal = parseFloat($vm.resumen[0].importeBase);
                // $vm.comisionTotal = parseFloat($vm.resumen[0].comision);
            }
            
            this.ticketsVisible = false;
  
            this.visibleCheckout = true;
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

        async goToCarrito(){
            let $vm = this;
  
            // Luego tenemos que ver si se trata de una venta con comisión o si se trata de una venta sin comisión
            if( $vm.condicionComercial ){
                $vm.comisionTotal = parseFloat($vm.total - $vm.baseTotal);
            }
            else{
                $vm.comisionTotal = 0;
            }
  
            // En caso de que se haya escogido una reserva con descuento comercial, se calcula, si no se asigna el valor de 0
            $vm.descuentoTotal = $vm.descuentoComercial ? ($vm.descuentoComercial.valor/100 * ($vm.total)) * (1 + $vm.iva):0
  
            // Creamos el identificador único de esta reserva
            $vm.itemUuid = uuidv4()
  
            let comisionComercial = null;
            let descuentoComercial = null;
  
            if($vm.tipoCobro == true){
                comisionComercial = $vm.comision;
            }
            else{
                descuentoComercial = null;
            }
  
            let itemId = null
            
            // Está condición sirve para interactuar con clorian, si la url contiene el nombre del monumento, entonces, se trata de una url relacionada con clorian
  
            let nombreDeMonumentoQuery = $vm.$route.query.monumento;
  
            if( nombreDeMonumentoQuery ){
                itemId = $vm.horarioSelected.eventId;
            }
            else{
                itemId = $vm.horarioSelected._id
            }
  
            let carritoItem = {
                itemID: $vm.clorian == false ? itemId : null,
                itemClorianID: $vm.clorian ? itemId : null,
                itemIDVisita: $vm.entradaId2,
                itemUuid:$vm.itemUuid, 
                itemComisionTotal: $vm.comisionTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } ),
                itemDescuentoTotal: $vm.descuentoTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } ),
                itemBaseTotal: $vm.baseTotal.toLocaleString('es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } ),
                itemBaseTotalMayorista: this.baseTotalMayorista.toLocaleString( 'es-ES', { maximumFractionDigits:2, minimumFracionDigits:2 } ),
                itemComisionMayorista: this.comisionTotalMayorista,
                itemHorario: $vm.horarioSelected.hora, 
                itemFecha: $vm.selectedDate, 
                itemTotal: $vm.total, 
                itemTickets: $vm.resumen, 
                itemVisita: $vm.nombres, 
                itemMonumento: $vm.monumentoNombres,
                itemMonumentoId: $vm.monumentoId,
                itemComision: $vm.comision,
                itemDescuento: $vm.descuento,
                itemTipoCobro: $vm.tipoCobro,
                itemComisionPorcentaje: $vm.tipoComision,
                totalDePersonas: $vm.getTicketsAmount,
                cancelable: $vm.cancelable,
                seguroCancelacion: false,
                montoCancelacion: 0,
                timestamp: new Date(),
                pos: $vm.pos,
                carritoUuid: null,
                accionDePago: 'reservar',   
                referenciaDistribuidor: this.referenciaDistribuidor,
                idioma: null,
                ocultarPrecio: false
            }
    
            const preReservas = [ 
                { 
                    uuid: carritoItem.itemUuid, 
                    pax: carritoItem.itemTickets.map( item => item.cantidad ).reduce( (acc, prev) => acc + prev, 0 ), 
                    eventoId: $vm.clorian == false ? carritoItem.itemID : null, 
                } ]
  
            const carritoObjItem = {
                uuid: uuidv4(),
                status: false,
                preReservas: preReservas,
            }            
  
            await $vm.$store.dispatch( 'addToCart', carritoItem );    
                
            carritoItem.carritoUuid = $vm.$store.getters.cartStatus.uuid;

            await $vm.consultarInfoParaReserva();

            // Esta variable hace que no se puedan agregar más entradas con estos mismos datos
            $vm.productoAgregado = true;
            // Esta entrada hace que el icono de carrito parpadeé para llamar la atención;
            $vm.itemAgregado = true;
            
  
            $vm.$router.push(`/${this.$route.params.monumentoNombre}/reservar/resumenCompra`)
        },

        goToEntrada(evento){
            let $vm = this;
            $vm.$router.push("/castillos/tarifas/" + $vm.monumentoNombres[0].texto + '/' + evento)
        },

        goToEntradas(evento){
            let $vm = this;
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
                    // visita: $vm.nombres[$vm.idiomaIndex].texto
                }
            } )
        },

        // Este evento es disparado cuando se detecta un cambio de mes en el calendario.
        newMonth(event) {
            let $vm = this;
            // console.log(event);
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
            else{
                fromDate = new Date(year, month-1, 1);
            }
  
            let nombreDeMonumentoQuery = $vm.$route.query.monumento;
  
            $vm.getFechas(fromDate)                    
  
        },

        // Obtenemos las fechas disponibles para el mes con el que se está trabajando
        getFechas(fromDate){
            let fromDateStandard = new Date();
            fromDateStandard.setUTCDate(fromDate.getDate());
            fromDateStandard.setUTCMonth(fromDate.getMonth());
  
            fromDateStandard.setUTCHours(0);
            fromDateStandard.setUTCMinutes(0);
            fromDateStandard.setUTCSeconds(0);
            fromDateStandard.setUTCMilliseconds(0);
  
            fromDateStandard.setUTCFullYear(fromDate.getFullYear());
  
            let $vm = this;
                
            $vm.loading = true;
            
            $vm.enabledDates = [];
            $vm.precios = [];
  
            // Hacemos la consulta al servidor, le pasamos como datos el idioma, el id de la entrada que queremos conocer y
            // la fecha a partir de la que se quiere consultar, nos va a devolver los valores para dos meses seguidos
            ApiService.getFechaByVisitaId($vm.$i18n.locale, $vm.entradaId2, fromDateStandard)
                .then( result => {

                    $vm.loading = false
                    // La información de dispoinibilidad se utiliza para determinar que fechas se van a marcar como disponibles en el calendario
                    $vm.disponibilidadInfo = [...result.data.fecha];
  
                    // $vm.disponibilidadInfo.horarios
  
                    $vm.disponibilidadInfo = $vm.disponibilidadInfo.sort( function(a,b){
                        return new Date( a.fecha ) - new Date( b.fecha );
                    } )

                    // $vm.visitaFirstDate = result.data.visitaExist;
                    $vm.visitaFirstDate = result.data.visitaExist;
    
                    // Esta información se utiliza en caso de que la entrada tenga habilitada la compra por horarios
  
                    let tempHorariosInfo = null;
                      
                    let now = moment();
  
                    $vm.disponibilidadInfo.forEach(element => {
                        let dateObject = {'start': element.fecha, 'end':element.fecha};
                        let horariosDisponibles = []
  
                        let now = moment();
                        horariosDisponibles = element.horarios.filter( horario => {
                            if(horario.horaDeCierre){
                                if( moment.utc(horario.horaDeCierre).isBefore(now) ){
                                    return false
                                }
                                else{
                                    return true;
                                }
                            }
                            else{
                                return true;
                            }
  
                        } )
  
                        if(horariosDisponibles.length > 0){
                            $vm.enabledDates.push(dateObject);
                        }
                    });
  
                    // El tipo de entrada se muestra en la barra de resultados
                    $vm.tipoDeEntrada = $vm.disponibilidadInfo[0] ? $vm.disponibilidadInfo[0].tipo:$vm.tipoDeEntrada;
  
                    let todayIsOk = true;
                    // Si es una entrada abierta, la hora de visita puede ser cualquiera y solo hay una
                    // hora en la información devuelta, por lo que se fija la tarifa disponible de manera automática
                    if($vm.disponibilidadInfo[0]){
                        if($vm.disponibilidadInfo[0].horarios.length == 1 && $vm.disponibilidadInfo[0].horarios[0].hora == null){
                            let now = moment();
                            const lastHour = $vm.disponibilidadInfo[0].horarios.length - 1
                            const horario = $vm.disponibilidadInfo[0].horarios[lastHour]; 
                            if( horario.horaDeCierre ){
                                if( moment.utc(horario.horaDeCierre).isAfter(now) ){
                                  todayIsOk = true;
                                }
                                else{
                                    todayIsOk = false;
                                }
                            }
                        }
                    }
                    const calendar = $vm.$refs['calendario'];
  
                    let fecha = null;
  
                    if(todayIsOk){
                        // console.log("ok")
                        fecha = $vm.disponibilidadInfo[0] ? $vm.disponibilidadInfo[0].fecha:null;
                        tempHorariosInfo = $vm.disponibilidadInfo[0]?[...$vm.disponibilidadInfo[0].horarios]:[];
                    }
                    else{
                        fecha = $vm.disponibilidadInfo[1] ? $vm.disponibilidadInfo[1].fecha:null;
                        tempHorariosInfo = $vm.disponibilidadInfo[1]?[...$vm.disponibilidadInfo[1].horarios]:[];
                    }
  
                    $vm.horariosInfo = tempHorariosInfo.filter( hora => {
                        if(hora.horaDeCierre){
                            // console.log("Revisar hora de cierre");
                            console.log(hora.horaDeCierre)
                            if( moment.utc(hora.horaDeCierre).isBefore(now) ){
                                // console.log("Ya no se puede vender")
                                return false
                            }
                            else{
                                // console.log("Todavía se puede vender")
                                return true;
                            }
                        }
                        else if(hora.hora){
                            // console.log(moment(daySelected));
                            // console.log()

                            console.log($vm.disponibilidadInfo)
                            let date = moment.utc($vm.disponibilidadInfo[0].fecha).format("YYYY-MM-DD");
                            // console.log(date);
                            // console.log(now.format('YYYY-MM-DD'))
  
                            let horario = moment.utc(hora.hora).format("HH:mm:ss");
                            let newHour = moment(date + "T" + horario)
  
                            // console.log(newHour.format("YYYY-MM-DDTHH:mm:ss"));
  
                            if(now.format("YYYY-MM-DD") === date){
                                // console.log("revisar disponibilidad");
                                var isAfter = moment(newHour).isAfter(now);
                                return isAfter;
  
                            }
                            else{
                                // console.log("Esta visita no es para hoy")
                                return true
                            }
                            // console.log(moment(hora.hora))
                        }
                        else{
                            return false;
                        }
                    })
    
                    $vm.selectedDate = fecha ? new Date(fecha):null;
  
                    if(fecha){
                        calendar.focusDate( new Date(fecha) );
                    }
  
                    this.selectedDate = null;
                    // calendar.focusDate(new Date())
                    $vm.cargandoDisponibilidad = false;
                    // document.getElementById('horarios-disponibles').scrollIntoView({ behavior:'auto', block:'start', inline:"start" })
                    
                })
                .catch( err=> {
                    $vm.loading = false
  
                    console.log(err);
                })
        },
        setTarifa(horario){
            let $vm = this;
  
            // console.log(horario);
            $vm.loading = true;
            // console.log("Calculando las tarifas");
            $vm.horarioSelected = horario;
  
            this.visibleHours = false;
  
            $vm.ticketsVisible = true;
            // console.log($vm.horarioSelected);
            
            let nombreDeMonumentoQuery = $vm.$route.query.monumento;
  
            // Esto quiere decir que el monumento está configurado para funcionar con clorian
            if( nombreDeMonumentoQuery ){
  
                let preciosTemp = $vm.clorianRatesInfo;
  
                console.log($vm.clorianRatesInfo);
                $vm.precios = preciosTemp.map( precio => {
                    return {
                        descripciones: [{ texto: precio.shortName }, { texto: precio.shortName }, { texto: precio.shortName }, { texto: precio.shortName }],
                        buyerTypeId: precio.buyerTypeId,
                        precio: parseFloat(precio.price)
                    }
                })
  
                // console.log($vm.precios);
                $vm.selected = [];
  
                $vm.precios.forEach( item => {
                    let precio = item.precio;
                    let comision = null;
                    let descuento = null;
  
                    if($vm.tipoCobro){
                        comision = $vm.comision;
                    }
                    else{
                        descuento = $vm.comision
                    }
  
                    $vm.selected.push({'cantidad':0, buyerTypeId:item.buyerTypeId, descripcion: item.descripciones[$vm.idiomaIndex].texto, tipo_comision:$vm.tipoComision, comision: comision, descuento: descuento, precio: precio, total:0, pvp:item.precio, minPersonas: 1 })
                })
  
            }
  
            else{
                let preciosTemp = [...horario.tarifa.precios]
  
                $vm.precios = preciosTemp.filter( precio => { 
                    if( (precio.activo == null || precio.activo == true) && (precio.web == null || precio.web == true) && (precio.mayoristas == null || precio.mayoristas == true)) {
                        return true;
                    }
                    else{
                        return false;
                    }
                } )
  
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
  
                    // console.log($vm.condicionComercial);
                    // console.log($vm.descuentoComercial);
  
                    comision = $vm.condicionComercial ? $vm.condicionComercial.valor:null;
    
                    descuento =$vm.descuentoComercial ? $vm.descuentoComercial.valor:null;
                    $vm.selected.push({'cantidad':0, descripcion: item.descripciones[$vm.idiomaIndex].texto, tipo_comision:$vm.tipoComision, comision: comision , descuento: descuento, precio: precio, total:0, pvp:(item.precio).toString(), minPersonas: item.minPersonas })
                })
            }
  
            $vm.loading = false;
  
        },
        priceCalculator(precio){
            let $vm = this;
            
            let descuento = 0;
            let comision = 0;

            if( $vm.tipoDeDescuento === 'porcentaje'){
                descuento = this.descuento * precio / 100;
            }
            else{
                descuento = this.descuento;
            }

            if(this.simbolo === '%'){
                comision = this.comision * precio / 100;
            }
            else{
                comision = this.comision
            }

            const resultado = precio - descuento + comision;
            return resultado;
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
            // document.getElementById('resumen-general').scrollIntoView({ behavior:'auto', block:'start', inline:"start" })
  
        },
  
        async getEventListClorian(productId, date){
            let $vm = this;
  
            $vm.loadingSchedule = true;
            ClorianService.consultarListaDeEventos(productId, date, $vm.monumentoNombres[0].texto)
                .then( res => {
  
                    console.log(res.data);
                    $vm.horariosInfo = res.data.eventos.events[0].venueCapacityList.map( horarios => horarios.eventList);
  
                    console.log($vm.horariosInfo);
                    $vm.horariosInfo = $vm.horariosInfo[0];
                    // $vm.horarioSelected = {
                    //     _id: $vm.horariosInfo.venueId,
                    //     hora: $vm.horariosInfo.hora
                    // }
                    if( $vm.horariosInfo.length == 1 && $vm.horariosInfo.hora == null){
                        $vm.setTarifa($vm.horariosInfo[0]);
                    }
  
                    $vm.horariosInfo.map( horario => {
                        console.log(horario)
                        let hora = parseInt(horario.startDatetime);
                        /* console.log(new Date(hora).toISOString().slice(11, 19));
  
                        console.log($vm.convertMsToTime(hora)); */
  
                        let fullHora = $vm.dateSelected.valueOf() + hora;
                        horario.plazas = Number(horario.capacity)
                        horario.plazasOcupadas = Number(horario.capacity) - Number(horario.totalAvailability)
                        //horario.hora = moment(fullHora).format("YYYY-MM-DDTHH:mm:ss")
                        horario.hora = new Date(hora * 1000).toISOString()
                    })
  
                    console.log($vm.horariosInfo)
  
                    if($vm.horariosInfo[0].plazas > 0){
                        $vm.mostrarPlazas = true;
                        $vm.mostrarAforo = true;
                    }
  
                    $vm.loadingSchedule = false;
                })
                .catch( err=> {
                    $vm.loadingSchedule = false;
                    console.log(err);
                })
            
        },
  
        async getPricingForEvent(productId, date){
            let $vm = this;
            ClorianService.getPricingForEvent(productId, date, $vm.monumentoNombres[0].texto)
                .then( res => {
                    console.log(res)
                })
                .catch( err=> {
                    console.log(err);
                })
            
        },
  
        async daySelected(day){
            let $vm = this;
            let daySelected = new Date(day.id).toUTCString();
  
            this.visibleDate = false;
            this.visibleHours = true;
  
            $vm.loadingSchedule = true;
  
            let nombreDeMonumentoQuery = $vm.$route.query.monumento;
            $vm.precios = [];
            if(nombreDeMonumentoQuery){
                let daySelected = new Date(day.id);
  
                daySelected = moment(day.id).startOf('day').format('DD/MM/YYYY')
  
                $vm.dateSelected = moment(day.id).startOf('day');
  
                console.log("Consultando en clorian");
                await $vm.getEventListClorian($vm.entradaId, daySelected, $vm.monumentoNombres[0].texto)
  
                $vm.loadingSchedule = false;
                // await $vm.getPricingForEvent($vm.entradaId, daySelected);
            }
            else{
                let infoParaFecha = $vm.disponibilidadInfo.filter( fecha => {
                    let date1 = new Date(fecha.fecha);
                    date1.setUTCHours(0);
                    let dateString = date1.toUTCString();
                    return dateString == daySelected;
                })
  
                let tempHorariosInfo = [...infoParaFecha[0].horarios];
                // $vm.horariosInfo = [...infoParaFecha[0].horarios];
  
                // console.log(daySelected);
  
                let now = moment();
  
                // console.log(now);
                $vm.horariosInfo = tempHorariosInfo.filter( hora => {
                    if(hora.hora){
                        // console.log(moment(daySelected));
                        // console.log()
                        let date = moment.utc(daySelected).format("YYYY-MM-DD");
                        // console.log(date);
                        // console.log(now.format('YYYY-MM-DD'))
  
                        let horario = moment.utc(hora.hora).format("HH:mm:ss");
                        let newHour = moment(date + "T" + horario)
  
                        // console.log(newHour.format("YYYY-MM-DDTHH:mm:ss"));
  
                        if(now.format("YYYY-MM-DD") === date){
                            // console.log("revisar disponibilidad");
                            var isAfter = moment(newHour).isAfter(now);
                            return isAfter;
  
                        }
                        else{
                            console.log("Esta visita no es para hoy")
                            return true
                        }
                        // console.log(moment(hora.hora))
                    }
                    else{
                        return true;
                    }
                })
  
                $vm.horarioSelected = null;
  
                if($vm.horariosInfo.length == 1 && $vm.horariosInfo[0].hora == null){
                    $vm.setTarifa($vm.horariosInfo[0]);
                    // $vm.loading = false;
                }
                else{
                    $vm.selected = []
                    $vm.precios = []
                }
                $vm.loadingSchedule = false;
            }
  
            // document.getElementById('horarios-disponibles').scrollIntoView({ behavior:'smooth', block:'start' })
        },
        
        validarNumeroEntradas(event, index, valorAnterior){
            let $vm = this;
            let cantidad = event;
  
            let _valorAnterior = valorAnterior;
  
            // console.log(this.precios.length)
            // console.log(cantidad);
            let plazasOcupadas = 0;
            if($vm.horarioSelected.plazasOcupadas != null){
                plazasOcupadas = $vm.horarioSelected.plazasOcupadas;
            }
  
            let plazasReservadas = $vm.horarioSelected.plazasReservadas ?? 0;
  
            let minPersonas = $vm.selected[index].minPersonas;
            // console.log(minPersonas)
            if(cantidad > 0){
              //   $vm.selected[index].cantidad = cantidad;
                let tempCantidad = 0;
  
                if( typeof( cantidad ) === "string" ){
                    tempCantidad = parseInt(tempCantidad);
                }
                else{
                    tempCantidad = cantidad;
                }
  
                // console.log(tempCantidad)
                // if( event <  )
                if( tempCantidad == (minPersonas - 1) ){
                    cantidad = 0;
                    tempCantidad = cantidad;
                }
                else if(cantidad < minPersonas){
                    cantidad = minPersonas;
                    console.log(cantidad);
                    tempCantidad = cantidad;
                }
  
                if(tempCantidad < minPersonas){
                  tempCantidad = 0;
                }
  
                $vm.selected[index].cantidad = tempCantidad;
                
                let cantidadTotal = this.selected.map( cant => parseInt(cant.cantidad) ).reduce( (acc, prev) => acc + prev);
  
                if( cantidadTotal > ($vm.horarioSelected.plazas - plazasOcupadas - plazasReservadas) && ($vm.horarioSelected.plazas != 0 && $vm.horarioSelected.plazas != null)){
                    this.selected[index].cantidad = 0;
                }
  
            }
            else{
              console.log("Estoy aquí")
                cantidad = 0;
                $vm.selected[index].cantidad = 0;
            }
        },
        /**
         * Preguntamos las condiciones comerciales específicas que este monumento carga a 
         * este mayorista, considerando la visita que se quiere reservar. Además,
         * obtenemos la comisión que cobra spainhn a este mayorista
         */
        async consultarCondicionesComerciales(){
            let $vm = this;
            const condiciones = await ApiService.getComision( $vm.monumentoId, $vm.entradaId2)
            console.log(condiciones.data);
            return condiciones.data;
        },
        /**
         * Obtenemos la lista de visitas que están disponibles para este monumento;
         */
        async getVisitas( monumentoId ){
            let $vm = this;
            let resultado =  await ApiService.getVisitas( 'es', monumentoId);
            const visitasDisponibles = resultado.data.map( v=> {
                let obj = { text: `${v.nombres[0].texto}`, value: v.oldId }
                return obj;
            })

            return visitasDisponibles;
        },
        /**
         *  Consultamos la información para la reserva
         */
        async consultarInfoParaReserva(){
            let $vm = this;

            // Obtenemos la entrada
            $vm.entradaId = $vm.$route.params.visitaId;

            const entradaResult = await ApiService.getEntradaById($vm.entradaId, 'es');
            const entradaInfo = entradaResult.data;

            $vm.nombres = entradaInfo.nombres;
            $vm.monumentoNombres = entradaInfo.castilloNombres;
            $vm.monumentoId = entradaInfo.monumentoId;
            $vm.cancelable = entradaInfo.cancelable;
            $vm.tipoDeEntrada = entradaInfo.tipo;
            $vm.mostrarAforo = entradaInfo.mostrarAforo;
            $vm.mostrarPlazas = entradaInfo.mostrarPlazas;
            $vm.entradaId2 = entradaInfo._id;

            const condicionesComerciales = await $vm.consultarCondicionesComerciales();

            const { tipoComisionSpainhn, spainhn, descuentoComercial, tipoDescuento } = condicionesComerciales;

            this.simbolo = tipoComisionSpainhn !== 'porcentaje' ? '€' : '%';

            this.comision = spainhn;

            this.descuento = descuentoComercial;

            this.tipoDeDescuento = tipoDescuento;

            // console.log(condicines)
            
            $vm.getFechas( new Date() );
  
        },
        async consultarProductDetails(){
            let $vm = this;
            let monumento = $vm.$route.query.monumento; 
            let productId = $vm.$route.params.entradaId;
            $vm.pos = $vm.$route.query.pos;
            
            let tarifas = null;
            ClorianService.consultarDetallesProducto( productId, monumento, $vm.pos )
            .then( res => {
                $vm.nombres[0].texto = res.data.productDetails.product.name
                tarifas = res.data.productDetails.buyerTypeList;
                // $vm.pos = res.data.pos
                $vm.clorianRatesInfo = tarifas;
            }) 
            .catch( err => {
                console.log(err);
            })
        },
        async consultarInfoClorian( queryMonth ){
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
  
            if( queryMonth ){
  
                month = (queryMonth).toString();
  
                if( month.length < 2){
                    month = '0' + month;
                }
            }
  
            $vm.loading = true;
            // Consultamos la disponiblidad para este mes
            ClorianService.consultarFechasProducto(productId, monumento, year, month)
            .then( res => {
                //$vm.nombres[0].texto = res.data.eventos ? res.data.eventos.events[0].name: $vm.nombres[0].texto;
  
                var clorianAvailableDates = [];
                // Convertimos las fechas
                var clorianFullDates = Object.keys(res.data.fechasDisponibles);
  
                clorianFullDates.forEach( element => {
                    if(res.data.fechasDisponibles[element] === "availability"){
                        clorianAvailableDates.push( element );
                    }
                } )
                // Comparamos a partir del día de hoy
                var today = new Date();
  
                today = moment(today).startOf('day').format('YYYY-MM-DD');
                $vm.visitaFirstDate = clorianAvailableDates[0];
  
                $vm.enabledDates = [];
                clorianAvailableDates.forEach( element => {
  
                    let tempDate = moment(element).format('YYYY-MM-DD');
  
                    if(tempDate >= today ){
                        let dateObject = { 'start':element, 'end': element }
                        $vm.enabledDates.push(dateObject)
                    }
                } )
  
                $vm.loading = false;
            })
            .catch( err=> {
                $vm.loading = false;
                console.log(err);
            })
        }
  
    },
    setup() {
        
    },
    computed: {
      compraStepper(){
  
          const fecha = this.selectedDate ? 'Visita con fecha de ' + this.selectedDate.toLocaleDateString('es-ES', {'timeZone':'UTC'}): this.$t('default.CART_STEP_1')
          const steps = [
              { name: fecha },
              { name: this.$t('default.CART_STEP1_NOTES_2')  },
              { name: this.$t('default.CART_INSTRUCTIONS_2') },
              { name: this.$t('default.CART_INSTRUCTIONS_3') }
          ]
  
          return steps;
      },
  
      horarioParaResumen(){
          const hora = this.horarioSelected ? this.horarioSelected.hora ? new Date(this.horarioSelected.hora).toLocaleTimeString( 'es-ES', {'timeZone':'UTC', hour:'2-digit', minute:'2-digit' } ): "Horario Libre":"" 
          return hora;
      },
  
      getTicketsAmount(){
          let personas = this.selected.map( item => item.cantidad ).reduce( (acc, curr) => acc + curr, 0 )
          return personas;
      },  
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
    async created(){
        let $vm = this;
        // $vm.monumentoNombre = $vm.$route.params.monumentoNombre;
        // $vm.monumentoNombre = "Castillo de Belmonte";
        $vm.entradaId = $vm.$route.params.visitaId
        
        $vm.calendar = $vm.$refs['calendario'];
  
        $vm.cargandoDisponibilidad = true;
        
        let nombreDeMonumentoQuery = $vm.$route.query.monumento;

        this.monumentoNombre = this.$route.params.monumentoNombre.replaceAll('-', ' ');

  
        if(nombreDeMonumentoQuery == null ){
            await $vm.consultarInfoParaReserva();

            $vm.visitasDisponibles = await $vm.getVisitas( $vm.monumentoId );

            $vm.nombreDeVisita = $vm.visitasDisponibles.filter( visita => visita.value == $vm.entradaId ).map( v => v.text );
        }
        else{
            await $vm.consultarProductDetails();
            $vm.consultarInfoClorian();
            $vm.monumentoNombres[0].texto = nombreDeMonumentoQuery
            $vm.clorian = true;
        }
  
        if($vm.$route.query.cancel){
            // window.alert("Ups... algo salió mal")
            $vm.reservaCancelada = true;
        }
        
    }
  }
  </script>
  
  <style scoped>
    
  .warning-block {
    position: fixed;
    z-index: 9;
    background: white;
    padding: 30px;
    box-shadow: 0px 0px 9px 3px #d6d6d6;
    margin-top: 100px;
  }
  
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
  /* -webkit-appearance: none; */
  margin: 0;
  }
  
  /* Firefox */
  /* input[type=number] {
  -moz-appearance: textfield;
  } */
  
  .horario-selected {
    background-color: rgba(204, 255, 255, 0.5) !important;
  }
  </style>