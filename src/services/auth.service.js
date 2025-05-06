import http from "../http-common"

class AdminAuthService {
    /**
     * Método para iniciar sesión
     */
    login(body) {
        return http.post("/login", body, {
            timeout: 3000
        });
    }
    adminLogin(body){
        return http.post("/loginAdmin", body);
    }

    logout(){
        localStorage.removeItem('user');
    }
    reset(body){
        return http.post('/reser', body);
    }
    requestPasswordReset(body){
        return http.post('/user/reset-request', body)
    }

    resetPasswordByToken(body){
        return http.put( '/resetByToken', body)
    }

    getUserRolByToken(token){
        return http.post('/me',{}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

}

export default new AdminAuthService();