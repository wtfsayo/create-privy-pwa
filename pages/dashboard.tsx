import AuthenticatedPage from '@/components/authenticated-page'
import Section from '@/components/section'
import { usePrivy } from '@privy-io/react-auth'
import { links } from '@/lib/links'
import { LinkAccounts } from '@/components/link-accounts'

const Dashboard = () => {
	return (
		<AuthenticatedPage>
			<Section>
				<p className='text-md mt-2 font-bold uppercase text-gray-700'>
					Recent Launches
				</p>
				<div className='flex flex-row gap-2'>
				<p className='mt-2 text-sm text-gray-600'>
					Your ETH Balance:
				</p>
				<p className='mt-2 text-sm text-gray-600'>
					0.001
				</p>
				</div>
				{/* <LinkAccounts/> */}
			</Section>
			
		</AuthenticatedPage>
	)
}

export default Dashboard
