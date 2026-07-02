function toCamel(key: string): string {
	return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function toCamelCase<T>(value: unknown): T {
	if (value === null || value === undefined) return value as T;
	if (Array.isArray(value)) return value.map((item) => toCamelCase(item)) as T;
	if (typeof value === 'object' && !(value instanceof Date)) {
		const result: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
			result[toCamel(key)] = toCamelCase(val);
		}
		return result as T;
	}
	return value as T;
}
