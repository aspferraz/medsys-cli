import http from "../http-common";

class ServicosDataService {

    getCount() {
        return http.get(`/servicos/count`);
    }

    getAllWithPagination(page=1, size=8, sortBy = "id", sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/servicos?page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    getAll() {
        return http.get("/servicos");
    }

    get(id) {
        return http.get(`/servicos/${id}`);
    }

    create(data) {
        return http.post("/servicos", data);
    }

    update(data) {
        return http.put(`/servicos/${data.id}`, data);
    }

    delete(id) {
        return http.delete(`/servicos/${id}`);
    }

    //   deleteAll() {
    //     return http.delete(`/servicos`);
    //   }

    findByDescricao(descricao, page=1, size=8, sortBy='id', sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/servicos?descricao=${descricao}&page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }
}

export default new ServicosDataService();