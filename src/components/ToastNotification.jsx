import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = (props) => {
	const { notification, dispatch } = props;

	useEffect(() => {
		if (notification.msg) {
			const options = {
				autoClose: 3000,
				// autoClose: false,
				position: 'top-right',
				theme: 'colored',
				onOpen: props => {
					dispatch({type: 'CLEAR_NOTIFICATION'})
				}
			}
			if (notification.type === "success") {
				toast.success(notification.msg, options);
			} else if (notification.type === "info") {
				toast.info(notification.msg, options);
			} else {
				toast.error(notification.msg, options);
			}
		}
	}, [notification]);
	
	return (
		<>
			<ToastContainer position={"bottom-center"} toastClassName="toast-dark" style={{width: 'auto', maxWidth: '90vw'}} />
		</>
	);
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

const mapsStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        notification: state.app.notification
    }
}

export default withRouter(connect(
    mapsStateToProps, mapDispatchToProps
)(ToastNotification));
