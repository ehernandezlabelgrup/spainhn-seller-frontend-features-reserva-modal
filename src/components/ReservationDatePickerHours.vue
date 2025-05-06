<template>
    <div class="container-fluid px-0" >
        <mdb-card id="horarios-disponibles" class="d-flex pl-0 w-100 container px-0 px-md-0">
            <mdb-card-header class="text-start" style="text-align: start !important">

                <div class="text-start section-title mr-auto my-auto align-items-center">
                    <slot>
                        <span class="mt-auto mb-auto"><font-awesome-icon icon="fa-calendar" class="mr-2 my-auto"/></span>
                        <span v-bind:class="{'d-none': selectedDate}">{{ $t('default.RESERVATION_CHOOSE_DATE') }}</span>
                        <span v-bind:class="{'d-none': selectedDate == null}" class="clearfix">
                            <div class="float-right my-auto">
                                <span class="font-weight-bold">{{ originalDate ? originalDate.toLocaleDateString('es-ES' ):null }}</span>
                                <span class="font-weight-bold"> - {{ selectedHour ? selectedHour : 'Horario Libre' }}</span>
                                <mdb-btn flat class="ml-3 py-0 px-0" @click="() => show ? show = false: show = true">
                                    <font-awesome-icon role="button" class="circle-icon shadow" icon="fa-pen"/>
                                </mdb-btn>                            
                            </div>
                        </span>
                    </slot>
                </div>

            </mdb-card-header>
            <mdb-card-body v-if="show" v-bind:class="{'d-none': !show}" class="animated fadeIn">
                <div>
                    <vc-date-picker 
                        ref="calendario"
                        is-expanded
                        is24hr
                        @update:to-page="changeMonth($event)"
                        @dayclick="daySelected($event)"
                        v-model="selectedDate"
                        :min-date="minDate"
                        :disabled-dates="[{start: null}]"
                        :available-dates="availableDates"
                        :attributes="attrs"
                        :color="'red'" 
                    />

                    <hour-selector
                        @getHour="setSchedule"
                        :fecha="calendarId"
                        :idEvento="idProducto"
                    />

                    <!-- <schedule-picker
                        v-if="idProducto"
                        @getHour="setSchedule" 
                        :fecha="selectedDate" 
                        :mostrar-aforo="mostrarAforo"
                        :mostrar-plazas="mostrarPlazas"
                        :id-producto="idProducto"/>
 -->
                </div>
            </mdb-card-body>
        </mdb-card>
    </div>
</template>

<script>
import ApiService from '../services/ApiSeller.service';
import CalendarioService from '../services/Calendario.service';
// import SchedulePicker from './SchedulePicker.vue';
import HourSelector from './HourSelector.vue';
import moment from 'moment';

export default {
    name:'ReservationDatePicker',
    components:{
        HourSelector
        // SchedulePicker
    },
    props:{
        idProducto: String,
        initialHour: String,
        initialDate: String,
        initialProduct: String,
    },
    data(){
        return{
            selectedDate: null,
            fechas: [],
            availableDates: [],
            moment: moment,
            attrs: [
                {
                }
            ],
            show: false,
            selectedHour: null,
            originalDate: null,
            selectedHourInfo: null
        }
    },
    methods:{
        setSchedule( evt ){
            this.selectedHourInfo = evt;

            const tempTarifa = {...evt.tarifa}
            const precios = tempTarifa ?  tempTarifa.precios.filter( p => p.web != false ) : [];
            tempTarifa.precios = precios;

            // this.tarifa = evt.tarifa ? evt.tarifa : { precios: [] }
            this.tarifa = tempTarifa ? tempTarifa : { precios: [] }

            this.originalDate = this.selectedDate;

            const payload = {
                tarifa: this.tarifa,
                date: this.originalDate,
                hour: this.selectedHourInfo
            }

            this.show = false;
            this.$emit('getProduct', payload )
        },

        async changeMonth( event ){
            const startDate = moment.utc([ event.year, event.month - 1, 1])

            const today = moment.utc().startOf('day');

            let tempDate = null;
            if( startDate < today ){
                tempDate = today;
            }
            else{
                tempDate = startDate;
            }

            const from = tempDate.format('YYYY-MM-DDTHH:mm:ssZZ');
            const to = tempDate.endOf('month').format( 'YYYY-MM-DDTHH:mm:ssZZ' )

            await this.consultarCalendarioDeFechas( this.idProducto, from, to)
        },
        async consultarCalendarioDeFechas( idVisita, from, to ){

            this.availableDates = [];

            console.log( this.initialDate );
            this.selectedDate = moment(this.initialDate).toDate();

            console.log( this.selectedDate );
            this.calendarId = this.initialDate;

            const calendario = await CalendarioService.consultarDisponibilidadDeFechas( 'es', idVisita, from, to );

            this.fechas = calendario.data.fechas.map( f => {
                let dateObject = {'start': f.fecha, 'end': f.fecha, id: f._id};
                this.availableDates.push(dateObject)
                return moment( f.fecha ).utc().format('YYYY-MM-DD');
            });

            this.fechas.sort( function(a,b){
                return new Date(a) - new Date(b);
            })

            const calendar = this.$refs['calendario'];

            // if( this.fechas[0] ){
            //     calendar.focusDate( new Date( this.fechas[0] ) );
            // }

            return calendario.data
        },

        daySelected( evt ){
            const existe = this.availableDates.filter( d => moment(d.start).utc().format( 'YYYY-MM-DD' ) == evt.id );
            if( existe.length > 0 ){
                this.selectedDate = new Date(evt.id);
                this.calendarId = evt.id;
                // this.show = false;
                // this.$emit('getDate', evt.id)
            }
            else{
                this.$emit('getDate', null)
            }
        }
    },
    async created(){
        const hoy = moment().utc().startOf('day').format('YYYY-MM-DDTHH:mm:ssZZ');
        const endDate = moment().utc().endOf('month').format('YYYY-MM-DDTHH:mm:ssZZ');
        this.selectedHour = this.initialHour; 

        this.originalDate = moment(this.initialDate).toDate();

        await this.consultarCalendarioDeFechas( this.idProducto, hoy, endDate );
    },
    computed:{
        minDate(){
            return new Date();
        }
    }
}
</script>