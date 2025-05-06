<template>
    <div :style="{ 'backgroundImage': image }" class="card my-auto mx-2 mt-2" @click="goToMicrosite">
        <div class="container">
            <button class="round-button" @click.stop.prevent="emitAction" :disabled="disableButton" 
            v-bind:class="{'favorite': favorite, 'no-favorite': !favorite}">
                <mdb-icon :icon="icon" />
            </button>
            <div class="card-body">
                <div class="overflow-hidden d-flex pt-auto" style="height:150px;">
                    <strong class="mt-auto mx-auto spainhn-text">{{ monument }}</strong>
                </div>
                <div class="d-flex">
                    <div class="mx-auto my-1">
                        <button role="button" size="sm" class="fw-bold mdb-color custom-btn my-2"
                            @click.stop.prevent="goToMicrositeBuy" style="z-index: 1">
                            Comprar/Reservar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Cards2',
    props: {
        imageUrl: String,
        bloqueado: Boolean,
        monument: String,
        idMonumento: String,
        text: String,
        nombreUrl: String,
        favorite: { type: Boolean, default: false },
        autorizado: { type: String, default: 'Waiting' },
        EstadoDeSolicitud: String
    },
    data() {
        return {
            status: false
        };
    },
    methods: {
        goToMicrosite() {
            this.$router.push('/' + this.encodedUrl + '/tablero');
        },
        goToMicrositeBuy(event) {
            console.log("Aquí");
            this.$router.push('/' + this.encodedUrl + '/productos');
        },
        emitAction() {
            let action = null;
            // if( this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'None' ){
            //   action = 'Enviar_Solicitud';
            // }
            action = 'Agregar_Favorito';
            this.actions(action);
        },
        actions(action) {
            switch (action) {
                case 'Enviar_Solicitud':
                    return this.$emit('enviarSolicitudAprobacion', { idMonumento: this.idMonumento, monumento: this.monument })
                case 'Agregar_Favorito':
                    return this.$emit('toggleFavorite')
            }
        },
        showText() {
            this.status = true;
        },
        hideText() {
            this.status = false;
        },
        addToFavorite() {
            this.$emit('toggleFavorite')
        },
        sendAproveRequest() {
            const payload = {
                idMonumento: this.idMonumento,
                monumento: this.monument
            }
            this.$emit('enviarSolicitudAprobacion', payload);
        }

    },
    computed: {
        image() {
            let urlEncoded = encodeURI(this.imageUrl);
            return `url(${urlEncoded})`;
        },
        encodedUrl() {
            let rawName = this.nombreUrl.replaceAll(',', '');
            rawName = rawName.replaceAll('.', '');
            let nombreNormalizado = rawName.normalize("NFD").replace(/[\u0300-\u036f]|[^0-9a-zA-Z]+[\u0020]/g, '');
            let nombreNormalizadoLowerCase = nombreNormalizado.toLowerCase().replace(/[\u0020]/g, '-');
            return nombreNormalizadoLowerCase;
        },
        icon() {
            // return
            if (this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'None') {
                return 'paper-plane'
            }
            else if (this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'Sent') {
                return 'paper-plane'
            }
            // else if( this.autorizado === 'Ok' && this.Favorite === false ){
            //   return 'heart'
            // }
            else if (this.autorizado === 'Ok') {
                return 'heart';
            }
            // Para volver al estado anterior, quitar este comentario
            // return 'paper-plane';
            return 'heart'
        },
        disableButton() {
            if (this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'Sent') {
                return true
            }

            return false;
        },
        isFavorite() {
            return this.favorite;
        },
        permitido() {
            if (this.autorizado === 'Ok') {
                return false
            }
            else {
                return true;
            }
        },
        buttonColor() {
            if (this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'Sent') {
                return 'light-blue'
            }
            else if (this.autorizado === 'Ok' && this.favorite === false) {
                return 'danger'
            }
            else if (this.autorizado === 'Ok' && this.favorite === true) {
                return 'deep-orange'
            }
            else {
                return 'primary'
            }
        },


    }
};
</script>

<style scoped>
.card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    border-radius: 10px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    align-items: center;
    height: 20rem;
    width: 20rem;
    min-width: 250px;
    padding: 0;
}

.card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0px 0px;
    height: 100%;
    border-radius: 10px;
}

.card-body {
    height: 40%;
    padding: 0% 5%;
    padding-bottom: 2%;
    padding-top: 5%;
    background-color: rgba(206, 0, 0, 0.7);
    color: white;
    border-radius: 0px 0px 10px 10px;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    overflow: hidden;
}

.title-text {
    width: 100%;
    height: 100%;
    white-space: wrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    margin-top: auto;
}

.buy-ticket {
    color: white;
    text-align: center;
    font-family: 'Montserrat';
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.custom-btn {
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    border-radius: 12px;
    color: white;
}

.label-visit {
    background-color: var(--spainhn-rojo-spainhn) !important;
}

.label-paquete {
    background-color: var(--spainhn-pack-color) !important;
}

.round-button {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
}

.round-button:hover {
    background-color: #e91e63;
}

.favorite {
    background-color: #FF8A65;

}

.no-favorite{
    background-color: #BDBDBD;
}
</style>