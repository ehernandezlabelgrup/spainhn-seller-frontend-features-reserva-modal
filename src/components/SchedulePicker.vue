<template>
    <div class="container-fluid px-0">
        <mdb-card id="horarios-disponibles" class="d-flex pl-0 w-100 container px-0 px-md-0">

            <mdb-card-header class="text-start" style="text-align: start !important">
                <div class="text-start section-title mr-auto my-auto align-items-center">
                    <span class="mt-auto mb-auto"><font-awesome-icon icon="fa-clock" class="mr-2 my-auto"/></span>
                    <span v-bind:class="{'d-none': selectedHour}">{{ $t('default.RESERVATION_CHOOSE_HOUR') }}</span>
                    <span v-bind:class="{'d-none': selectedHour == null}" class="clearfix">
                        <div class="float-right my-auto">
                            {{ selectedHour ? selectedHour : null }}
                            <mdb-btn flat class="ml-3 py-0 px-0" @click="() => show ? show = false: show = true">
                                <font-awesome-icon role="button" class="circle-icon shadow" icon="fa-pen"/>
                            </mdb-btn>                            
                        </div>
                    </span>  
                </div>
            </mdb-card-header>

            <mdb-card-body v-if="show" v-bind:class="{'d-none':!show}" class="animated fadeIn">
                <div class="col-md-7 col-12 mx-auto px-4" style="">
                    <div class="w-100 spainhn-text pt-2 pb-2 px-2"><strong>Seleccione un horario para su visita</strong></div>

                    <div class="d-flex flex-column flex-wrap px-0 gap-2">
                        <mdb-spinner class="mx-auto" big crazy color="blue" v-bind:class="{'d-none': !loading}"/>

                        <div class="d-flex mx-auto px-0" v-for="(horario, index) in horarios" :key="index">
                            <div>
                                <mdb-btn :outline="horario.variant" v-if="!horario.selected" @click="checkIfShouldAskForHour( horario )" :disabled="horario.disabled" >
                                    {{ horario.hora }}
                                </mdb-btn>
                                <mdb-btn disabled color="primary" v-if="horario.selected" @click="checkIfShouldAskForHour( horario )">
                                    {{ horario.hora }}
                                </mdb-btn>
                                <div>
                                    <div v-if="mostrarAforoTexto && horario.plazas > 0">
                                        <small class="text-muted">
                                            {{ $t("default.MENSAJE_AFORO") }}                                    
                                        </small>
                                        <br/>
                                   
                                        <small  class="text-muted">
                                            {{ $t("default.MENSAJE_AFORO") }} <span class="text-danger font-italic">{{ horario.plazasDisponibles }}</span> entradas
                                        </small>
                                       <br />
                                    

                                    </div>
                                    <div v-if="horario.notaDeVenta">
                                        <small class="font-italic text-muted">
                                            <span> {{horario.notaDeVenta}}</span>
                                        </small>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="shouldAskForHour" class="d-flex gap-2 flex-column justify-content-center align-items-center">
                            <label for="appt" class="font-weight-bold">Hora de visita</label>
                            <input class="time-input" v-model="inputTime" id="appt" name="appt"
                            type="time" min="09:00" max="18:00" />
                            <span>Indique la hora de llegada del grupo para que el monumento pueda tenerlo en cuenta</span>
                            <mdb-btn color="primary" :disabled="inputTime == null" @click="setTimeForVisit(inputTime)">
                                <font-awesome-icon icon="fa-check" style="margin-right: 4px;"/> Confirmar
                            </mdb-btn>
                        </div>

                        <div class="mx-auto" v-bind:class="{'d-flex': horarios.length < 1, 'd-none': horarios.length > 0}">
                            <strong>
                                <span class="text-danger"><font-awesome-icon icon="fa-times-circle"/> No hay más horarios disponibles para este día</span>
                            </strong>
                        </div>

                    </div>
                </div>

            </mdb-card-body>

        </mdb-card>
    </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment';
import ApiService from '../services/Calendario.service';
import EventBus from '../event-bus';
export default{
    name:'SchedulePicker',
    moment: moment,
    props: {
        fecha: {
            type: String
        },
        idProducto:{
            type: String
        },
        mostrarAforo: {
            type: Boolean,
        },
        mostrarPlazas: {
            type: Boolean
        },
        idMonumento:{
            type: String
        }
    },
    data(){
        return{
            selectedHour: null,
            inputTime: null,
            selectedData: null,
            shouldAskForHour: false,
            idSelectedHour: null,
            show: false,
            horarios: [],
            loading: false,
            fechaAConsultar: null,
        }
    },
    methods:{
        setTimeForVisit( time ){
            this.selectedData.notesToMonument = time;
            this.setVisitHour( this.selectedData )
        },
        checkIfShouldAskForHour( evt){
            let $vm = this;
            this.horarios.forEach( horario => {
                if( horario.id == evt.id ){
                    horario.selected = true;
                }
                else{
                    horario.selected = false;
                }
                
            });
            if(evt.horaFull === null || evt.hora === "Horario Libre"){
                 $vm.shouldAskForHour = true;
                 $vm.selectedData = evt
            }
            else{
                $vm.shouldAskForHour = false;
                this.setVisitHour( evt )
            }
        },
        setVisitHour( evt ){
            this.selectedHour = evt.hora;
            this.idSelectedHour = evt.id;

            this.show = false;

            this.$store.commit('guardarPlazas', evt.plazasDisponibles);

            // if( evt.plazasDisponibles == null ){
            //     this.$store.commit('guardarPlazas', null);
            // }
            // else{
            // }
            this.$emit( 'getHour', evt )
        },
        async consultarHorariosDeNuevo(){
            this.selectedHour = null;

            const fechaSplitted = this.fecha.split('-');

            fechaSplitted.forEach( part => {
                if( part.length == 1){
                    part = '0' + part;
                }
            })

            const tempFecha = fechaSplitted[0] + "-" + fechaSplitted[1] + "-" + fechaSplitted[2]
            const fechaAConsultar = moment(`${tempFecha}`).startOf('day').format('YYYY-MM-DDTHH:mm:ss')
            this.fechaAConsultar = fechaAConsultar;
            this.loading = true;

            const resultado = await ApiService.consultarHorariosParaFecha( this.idProducto, fechaAConsultar, this.idMonumento )

            this.loading = false;

            const horarios = resultado.data.map( fecha => fecha.horarios ).reduce( (acc, curr) => acc.concat(curr), [] )

            const hoy = moment().format('YYYY-MM-DD');


            const checkTimeout = (this.fecha == hoy);

            const tempHorarios = horarios.filter( horario => horario.pausado != true ).map( horario => {

                let disabled = false;

                let mostrar = true;
                let dentroDeHorario = true;

                if( checkTimeout ){
                    if( horario.hora == null){
                        if( moment().format('HH:mm:ss') > moment( ).utc().hours(18).minutes(0).seconds(0).format('HH:mm:ss') ){
                            disabled = true;
                            dentroDeHorario = false;
                        }
                    }
                    else{
                        if( moment().format('HH:mm:ss') > moment( horario.hora ).utc().format('HH:mm:ss') ){
                            disabled = true;
                            dentroDeHorario = false;
                        }
                    }
                }

                const plazasReservadas = horario.plazasReservadas ?? 0;
                const plazasOcupadas = horario.plazasOcupadas ?? 0

                // if( horario.plazas == 0){
                //     this.$store.commit('guardarPlazas', null);
                // }
                // else{
                //     const plazasDisponibles = horario.plazas - ( plazasReservadas + plazasOcupadas )
                //     this.$store.commit('guardarPlazas', plazasDisponibles);
                // }

                let plazasDisponibles = null;

                if( horario.plazas > 0){
                    plazasDisponibles = horario.plazas - ( plazasReservadas + plazasOcupadas )
                }


                let horaDeInicioValida = true;
                let horaDeCierreValida = true;

                if( horario.horaDeInicio ){

                    const hoy = moment().utc();

                    const fechaComparacion = moment(horario.horaDeInicio).utc()

                    if( hoy < fechaComparacion ){
                        horaDeInicioValida = false;
                    }
                }
                if( horario.horaDeCierre ){
                    const hoy = moment().utc();

                    const fechaComparacion = moment(horario.horaDeCierre).utc()

                    if( hoy > fechaComparacion ){
                        horaDeCierreValida = false;
                    }
                }

                if( horaDeCierreValida && horaDeInicioValida && dentroDeHorario){
                    mostrar = true;
                }
                else{
                    mostrar = false;
                }

                let obj = {
                    horaFull: horario.hora,
                    hora: horario.hora != null ? moment( horario.hora ).utc().format('HH:mm') : "Horario Libre",
                    id: horario._id,
                    plazas: horario.plazas,
                    selected: false,
                    variant: 'danger',
                    tarifa: horario.tarifa,
                    disabled: disabled ? disabled : ( !(horario.plazas == 0) && horario.plazas <= ( plazasReservadas + plazasOcupadas )),
                    plazasReservadas: plazasReservadas,
                    plazasOcupadas: plazasOcupadas,
                    plazasDisponibles: plazasDisponibles,
                    notaDeVenta: horario.notaDeVenta,
                    ocultarStock: horario.mostrarPlazas ? horario.mostrarPlazas : true,
                    fechaDeInicioDeVenta: horario.horaDeCierre,
                    fechaDeFinDeVenta: horario.horaDeInicio,
                    mostrar: mostrar
                }
                return obj;
            });

            // Filter out duplicates based on hora value
            const uniqueHorarios = tempHorarios.filter((horario, index, self) =>
                index === self.findIndex((h) => h.hora === horario.hora)
            ).filter(h => h.mostrar);

            this.horarios = uniqueHorarios;

            if( this.fecha ){
                this.show = true;
            }

        }
    },
    watch:{
        async fecha( fecha ){
            // this.selectedHour = false;
            this.selectedHour = null;

            const fechaSplitted = fecha.split('-');

            fechaSplitted.forEach( part => {
                if( part.length == 1){
                    part = '0' + part;
                }
            })

            const tempFecha = fechaSplitted[0] + "-" + fechaSplitted[1] + "-" + fechaSplitted[2]
            const fechaAConsultar = moment.utc(`${tempFecha}`).startOf('day').format('YYYY-MM-DDTHH:mm:ssZZ')
            this.fechaAConsultar = fechaAConsultar;
            this.loading = true;
            const resultado = await ApiService.consultarHorariosParaFecha( this.idProducto, fechaAConsultar, this.idMonumento )

            this.loading = false;

            const horarios = resultado.data.map( fecha => fecha.horarios ).reduce( (acc, curr) => acc.concat(curr), [] )

            const hoy = moment().utc().format('YYYY-MM-DD');


            const checkTimeout = (fecha == hoy);

            const tempHorarios = horarios.filter( horario => horario.pausado != true ).map( horario => {

                let disabled = false;

                let mostrar = true;
                let dentroDeHorario = true;

                if( checkTimeout ){
                    if( horario.hora == null){
                        if( moment().format('HH:mm:ss') > moment( ).utc().hours(18).minutes(0).seconds(0).format('HH:mm:ss') ){
                            disabled = true;
                            dentroDeHorario = false;
                        }
                    }
                    else{
                        if( moment().format('HH:mm:ss') > moment( horario.hora ).utc().format('HH:mm:ss') ){
                            disabled = true;
                            dentroDeHorario = false;
                        }
                    }
                }

                const plazasReservadas = horario.plazasReservadas ?? 0;
                const plazasOcupadas = horario.plazasOcupadas ?? 0

                // if( horario.plazas == 0){
                //     this.$store.commit('guardarPlazas', null);
                // }
                // else{
                //     const plazasDisponibles = horario.plazas - ( plazasReservadas + plazasOcupadas )
                //     this.$store.commit('guardarPlazas', plazasDisponibles);
                // }

                let plazasDisponibles = null;

                if( horario.plazas > 0){
                    plazasDisponibles = horario.plazas - ( plazasReservadas + plazasOcupadas )
                }


                let horaDeInicioValida = true;
                let horaDeCierreValida = true;

                if( horario.horaDeInicio ){

                    const hoy = moment().utc();

                    const fechaComparacion = moment(horario.horaDeInicio).utc()

                    if( hoy < fechaComparacion ){
                        horaDeInicioValida = false;
                    }
                }
                if( horario.horaDeCierre ){
                    const hoy = moment().utc();

                    const fechaComparacion = moment(horario.horaDeCierre).utc()

                    if( hoy > fechaComparacion ){
                        horaDeCierreValida = false;
                    }
                }

                if( horaDeCierreValida && horaDeInicioValida && dentroDeHorario){
                    mostrar = true;
                }
                else{
                    mostrar = false;
                }

                let obj = {
                    horaFull: horario.hora,
                    hora: horario.hora != null ? moment( horario.hora ).utc().format('HH:mm') : "Horario Libre",
                    id: horario._id,
                    plazas: horario.plazas,
                    selected: false,
                    variant: 'danger',
                    tarifa: horario.tarifa,
                    disabled: disabled ? disabled : ( !(horario.plazas == 0) && horario.plazas <= ( plazasReservadas + plazasOcupadas )),
                    plazasReservadas: plazasReservadas,
                    plazasOcupadas: plazasOcupadas,
                    plazasDisponibles: plazasDisponibles,
                    notaDeVenta: horario.notaDeVenta,
                    ocultarStock: horario.mostrarPlazas ? horario.mostrarPlazas : true,
                    fechaDeInicioDeVenta: horario.horaDeCierre,
                    fechaDeFinDeVenta: horario.horaDeInicio,
                    mostrar: mostrar
                }
                return obj;
            });

            // Filter out duplicates based on hora value
            const uniqueHorarios = tempHorarios.filter((horario, index, self) =>
                index === self.findIndex((h) => h.hora === horario.hora)
            ).filter(h => h.mostrar);

            this.horarios = uniqueHorarios;

            if( fecha ){
                this.show = true;
            }
        }
    },
    computed:{
        plazasDisponibles(){
            return this.$store.getters.espacioParaBoletos;
        },
        mostrarAforoTexto(){
            return this.mostrarAforo ?? false;
        },
        mostrarPlazasTexto(){
            return this.mostrarPlazas ?? false;
        }
    },
    mounted(){
        EventBus.$on('consultarHorarios', this.consultarHorariosDeNuevo)
    }
}
</script>
<style lang="css" scoped>
    .time-input {
        width: 10rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 5px;
    }
</style>
