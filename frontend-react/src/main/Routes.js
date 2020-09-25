import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../components/Home';
import AdminPages from '../components/AdminPages';
import ArticlesByCategory from '../components/article/ArticlesByCategory';
import ArticleById from '../components/article/ArticleById';
import Auth from '../components/Auth';

import { userKey } from '../global';


//função para validar usuário para rota(s) específica(s), permitindo ou não acessar rota(s).
const PrivateRoute = ({ component: Component, ...rest }) => {
    const json = localStorage.getItem(userKey);
    const user = JSON.parse(json);

    return (
        <Route
            {...rest}
            render={props =>
                user && user.admin ? (
                    <Component {...props} />
                ) : (   //from: props.location (garante que usuário não perca histórico)
                        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                    )
            }
        />
    );
}


const router = () =>
    <Switch>
        <Route exact path='/' component={Home} />
        <PrivateRoute path='/admin' component={AdminPages} />
        <Route path='/categories/:id/articles' component={ArticlesByCategory} />
        <Route path='/articles/:id' component={ArticleById} />
        <Route path='/auth' component={Auth} />
        <Redirect from='*' to='/' />
    </Switch>


export default router;