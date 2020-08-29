export const baseApiUrl = 'http://localhost:3001';

export function showError(e) {
    let msg;
    if (e && e.response && e.response.data) {
        msg = e.response.data;
    } else if (typeof e === 'string') {
        msg = e;
    } else {
        msg = 'Sem detalhes!';
    }
    return msg;
}

export default { baseApiUrl, showError}