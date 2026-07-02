import type { ApiResult } from '../client';
import type { OtpVerifyResponse, Role } from '../types';
import { uuid } from '../data';

export function requestOtp(_phone: string, _role?: Role): Promise<ApiResult<{ status: string }>> {
    return Promise.resolve({ ok: true, data: { status: 'otp_sent' } });
}

export function verifyOtp(_phone: string, _code: string): Promise<ApiResult<OtpVerifyResponse>> {
    return Promise.resolve({
        ok: true,
        data: {
            jwt: `mock_jwt_${uuid()}`,
            roles: ['MERCHANT', 'CUSTOMER'],
            is_new: false,
            has_pin: true,
        },
    });
}

export function setPin(_pin: string, _oldPin?: string): Promise<ApiResult<{ status: string }>> {
    return Promise.resolve({ ok: true, data: { status: 'pin_set' } });
}
