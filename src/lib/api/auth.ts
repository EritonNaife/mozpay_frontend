import { api } from './client';
import type { OtpVerifyResponse, Role } from './types';

export function requestOtp(phone: string, role?: Role) {
    const body: { phone_number: string; role?: Role } = { phone_number: phone };
    if (role) body.role = role;
    return api<{ status: string }>('/auth/request-otp', {
        method: 'POST',
        body,
    });
}

export function verifyOtp(phone: string, code: string) {
    return api<OtpVerifyResponse>('/auth/verify-otp', {
        method: 'POST',
        body: { phone_number: phone, code },
    });
}

export function setPin(pin: string, oldPin?: string) {
	const body: { pin: string; old_pin?: string } = { pin };
	if (oldPin) body.old_pin = oldPin;
	return api<{ status: string }>('/auth/set-pin', {
		method: 'POST',
		body,
	});
}
