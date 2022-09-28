import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { InputGroup, FloatingLabel, FormControl } from 'react-bootstrap';
import * as API from '../../store/web3api';
import { setNotificationAction } from '../../store/actions';

const MintForm = (props) => {
	const { account, library } = useWeb3React();
	const [mintAmount, setMintAmount] = useState(1);
	const [nftPrice, setNftPrice] = useState(0.01);
	const [totalPrice, setTotalPrice] = useState(0);
	const [processing, setProcessing] = useState(false);
	const [saleStatus, setSaleStatus] = useState(0);
	const [isWhitelisted, setIsWhitelisted] = useState(false);

	useEffect(() => {
		// getMintPrice();
		getSaleStatus();
		setNftPrice(0.01);
	});

	useEffect(() => {
		setTotalPrice(nftPrice * mintAmount);
	}, [nftPrice, mintAmount]);

    const getSaleStatus = async() => {
    	try {
    		let _result = await API.getSaleStatus(library);
    		setSaleStatus(_result);
    	} catch(err) {
			console.log(err);
		}
    }

    const getIsWhiteListed = async() => {
    	try {
    		const is_whitelisted = await API.isWhitelisted(account, library);
    		setIsWhitelisted(is_whitelisted);
    	} catch(err) {
			console.log(err);
		}
    }

    const increaseMintAmount = () => {
    	let mint_amount = mintAmount + 1;
    	if (mint_amount > 5) mint_amount = 5;
    	setMintAmount(mint_amount);
    }

    const decreaseMintAmount = () => {
    	let mint_amount = mintAmount - 1;
    	if (mint_amount < 1 ) mint_amount = 1;
    	setMintAmount(mint_amount);
    }

	const handleMintAmountChange = (e) => {
		console.log(e.target.value);
	}
	const handleMint = async() => {
		if (account && mintAmount > 0) {
			setProcessing(true);
			try {
				const tokenIds = await API.mint({amount: mintAmount, account, price: totalPrice}, library);
				const _msg = `Your minting has been confirmed.`;
				props.dispatch(setNotificationAction(_msg, 'success'));

				// if (isWhitelisted) {
				// 	const tokenIds = await API.whitelistSale({amount: mintAmount, account, price: totalPrice}, library);
				// 	const _msg = `Your minting has been confirmed, your NFT ID is ${tokenIds.join(', ')}. Save IT`;
				// 	props.dispatch(setNotificationAction(_msg, 'success'));
				// } else {
				// 	const tokenIds = await API.publicSale({amount: mintAmount, account, price: totalPrice}, library);
				// 	const _msg = `Your minting has been confirmed, your NFT ID is ${tokenIds.join(', ')}. Save IT`;
				// 	props.dispatch(setNotificationAction(_msg, 'success'));
				// }
				// if (parseInt(saleStatus) === 1) { // Pre-sale
				// 	const tokenIds = await API.mintPreSale({amount: mintAmount, account, price: totalPrice}, library);
				// 	const _msg = `Your minting has been confirmed, your NFT ID is ${tokenIds.join(', ')}. Save IT`;
				// 	props.dispatch(setNotificationAction(_msg, 'success'));
				// } else if (parseInt(saleStatus) === 2) { // Public Sale
				// 	const tokenIds = await API.mintToken({amount: mintAmount, account, price: totalPrice}, library);
				// 	const _msg = `Your minting has been confirmed, your NFT ID is ${tokenIds.join(', ')}. Save IT`;
				// 	props.dispatch(setNotificationAction(_msg, 'success'));
				// } else {
				// 	props.dispatch(setNotificationAction('Sold out', 'error'));
				// }
			} catch (err) {
				console.log(err.message)
				props.dispatch(setNotificationAction(err.message || err, 'error'));
			}
			setProcessing(false);
		}
	}

	return (
		<>
			{
				(saleStatus) ? (
					<>
						<div className="text-center gy-3" data-aos="fade-in" data-aos-once="true">
							<div className="px-5">
								<InputGroup className="mb-3 flex-nowrap">
									<button
										className={`btn btn-primary-alt text-uppercase w-auto fs-2 text-white px-4`}
										id="btn_check_whitelist"
										onClick={()=>decreaseMintAmount()}
										>-</button>
									<FloatingLabel className="flex-grow-1 flex-shrink-1" controlId="mint_amount" label="Mint Amount">
										<FormControl type="text"
											size="lg"
											className="bg-dark text-center text-white rounded-0 fs-2 border-0"
											name="mint_amount"
											value={mintAmount}
											onChange={(e)=>handleMintAmountChange(e)}
											placeholder="Mint Amount"
											readOnly />
									</FloatingLabel>
									<button
										className={`btn btn-primary-alt text-uppercase w-auto fs-2 text-white px-4`}
										id="btn_check_whitelist"
										onClick={()=>increaseMintAmount()}
										>+</button>
								</InputGroup>
							</div>
							<div className="mt-5">
								<button className={`px-btn btn-lg btn btn-primary-alt btn-lg ${processing?'processing':''}`}
									onClick={()=>handleMint()}
								>
									{ `MINT FOR ${totalPrice.toFixed(2)} ETH` }
								</button>
							</div>
						</div>
					</>
				) : (
					<h2 className="text-white text-center" data-aos="fade-in" data-aos-once="true">Coming Soon!</h2>
				)
			}
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
)(MintForm));