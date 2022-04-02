import React from 'react';
import { useHistory } from 'react-router-dom';

import './confirmDeleteModal.scss';

export default function ConfirmDeleteModal(props) {
    const history = useHistory();
    const returnToPreviousPage = () => history.push('/dashboard');
    
    const confirmRemove = () => {
        window.$("#confirmDeleteModal").modal("hide");
        props.function(props.id);
    }
    
    return (
        <div className="modal fade" id="confirmDeleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title centered" id="exampleModalLabel">Confirm Delete</h5>
                        <button type="button shadow-none" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body centered">
                        Are you sure you want to delete <strong>{props.name}</strong>?
                    </div>
                    <div className="modal-footer ">
                        <div className="centered">
                            <button type="button" className="btn btn-danger mr-2" onClick={() => confirmRemove() }>Yes, delete</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">No, cancel</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
