import * as real from './modules';
import * as mock from './mock';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export const {
    getMerchantDashboard,
    getMerchantStats,
    getProfile,
    createProfile,
    listDisputes,
    createDispute,
    resolveDispute,
    addDisputeNote,
    resolveMerchantDispute,
    listCustomers,
    getCustomer,
    getCustomerDetail,
} = useMock ? mock : real;
