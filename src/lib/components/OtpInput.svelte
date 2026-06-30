<script lang="ts">
	interface Props {
		value?: string;
		length?: number;
		oncomplete?: (code: string) => void;
		disabled?: boolean;
	}
	let { value = $bindable(''), length = 6, oncomplete, disabled = false }: Props = $props();

	let boxes = $state(Array.from({ length }, () => ''));
	let refs = $state<HTMLInputElement[]>([]);

	function focusAt(idx: number) {
		const el = refs[idx];
		if (el) el.focus();
	}

	function handleInput(idx: number, e: Event) {
		const inp = e.target as HTMLInputElement;
		let val = inp.value.replace(/\D/g, '');
		if (val.length > 1) {
			val = val[val.length - 1];
		}
		boxes[idx] = val;
		if (val && idx < length - 1) {
			focusAt(idx + 1);
		}
		syncValue();
	}

	function handleKeydown(idx: number, e: KeyboardEvent) {
		if (e.key === 'Backspace' && !boxes[idx] && idx > 0) {
			boxes[idx - 1] = '';
			focusAt(idx - 1);
			syncValue();
			e.preventDefault();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const data = e.clipboardData?.getData('text') ?? '';
		const digits = data.replace(/\D/g, '').slice(0, length);
		for (let i = 0; i < length; i++) {
			boxes[i] = digits[i] ?? '';
		}
		focusAt(Math.min(digits.length, length - 1));
		syncValue();
	}

	function syncValue() {
		value = boxes.join('');
		if (value.length === length) {
			oncomplete?.(value);
		}
	}
</script>

<div style="display:flex;gap:9px" onpaste={handlePaste}>
	{#each boxes as d, i}
		<input
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength="1"
			aria-label="Dígito {i + 1} de {length}"
			bind:this={refs[i]}
			disabled={disabled}
			value={d}
			oninput={(e) => handleInput(i, e)}
			onkeydown={(e) => handleKeydown(i, e)}
			style="flex:1 1 0;height:62px;border-radius:15px;border:1.5px solid var(--line);background:var(--surface);text-align:center;font-family:var(--display);font-size:26px;font-weight:600;color:var(--ink);outline:none;-moz-appearance:textfield"
		/>
	{/each}
</div>
