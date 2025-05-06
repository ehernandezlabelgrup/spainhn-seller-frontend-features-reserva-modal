<template>
    <div class="container-fluid px-0" >
        <mdb-card id="horarios-disponibles" class="d-flex pl-0 w-100 container px-0 px-md-0">
            <mdb-card-header class="text-start" style="text-align: start !important">

                <div class="text-start section-title mr-auto my-auto align-items-center">
                    <span class="mt-auto mb-auto"><font-awesome-icon icon="fa-calendar" class="mr-2 my-auto"/></span>
                    <span v-bind:class="{'d-none': selectedDate}">{{ $t('default.RESERVATION_CHOOSE_DATE') }}</span>
                    <span v-bind:class="{'d-none': selectedDate == null}" class="clearfix">
                        <div class="float-right my-auto">
                            {{ selectedDate ? selectedDate.toLocaleDateString('es-ES', { timeZone:'UTC'} ):null }}
                            <mdb-btn flat class="ml-3 py-0 px-0" @click="() => show ? show = false: show = true">
                                <font-awesome-icon role="button" class="circle-icon shadow" icon="fa-pen"/>
                            </mdb-btn>                            
                        </div>
                    </span>
                    
                </div>

            </mdb-card-header>
            <mdb-card-body v-if="show" v-bind:class="{'d-none': !show}" class="animated fadeIn">
                <vc-date-picker 
                    ref="calendario"
                    is-expanded
                    is24hr
                    @update:to-page="changeMonth($event)"
                    @dayclick="daySelected($event)"
                    v-model="selectedDate"
                    :min-date="minDateData"
                    :disabled-dates="[{start: null}]"
                    :available-dates="availableDates"
                    :attributes="attrs"
                    :timezone="'UTC'"
                    :color="'red'" 
                    />
            </mdb-card-body>
        </mdb-card>
    </div>
</template>

<script>
import ApiService from '../services/ApiSeller.service';
import CalendarioService from '../services/Calendario.service';
import moment from 'moment';

export default {
    name:'ReservationDatePicker',
    props:{
        idProducto: String,
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
            show: true,
            minDateData: null,
            setDefaultDateFlag: true
        }
    },
    methods:{
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

            const calendario = await CalendarioService.consultarDisponibilidadDeFechas( 'es', idVisita, from, to );

            const calendar = this.$refs['calendario'];

            if(calendario.data.fechas.length == 0 && this.setDefaultDateFlag){
                calendar.move(new Date(calendario.data.visitaExist.fecha));
                this.setDefaultDateFlag = false;
                return null;
            }

            this.minDateData = new Date(calendario.data.visitaExist.fecha);
            

            this.fechas = calendario.data.fechas.map( f => {
                let dateObject = {'start': f.fecha, 'end': f.fecha, id: f._id};
                this.availableDates.push(dateObject)
                return moment( f.fecha ).utc().format('YYYY-MM-DD');
            });

            this.fechas.sort( function(a,b){
                return new Date(a) - new Date(b);
            })


            if( this.fechas[0] ){
                calendar.focusDate( new Date( this.fechas[0] ) );
            }

            return calendario.data
        },

        daySelected( evt ){
            const existe = this.availableDates.filter( d => moment(d.start).utc().format( 'YYYY-MM-DD' ) == evt.id );
            if( existe.length > 0 ){
                this.selectedDate = new Date(evt.id);
                this.show = false;
                this.$emit('getDate', evt.id)
            }
            else{
                this.$emit('getDate', null)
            }
        }
    },
    async created(){
        const hoy = moment().utc().startOf('day').format('YYYY-MM-DDTHH:mm:ssZZ');
        const endDate = moment().utc().endOf('month').format('YYYY-MM-DDTHH:mm:ssZZ');
        await this.consultarCalendarioDeFechas( this.idProducto, hoy, endDate );
    },
    computed:{
        minDate(){
            return this.minDateData;
        }
    }
}
</script>