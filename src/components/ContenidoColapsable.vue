<template>
    <div class="accordion" role="tablist">
        <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1 w-100" role="tab">
                <div class="d-flex w-100">
                    <b-button class="mx-auto" block 
                    @click="colapsar = !colapsar"                
                    variant="danger">
                        <div class="d-flex" v-bind:class="{'d-none':colapsar}">
                            <b-icon-plus-circle-dotted></b-icon-plus-circle-dotted>
                            <span class="ms-2">Mostrar detalles</span>
                            
                        </div>
                        <div class="d-flex" v-bind:class="{'d-none':!colapsar}">
                            <b-icon-dash-circle-dotted></b-icon-dash-circle-dotted>
                            <span class="ms-2">Menos detalles</span>
                        </div>
                    </b-button>

                </div>
            </b-card-header>

            <mdb-modal :show="colapsar" size="lg" @close="() => colapsar=false">
            <mdb-modal-header class="bg-danger text-white">
                <mdb-modal-title class="title text-white">
                    {{ titulo }}
                </mdb-modal-title>
            </mdb-modal-header>

            <mdb-modal-body>
                <div class="text-start" style="max-height: 75vh; overflow-y: auto;">
                    <div class="text-start px-5">
                        <!-- <mdb-row class="">
                            <p class="section-title">Detalles</p>
                        </mdb-row> -->
                        <span class="d-flex flex-column align-items-start text-start small-text" v-html="details"></span>
                    </div>
                    <hr />
                    <div class="text-start px-5">
                        <mdb-row class="">
                            <p class="section-title">Horarios</p>
                        </mdb-row>
                        <span id="horarios" class="d-flex flex-column align-items-start text-start small-text" v-html="schedule"></span>
                    </div>

                    <hr />

                    <div class="text-start px-5">
                        <mdb-row class="">
                            <p class="section-title">Descripción</p>
                        </mdb-row>
                        <span id="horarios" class="d-flex flex-column align-items-start text-start small-text" v-html="description"></span>
                    </div>
                    <hr />

                    <div class="text-start px-5">
                        <mdb-row class="">
                            <p class="section-title">Descuentos</p>
                        </mdb-row>
                        <span id="horarios" class="d-flex flex-column align-items-start text-start small-text" v-html="discounts"></span>
                    </div>

                </div>
            </mdb-modal-body>

            <mdb-modal-footer>

                <mdb-btn color="indigo darken-4" size="sm" @click=" () => colapsar = false">
                    <div class="d-flex text-white">
                        <p class="my-auto font-weight-bold">Cerrar</p>
                    </div>
                </mdb-btn>

                <mdb-btn color="red darken-4" size="sm" @click="() => $emit( 'comprar' )">
                    <div class="d-flex text-white">
                        <span class="my-auto mr-2">
                            <font-awesome-icon icon="fa-cart-shopping" size="sm"/>
                        </span>
                        <p class="my-auto font-weight-bold">Entradas</p>
                    </div>
                </mdb-btn>
            </mdb-modal-footer>
        </mdb-modal>

            
            <!-- <b-collapse :id="ariaControl" v-model="colapsar" role="tabpanel">
                <b-card-body>
                    <b-card-text>
                        <slot></slot>
                    </b-card-text>
                </b-card-body>
            </b-collapse> -->
        </b-card>
    </div>
</template>

<script>
export default {
    props:{
        ariaControl: String,
        titulo: String,
        description: String,
        schedule: String,
        details: String,
        discounts: String
    },
    data(){
        return{
            colapsar: false
        }
    }
}
</script>