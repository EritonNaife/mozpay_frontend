export interface NavItem { id: string; icon: string; label: string; href: string; }

export const MERCHANT_NAV: NavItem[] = [
	{ id: 'home',    icon: 'home',  label: 'Início',   href: '/merchant' },
	{ id: 'plans',   icon: 'doc',   label: 'Planos',   href: '/merchant/plans' },
	{ id: 'clients', icon: 'users', label: 'Clientes', href: '/merchant/customers' },
	{ id: 'account', icon: 'store', label: 'Negócio',  href: '/merchant/account' },
];

export const CUSTOMER_NAV: NavItem[] = [
	{ id: 'home',    icon: 'home',   label: 'Início',    href: '/customer' },
	{ id: 'plans',   icon: 'doc',    label: 'Planos',    href: '/customer/plans' },
	{ id: 'score',   icon: 'shield', label: 'Confiança', href: '/customer/score' },
	{ id: 'profile', icon: 'user',   label: 'Perfil',    href: '/customer/profile' },
];

export function isActive(href: string, pathname: string, rootHref: string): boolean {
	if (href === rootHref) return pathname === rootHref;
	return pathname === href || pathname.startsWith(href + '/');
}
