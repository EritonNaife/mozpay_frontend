export interface NavItem { id: string; icon: string; label: string; href: string; }

// Main sidebar group for the merchant area.
export const MERCHANT_NAV: NavItem[] = [
	{ id: 'home',     icon: 'home',    label: 'Painel',       href: '/merchant' },
	{ id: 'plans',    icon: 'store',   label: 'Vendas',       href: '/merchant/plans' },
	{ id: 'clients',  icon: 'users',   label: 'Clientes',     href: '/merchant/customers' },
	{ id: 'payment',  icon: 'wallet',  label: 'Pagamentos',   href: '/merchant/payment' },
	{ id: 'stats',    icon: 'receipt', label: 'Estatísticas', href: '/merchant/stats' },
	{ id: 'disputes', icon: 'flag',    label: 'Disputas',     href: '/merchant/disputes' },
];

// Footer group pinned to the bottom of the merchant sidebar.
export const MERCHANT_NAV_FOOTER: NavItem[] = [
	{ id: 'alerts',  icon: 'bell', label: 'Alertas', href: '/merchant/notifications' },
	{ id: 'account', icon: 'user', label: 'Conta',   href: '/merchant/account' },
];

// Mobile tab bar subset (5 tabs).
export const MERCHANT_TABS: NavItem[] = [
	{ id: 'home',    icon: 'home',   label: 'Painel',   href: '/merchant' },
	{ id: 'plans',   icon: 'store',  label: 'Vendas',   href: '/merchant/plans' },
	{ id: 'clients', icon: 'users',  label: 'Clientes', href: '/merchant/customers' },
	{ id: 'payment', icon: 'wallet', label: 'Pagam.',   href: '/merchant/payment' },
	{ id: 'account', icon: 'user',   label: 'Conta',    href: '/merchant/account' },
];

export const CUSTOMER_NAV: NavItem[] = [
	{ id: 'home',    icon: 'home',   label: 'Início',    href: '/customer' },
	{ id: 'plans',   icon: 'doc',    label: 'Planos',    href: '/customer/plans' },
	{ id: 'score',   icon: 'trophy', label: 'Confiança', href: '/customer/score' },
	{ id: 'profile', icon: 'user',   label: 'Conta',     href: '/customer/profile' },
];

// Root href (e.g. /merchant) is active only on the exact path; every other item
// highlights on its own subtree, so Clientes stays active on
// /merchant/customers/[id] and Vendas on /merchant/plans/*.
export function isActive(href: string, pathname: string, rootHref: string): boolean {
	if (href === rootHref) return pathname === rootHref;
	return pathname === href || pathname.startsWith(href + '/');
}
