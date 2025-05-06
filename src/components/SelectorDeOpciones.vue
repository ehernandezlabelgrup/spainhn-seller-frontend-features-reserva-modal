<template>
    <div>
        <select v-bind:value="opcionElegida" v-on:select="$emit('input', $event.target.value)" class="custom-select">
            <slot>

            </slot>
        </select>
    </div>
</template>

<script>
    export default {
        props: ['opcionElegida'],
    }
</script>

<style scoped>
.custom-select{
  width: 100%;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
}
</style>