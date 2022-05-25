import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { ReactComponent as LogoBrandFull } from '../../assets/icons/logo-brand-full.svg';
import { ReactComponent as WaveGradient } from '../../assets/icons/login-wave.svg';

import cogoToast from 'cogo-toast';

import './login.scss';

import { useUser, useUserAuth } from '../../services/AuthenticationContextProvider';

// const dummyUser = {
//     userName: 'Scott Dowell',
//     userId: 'SDW',
//     roles: ['Admin', 'test'],
//     authenticationToken: '127893417289-321yui31hui-1293',
//     isLoggedIn: true,
// };

export default function Login() {

    const [errorMsg, setErrorMsg] = useState(null);
    const history = useHistory();


    const userAuth = useUserAuth();
    const user = useUser();

    // If token exists and user has been logged in previously
    useEffect(() => {
        if(user) history.push("/dashboard");
    }, [user]);


    // If token expires, mptify the user (UX)
    useEffect(() => {
        if(userAuth.expirationMessage){
            cogoToast.error(userAuth.expirationMessage);
        }
    }, [userAuth.expirationMessage]);
    
    // Display a message confirmation when user logs out
    useEffect(() => {
        if (userAuth.logoutMessage){
            cogoToast.success(userAuth.logoutMessage)
        }
    }, [userAuth.logoutMessage]);

    // Handle login function
    function handleLogin(e) {
        console.log("start handleLogin in login.jsx")
        setErrorMsg(() => null);

        e.preventDefault()

        const form = e.target;
        const user = {
            email: form[0].value,
            password: form[1].value
        }

        userAuth.login(user.email, user.password).then(res => {
            console.log("after userAuth.login")
            console.log(res);
            if(res !== "Success"){
                setErrorMsg(res);
            } else {
                history.push("/dashboard");
            }
        });

    }

    return (
        <div className='login'>

            {/* { user && <Redirect path="/dashboard" /> } */}

            <div className="login__title-section">
                <WaveGradient className="login__gradient login__gradient--bottom" />
                <WaveGradient className="login__gradient login__gradient--top"/>
                <LogoBrandFull fill='#FFF' className='login__logo' />
                <h3 className="login__subtitle">Strategy & Tactics Tree</h3>
            </div>
            <div className="login__login-section">
                <h2 className="login__login-section-title">G'day mate!</h2>
        
                { errorMsg && <p className="login__login-section-error text-danger">{ errorMsg }</p> }
                <form className="login__form" onSubmit= {event => handleLogin(event)}>
                    <input type="email" className="form-control login__email login__input" autoComplete="email" placeholder="Email"/>
                    <input type="password" className="form-control login__password login__input" autoComplete="password" placeholder="Password"/>
                    <button className='login__btn btn' value="Submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

// const [isLoading, setIsLoading] = useState(false);

// async function callUber(){
//     setIsLoading(() => true);
//     let data = await fetch(); // 5 seconds
//     setIsLoading(() => false);
//     console.log(data);
// }

// return (
//     <p>{ isLoading && "Loading..." }</p>
// )

// let data = fs.readFileSync("treeDiagram.json");

// let tree = JSON.parse(data);



function updateTree(){
    let data = fetch() // Promise

    for(let i = 0; i < data.length; i++){
        console.log(data[i]);
    }
    
}


