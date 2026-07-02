/** Group digits with dots (pt-MZ convention) */
export function grp(n: number): string {
	return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Format as "12.500 MT" */
export function money(n: number): string {
	return grp(n) + ' MT';
}

/** Format as "5.333,33 MT" */
export function moneyDec(n: number): string {
	const f = n.toFixed(2).split('.');
	return grp(+f[0]) + ',' + f[1] + ' MT';
}

/** Just the grouped number, no currency */
export function money0(n: number): string {
	return grp(n);
}
