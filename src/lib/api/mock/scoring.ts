import type { ApiResult } from '../client';
import type { CustomerScore } from '../scoring';

export async function getCustomerScore(): Promise<ApiResult<CustomerScore>> {
    return {
        ok: true,
        data: {
            score: 72,
            label: 'Building',
            tier: 'Perfil em consolidação',
            scoreOutOf: 100,
            factors: [
                { icon: 'check', label: 'Pontualidade', value: '2 de 2 a tempo', tone: 'green' },
                { icon: 'clock', label: 'Planos concluídos', value: '0 concluídos', tone: 'slate' },
                { icon: 'check', label: 'Disputas', value: 'Nenhuma', tone: 'green' },
            ],
        },
    };
}
