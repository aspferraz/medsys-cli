import http from "../http-common";

class ProfissoesDataService {

    getAll() {
        return http.get("/profissoes");
    }

}

export default new ProfissoesDataService();