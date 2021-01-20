import http from "../http-common";

class CidadesDataService {

    get(id) {
        return http.get(`/cidades/${id}`);
    }

    findByEstadoId(estado_id) {
        return http.get(`/cidades?estado_id=${estado_id}`);
    }

}

export default new CidadesDataService();