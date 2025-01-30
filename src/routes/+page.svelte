<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AmbientLight,
		BackSide,
		Box3,
		BoxGeometry,
		DirectionalLight,
		Euler,
		HemisphereLight,
		Mesh,
		MeshBasicMaterial,
		MeshStandardMaterial,
		PerspectiveCamera,
		Scene,
		SphereGeometry,
		TextureLoader,
		Vector3,
		WebGLRenderer
	} from 'three';
	import {
		Font,
		FontLoader,
		GLTFLoader,
		OrbitControls,
		TextGeometry
	} from 'three/examples/jsm/Addons.js';

	let scene: Scene;
	let camera: PerspectiveCamera;
	let renderer: WebGLRenderer;

	let canvas: HTMLCanvasElement;

	onMount(async () => {
		scene = new Scene();

		camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 30000);
		camera.position.set(-8, 0.4, 0);
		camera.setRotationFromEuler(new Euler(0, -Math.PI / 2, 0));

		renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		let hat = (await new GLTFLoader().loadAsync('models/hat.glb')).scene;
		hat.position.set(0, 1.25, 0);
		hat.rotation.set(0, (-31 / 180) * Math.PI, (18 / 180) * Math.PI);
		scene.add(hat);

		const light = new AmbientLight(0xffffff, 2);
		scene.add(light);

		const spotlight = new DirectionalLight(0xffffff, 5);
		spotlight.position.set(11, 10, -22);
		spotlight.lookAt(hat.position);
		scene.add(spotlight);

		const hemispherelight = new HemisphereLight(0x3894e1, 0x3894e1, 1);
		scene.add(hemispherelight);

		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();

		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
	});
</script>

<div class="bg-[#3894e1]">
	<div class="flex h-screen w-full items-center justify-center">
		<canvas class="absolute z-20" bind:this={canvas}></canvas>
		<img class="absolute z-10 h-full w-full object-cover" src="/clouds.png" alt="" />
		<img class="absolute z-30 h-full w-full object-cover opacity-50" src="/clouds.png" alt="" />
		<img
			class="absolute h-full w-full rotate-180 object-cover opacity-20"
			src="/clouds.png"
			alt=""
		/>

		<img class="mb-[45vh] w-3/4" src="/logo.png" alt="text logo: karl mårten" />
	</div>
</div>
