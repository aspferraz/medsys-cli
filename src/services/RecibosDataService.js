import http from "../http-common";

class RecibosDataService {

    getCount() {
        return http.get(`/recibos/count`);
    }

    getAllWithPagination(page=1, size=8, sortBy = "id", sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/recibos?page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    getAll() {
        return http.get("/recibos");
    }

    get(id) {
        return http.get(`/recibos/${id}`);
    }
    
    getPdf(id, options = {}) {
        return http.get(`/recibos/pdf/${id}/options?descricao_servico=${options.descricao_servico}&valor_servico=${options.valor_servico}`, {responseType: 'blob'});
    }

    getPdfPorPeriodo(dt_inicial, dt_final) {
        return http.get(`/recibos/pdf?dt_inicial=${dt_inicial}&dt_final=${dt_final}`, {responseType: 'blob'});
    }

    create(data) {
        return http.post("/recibos", data);
    }

    update(data) {
        return http.put(`/recibos/${data.id}`, data);
    }

    delete(id) {
        return http.delete(`/recibos/${id}`);
    }

    //   deleteAll() {
    //     return http.delete(`/recibos`);
    //   }

    findByNomePaciente(nome, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/recibos?Paciente.DadosPessoais.nome=${nome}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    findByCpfResponsavel(cpf, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/recibos?ResponsavelPagamento.cpf=${cpf}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    findByCnpjResponsavel(cnpj, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/recibos?ResponsavelPagamento.cnpj=${cnpj}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    findByQueryString(queryString, operator, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/recibos?${queryString}&operator=${operator}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }
}

export default new RecibosDataService();