import http from "../http-common";

class EstadosCivisDataService {

    getAll() {
        return http.get("/estadoscivis");
    }

}

export default new EstadosCivisDataService();