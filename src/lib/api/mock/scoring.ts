import type { ApiResult } from '../client';
import type { CustomerScore } from '../scoring';

export async function getCustomerScore(): Promise<ApiResult<CustomerScore>> {
    return {
        ok: true,
        data: { score: 78, label: 'Building' },
    };
}
