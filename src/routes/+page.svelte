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
		camera.position.set(-10, 0, 0);
		camera.setRotationFromEuler(new Euler(0.5, 0, 0));

		renderer = new WebGLRenderer({ canvas, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		let controls = new OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', () => renderer.render(scene, camera));

		let skymat = new MeshStandardMaterial({
			color: 0x3894e1,
			side: BackSide
		});

		let box = new SphereGeometry(500, 60, 40);
		let skybox = new Mesh(box, skymat);
		scene.add(skybox);

		const light = new AmbientLight(0xffffff, 2);
		scene.add(light);

		const spotlight = new DirectionalLight(0xffffff, 5);
		spotlight.position.set(11, 10, -22);
		scene.add(spotlight);

		const hemispherelight = new HemisphereLight(0x3894e1, 0x3894e1, 1);
		scene.add(hemispherelight);

		let hat = (await new GLTFLoader().loadAsync('models/hat.glb')).scene;
		hat.position.set(0, 1.25, 0);
		hat.rotation.set(0, (-31 / 180) * Math.PI, (18 / 180) * Math.PI);
		scene.add(hat);

		let text = new TextGeometry('karl mårten', {
			font: new FontLoader().parse(
				await fetch('fonts/shrikhand.typeface.json').then((res) => res.json())
			),
			size: 1,
			height: 0.1
		});
		let textmat = new MeshBasicMaterial({ color: 0xffea00 });
		let textmesh = new Mesh(text, textmat);
		let textbox = new Box3();
		textbox.expandByObject(textmesh);
		textmesh.position.set(2.2, 2.2, -textbox.getSize(new Vector3()).x / 2);
		textmesh.rotation.set(0, -Math.PI / 2, 0);
		scene.add(textmesh);

		let textborder = new TextGeometry('karl mårten', {
			font: new FontLoader().parse(
				await fetch('fonts/shrikhand.typeface.json').then((res) => res.json())
			),
			size: 1,
			height: 0.1,
			bevelEnabled: true,
			bevelSize: 0.1,
			bevelThickness: 0.1
		});
		let textbordermat = new MeshBasicMaterial({ color: 0x000000 });
		let textbordermesh = new Mesh(textborder, textbordermat);
		textbordermesh.position.set(2.4, 2.2, -textbox.getSize(new Vector3()).x / 2);
		textbordermesh.rotation.set(0, -Math.PI / 2, 0);
		scene.add(textbordermesh);

		let textshadow = new TextGeometry('karl mårten', {
			font: new FontLoader().parse(
				await fetch('fonts/shrikhand.typeface.json').then((res) => res.json())
			),
			size: 1,
			height: 0.1,
			bevelEnabled: true,
			bevelSize: 0.1,
			bevelThickness: 0.1
		});
		let textshadowmesh = new Mesh(textshadow, textbordermat);
		textshadowmesh.position.set(2.4, 2.1, 0.1 - textbox.getSize(new Vector3()).x / 2);
		textshadowmesh.rotation.set(0, -Math.PI / 2, 0);
		scene.add(textshadowmesh);

		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();
		console.log(camera.zoom, camera.position, camera.rotation);
	});
</script>

<canvas bind:this={canvas}></canvas>
