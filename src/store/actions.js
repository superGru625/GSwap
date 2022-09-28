// import * as API from "./api";

export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const SUBMITTED_TRANSACTION = 'SUBMITTED_TRANSACTION';
export const SUCCEEDED_APPROVE = 'SUCCEEDED_APPROVE';
export const SUCCEEDED_MIGRATE = 'SUCCEEDED_MIGRATE';

export const setNotificationAction = (msg_content, msg_type="success", msg_position="top-right") => {
	return (dispatch) => {
		return dispatch({
	      	type: SET_NOTIFICATION,
	      	data: {
		        type: msg_type,
		        msg: msg_content,
		        position: msg_position
	      	}
	    });
	}
}