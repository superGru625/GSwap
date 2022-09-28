import axios from 'axios';
import { API_BASE_URL } from '../Constants';

axios.defaults.baseURL = API_BASE_URL

export const loadProjects = async (params) => {
	try {
		const projects = await axios.get('api/project', {
			params: params
		});

		return projects;
	} catch (e) {
		console.log(e)
		createError(e);
	}
}

export const addProject = async(data) => {
	try {
		const result = await axios.post('api/project', data);

		return result;
	} catch (e) {
		console.log(e)
		createError(e);
	}
}

// export const addProject = async(formData) => {
// 	try {
// 		const result = await axios.post('api/admin/business', formData, {
// 			header: {
// 				'Content-Type': 'multipart/form-da'
// 			}
// 		});

// 		return result;
// 	} catch (e) {
// 		console.log(e)
// 		createError(e);
// 	}
// }

export const updateProject = async(id, data) => {
	try {
		const result = await axios.post('api/project/' + id, data);

		return result;
	} catch (e) {
		console.log(e)
		createError(e);
	}
}

export const deleteProject = async(id) => {
	try {
		const result = await axios.delete('api/project/' + id);

		return result;
	} catch (e) {
		console.log(e)
		createError(e);
	}
}

export const catchSmartContractErrorMessage = (e) => {
	const err_msg = String(e.message).toLowerCase();
	if (err_msg.includes("exceed transaction limit")) {
		return "Exceed one-time mint limit.";
	} else if (err_msg.includes("not in sale")) {
		return "Not in sale."
	} else if (err_msg.includes("exceed wallet limit")) {
		return "Exceed the limit per wallet";
	} else if (err_msg.includes("not whitelisted")) {
		return "You wallet is not whitelisted yet. Please contact us on Discord";
	} else if (err_msg.includes("insufficient funds for gas")) {
		return "Your wallet has insufficient funds for gas";
	} else if (err_msg.includes("user denied transaction")) {
		return "You rejected transaction."
	} else {
		return "Failed. Please try again."
	}
}

const createError = (err_msg) => {
	throw new Error(err_msg);
}