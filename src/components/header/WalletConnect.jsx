import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injected, walletconnect, walletlink } from '../../utils/Connectors';
import { useEagerConnect, useInactiveListener } from '../../utils/Hooks';
import { getWalletErrorMessage } from '../../utils/Helpers';
import { setNotificationAction } from '../../store/actions';
import { Modal } from 'react-bootstrap';

const WalletConnect = (props) => {
	const { account, activate, deactivate, connector, error } = useWeb3React();
    const [activatingConnector, setActivatingConnector] = useState();
    const [show, setShow] = useState(false);

    useEffect(() => {
    	if (error) {
	    	let errorMessage = getWalletErrorMessage(error);
	    	props.dispatch(setNotificationAction(errorMessage, 'error'));
	    }
    }, [error])

    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager || !!activatingConnector);

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    const handleConnectWallet = (_connetor) => {
		setActivatingConnector(_connetor);
		activate(_connetor);
		setShow(false);
	}

	const handleClose = () => {
		setShow(false);
	}

	// const checkMetaMaskInstalled = () => {
	// 	const { ethereum } = window;
	// 	return !!ethereum;
	// }

	const handleDisconnectWallet = () => {
		if (connector === walletconnect || connector === walletlink) {
			connector.close();
		} else {
			deactivate();
		}
	}

	return (
		<>
			{
				account ? (
					<div className="">						
						<button className="btn btn-secondary"
							onClick={() => {handleDisconnectWallet()}}
						>{`${account.substring(0, 4)}...${account.substring(account.length - 4)}`}</button>
					</div>
				) : (
					<>
						<button className="px-btn px-btn-theme" onClick={() => {setShow(true)}}>Connect Wallet</button>
					</>
				)
			}
          	<Modal className="wallet-connect-modal" show={show} onHide={handleClose} centered>
				<Modal.Body className="bg-dark">
					<div className="gy-3">
						<div className="text-center mb-1">
							<a href="#" className="btn btn-dark btn-wallet btn-block"
								onClick={() => {handleConnectWallet(injected)}}
							>
								<img className="wallet-logo" src={require('../../assets/images/logos/metamask.svg').default} />
								<div>Metamask</div>
							</a>
						</div>
						<div className="text-center mb-1">
							<a href="#" className="btn btn-dark btn-wallet btn-block"
								onClick={() => {handleConnectWallet(walletconnect)}}
							>
								<img className="wallet-logo" src={require('../../assets/images/logos/walletconnect.svg').default} />
								<div>WalletConnect</div>
							</a>
						</div>
						<div className="text-center">
							<a href="#" className="btn btn-dark btn-wallet btn-block"
								onClick={() => {handleConnectWallet(walletlink)}}
							>
								<img className="wallet-logo" src={require('../../assets/images/logos/coinbase-wallet.svg').default} />
								<div>Coinbase Wallet</div>
							</a>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
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
)(WalletConnect));