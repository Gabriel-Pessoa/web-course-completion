const schedule = require('node-schedule');

module.exports = app => {
                    // padrão de 1 em 1 min
    schedule.scheduleJob('*/1 * * * *', async function() {
        const usersCount = await app.db('users').count('id').first();
        const categoriesCount = await app.db('categories').count('id').first();
        const articlesCount = await app.db('articles').count('id').first();

        // importando modelo/schema
        const { Stat } = app.api.stat;

        //pega última estatística no mongodb
        const lastStat = await Stat.findOne({}, {}, { sort: {'createdAt': -1 } });

        //instanciando objeto
        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date() 
        });

        //precisa comparar sat com o lastSta, para saber se houve mudança
        //se lastStat não estiver setado, ou stat.user diferente de lastStat.users
        const changeUsers = !lastStat || stat.users !== lastStat.users; 
        const changeCategories = !lastStat || stat.categories !== lastStat.categories; 
        const changeArticles = !lastStat || stat.articles !== lastStat.articles; 

        //se mudou algumas das categorias acima
        if(changeUsers || changeCategories || changeArticles) {
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas!'))
        }

    }); 
}