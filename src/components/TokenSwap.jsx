import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { GrPowerCycle } from "react-icons/gr";
import { BigNumber } from "bignumber.js";

import { injected, walletconnect, walletlink } from '../utils/Connectors';
// import { useEagerConnect, useInactiveListener } from '../utils/Hooks';
import { getWalletErrorMessage } from '../utils/Helpers';
import * as WEB3API from '../store/web3api';
import { setNotificationAction } from '../store/actions';

import { Modal, Card } from "react-bootstrap";

BigNumber.config({ EXPONENTIAL_AT: 30 })
const TokeSwap = (props) => {
    const { account, library, activate, deactivate, connector, error } = useWeb3React();
    // const [activatingConnector, setActivatingConnector] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [showWallet, setShowWallet] = useState(false);
    
    const [v1TokenBalance, setV1TokenBalance] = useState('0');
    const [v1MigratingTokenBalance, setV1MigratingTokenBalance] = useState('0');
    const [v2TokenBalance, setV2TokenBalance] = useState('0');
    const [v2TokenAmount, setV2TokenAmount] = useState('0');
    const [timestamp, setTimestamp] = useState('');
    const [hash, setHash] = useState('');
    const [signature, setSignature] = useState('');

    const [isApproved, setIsApproved] = useState(false);
    
    const { notification, dispatch } = props;

    useEffect(() => {
        if (account) {
            setIsLoading(true);
            checkIsApproved();
            getV1TokenBalance();
            getV2TokenBalance();
            getMigratingV1TokenAmount();
        }
        else {
            setIsLoading(false);
            setV1TokenBalance('0')
            setV1MigratingTokenBalance('0')
            setV2TokenBalance('0')
            setV2TokenAmount('0')
        }
    }, [account])

    useEffect(() => {
        if (v1MigratingTokenBalance && v1MigratingTokenBalance !== '0') {
            calculateV2TokeAmount()
        }
        else {
            setV2TokenAmount('0')
        }
    }, [v1MigratingTokenBalance])

    useEffect(() => {
        if (notification.type === 'SUBMITTED_TRANSACTION') {
            props.dispatch(setNotificationAction("Confirmed the transaction.", 'info'));            
        }
        else if (notification.type === 'SUCCEEDED_APPROVE') {
            props.dispatch(setNotificationAction("Approved successfully.", 'success'));
            checkIsApproved()
        }
        else if (notification.type === 'SUCCEEDED_MIGRATE') {
            props.dispatch(setNotificationAction("Migrated successfully.", 'success'));
            getMigratingV1TokenAmount();
            getV2TokenBalance()
        }
    }, [notification]);

    useEffect(() => {
        if (error) {
            let errorMessage = getWalletErrorMessage(error);
            props.dispatch(setNotificationAction(errorMessage, 'error'));
        }
    }, [error])

    // const triedEager = useEagerConnect();
    // useInactiveListener(!triedEager || !!activatingConnector);

    // useEffect(() => {
    //     console.log(connector)
    //     if (activatingConnector && activatingConnector === connector) {
    //         setActivatingConnector(undefined);
    //     }
    // }, [activatingConnector, connector]);

    const handleConnectWallet = (_connetor) => {
        // setActivatingConnector(_connetor);
        activate(_connetor);
        setShowWallet(false);
    }

    const showWalletModal = () => {
        setShowWallet(true);
    }

    const handleClose = () => {
        setShowWallet(false);
    }

    const handleDisconnectWallet = () => {
        let result = window.confirm("Are you sure to disconnect wallet?")
        if (result) {
            if (connector === walletconnect || connector === walletlink) {
                connector.close();
            } else {
                deactivate();
            }
        }
    }

    const checkIsApproved = async () => {
        try {            
            let allowance = await WEB3API.checkIsApproved(account, library);
            if (BigNumber(allowance).comparedTo(BigNumber('100000000000000000000')) === 1) {
                setIsApproved(true)
            }
            else {
                setIsApproved(false)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getV1TokenBalance = async () => {
        try {
            let balance = await WEB3API.getV1TokenBalance(account, library);
            setV1TokenBalance(balance)
        } catch(err) {
            console.log(err);
        }
    }

    const getV2TokenBalance = async () => {
        try {
            let balance = await WEB3API.getV2TokenBalance(account, library);
            setV2TokenBalance(balance)
        } catch(err) {
            console.log(err);
        }
    }

    const getMigratingV1TokenAmount = async () => {
        let data = await WEB3API.getMigratingAmount({amount: v1TokenBalance, account}, library);
        if (data.amount) {
            setV1MigratingTokenBalance(WEB3API.WeiToEth(data.amount));
            setTimestamp(data.timestamp)
            setHash(data.hash)
            setSignature(data.signature)
        }
        else {
            setV1MigratingTokenBalance('0')
            setTimestamp('')
            setHash('')
            setSignature('')
        }
        setIsLoading(false);
    }

    const calculateV2TokeAmount = async () => {
        if (v1MigratingTokenBalance && v1MigratingTokenBalance != '0') {
            let amount = await WEB3API.getV2Amount({amount: v1MigratingTokenBalance}, library);
            amount = BigNumber(amount).toFixed(0);
            setV2TokenAmount(amount.toString())
        }
    }

    const approve = (e) => {
        if (!account) {
            alert("Connect your wallet.");
            setShowWallet(true);
            return;
        }

        if (v1MigratingTokenBalance === '' || v1MigratingTokenBalance === '0' || v1MigratingTokenBalance === 0 || v1TokenBalance === undefined) {
            alert("You don't own GOMA V1 token.");
            return;
        }

        try {
            WEB3API.approve({amount: v1MigratingTokenBalance, account}, library, dispatch);
        } catch(err) {
            console.log(err);
        }        
    }

    const migrate = (e) => {
        if (!account) {
            alert("Connect your wallet.");
            setShowWallet(true);
            return;
        }

        try {
            WEB3API.migrate({amount: v1MigratingTokenBalance, timestamp: timestamp, hash:hash, signature:signature, account}, library, dispatch);
        } catch(err) {
            console.log(err);
        }        
    }

    return (
        <>
            {
                account ? (
                    <div className="d-flex justify-content-center btn-disconnect-wrapper">
                        <button className="btn btn-secondary rounded-pill btn-disconnect" onClick={() => {handleDisconnectWallet()}}>{`${account.substring(0, 8)}...${account.substring(account.length - 6)}`}</button>
                    </div>
                ) : ( "" )
            }
            <div className="d-flex justify-content-center">
                <Card className="swap-box shadow-lg">
                    <Card.Body>
                        <Card.Title className="text-center mb-5">
                            <h4>GSWAP Phase 2</h4>
                        </Card.Title>
                        <div className="text-secondary d-flex justify-content-between px-4">
                            <small>From</small>
                            <small>Balance: {BigNumber(v1MigratingTokenBalance).toFixed(0)}</small>
                        </div>
                        <div className="from-section d-flex justify-content-between align-items-center rounded-pill">
                            <h6 className="m-0">
                                <img
                                  className="me-2"
                                  src="/img/logo-v1.png"
                                  alt="GOMA V1"
                                />
                                GOMA V1
                            </h6>
                            <h4 className="text-end">{BigNumber(v1MigratingTokenBalance).toFixed(0)}</h4>
                        </div>
                        <div className="pt-4 text-center position-relative">
                            <h1 className="exchange-icon"><GrPowerCycle color='aliceblue'/></h1>
                            {/*<div className="position-absolute percent-fee">
                                🤑 <span className="">-8%</span>
                            </div>*/}
                        </div>
                        <div className="text-secondary d-flex justify-content-between px-4">
                            <small>To</small>
                            <small>Balance: {BigNumber(v2TokenBalance).toFixed(0)}</small>
                        </div>
                        <div className="to-section d-flex justify-content-between align-items-center rounded-pill">
                            <h6 className="m-0">
                                <img
                                  className="me-2"
                                  src="/img/logo-v2.png"
                                  alt="GOMA V2"
                                />
                                GOMA V2
                            </h6>
                            <h4 className="text-end">{BigNumber(v2TokenAmount).toFixed(0)}</h4>
                        </div>
                        <div className="d-grid mt-4 pt-2">
                        {
                            account ? (
                                <>
                                    {
                                        isApproved ? (
                                            <button className="btn btn-info btn-lg rounded-pill text-white" onClick={migrate}>Migrate</button>
                                            // <button className="btn btn-info btn-lg rounded-pill text-white" disabled>Migrate</button>
                                        ) : (
                                            <button className="btn btn-info btn-lg rounded-pill text-white" onClick={approve}>Approve</button>
                                            // <button className="btn btn-info btn-lg rounded-pill text-white" disabled>Approve</button>
                                        )
                                    }
                                </>
                            ) : (
                                <button className="btn btn-info btn-lg rounded-pill text-white" onClick={showWalletModal}>Connect your wallet</button>
                            )                            
                        }
                        </div>
                    </Card.Body>
                    {
                        isLoading ? (
                            <div className="loading-box d-flex justify-content-center align-items-center">
                                <span className="spinner" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </span>
                            </div>
                        ) : ""
                    }                    
                </Card>
            </div>
            <div className="d-flex justify-content-center">
                <div className="bottom-description mt-4 pb-2 text-center">
                    For those moving from v1 to v2, please be aware that only v1 tokens bought before liquidity was removed at 3:59pm UTC on the 15th of April are able to be swapped. As announced GOMA V1 tax (8%) applies to all GOMA V1 swaps.
                </div>
            </div>
            <Modal className="wallet-connect-modal" show={showWallet} onHide={handleClose} centered>
                <Modal.Body className="bg-dark">
                    <div className="gy-3">
                        <div className="text-center mb-1 d-grid">
                            <button href="#" className="btn btn-dark btn-block"
                                onClick={() => {handleConnectWallet(injected)}}
                            >
                                <img className="wallet-logo" src={require('../assets/images/logos/metamask.svg').default} />
                                <div>Metamask</div>
                            </button>
                        </div>
                        <div className="text-center mb-1 d-grid">
                            <button href="#" className="btn btn-dark btn-block"
                                onClick={() => {handleConnectWallet(walletconnect)}}
                            >
                                <img className="wallet-logo" src={require('../assets/images/logos/walletconnect.svg').default} />
                                <div>WalletConnect</div>
                            </button>
                        </div>
                        <div className="text-center d-grid">
                            <button href="#" className="btn btn-dark btn-wallet btn-block"
                                onClick={() => {handleConnectWallet(walletlink)}}
                            >
                                <img className="wallet-logo" src={require('../assets/images/logos/coinbase-wallet.svg').default} />
                                <div>Coinbase Wallet</div>
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

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
)(TokeSwap));
