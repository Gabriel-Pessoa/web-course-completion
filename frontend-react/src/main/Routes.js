import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../components/Home';
import AdminPages from '../components/AdminPages';

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/admin' component={AdminPages} />
        <Redirect from='*' to='/' />
    </Switch>