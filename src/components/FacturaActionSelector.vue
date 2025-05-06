<template>
    <div>
        <mdb-select v-model="acciones"/>
    </div>
</template>

<script>
export default {
    data() {
        return{
            acciones : [
                { text: 'Ver Factura', value: 0 },
            ]
        }
    },
}
</script>