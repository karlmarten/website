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
		TextureLoader,
		WebGLRenderer
	} from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';

	let scene: Scene;
	let camera: PerspectiveCamera;
	let renderer: WebGLRenderer;

	let canvas: HTMLCanvasElement;

	let materials: MeshBasicMaterial[] = [];

	onMount(() => {
		scene = new Scene();

		camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
        camera.setRotationFromEuler(new Euler(0.5, 0, 0));

		renderer = new WebGLRenderer({ canvas, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		let sky_front = new TextureLoader().load('skybox/front.bmp');
		let sky_back = new TextureLoader().load('skybox/back.bmp');
		let sky_up = new TextureLoader().load('skybox/up.bmp');
		let sky_down = new TextureLoader().load('skybox/down.bmp');
		let sky_left = new TextureLoader().load('skybox/left.bmp');
		let sky_right = new TextureLoader().load('skybox/right.bmp');

		materials.push(new MeshBasicMaterial({ map: sky_front }));
		materials.push(new MeshBasicMaterial({ map: sky_back }));
		materials.push(new MeshBasicMaterial({ map: sky_up }));
		materials.push(new MeshBasicMaterial({ map: sky_down }));
		materials.push(new MeshBasicMaterial({ map: sky_left }));
		materials.push(new MeshBasicMaterial({ map: sky_right }));

		materials.forEach((material) => (material.side = BackSide));

		let box = new BoxGeometry(1000, 1000, 1000);
		let skybox = new Mesh(box, materials);

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
