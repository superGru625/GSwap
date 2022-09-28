import { useState } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';

import WalletConnect from './WalletConnect';
import MintForm from './MintForm';

import * as API from '../../store/web3api';
import { setNotificationAction } from '../../store/actions';

const MintSection = () => {
	const { account } = useWeb3React();
	const [chkAddress, setChkAddress] = useState('');
	const [checking, setChecking] = useState(false);


	return (
		<>
			<div 
              	className="section-mint"
              	data-aos="fade-up"
              	data-aos-duration="1200"
              	data-aos-delay="100"
            >
              	<WalletConnect />
              	{
					account && (
						<MintForm />
					)
				}
            </div>
		</>
	)
}

export default MintSection;