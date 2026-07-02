import * as real from './modules';
import * as mock from './mock';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export const {
    requestOtp,
    verifyOtp,
    setPin,
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
    listPaymentHistory,
    getPaymentStats,
    listNotifications,
    markRead,
} = useMock ? mock : real;
