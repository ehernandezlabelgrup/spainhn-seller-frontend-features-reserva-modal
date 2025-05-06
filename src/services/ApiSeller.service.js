import http from "../http-common";
import store from '../store';

class ApiDataService{

    me(){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;
        return http.post('/me', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    /**
     * Inicia sesión del usuario de agencia de viajes
     * @param {String} username - nombre de usuario
     * @param {String} password - Contraseña del usuario
     * @returns Token para hacer las solicitudes
     */
    login( body ){
        return http.post("/login", body, { headers:{ 'Content-Type':'application/json'} } )
    }
    /**
     * Monumentos que tienen habilitada la opción de vender a través de agencias de viajes
     * @param {String} tipo - Tipo de monumento (castillo, palacio, palacio real, etc...)
     * @param {String} idioma 
     * @returns Todos los monumentos que coinciden con el tipo seleccionado
     */
    getAllEdificaciones(tipo, idioma){
        // Se solicita el token almacenado para esta sesión y se envía en el header
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;
        
        return http.get("/edificaciones", { 
            params: {'tipo':tipo, 'idioma':idioma},
            headers:{
                'Authorization': `Bearer ${token}`
            }

        });
    }

    getEntradaNombres(id){
        return http.get("/entradaNombresById", { params:{'entradaId':id } });        
    }


    checkResetURL(body) {
        // console.log(body.token)
        return http.post('/validar-reset-token', body)
    }

    /**
     * Descripción del monumento
     * @param {String} idioma 
     * @param {String} nombre - nombre del monumento que se queire consultar
     * @returns 
     */
    getDescripcion(idioma, nombre){
        // Se solicita el token almacenado para esta sesión y se envía en el header
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get("/monumento", { 
            params: {'nombre':nombre, 'idioma':idioma},
            headers:{
                'Authorization': `Bearer ${token}`
            }

        });
    }

    /**
     * 
     * @param {String} idioma 
     * @param {String} monumentoId  - Id del monumento cuyas visitas se quieren accesar
     * @returns 
     */
    getVisitas(idioma, monumentoId){
        // Se solicita el token almacenado para esta sesión y se envía en el header
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;
        return http.get("/monumento-visitas", { 
            params: {'monumentoId':monumentoId, 'idioma':idioma},
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getEntradaById(id, idioma){

        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get("/entrada-by-id", { 
            params:{ 'visitaId':id, 'idioma':idioma },
            headers:{
                'Authorization': `Bearer ${token}`
            }

        });
    }

    getEntradaByLegacy(id, idioma){

        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get("/entrada-by-id", { 
            params:{ 'visitaId':id, 'idioma':idioma },
            headers:{
                'Authorization': `Bearer ${token}`
            }

        });
    }

    getFechaByVisitaId(idioma, id, selectedDate){        

        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get("/fecha-by-visita-id", { 
            params:{'visitaId':id, 'idioma':idioma, 'fecha':selectedDate} ,
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
    }

    getComision(monumentoId, visitaId){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get('/tipoComision', {
            params:{'monumentoId':monumentoId, 'visitaId':visitaId},
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    createCarrito(carrito){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        console.log(carrito)
        return http.post('/carrito', carrito, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    deleteCarrito( uuid ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.delete( `/carrito/${uuid}`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    updateCarrito( uuid, reserva ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.put(`/carrito/${uuid}`, reserva, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        } )
    }

    removeFromCarrito( uuid, reservaId ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.put(`/carrito/delete-reserva/${reservaId}`, {},{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getCarrito( uuid ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get(`/carrito?carrito=${uuid}`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    checkoutProcess( uuid, reservas, monto, monumento, tipoDePago ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        const body = {
            productos: reservas,
            mount: monto,
            monumento: monumento,
            tipoDePago: tipoDePago
        }

        return http.post( `/carrito-checkout/${uuid}`, body, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    checkoutReserva( importe, reservaLoc, monumento, tipoDePago='redsys' ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        const body = {
            importe: importe,
            monumento: monumento,
            tipoDePago: tipoDePago
        }

        return http.post(`/reserva-checkout/${reservaLoc}`, body, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getReservas(filtros, url){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.post(`/reservas/monumento/${url}`, filtros, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getPagos(filtros, url){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.post(`/pagos/monumento/${url}`, filtros, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getReservasByDsMerchantParameter( Ds_MerchantParameters, Ds_SignatureVersion, Ds_Signature ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get(`/reservas/pedido-complete/redsys-merchant`, {
            params:{
                Ds_MerchantParameters: Ds_MerchantParameters,
                Ds_Signature: Ds_Signature,
                Ds_SignatureVersion: Ds_SignatureVersion
            },
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })

    }

    /**
     * Consultamos la información de la reserva que coincida con este identificador
     * @param {String} idioma - idioma en que se hizo la reserva
     * @param {String} identificador - identificador único de la reserva
     * @returns 
     */
    getReservaByLocalizador(idioma, identificador, extended){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get(`/reserva/${identificador}`, {
            params:{
                language: idioma,
                extended: extended
            },
            headers:{
                'Authorization': `Bearer ${token}`
            }    
        })
    }

        /**
     * Consultamos la información de la reserva que coincida con este identificador
     * @param {String} idioma - idioma en que se hizo la reserva
     * @param {String} identificador - identificador único de la reserva
     * @returns 
     */
    getReservasByLocalizador(idioma, identificador, extended){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get(`/reservas/${identificador}`, {
            params:{
                language: idioma,
                extended: extended
            },
            headers:{
                'Authorization': `Bearer ${token}`
            }    
        })
    }
    async getCancellationRequestsForBooking( identificador ){
        store.commit('fetchAccessToken');

        const token = store.getters.isAuthenticated;

        const result = await http.get(`/reservas/${identificador}/refund-request`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return result.data;
    }
    
    /**
     * Consultamos la información relacionada a este mayorista
     */
    mayoristaInfo(){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.post(`/me-complete`, {}, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    consultarPagos( localizador ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.post(`/reserva/${localizador}/pagos`, {}, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getReservaPdf( localizador ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get(`/reserva/pdf/${localizador}`, {
            responseType: 'blob',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getPdfProforma( localizador ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get(`/reservas/proforma/${localizador}`, {
            responseType: 'blob',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    updateFavoritos( payload ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.post(`/update-favoritos/${payload.idMonumento}`, payload, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    enviarSolicitudAprobacion( data ){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;

        return http.post('/solicitar-aprobacion', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    cancelReservation( localizador, data ){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;

        return http.put(`/reservas/cancelar/${localizador}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

    }

    async triggerRefundRequest( localizador, form ){
        store.commit("fetchAccessToken")
        const token = store.getters.isAuthenticated;
        const result = await http.post(`/reservas/${localizador}/refund-request`, form, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } );
        return result.data;
    }


    editHidePrice( localizador, data){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;

        return http.put(`/reserva/${localizador}/basic-edit`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

    }

    editReference( localizador, data ){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;

        return http.put(`/reserva/${localizador}/basic-edit`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async getPaymentMethods( itemIDVisita ){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;

        const result = await http.get(`/metodos-de-pago-para-mayorista`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                idVisita: itemIDVisita
            }
        })
        return result.data;
    }

    async getBoard( monumento ){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;

        const result = await http.get(`/tablero/${monumento}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return result.data;
    }

    async getModificadoresDePrecios( idPrecio ){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;
        const result = await http.post(`/modificadores-de-precios`, idPrecio, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } );
        console.log( result );
        return result.data;
    }

    async getProfile(){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;
        const result = await http.get(`/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } );
        return result.data;
    }

    async updateProfile( form ){
        store.commit( 'fetchAccessToken' );
        const token = store.getters.isAuthenticated;
        const result = await http.put(`/update-profile`, form, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } );
        return result.data;
    }

    async updatePassword(form) {
        store.commit("fetchAccessToken")
        const token = store.getters.isAuthenticated;
        const result = await http.put(`/profile/actualizar-password`, form, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } );
        return result.data;
    }
}

export default new ApiDataService;