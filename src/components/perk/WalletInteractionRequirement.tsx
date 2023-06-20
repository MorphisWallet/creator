import { api } from '@/utils/api'
import { Button } from '@mantine/core'

export const WalletInteractionRequirement = () => {
  const { data, refetch } = api.blockchain.getContractAbi.useQuery(
    {
      blockchain: 'Etherum',
      contractAddress: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  )

  return (
    <div>
      <Button onClick={() => void refetch()}>Fetch</Button>
    </div>
  )
}
