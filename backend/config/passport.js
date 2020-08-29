const { authSecret } = require('../.env');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const { Strategy, ExtractJwt } = passportJwt; // desestrututurando objeto passportJwt

module.exports = app => {
    // params para Strategy
    const params = {
        secretOrKey: authSecret, // segredo para descodificar o token
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // extrai o token do cabeçalho da requisição , com o auxilio do bearer
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false)) // poderia retornar o próprio user
            .catch(err => done(err, false));
    });

    passport.use(strategy);

    return {
        // nas rotas iremos usar esse método para filtrar as requisições que precisam passar pelo passport com usuário logado
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}