import http from "../http-common";

class EstadosDataService {

    getAll() {
        return http.get("/estados");
    }

    get(id) {
        return http.get(`/estados/${id}`);
    }

    findByUf(uf) {
        return http.get(`/estados?uf=${uf}`);
    }

}

export default new EstadosDataService();