import { walletAPI } from './api'

export const walletService = {
  getBalance: () => walletAPI.getBalance(),
  
  getTransactions: (params) => walletAPI.getTransactions(params),
  
  getUserWallet: (userId) => walletAPI.getUserWallet(userId),
  
  getAdminOverview: () => walletAPI.getAdminOverview(),
  
  addFunds: (data) => walletAPI.addFunds(data),
  
  withdraw: (data) => walletAPI.withdraw(data),
}

export default walletService
