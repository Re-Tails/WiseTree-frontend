
import './userManagement.scss';

import { useApolloClient, useQuery } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { useUser } from '../../services/AuthenticationContextProvider.jsx';
import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEllipsisH, faRedo } from '@fortawesome/free-solid-svg-icons'
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirmDeleteModal';

import { useHistory } from 'react-router';
import {
    GET_ALL_USERS,
    REMOVE_USER
} from '../../services/graphQL/dashboardApiHelper';

function UserManagement(props) {
    const user = useUser();

    const { data, error, refetch } = useQuery(GET_ALL_USERS, { pollInterval: 10000 });
    const history = useHistory();
    const client = useApolloClient();

    console.log(data)

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [activeName, setActiveName] = useState("");
    const [activeId, setActiveId] = useState("");
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("")

    const handleRemoveUser = async (userId) => {
        console.log(userId)
        let response = await client.mutate({ mutation: REMOVE_USER, variables: { _id: userId }});
        await refetch();
        cogoToast.success("User has been succesfully deleted");
    }

    const generatePassword = () => {
        let password = generatePasswordHelper()
        setGeneratedPassword(password)
    }

    const handleAddUser = async (event) => {
        event.preventDefault();
        let inputName = event.target[0].value;
        let inputEmail = event.target[1].value;
        let inputPassword = event.target[2].value;

        let userData = {email: inputEmail, name: inputName, password: inputPassword}
        if (inputPassword == "") {
            setErrorMessage("Error! Please make sure password is not empty.")
            return
        } else {
            const response = await fetch("/register", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin', 
                headers: {
                    'Content-Type': 'application/json'
                   
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer', 
                body: JSON.stringify(userData) 
            });
            var message = await response.json(); 
            // Check if there is an email error key in the returned JSON object and break if exists
            if (message.hasOwnProperty("emailError")) {
                setErrorMessage("Error! Email already exists.")
                return
            }

            // Refresh data
            await refetch()
            
            // Close the modal
            window.$("#createUserModal").modal('hide');

            // Clear the form
            setErrorMessage(false)
            setEmail("")
            setName("")
            setGeneratedPassword("")

            
            // Display success message
            cogoToast.success("User has been succesfully created");

        }
    }

    function generatePasswordHelper() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }


    let users = user?.role == 'admin' ? data?.getUsers : null;

    return (
        <div className="user-management">
            <div className="user-management__header">
                <h1 className="user-management__title">
                    User Management
                </h1>
                {user?.role == 'admin' && <button
                    onClick={() => true}
                    className="user-management__btn"
                    type="button" data-toggle="modal" data-target="#createUserModal">Create User +</button>}


            </div>
            <hr />

            <table className="table">
                <thead >
                    <tr className="user-management__table-head">
                        <th scope="col">Full Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                </thead>
                <tbody className="user-management__table-body">
                    {users?.map(user =>
                        <tr key={user._id}>
                            <td style={{ verticalAlign: "middle" }}>{user.name}</td>
                            <td style={{ verticalAlign: "middle" }}>{user.email}</td>
                            {user.role == "admin" ? <td style={{ verticalAlign: "middle" }}> <span className="badge badge-admin">Admin</span></td> : <td style={{ verticalAlign: "middle" }}><span className="badge badge-staff">Staff</span></td>}

                            <td className="buttons" className="user-management__group-buttons">
                                <button className="btn btn-light mr-2" data-toggle="modal" data-target="#confirmDeleteModal" onClick={() => { setActiveName(user.name); setActiveId(user._id) }}><FontAwesomeIcon icon={faTrashAlt} className="user-management__trash-icon" /></button>
                                <div className="btn-group">
                                    <button className="btn btn-light mr-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><FontAwesomeIcon icon={faEllipsisH} className="user-management__edit-icon" /></button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#">Change Password</a>
                                        <a className="dropdown-item" href="#">Modify Information</a>
                                    </div>
                                </div>
                            </td>
                        </tr>

                    )}
                </tbody>
            </table>

            <ConfirmDeleteModal name={activeName} id={activeId} function={handleRemoveUser} />

            {/* User Creation Modal */}
            <div className="modal fade" id="createUserModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title centered" id="exampleModalLabel">Create User</h5>
                            <button type="button shadow-none" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>

                        </div>
                        {errorMessage != "" ? <p className="text-danger mb-2 centered"> {errorMessage}</p> : ""}
                        <div className="modal-body">

                            <div className='container-fluid'>

                                <form action="#" onSubmit={handleAddUser}>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <label htmlFor='name'>Full Name</label>
                                            <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='form-control' name='name' required />
                                        </div>


                                    </div>
                                    <div className='row mt-2'>
                                        <div className='col'>
                                            <label htmlFor='email'>Email Address</label>
                                            <input type='email'  value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' required name='email'
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-2 mb-3">
                                        <div className="col">
                                            <label htmlFor='password'>Password</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" name="password" value={generatedPassword} disabled />
                                                <span className="input-group-append"><button type="button" className="btn btn-primary new-pass shadow-none" onClick={() => generatePassword()}><FontAwesomeIcon icon={faRedo} /></button></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <div className="centered">
                                            <button type="submit" className="btn btn-primary mr-2" >Create User</button>
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default UserManagement;