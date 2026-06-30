<script lang="ts">
	import { goto } from '$app/navigation';
	import { Brand } from '$lib/components/index.js';
	import { auth } from '$lib/stores';

	$effect(() => {
		if (auth.isAuthenticated) {
			goto(auth.roles.includes('MERCHANT') ? '/merchant' : '/customer');
		}
	});
</script>

<div class="mz-screen" style="justify-content:center;align-items:center;gap:24px;min-height:100dvh;background:var(--hero-gradient-dark)">
	<Brand size={72} showName light />
	<p style="color:rgba(255,255,255,.7);font-size:15px;font-weight:500;text-align:center;max-width:280px">
		Pagamentos a prestações — sem burocracia
	</p>
	<div style="display:flex;gap:12px;margin-top:20px">
		<a href="/merchant/onboarding" style="display:inline-flex;align-items:center;justify-content:center;height:50px;padding:0 24px;border-radius:14px;background:#fff;color:var(--blue-800);font-weight:600;font-size:15px;text-decoration:none;font-family:var(--ui)">
			Comerciante
		</a>
		<a href="/customer/login" style="display:inline-flex;align-items:center;justify-content:center;height:50px;padding:0 24px;border-radius:14px;background:rgba(255,255,255,.15);color:#fff;font-weight:600;font-size:15px;text-decoration:none;border:1px solid rgba(255,255,255,.2);font-family:var(--ui)">
			Cliente
		</a>
	</div>
</div>
