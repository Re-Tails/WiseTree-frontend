import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import Login from './pages/login/login';
import TreeDashboard from './pages/tree-dashboard/treeDashboard';
import TreeEditor from './pages/tree-editor/treeEditor';

import AuthenticationProvider from './services/AuthenticationContextProvider';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import './app.scss';
import { createHttpLink } from 'apollo-link-http';

const link = createHttpLink({
    uri: "https://wisetech-app.herokuapp.com/graphql",
    credentials: "include"
});

const client = new ApolloClient({
    link
});

// const client = new ApolloClient({
//     uri: 'http://localhost:4000/graphql',
// });

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>

                <AuthenticationProvider>

                    <Switch>
                        <Route path='/dashboard'>
                            <TreeDashboard treeStatus='published' />
                        </Route>
                        {/* <Route path='/drafts'>
                            <TreeDashboard treeStatus='draft' />
                        </Route> */}


                        <Route path={'/tree/'} component={TreeEditor} />

                        <Route path='/login'>
                            <Login />
                        </Route>

                        <Redirect path='/' to='login' />
                    </Switch>

                </AuthenticationProvider>

            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
