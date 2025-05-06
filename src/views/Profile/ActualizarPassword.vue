<template>
    <home-layout>
        <mdb-breadcrumb class="py-2 ps-5">
            <mdb-breadcrumb-item><a href="/">INICIO</a></mdb-breadcrumb-item>
            <mdb-breadcrumb-item active>PERFIL</mdb-breadcrumb-item>
        </mdb-breadcrumb>
        <div class="home bg-white container border shadow my-5 py-5" style="min-width:350px;">
            <h3>Cambio de contraseña</h3>
            <mdb-container>
                <form @submit.prevent="updatePassword" class="needs-validation">
                    <div class="d-flex">
                        <div class="my-auto flex-grow-1">
                            <mdb-input type="password" label="Contraseña antigua" outline ref="oldPasswordInput" required
                                v-model="form.oldPassword" />
                        </div>

                    </div>
                    <div class="d-flex">
                        <div class="my-auto flex-grow-1">
                            <mdb-input type="password" label="Nueva contraseña" outline ref="newPasswordInput" required
                                v-model="form.newPassword" />
                        </div>

                    </div>
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <mdb-input type="password" label="Repetir contraseña" outline ref="matchNewPassword" required
                                v-model="form.matchNewPassword" />
                        </div>
                    </div>
                    <mdb-btn :disabled="!isFormValid" type="submit" color="primary">Guardar cambios</mdb-btn>
                </form>
            </mdb-container>
        </div>
        <mdb-alert color="primary" v-if="cambiado" @closeAlert="cambiado = false" dismiss>
            <strong>Contraseña actualizada</strong>
        </mdb-alert>
        <mdb-alert color="error" v-if="error" @closeAlert="error = false" dismiss>
            <strong>{{ errorMessage }}</strong>
        </mdb-alert>

    </home-layout>
</template>

<script>
import ApiSellerService from '../../services/ApiSeller.service';

export default {
    data() {
        return {
            form: {
                oldPassword: '',
                newPassword: '',
                matchNewPassword: '',
            },
            disableOldPassword: true,
            disableNewPassword: true,
            disableMatchPassword: true,
            cambiado: false,
            error: false,
            errorMessage: ''
        }
    },
    computed: {
        isFormValid() {
            return this.form.oldPassword && this.form.newPassword && this.form.matchNewPassword;
        }
    },
    methods: {
        editarPassword() {
            this.disableOldPassword = false;
            this.$refs.oldPasswordInput.focus();
        },
        editarNewPassword() {
            this.disableNewPassword = false,
                this.$refs.newPasswordInput.focus();
        },
        editarMatchPassword() {
            this.disableMatchPassword = false,
                this.$refs.matchNewPassword.focus();
        },
        async updatePassword() {

            try {
                if (this.form.newPassword !== this.form.matchNewPassword) {
                    console.log("No coinciden")
                    this.error = true;
                    this.errorMessage = 'Las contraseñas no coinciden.';
                    return;
                }
                const result = await ApiSellerService.updatePassword(this.form);
                this.cambiado = true;
                this.error = false;

            } catch (err) {
                console.error(err);
                this.error = true;
                this.errorMessage = 'Error al actualizar la contraseña.';
                this.cambiado = false;
            }
        }
    },
}
</script>

<style scoped></style>