import swal from 'sweetalert'; // popup de alertas


export const baseApiUrl = 'http://localhost:3001';

export const userKey = '__knowledge_user';

export function showError(e) {
    let msg;
    if (e && e.response && e.response.data) {
        msg = e.response.data;
    } else if (typeof e === 'string') {
        msg = e;
    } else {
        msg = 'Sem detalhes!';
    }

    //return msg;
    return swal({
        title: 'Erro no processo!',
        text: msg,
        icon: 'error',
        dangerMode: true
    });
}

export function showSuccess() {
    return swal({
        title: 'Processo realizado com Sucesso!',
        icon: 'success',
        dangerMode: false
    });
}

export default { baseApiUrl, showError, userKey, showSuccess }