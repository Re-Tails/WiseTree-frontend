import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import { withApollo } from "react-apollo"
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    uri: "https://wisetech-app.herokuapp.com/graphql",
    credentials: "include"
});

const AppWithClient = withApollo(App);

ReactDOM.render(
    <ApolloProvider client={client}>
      <Fragment>
        <AppWithClient />
      </Fragment>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
