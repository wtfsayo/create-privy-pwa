import AuthenticatedPage from '@/components/authenticated-page'
import Section from '@/components/section'
import { links } from '@/lib/links'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { createWalletClient, custom, parseEther } from 'viem'
import { base } from 'viem/chains'

const suggestedAmounts = [
	0.025, 0.05, 0.1, 0.5
]

const LoadAssets = () => {
	const { connectWallet } = usePrivy()
	const { wallets } = useWallets()
	const embeddedWallet = wallets.find(
		(wallet) => wallet.walletClientType === 'privy'
	)
	const externalWallet = wallets.find(
		(wallet) => wallet.walletClientType !== 'privy'
	)
	const [txIsLoading, setTxIsLoading] = useState(false)
	const [txHash, setTxHash] = useState<string | undefined>()

	const [selectedAmount, setSelectedAmount] = useState<number>(suggestedAmounts[0]);

	const handleAmountClick = (amount: typeof selectedAmount[0]) => {
	  setSelectedAmount(amount);
	};

	const onTransfer = async () => {
		if (!externalWallet || !embeddedWallet) return
		try {
			// Switch chain to Base Goerli
			await externalWallet.switchChain(base.id)

			// Build viem wallet client for external wallet
			const provider = await externalWallet.getEthereumProvider()
			const walletClient = createWalletClient({
				account: externalWallet.address as `0x${string}`,
				chain: base,
				transport: custom(provider),
			})

			// Send transaction from external wallet
			setTxIsLoading(true)
			const _txHash = await walletClient.sendTransaction({
				account: externalWallet.address as `0x${string}`,
				to: embeddedWallet.address as `0x${string}`,
				value: parseEther(selectedAmount.toString()),
			})
			setTxHash(_txHash)
		} catch (e) {
			console.error('Transfer failed with error ', e)
		}
		setTxIsLoading(false)
	}

	const onAddNetwork = async () => {
		if (!externalWallet) return
		const provider = await externalWallet.getEthereumProvider()
		await provider.request({
			method: 'wallet_addEthereumChain',
			params: [
				{
					chainId: `0x${base.id.toString(16)}`,
					chainName: base.name,
					nativeCurrency: base.nativeCurrency,
					rpcUrls: [base.rpcUrls.public?.http[0] ?? ''],
					blockExplorerUrls: [base.blockExplorers?.default.url ?? ''],
				},
			],
		})
	}

	return (
		<AuthenticatedPage>
			<Section>
				<p className='text-md mt-2 font-bold uppercase text-gray-700'>
					Your Trenches wallet
				</p>
				<textarea
					value={
						embeddedWallet?.address
					}
					className='mt-4 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50'
					rows={1}
					readOnly
				/>
				<p className='text-md mt-2 font-bold uppercase text-gray-700'>
					Your external wallet
				</p>
				<p className='text-sm text-gray-600'></p>
				{!externalWallet && <button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
					onClick={connectWallet}
				>
					Connect External Wallet
				</button>}
				<textarea
					value={
						externalWallet?.address
							
					}
					className='mt-4 h-fit w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50'
					rows={1}
					readOnly
				/>
				
				<p className='text-md mt-6 font-bold uppercase text-gray-700'>
					Amount to fund
				</p>
				{/* <input type="number" className='mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50' placeholder="amount in eth" value={selectedAmount} disabled/> */}
				{/* <p className='mt-2 text-sm text-gray-600'>
				you can only select from suggested amounts for now
				</p> */}
				<div className="flex flex-row gap-4">
      {suggestedAmounts.map((amount) => (
        <button
          key={amount}
          onClick={() => handleAmountClick(amount)}
          className={`my-4 w-1/3 rounded-md px-2 py-2.5 text-xs font-semibold shadow-sm transition-colors
            ${selectedAmount === amount 
              ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-600 ring-offset-2' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            }`}
        >
          {amount}
        </button>
      ))}
    </div>
				
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
					onClick={onTransfer}
					disabled={!externalWallet || txIsLoading}
				>
					Fund Trenches Wallet
				</button>
				{txHash && (
					<p className='mt-2 text-sm italic text-gray-600'>
						See your transaction on{' '}
						<a
							className='underline'
							href={`${links.base.transactionExplorer}${txHash}`}
							target='_blank'
							rel='noreferrer noopener'
						>
							basescan
						</a>
						.
					</p>
				)}
			</Section>
		</AuthenticatedPage>
	)
}

export default LoadAssets
