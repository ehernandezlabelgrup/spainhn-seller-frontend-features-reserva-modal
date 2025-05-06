import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist';
import { v4 as uuidv4 } from 'uuid';
import ApiService from "../services/ApiSeller.service";

import moment from "moment"

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    cartUuid: state.cartUuid,
    cartExp: state.cartExp,
    cart: state.cart,
    seguroDeCancelacion: state.seguroDeCancelacion,
    idiomaSelected: state.idiomaSelected??'es',
  })
})


export default new Vuex.Store({
  state: {
    plazasDisponibles: 0,
    cart:[],
    cartUuid: null,
    cartExp: null,
    accessToken: null,
    timerId: null,
    timeCounter: null,
    cartAnimation: false,
    seguroDeCancelacion: false,

    idiomaSelected: localStorage.getItem('idiomaSelected')??'es',
    clorianToken: null,
    monumentoId: null,
    totalBoletos: 0,
    motivosDeCancelacion: [
      { text: ' ', value: 0 },
      { text: 'Error de compra', value: 1 },
      { text: 'Fuerza Mayor', value: 2 },
      { text: 'Cambio Planificación', value: 3 },
      { text: 'Solicitud del Organizador', value: 4},
      { text: 'Otros', value: 5 }
    ]

  },
  getters:{
    motivosDeCancelacionOptions(state){
      return state.motivosDeCancelacion;
    },
    isAuthenticated(state) {
      // console.log(state.accessToken);
      return state.accessToken;
    },

    cartStatus: state => {

      let statusObj = {uuid: state.cartUuid, exp: state.cartExp};
      return statusObj;
    },

    getExp: state => {
      return state.cartExp;
    },

    cartAnimation: state => {
      return state.cartAnimation;
    },

    total: state=> {
      if(state.cart.length > 0){
        // console.log(state.cart);
        // let entradas = state.cart;
        return state.cart.map( item => item.itemTotal ).reduce((total, amount) => total + amount);
      }
      else{
        return 0;
      }
    },

    totalCancelacion: state => {
      if(state.cart.length > 0){
        // console.log(state.cart);
        // let entradas = state.cart;
        return state.cart.filter( item => item.cancelable ).map( item => item.itemTotal ).reduce((total, amount) => total + amount, 0) * 0.1;
      }
      else{
        return 0;
      }

    },

    itemsInCart: state => {
      return state.cart;
    },

    numberOfTickets: state => {
      return state.cart.length;
    },

    idiomaIndex: state => {
      if (state.idiomaSelected == 'es'){
        return 0;
      }
      else if(state.idiomaSelected == 'en'){
        return 1;
      }
      else if(state.idiomaSelected == 'fr'){
        return 2;
      }
      else if(state.idiomaSelected == 'de'){
        return 3
      }
      else{
        return 0;
      }
    },

    getIdioma: state =>{
      return state.idiomaSelected;
    },

    seguroDeCancelacion: state => {
      return state.seguroDeCancelacion
    },

    getAccessToken: state => {
      return state.accessToken;
    },

    /**
     * Verificamos que los items que se encuentran en el carrito aún sean válidas.
     * Si ya pasaron, se borrarán del carrito
     * @param {Object} state 
     */
    validarTickets(state){
      // Aquí guardaremos los items que serán eliminados
      let items = [];
      try{
        items = state.cart.filter( ticket => {
          // console.log(ticket);
          return true;
        }) 
      }
      catch(err){
        console.log(err);
      }

      return items;
    },

    espacioParaBoletos(state){
      if(state.plazasDisponibles == null){
        return null;
      }
      else if( state.plazasDisponibles ){
        return state.plazasDisponibles;
      }
      else{
        return 0;
      }
    },

    boletosAgregados(state){
      return state.totalBoletos;
    }

  },
  mutations: {

    addToCart(state, payload){
      state.cartAnimation = true;
      return state.cart.push(payload);
    },

    removeFromCart(state, payload){
      let itemIndex = state.cart.findIndex( (item)=> item.itemUuid == payload.itemUuid )

      if(itemIndex != -1){
        if(state.cart.length == 1){
          state.cartUuid = null;
          state.cartExp = null;
          state.timeCounter = null;
          state.seguroDeCancelacion = false;
        }
        state.cartAnimation = false;

        return state.cart.splice(itemIndex,1);
      }
      else
        return state.cart;
    },

    removeOldItemsFromCart( state, payload ){
      let itemsValidos = state.cart.filter( item => {
        return !payload.includes( item.itemUuid );
      } )

      state.cart = itemsValidos;

      return state.cart;
    },

    removeAllItems(state){
      state.seguroDeCancelacion = false;
      state.cartUuid = null;
      state.cartExp = null;
      return state.cart = [];
    },

    setIdioma(state, payload){
      // console.log(payload);
      return state.idiomaSelected = payload;
    },

    addCancelToItems(state){
      state.seguroDeCancelacion = true;
      state.cart.filter(items => items.cancelable).map( item => { 
        item.seguroDeCancelacion = true; 
        item.montoCancelacion = item.itemTotal * 0.1} 
      )
      // console.log(state.cart)
      return state.cart;
    },

    removeCancelToItems(state){
      state.seguroDeCancelacion = false;
      state.cart.filter(items => items.cancelable).map( item => { item.seguroDeCancelacion = false; item.montoCancelacion = 0} )
      console.log(state.cart);
      return state.cart;
    },

    updateAccessToken(state, accessToken){
      state.accessToken = accessToken
      return accessToken;
    },

    setUser: (state, user) => {
      state.user = user;
    },

    fetchAccessToken: (state) => {
      // console.log("Actualizando el token de acceso");
      state.accessToken = localStorage.getItem('accessToken');
      // console.log(state.accessToken);
    },

    resetBoletos(state){
      state.totalBoletos = 0;
      return state.totalBoletos;
    },

    quitarBoleto(state, payload){
      state.totalBoletos -= payload;
      return state.totalBoletos;
    },

    agregarBoleto(state, payload){
      state.totalBoletos += payload;
      return state.totalBoletos;
    },

    guardarPlazas( state, payload ){
      state.plazasDisponibles = payload;
      return state.plazasDisponibles;
    },

    addReservationId( state, payload ){
      const { itemUuid, reservationId } = payload;
      state.cart.forEach( c => {
        if( c.itemUuid == itemUuid){
          c.reservationId = reservationId;
        }
      })

      return state.cart;
    },

    updateActionType( state, payload ){

      console.log( payload );
      state.cart.forEach( i => {
        console.log( i );
        if( i.itemUUid == payload.uuid ){
          i.accionDePago = payload.accion
        }
      })
    }
  },
  actions: {
    fetchAccessToken({ commit }){
      commit('updateAccessToken', localStorage.getItem('accessToken'));
    },
    removeAccessToken( { commit } ){
      localStorage.removeItem('accessToken');
      commit('updateAccessToken', null);
    },
    async addToCart( { commit, state, dispatch }, products ){

      console.log( products );

      if( state.cartUuid ){
        let preReservas = { 
          "uuid":products.itemUuid, 
          "pax":products.itemTickets.map( item => item.cantidad ).reduce( (acc, curr) => acc + curr, 0 ), 
          "eventoId": products.itemID, 
          // "tickets":products.itemTickets,
          // "fecha": products.itemFecha,
          // "hora": products.itemHorario,
          // "comision": products.itemComision,
          // "descuento": products.itemDescuento,
          // "monumentoId": products.itemMonumentoId,
          // "visitaId": products.itemIDVisita
        };

        let result = await ApiService.updateCarrito( state.cartUuid, preReservas )        
        state.cartExp = result.data.cartExp;

      }

      else{
        const payload = {
          uuid: uuidv4(),
          preReservas: [ { 
            "uuid":products.itemUuid, 
            "pax":products.itemTickets.map( item => item.cantidad ).reduce( (acc, curr) => acc + curr, 0 ), 
            "eventoId": products.itemID, 
            // "tickets":products.itemTickets,
            // "fecha": products.itemFecha,
            // "hora": products.itemHorario,
            // "comision": products.itemComision,
            // "descuento": products.itemDescuento,
            // "monumentoId": products.itemMonumentoId,
            // "visitaId": products.itemIDVisita  
          } ],
          status: false
        }

        let result = await ApiService.createCarrito( payload );
        console.log( result );
        state.cartUuid = result.data.uuid;
        state.cartExp = result.data.expireAt;
      }

      products.carritoUuid = state.cartUuid;
      commit( 'addToCart', products );
    },

    async reservaDelete( { commit, state }, reserva ){
      commit( 'removeFromCart', reserva )

      console.log(reserva)
      await ApiService.removeFromCarrito( state.cartUuid, reserva.itemUuid )

      return true;
    },

    async triggerTimer( {commit, state} ){
      if( !state.timerId ){
        // state.carritoTime = moment.utc( state.cartExp?? 0 );
        state.timerId = setInterval( () => { 
            let now = moment();
            // console.log(now)
            let diffTime = moment.utc( state.cartExp?? 0 ) - now;

            // console.log(diffTime)
            let duration = moment.duration( diffTime - 1000, 'milliseconds' )

            state.timeCounter = (duration.minutes() + ":" + duration.seconds() );

            console.log(state.timeCounter);
            if( duration <= 0 ){
                state.timeCounter = null;
                clearInterval( state.timerId );
                state.timerId = null;
                commit('removeAllItems')
            }

            return state.timeCounter
        }, 1000 )
      }

    }

  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
