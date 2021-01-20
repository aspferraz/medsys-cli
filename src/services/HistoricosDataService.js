import http from "../http-common";

class HistoricosDataService {

    getCount() {
        return http.get(`/historicos/count`);
    }

    getAllWithPagination(page=1, size=8, sortBy = "id", sortDesc = false) {
        if ((/^\s*$/).test(sortBy)) {
            sortBy = 'id';
        }
        return http.get(`/historicos?page=${page}&size=${size}&sortby=${sortBy}&sortdesc=${sortDesc}`);
    }

    getAll() {
        return http.get("/historicos");
    }

    get(id) {
        return http.get(`/historicos/${id}`);
    }

    create(data) {
        return http.post("/historicos", data);
    }

    update(data) {
        return http.put(`/historicos/${data.id}`, data);
    }

    delete(id) {
        return http.delete(`/historicos/${id}`);
    }

    //   deleteAll() {
    //     return http.delete(`/historicos`);
    //   }

}

export default new HistoricosDataService();