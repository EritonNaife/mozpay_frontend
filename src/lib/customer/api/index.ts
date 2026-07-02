import * as real from './modules';
import * as mock from './mock';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export const {
    getCustomerScore,
    getCustomerDashboard,
} = useMock ? mock : real;
