<script lang="ts">
	import { StatusBar, AppBar, Icon, Btn, Footer, HomeIndicator } from '$lib/components/index.js';
	import { auth } from '$lib/stores';
</script>

<StatusBar />
<AppBar />

<div class="mz-body mz-body--pad" style="overflow:hidden">
	<div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:14px">
		<div style="width:88px;height:88px;border-radius:50%;background:var(--green-tint);display:flex;align-items:center;justify-content:center">
			<div style="width:62px;height:62px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;color:#fff">
				<Icon name="check" size={32} stroke={2.6} />
			</div>
		</div>
		<h1 class="mz-h1" style="margin-top:20px;font-size:23px">Pagamento confirmado</h1>
		<p class="mz-sub" style="margin-top:8px;max-width:285px">
			Boa, {auth.phone || 'Cliente'}! Continue a pagar a tempo para melhorar a sua pontuação.
		</p>
	</div>

	<!-- Score boost banner -->
	<div class="mz-card mz-card--pad" style="margin-top:22px;display:flex;align-items:center;gap:14px;background:var(--green-tint);border:none">
		<Icon name="arrowUp" size={26} stroke={2} style="color:var(--green);flex:0 0 auto" />
		<div>
			<div style="font-weight:700;font-size:14px;color:var(--green)">A sua pontuação sobe</div>
			<div style="font-size:12.5px;color:var(--ink-2);margin-top:2px;line-height:1.4">Cada prestação a tempo conta. Está mais perto de melhores condições.</div>
		</div>
	</div>
</div>

<Footer>
	<a href="/customer" style="text-decoration:none"><Btn variant="primary" block lg>Concluído</Btn></a>
</Footer>
<HomeIndicator />
