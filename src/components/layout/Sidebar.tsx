import { createStyles, Navbar, getStylesRef, rem, Center } from '@mantine/core'
import { IconPaint, IconLogout, IconSettings } from '@tabler/icons-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import LogoImage from '@/assets/images/airdawg-logo.png'
import Image from 'next/image'
import { useRouter } from 'next/router'

const useStyles = createStyles(theme => ({
  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },

  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}))

const data = [
  { link: '/dashboard/project', label: 'Project', icon: IconPaint },
  { link: '/dashboard/settings', label: 'Settings', icon: IconSettings },
]

export const Sidebar = () => {
  const { classes, cx } = useStyles()
  const router = useRouter()

  const links = data.map(item => (
    <Link
      className={cx(classes.link, { [classes.linkActive]: router.pathname.startsWith(item.link) })}
      href={item.link}
      key={item.label}
    >
      <item.icon
        className={classes.linkIcon}
        stroke={1.5}
      />
      <span>{item.label}</span>
    </Link>
  ))

  return (
    <Navbar
      mih="100vh"
      width={{ sm: 300 }}
      p="md"
      sx={{
        zIndex: 99,
      }}
    >
      <Navbar.Section grow>
        <Center mb={32}>
          <Image
            src={LogoImage}
            width={135}
            height={76}
            alt="Logo of Airdawg Creator"
            priority
          />
        </Center>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={event => {
            event.preventDefault()
            void signOut({
              callbackUrl: `${window.location.origin}`,
            })
          }}
        >
          <IconLogout
            className={classes.linkIcon}
            stroke={1.5}
          />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  )
}
