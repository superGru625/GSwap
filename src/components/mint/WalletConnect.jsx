import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect, walletlink } from '../../utils/Connectors';
// import { useEagerConnect, useInactiveListener } from '../../utils/Hooks';
import { getWalletErrorMessage } from '../../utils/Helpers';
import { Modal } from 'react-bootstrap';

const WalletConnect = () => {
	const { account, activate, deactivate, connector, error } = useWeb3React();
    const [activatingConnector, setActivatingConnector] = useState();
    const [show, setShow] = useState(false);

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
				error && (
					<p className="text-danger mb-4 mw-500px mx-auto">
						{ getWalletErrorMessage(error) }
					</p>
				)
			}
			{
				account ? (
					<div className="d-flex flex-wrap flex-column justify-content-center align-items-center mb-5">
						<p className="w-100 text-center mb-0 text-center mb-2 text-white">
							Connected: <b>{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</b>
						</p>
						<button className="btn btn-secondary"
							onClick={() => {handleDisconnectWallet()}}
						>Disconnect</button>
					</div>
				) : (
					<>
						<button className="px-btn px-btn-theme btn-lg" onClick={() => {setShow(true)}}>Connect Wallet</button>
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

export default WalletConnect;