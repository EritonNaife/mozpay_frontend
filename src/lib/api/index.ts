import * as real from './api-modules';
import * as mock from './mock';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export const {
    requestOtp,
    verifyOtp,
    setPin,
    getMerchantDashboard,
    getProfile,
    createProfile,
    listPlans,
    getPlan,
    previewPlan,
    createPlan,
    getConfirmationContext,
    confirmPlan,
    rejectPlan,
    cancelPlan,
    disputePlan,
    startPaymentRegistrationSession,
    recordPayment,
    confirmPayment,
    listPayments,
    listCustomers,
    getCustomer,
    getCustomerDashboard,
    listNotifications,
    markRead,
    listDisputes,
    createDispute,
    resolveDispute,
    getCustomerScore,
} = useMock ? mock : real;
