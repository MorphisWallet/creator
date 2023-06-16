import { Box, Group } from '@mantine/core'
import { Sidebar } from '@/components/layout/Sidebar'
import { UserProfile } from '@/components/layout/UserProfile'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Group
      align="start"
      noWrap
      spacing={0}
    >
      <Sidebar />
      <Box
        w={'100%'}
        mah={'100vh'}
        sx={{ overflow: 'auto' }}
        p={16}
      >
        <UserProfile />
        <Box>{children}</Box>
      </Box>
    </Group>
  )
}
