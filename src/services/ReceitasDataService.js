import http from "../http-common";

class ReceitasDataService {

    getPdf(paciente_id, receita_text) {        
        
        return http.get(`/receitas/pdf?paciente_id=${paciente_id}&receita_text=${receita_text.split('\n').join('%0A')}`, {responseType: 'blob'});
    }  
}

export default new ReceitasDataService();