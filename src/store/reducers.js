import { combineReducers } from 'redux';
import * as Actions from './actions';

const initialState = {
	notification: {
		type: "",
		msg: "",
		position: ""
	}
};

const app = (state = initialState, action) => {
	switch (action.type) {
		case Actions.SET_NOTIFICATION: {
			return {
				...state,
				notification: action.data
			}
		}
		case Actions.CLEAR_NOTIFICATION: {
			return {
				...state,
				notification: {
					type: "",
					msg: "",
					position: ""
				}
			}
		}
		case Actions.SUBMITTED_TRANSACTION: {
			return {
				...state,
				notification: action.data
			}
		}
		case Actions.SUCCEEDED_APPROVE: {
			return {
				...state,
				notification: action.data
			}
		}
		case Actions.SUCCEEDED_MIGRATE: {
			return {
				...state,
				notification: action.data
			}
		}
		default: {
			return state;
		}
	}
};

const createReducer = asyncReducers =>
	combineReducers({
		app,
		...asyncReducers
	});

export default createReducer;
