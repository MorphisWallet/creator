export const maskAddress = (address?: string) => {
  if (!address || address === '') return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
