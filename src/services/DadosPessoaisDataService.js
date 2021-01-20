import http from "../http-common";

class DadosPessoaisDataService {

    create(data) {
        return http.post("/dadospessoais", data);
    }

    getAll() {
        return http.get("/dadospessoais");
    }
    
    findByQueryString(queryString, operator, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/dadospessoais?${queryString}&operator=${operator}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

}

export default new DadosPessoaisDataService();