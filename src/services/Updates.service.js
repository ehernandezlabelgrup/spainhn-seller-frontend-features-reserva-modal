import http from "../http-common";
import store from "../store/index";

class UpdatesService{


    doUpdateReservation( localizador, modificaciones ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.put(`/reserva/${localizador}/update-reservation`,
        modificaciones,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

export default new UpdatesService;