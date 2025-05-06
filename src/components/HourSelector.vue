<template>
    <div class="container-fluid px-0">

        <div class="col-md-7 col-12 mx-auto px-4 animated fadeIn">
            <div class="w-100 spainhn-text pt-2 pb-2 px-2"><strong>Seleccione un horario para su visita</strong></div>

            <div class="d-flex flex-wrap px-0">
                <mdb-spinner class="mx-auto" big crazy color="blue" v-bind:class="{'d-none': !loading}"/>

                <div class="d-flex mx-auto px-0" v-for="(horario, index) in horarios" :key="index">
                    <div>
                        <mdb-btn :outline="horario.variant" v-bind:class="{'d-none': horario.selected}" @click="setVisitHour( horario )" :disabled="horario.disabled" >
                            {{ horario.hora }}
                        </mdb-btn>
                        <mdb-btn disabled color="primary" v-bind:class="{'d-none': !horario.selected}" @click="setVisitHour( horario )">
                            {{ horario.hora }}
                        </mdb-btn>
                        <div>
                            <small v-bind:class="{'d-none': !(mostrarAforoTexto && horario.plazas > 0)}" class="text-muted">
                                {{ $t("default.MENSAJE_AFORO") }}                                    
                            </small>
                            <br/>

                            <small v-bind:class="{'d-none': !(mostrarPlazasTexto && horario.plazas > 0)}" class="text-muted">
                                {{ $t("default.MENSAJE_AFORO") }} <span class="text-danger font-italic">{{ horario.plazasDisponibles }}</span> entradas
                            </small>

                            <br />
                            <small class="font-italic text-muted">
                                <span> {{horario.notaDeVenta}}</span>
                            </small>
                            <br/>
                        </div>
                    </div>
                </div>

                <div class="mx-auto" v-bind:class="{'d-flex': horarios.length < 1, 'd-none': horarios.length > 0}">
                    <strong>
                        <span class="text-danger"><font-awesome-icon icon="fa-times-circle"/> No hay más horarios disponibles para este día</span>
                    </strong>
                </div>

            </div>
        </div>

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
        idEvento:{
            type: String
        },
        mostrarAforo: {
            type: Boolean,
        },
        mostrarPlazas: {
            type: Boolean
        }
    },
    data(){
        return{
            selectedHour: null,
            idSelectedHour: null,
            show: false,
            horarios: [],
            loading: false,
            fechaAConsultar: null
        }
    },
    methods:{
        setVisitHour( evt ){
            this.selectedHour = evt.hora;
            this.idSelectedHour = evt.id;

            this.horarios.forEach( horario => {
                if( horario.id == evt.id ){
                    horario.selected = true;
                }
                else{
                    horario.selected = false;
                }
                
            })
            this.show = false;

            this.$store.commit('guardarPlazas', evt.plazasDisponibles);

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
            const fechaAConsultar = moment.utc(`${tempFecha}`).startOf('day').format('YYYY-MM-DDTHH:mm:ssZZ')
            this.fechaAConsultar = fechaAConsultar;
            this.loading = true;
            const resultado = await ApiService.consultarHorariosParaFecha( this.idEvento, fechaAConsultar )

            this.loading = false;

            const horarios = resultado.data.map( fecha => fecha.horarios ).reduce( (acc, curr) => acc.concat(curr), [] )

            const hoy = moment().utc().format('YYYY-MM-DD');


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

            this.horarios = tempHorarios.filter( h => h.mostrar);

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
            const resultado = await ApiService.consultarHorariosParaFecha( this.idEvento, fechaAConsultar )

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

            this.horarios = tempHorarios.filter( h => h.mostrar);

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
    async mounted(){
        EventBus.$on('consultarHorarios', this.consultarHorariosDeNuevo)

        await this.consultarHorariosDeNuevo();
    }
}
</script>
