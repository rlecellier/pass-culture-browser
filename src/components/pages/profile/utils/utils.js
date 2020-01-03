import formatDecimals from '../../../../utils/numbers/formatDecimals'

const getAvailableBalanceByType = walletBalance => ({ actual, max }) => {
  const maximumAvailableByType = max - actual
  const actualAvailableByType = Math.min(walletBalance, maximumAvailableByType)
  return formatDecimals(actualAvailableByType)
}

export default getAvailableBalanceByType