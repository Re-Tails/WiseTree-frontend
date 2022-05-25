import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import Login from './pages/login/login';
import TreeDashboard from './pages/tree-dashboard/treeDashboard';
import TreeEditor from './pages/tree-editor/treeEditor';

import AuthenticationProvider from './services/AuthenticationContextProvider';




import './app.scss';



// const client = new ApolloClient({
//     uri: 'http://localhost:4000/graphql',
// });

function App() {
    return (
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
    );
}

export default App;
