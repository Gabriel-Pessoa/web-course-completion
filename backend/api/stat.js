// criando arquivo de estatísticas do Postgres, utilizando o mongo
module.exports = app => {
    //criando o model/schema
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    });

    //método para obter do mongo a última estatística
    const get = (req, res) => {
        //busca no mongodb apenas uma última estatística
        //primeiro e segundo parâmetro sem alterações nos dados. Terceiro parâmetro de ordenação pega a última estatística
        Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })
            .then(stat => {

                const defaultStat = {
                    users: 0,
                    categories: 0,
                    articles: 0
                }
                
                res.json(stat || defaultStat); // resposta do mongo no formato json. Caso stat seja null, assume valor objeto vazio
            });
    }

    // retorno para ter acesso como atributos de objeto
    return { Stat, get }
}