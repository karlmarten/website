<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AmbientLight,
		BackSide,
		Box3,
		BoxGeometry,
		Clock,
		DirectionalLight,
		Euler,
		HemisphereLight,
		Mesh,
		MeshBasicMaterial,
		MeshStandardMaterial,
		PerspectiveCamera,
		Raycaster,
		Scene,
		SphereGeometry,
		TextureLoader,
		Vector2,
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

	let raycaster = new Raycaster();
	let pointer = new Vector2();
	let clock = new Clock();

	let hovering = false;

	onMount(async () => {
		scene = new Scene();

		camera = new PerspectiveCamera(37, window.innerWidth / window.innerHeight, 0.1, 30000);
		camera.position.set(-10, 5, 0);
		camera.setRotationFromEuler(new Euler(0, -Math.PI / 2, 0));

		renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		let hat = (await new GLTFLoader().loadAsync('models/hat.glb')).scene;
		hat.position.set(0, 0, 0);
		hat.rotation.set(0, (-49.9/ 180) * Math.PI+ Math.PI, (-10 / 180) * Math.PI);
		scene.add(hat);

		const light = new AmbientLight(0xffffff, 2.25);
		scene.add(light);

		const spotlight = new DirectionalLight(0xffffff, 5);
		spotlight.position.set(5, 10, -12);
		spotlight.lookAt(hat.position);
		scene.add(spotlight);

		const hemispherelight = new HemisphereLight(0xabd9ff, 0x3894e1, 3);
		scene.add(hemispherelight);

		const animate = () => {
			const delta = clock.getDelta();

			if (camera.position.y > -.3)
				camera.position.y -= delta * 8;
			if (camera.position.y < -.3)
				camera.position.y = -.3;

			if (hovering == true) {
				if (hat.rotation.y < 0) hat.rotateOnWorldAxis(new Vector3(0, 1, 0), delta * 5);
				if (hat.rotation.y > 0) hat.rotation.y = 0;

				if (hat.scale.x < 1.2) hat.scale.multiplyScalar(1 + delta);
				if (hat.scale.x > 1.2) hat.scale.set(1.2, 1.2, 1.2);
			} else {
				if (hat.rotation.y > (-50 / 180) * Math.PI)
					hat.rotateOnWorldAxis(new Vector3(0, 1, 0), -delta * 5);
				if (hat.rotation.y < (-50 / 180) * Math.PI) hat.rotation.y = (-50 / 180) * Math.PI;

				if (hat.scale.x > 1) hat.scale.multiplyScalar(1 - delta);
				if (hat.scale.x < 1) hat.scale.set(1, 1, 1);
			}

			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();

		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
		window.addEventListener('mousemove', (event) => {
			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(pointer, camera);

			// calculate objects intersecting the picking ray
			const intersects = raycaster.intersectObjects(scene.children);

			hovering = false;
			for (let i = 0; i < intersects.length; i++) {
				if (intersects[i].object.parent === hat) {
					hovering = true;
					break;
				}
			}
		});
	});
</script>

<div class="bg-[#3894e1]">
	<div class="flex h-screen w-full items-center justify-center">
		<canvas class="absolute z-20" bind:this={canvas}></canvas>
		<img
			class="pointer-events-none absolute z-10 h-full w-full object-cover"
			src="/clouds.png"
			alt=""
		/>
		<img
			class="pointer-events-none absolute z-30 h-full w-full object-cover opacity-50"
			src="/clouds.png"
			alt=""
		/>

		<img class="mb-[45vh] w-3/4" src="/logo.png" alt="text logo: karl mårten" />
	</div>
</div>
