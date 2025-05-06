import http from "../http-common";
import store from "../store/index";

class CalendarioService{
    /**
     * 
     * @param { String } idioma - El idioma del usuario de la web
     * @param { String } id - El id del tipo mongodb que se asigna al producto de que se quieren saber las fechas
     * @param { Date } from - La fecha a partir de la que se quiere consultar
     * @param { Date } to - La fecha a final de la que se quiere consultar
     * @returns 
     */
    consultarDisponibilidadDeFechas(idioma, id, from, to ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        return http.get("/calendarioDisponible", { 
            params:{ 'idProduct': id, 'idioma':idioma, 'from':from, 'to': to} ,
            headers:{
                'Authorization': `Bearer ${token}`
            }    
        });
    }

    consultarHorariosParaFecha( idProducto, fecha, idMonumento ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;
        return http.get("/horarios-disponibles", { 
            params:{ 'idProduct': idProducto, 'date': fecha, monumentoId: idMonumento },
            headers:{
                'Authorization': `Bearer ${token}`
            }    
        });
    }
    
    consultarDisponibilidadParaHorario( idHorario ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;
        return http.get('/plazas-disponibles', {
            params:{ 'idHorario': idHorario },
            headers:{
                'Authorization': `Bearer ${token}`
            }    
        } )
    }
    
    buscarTarifasDeProducto( idHorario ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;
        return http.get('/tarifas-disponibles', {
            params:{ 'idHorario': idHorario },
            headers:{
                'Authorization': `Bearer ${token}`
            }    
        } )

    }
}

export default new CalendarioService;