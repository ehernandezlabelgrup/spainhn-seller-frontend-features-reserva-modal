<template>
    <div class="loading-spinner flex-column">
        <img class="spinner-icon" src="../assets/SimboloCastilloRojoCorporativa.svg" alt="Loading Spinner"/>
        <h4>Cargando...</h4>
    </div>
</template>

<script>
</script>

<style scoped>
.loading-spinner{
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba( 255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner-icon{
    animation: spin 1s linear infinite; /* Se corrigió la definición de la animación */
}

@keyframes spin {
    0%{
        transform: rotateY(0deg);
    }
    100% {
        transform: rotateY(360deg);
    }
}

</style>