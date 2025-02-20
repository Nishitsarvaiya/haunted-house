import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import GUI from 'lil-gui';
import {
	AmbientLight,
	BoxGeometry,
	ConeGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	SphereGeometry,
	WebGLRenderer,
} from 'three';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new Scene();

/**
 * Floor
 */
const floor = new Mesh(new PlaneGeometry(40, 40), new MeshStandardMaterial({ color: 0x565254 }));
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * House
 */
const houseMeasurements = {
	walls: {
		width: 6,
		height: 4,
		depth: 6,
	},
	roof: {
		height: 3,
		radius: 5.5,
		sides: 4,
	},
	door: {
		width: 1.75,
		height: 2.75,
	},
	bushes: [
		{
			scale: 1.5,
			x: 2,
			z: 0.9,
		},
		{
			scale: 0.5,
			x: 2.8,
			z: 0.5,
		},
		{
			scale: 1.75,
			x: -2.8,
			z: 1.1,
		},
		{
			scale: 0.75,
			x: -2,
			z: 2,
		},
	],
};
const house = new Group();
scene.add(house);

// Walls
const walls = new Mesh(
	new BoxGeometry(houseMeasurements.walls.width, houseMeasurements.walls.height, houseMeasurements.walls.depth),
	new MeshStandardMaterial({ color: 0xefc88b })
);
walls.position.y = houseMeasurements.walls.height / 2;
house.add(walls);

// Roof
const roof = new Mesh(
	new ConeGeometry(houseMeasurements.roof.radius, houseMeasurements.roof.height, houseMeasurements.roof.sides),
	new MeshStandardMaterial({ color: 0xf5ee9e })
);
roof.position.y = houseMeasurements.walls.height + houseMeasurements.roof.height / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new Mesh(
	new PlaneGeometry(houseMeasurements.door.width, houseMeasurements.door.height),
	new MeshStandardMaterial({ color: 0x484d6d })
);
door.position.z = houseMeasurements.walls.width / 2 + 0.01;
door.position.y = houseMeasurements.door.height / 2;
house.add(door);

// Bushes
const bushGeometry = new SphereGeometry(0.5, 12, 12, 0, Math.PI);
const bushMaterial = new MeshStandardMaterial({ color: 0x484d6d });
houseMeasurements.bushes.forEach((bushObj) => {
	const bush = new Mesh(bushGeometry, bushMaterial);
	bush.scale.setScalar(bushObj.scale);
	bush.rotation.x = -Math.PI / 2;
	bush.position.z = houseMeasurements.walls.width / 2 + bushObj.z;
	bush.position.x = bushObj.x;
	house.add(bush);
});

/**
 * Graves
 */
const graveMeasurements = {
	width: 0.95,
	height: 1.5,
	depth: 0.25,
};
const graves = new Group();
scene.add(graves);

const graveGeometry = new BoxGeometry(graveMeasurements.width, graveMeasurements.height, graveMeasurements.depth);
const graveMaterial = new MeshStandardMaterial({ color: 0xbea7e5 });
for (let i = 0; i < 50; i++) {
	const grave = new Mesh(graveGeometry, graveMaterial);
	const angle = Math.random() * Math.PI * 2;
	const radius = 8 + Math.random() * 6;
	grave.position.y = Math.random() * graveMeasurements.height * 0.4;
	grave.position.x = Math.sin(angle) * radius;
	grave.position.z = Math.cos(angle) * radius;
	grave.rotation.x = (Math.random() - 0.5) * 0.5;
	grave.rotation.y = (Math.random() - 0.5) * 0.5;
	grave.rotation.z = (Math.random() - 0.5) * 0.85;
	graves.add(grave);
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new AmbientLight('#ffffff', 3);
scene.add(ambientLight);

// // Directional light
// const directionalLight = new DirectionalLight('#ffffff', 1.5);
// directionalLight.position.set(3, 2, -8);
// scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 8;
camera.position.z = 20;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
	canvas: canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
