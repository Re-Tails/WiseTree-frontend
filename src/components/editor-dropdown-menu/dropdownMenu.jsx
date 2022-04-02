import React from 'react';
import PropTypes from 'prop-types';
import './dropdownMenu.scss';

Menu.propTypes = {
    togglePreviewBar: PropTypes.func,
    closeForm: PropTypes.func,
    togglePreviewMode: PropTypes.func,
    toggleDeleteDialog: PropTypes.func
};

export default function Menu(props) {

    // Add functionality
    function toggleDialog(event) {
        props.togglePreviewBar();
        props.closeForm();
        props.togglePreviewMode(event.target.value);
    }

    // Delete functionality
    function toggleDeleteDialog() {
        props.closeForm();
        props.toggleDeleteDialog();
    }

    return (
        <div className='dropdown'>
            {/* <button onClick={toggleDialog} value='viewing' className='dropdown-option'>
                View
            </button> */}
            {/* <button onClick={toggleDialog} value='editing' className='dropdown-option'>
                Edit
            </button> */}
            <button onClick={toggleDialog} value='creating' className='dropdown-option'>
                Add
            </button>
            <button onClick={toggleDeleteDialog} value='deleting' className='dropdown-option dropdown-option--delete'>
                Delete
            </button>
        </div>
    );
}
