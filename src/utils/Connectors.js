import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { NETWORK_CHAIN_ID, NETWORK_CHAIN_RPC } from '../Constants';
export const injected = new InjectedConnector({ supportedChainIds: [NETWORK_CHAIN_ID] });

export const walletconnect = new WalletConnectConnector({
	rpc: { [NETWORK_CHAIN_ID]: NETWORK_CHAIN_RPC },
	rpcUrl: NETWORK_CHAIN_RPC,
	chainId: NETWORK_CHAIN_ID,
	qrcode: true,
	pollingInterval: 12000
});

export const walletlink = new WalletLinkConnector({
	url: NETWORK_CHAIN_RPC,
	appName: 'GSWAP',
	supportedChainIds: [NETWORK_CHAIN_ID]
});