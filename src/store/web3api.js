import Web3 from 'web3';
import axios from 'axios';
import { BigNumber } from "bignumber.js";
import { GSWAPv2, GOMA_V1, GOMA_V2, NETWORK_CHAIN_RPC, BACKEND_API_ENDPOINT } from '../Constants';
import ABI from '../abi/ABI.json';
import V1_ABI from '../abi/V1_ABI.json';
import V2_ABI from '../abi/V2_ABI.json';
import { setNotificationAction } from './actions';

BigNumber.config({ EXPONENTIAL_AT: 30 })

const initWeb3AndContract = (library = null) => {
	let web3 = null;
	if (!library) {
		web3 = new Web3(NETWORK_CHAIN_RPC);
	} else {
		web3 = library;
	}	

	const gswapContract = new web3.eth.Contract(ABI, GSWAPv2);
	const v1Contract = new web3.eth.Contract(V1_ABI, GOMA_V1);
	const v2Contract = new web3.eth.Contract(V2_ABI, GOMA_V2);
	return {web3, gswapContract, v1Contract, v2Contract};
}

export const WeiToEth = (amount_in_wei) => {
	const { web3 } = initWeb3AndContract();
	return web3.utils.fromWei(amount_in_wei, 'shannon');
}

export const EthToWei = (amount_in_eth) => {
	const { web3 } = initWeb3AndContract();
	return web3.utils.toWei(amount_in_eth, "shannon");
}

export const isAddress = (addr) => {
	const { web3 } = initWeb3AndContract();
	return web3.utils.isAddress(addr);
}

export const checkIsApproved = async (address, library=null) => {
	try {
		const { v1Contract } = initWeb3AndContract(library);
		const approvalAmount = await v1Contract.methods.allowance(address, GSWAPv2).call();
		return WeiToEth(approvalAmount);
	} catch (e) {
		console.log(e)
		createError(catchSmartContractErrorMessage(e));
	}
}

export const getV1TokenBalance = async (address, library=null) => {
	try {
		const { v1Contract } = initWeb3AndContract(library);
		const balance = await v1Contract.methods.balanceOf(address).call();
		return balance;
	} catch (e) {
		console.log(e)
		createError(catchSmartContractErrorMessage(e));
	}
}

export const getV2TokenBalance = async (address, library=null) => {
	try {
		const { v2Contract } = initWeb3AndContract(library);
		const balance = await v2Contract.methods.balanceOf(address).call();
		return WeiToEth(balance);
	} catch (e) {
		console.log(e)
		createError(catchSmartContractErrorMessage(e));
	}
}

export const getV2Amount = async (data, library=null) => {
	try {
		const { gswapContract } = initWeb3AndContract(library);
		let v1Amount = EthToWei(data.amount);
		const amount = await gswapContract.methods.getV2Amount(v1Amount).call();
		return WeiToEth(amount);
	} catch (e) {
		console.log(e)
		createError(catchSmartContractErrorMessage(e));
	}
}

export const getMigratingAmount = async (data, library=null) => {
	try {
		const response = await axios.post(BACKEND_API_ENDPOINT, {address: data.account});
		return response.data.data;
		// let balance = new BigNumber(data.amount);
		// const response = await axios.get(BSCSCAN_API_ENDPOINT + data.account);
		// if (response && response.data.result.length > 0) {
		// 	response.data.result.forEach((transaction) => {
		// 		if (transaction.to.toLowerCase() === data.account.toLowerCase()) {
		// 			balance = balance.minus(BigNumber(transaction.value));
		// 		}
		// 	})
		// }
		// return WeiToEth(balance.toString());
	} catch (e) {
		console.log(e)
		createError(catchSmartContractErrorMessage(e));
	}
}

export const approve = (data, library=null, dispatch) => {
	try {
		const { web3, v1Contract } = initWeb3AndContract(library);
		let gasPrice = 0;
		let gas = 0;
		let amount = '10000000000000000000000000000000000';
		web3.eth.getGasPrice().then((result) => {
			gasPrice = result;
			return v1Contract.methods.approve(GSWAPv2, amount).estimateGas({from: data.account});
		}).then((result) => {
			gas = result;
			v1Contract.methods.approve(GSWAPv2, amount).send({from: data.account, gas, gasPrice})
			.on('transactionHash', function(hash){
				dispatch({type: 'SUBMITTED_TRANSACTION', data: {
					type: 'SUBMITTED_TRANSACTION'
				}})
				
			})
			.on('confirmation', function(confirmationNumber){
				if (confirmationNumber === 0) {
					dispatch({type: 'SUCCEEDED_APPROVE', data: {
						type: 'SUCCEEDED_APPROVE'
					}})
				}
			})
			.on('receipt', function(receipt){
				// dispatch({type: 'SUCCEEDED_APPROVE', data: {
				// 	type: 'SUCCEEDED_APPROVE'
				// }})
			})
			.on('error', function(error, receipt){
				console.log(error)
				dispatch({type: 'ERROR_APPROVE', data: {
					type: 'ERROR_APPROVE',
					address: data.address
				}})
				dispatch(setNotificationAction(catchSmartContractErrorMessage(error), 'error'));
			});
			
		}).catch((e) => {
			dispatch({type: 'ERROR_APPROVE', data: {
				type: 'ERROR_APPROVE',
				address: data.address
			}})
			dispatch(setNotificationAction(catchSmartContractErrorMessage(e), 'error'));
		})
	} catch (e) {
		dispatch({type: 'ERROR_APPROVE', data: {
			type: 'ERROR_APPROVE',
			address: data.address
		}})
		dispatch(setNotificationAction(catchSmartContractErrorMessage(e), 'error'));
	}
}

export const migrate = (data, library=null, dispatch) => {
	try {
		const { web3, gswapContract } = initWeb3AndContract(library);
		let amount = EthToWei(data.amount);
		let gasPrice = 0;
		let gas = 0;
		web3.eth.getGasPrice().then((result) => {
			gasPrice = result;
			return gswapContract.methods.migrate(amount, data.timestamp, data.hash, data.signature).estimateGas({from: data.account});
		}).then((result) => {
			gas = result;

			gswapContract.methods.migrate(amount, data.timestamp, data.hash, data.signature).send({from: data.account, gas, gasPrice})
			.on('transactionHash', function(hash){
				dispatch({type: 'SUBMITTED_TRANSACTION', data: {
					type: 'SUBMITTED_TRANSACTION'
				}})
			})
			.on('confirmation', function(confirmationNumber){
				if (confirmationNumber === 0) {
					dispatch({type: 'SUCCEEDED_MIGRATE', data: {
						type: 'SUCCEEDED_MIGRATE'
					}})
				}
			})
			// .on('receipt', function(receipt){
			// 	dispatch({type: 'SUCCEEDED_MIGRATE', data: {
			// 		type: 'SUCCEEDED_MIGRATE'
			// 	}})
			// })
			.on('error', function(error, receipt){
				console.log(error)
				dispatch(setNotificationAction(catchSmartContractErrorMessage(error), 'error'));
			});
		}).catch((e) => {
			console.log(e)
			dispatch(setNotificationAction(catchSmartContractErrorMessage(e), 'error'));
		})
	} catch (e) {
		console.log(e)
		dispatch(setNotificationAction(catchSmartContractErrorMessage(e), 'error'));
	}
}

export const catchSmartContractErrorMessage = (e) => {
	const err_msg = String(e.message).toLowerCase();
	if (err_msg.includes("allowance")) {
		return "Not allowed to transfer token.";
	} else if (err_msg.includes("already migrated")) {
		return "You already migrated! If you have any issues, contact support team.";
	} else if (err_msg.includes("transfer amount must be greater than zero.")) {
		return "Transaction amount should be more than zero.";
	} else if (err_msg.includes("insufficient funds for gas")) {
		return "Your wallet has insufficient funds for gas";
	} else if (err_msg.includes("user denied transaction")) {
		return "You rejected transaction."
	} else if (err_msg.includes("failed to transfer v1 token")) {
		return "Failed to transfer v1 token."
	} else if (err_msg.includes("failed to transfer v2 token")) {
		return "Failed to transfer v2 token."
	} else if (err_msg.includes("not verified transaction")) {
		return "This transaction is not verified."
	} else if (err_msg.includes("not started yet")) {
		return "Migration is not started yet. Try again later"
	} else if (err_msg.includes("transfer amount exceeds allowance")) {
		return "GSWAPv2 not allowed to transfer yet. Try again later"
	} else {
		return "The transaction is failed. Please verify that you have enough funds to mint and pay the gas fees. If this issue may be issued continuously, please contact us on Discord."
	}
}

const createError = (err_msg) => {
	throw new Error(err_msg);
}