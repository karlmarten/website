<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BackSide,
		BoxGeometry,
		Euler,
		Mesh,
		MeshBasicMaterial,
		PerspectiveCamera,
		Scene,
		SphereGeometry,
		TextureLoader,
		WebGLRenderer
	} from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';

	let scene: Scene;
	let camera: PerspectiveCamera;
	let renderer: WebGLRenderer;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		scene = new Scene();

		camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
		camera.position.set(-900, -200, -900);
		camera.setRotationFromEuler(new Euler(0.5, 0, 0));

		renderer = new WebGLRenderer({ canvas, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		let controls = new OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', () => renderer.render(scene, camera));

		let skytex = new TextureLoader().load('sky.png');
		let skymat = new MeshBasicMaterial({ map: skytex, side: BackSide });

		let box = new SphereGeometry(500, 60, 40, );
		let skybox = new Mesh(box, skymat);

		scene.add(skybox);

		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();
		console.log(camera.zoom, camera.position, camera.rotation);
	});
</script>

<canvas bind:this={canvas}></canvas>
