import http from "../http-common";
import store from "../store/index";

class FacturacionService{

    async searchInvoices( searchParameters, url ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        const result =  await http.get(`/invoices/search-invoice/${url}`,
        {
            headers:{
                'Authorization': `Bearer ${token}`
            },
            params:{
                startDate: searchParameters.startDate,
                endDate: searchParameters.endDate,
                numeroEmision: searchParameters.numeroEmision,
                localizador: searchParameters.localizadorReserva
            }    
        })

        return result.data;
    }

    async consultarInvoice( numeroEmision ){
        store.commit('fetchAccessToken');
        const token = store.getters.isAuthenticated;

        const result = await http.get(`/invoices/consultar-invoice/${numeroEmision}`,
        {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return result.data;
    }
}

export default new FacturacionService;