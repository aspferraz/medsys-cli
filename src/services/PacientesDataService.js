import http from "../http-common";

class PacientesDataService {

    getCount() {
        return http.get(`/pacientes/count`);
    }

    getAllWithPagination(page=1, size=8, sortBy = "id", sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/pacientes?page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    getAll() {
        return http.get("/pacientes");
    }

    get(id) {
        return http.get(`/pacientes/${id}`);
    }

    create(data) {
        return http.post("/pacientes", data);
    }

    update(data) {
        return http.put(`/pacientes/${data.id}`, data);
    }

    delete(id) {
        return http.delete(`/pacientes/${id}`);
    }

    //   deleteAll() {
    //     return http.delete(`/pacientes`);
    //   }

    findByNome(nome, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/pacientes?DadosPessoais.nome=${nome}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    findByCpf(cpf, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/pacientes?DadosPessoais.cpf=${cpf}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    findByCnpj(cnpj, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/pacientes?DadosPessoais.cnpj=${cnpj}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    findByQueryString(queryString, operator, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/pacientes?${queryString}&operator=${operator}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }
}

export default new PacientesDataService();