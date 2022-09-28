import { UnsupportedChainIdError } from '@web3-react/core';
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';

import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { NETWORK_CHAIN_NAME } from '../Constants';

export const getWalletErrorMessage = (err) => {
    if (err instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
    } else if (err instanceof UnsupportedChainIdError) {
        return `Change Wallet Network to ${NETWORK_CHAIN_NAME.toUpperCase()}.`;
    } else if (err instanceof UserRejectedRequestErrorInjected ||
        err instanceof UserRejectedRequestErrorWalletConnect ||
        err.toString().includes("denied account authorization")) {
        return 'Please authorize this website to access your account.';
    } else if (err) {
        return 'An unknown error occurred. Check the console for more details.';
    } else {
        return false;
    }
}