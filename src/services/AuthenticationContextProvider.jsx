import { GraphQLNonNull } from 'graphql';
import { gql } from 'apollo-boost';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useApolloClient } from '@apollo/react-hooks';

const UserState = React.createContext();
const UserAuthentication = React.createContext();

export function useUser() {
    return useContext(UserState);
}

export function useUserAuth() {
    return useContext(UserAuthentication);
}

const ACCESS_TOKEN_MINUTES = 120;

const GET_USER_INFORMATION = gql`
    query {
        getUser {
            _id
            name
            email
            role
            isModerator
        }
    }
`

export default function AuthenticationProvider({ children }) {
    const interval = useRef(null);
    const history = useHistory();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userContext") || null));
    const [expirationMessage, setExpirationMessage] = useState(null);
    const [logoutMessage, setLogoutMessage] = useState(null);
    const client = useApolloClient();

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        console.log(user);
        if (user) {
            localStorage.setItem("userContext", JSON.stringify(user));
        } else {
            localStorage.removeItem("userContext", null);
        }
    }, [user]);

    

    function getUserData() {
        return fetch("https://wisetech-app.herokuapp.com/userData").then(res => res.json()).then(res => {
            if (res.user) {
                setUser(() => res.user);
                return res.user;
            } else {
                setUser(() => null);
                history.push("/login");
                return null;
            }
        });
    }

    function login(email, password) {
        console.log("test 1")
        return fetch("https://wisetech-app.herokuapp.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
            .then(
                res => {
                    res.json()
                    console.log("test 2")
                })
            .then(async res => {
                console.log(res)
                console.log("test 3")
                if (res.token) {   
                    console.log("test 4") 
                    await getUserData();
                }

                return res.message;
            });

    }

    function logout() {
        fetch("https://wisetech-app.herokuapp.com/logout")
            .then(() => setUser(() => null))
            .then(() => {
                setLogoutMessage("You have been succesfully logged out.")
                history.push("/login")
            });
    }

    function isUserAuth() {
        fetch("https://wisetech-app.herokuapp.com/isUserAuth").then(res => res.json()).then(res => {
            if (!res.isLoggedIn) {
                if(user){
                    setUser(() => null);
                    setExpirationMessage(() => "Login token has expired");
                    history.push("/login");
                }
            }
        });
    }

    // Modify this code
    useEffect(() => {
        isUserAuth();
        if (user) {
            interval.current = setInterval(() => {
                isUserAuth();
            }, 1000 * 60 * 1);
        } else {
            clearInterval(interval.current);
        }

        return () => clearInterval(interval.current);
    }, [user, isUserAuth]);

    return (
        <UserState.Provider value={user}>
            <UserAuthentication.Provider value={{ login, logout, getUserData, expirationMessage, logoutMessage, isUserAuth }}>
                {children}
            </UserAuthentication.Provider>
        </UserState.Provider>
    );
}


