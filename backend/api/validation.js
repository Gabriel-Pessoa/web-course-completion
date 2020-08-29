/* Dicas 
*Poderia utilizar função de validação para verificar entrada de email válidas usando regex.
* Validar icons, id, passaword(senha com quant. e determ. caracteres)
*/
module.exports = app => {
    // se valor existir não gera erro
    function existsOrError(value, msg) {
        //valor for null ou undefined
        if (!value) throw msg;

        //se valor for um array e estiver vazio
        if (Array.isArray(value) && value.length === 0) throw msg;

        // capturar valores tipo string com espaço em branco
        if (typeof value === 'string' && !value.trim()) throw msg;
    }

    // se valor não existir gera erro. O inverso da função acima
    function notExistsOrError(value, msg) {
        // implementação de erro ao contrário
        try {
            existsOrError(value, msg);
        }
        catch (msg) {
            return; // return: sai da função.
        }

        throw msg; // se não der erro no try, lança erro
    }

    //teste se dois valores são iguais
    // Comparar senhas por exemplo 
    function equalsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg;
    }

    return { existsOrError, notExistsOrError, equalsOrError }
}