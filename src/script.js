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
	RepeatWrapping,
	Scene,
	SphereGeometry,
	SRGBColorSpace,
	TextureLoader,
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
 * Textures
 */
const textureLoader = new TextureLoader();
// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg');
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg');
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg');
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg');
floorColorTexture.wrapS = RepeatWrapping;
floorARMTexture.wrapS = RepeatWrapping;
floorNormalTexture.wrapS = RepeatWrapping;
floorDisplacementTexture.wrapS = RepeatWrapping;
floorColorTexture.wrapT = RepeatWrapping;
floorARMTexture.wrapT = RepeatWrapping;
floorNormalTexture.wrapT = RepeatWrapping;
floorDisplacementTexture.wrapT = RepeatWrapping;
floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);
floorColorTexture.colorSpace = SRGBColorSpace;

// Wall
const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg');
const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg');
const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg');
wallColorTexture.colorSpace = SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg');
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg');
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg');
roofColorTexture.colorSpace = SRGBColorSpace;
roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);
roofColorTexture.wrapS = RepeatWrapping;
roofARMTexture.wrapS = RepeatWrapping;
roofNormalTexture.wrapS = RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg');
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg');
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg');
bushColorTexture.colorSpace = SRGBColorSpace;
bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);
bushColorTexture.wrapS = RepeatWrapping;
bushARMTexture.wrapS = RepeatWrapping;
bushNormalTexture.wrapS = RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg');
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg');
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg');
graveColorTexture.colorSpace = SRGBColorSpace;
graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg');
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('./door/height.jpg');
const doorNormalTexture = textureLoader.load('./door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg');
doorColorTexture.colorSpace = SRGBColorSpace;

/**
 * Floor
 */
const floor = new Mesh(
	new PlaneGeometry(40, 40, 100, 100),
	new MeshStandardMaterial({
		transparent: true,
		map: floorColorTexture,
		alphaMap: floorAlphaTexture,
		aoMap: floorARMTexture,
		roughnessMap: floorARMTexture,
		metalnessMap: floorARMTexture,
		displacementMap: floorDisplacementTexture,
		normalMap: floorNormalTexture,
		displacementScale: 0.3,
		displacementBias: -0.2,
	})
);
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
		width: 2.75,
		height: 3.25,
	},
	bushes: [
		{
			scale: 1.75,
			x: 2,
			z: 0.6,
		},
		{
			scale: 0.75,
			x: 3.1,
			z: 0.5,
		},
		{
			scale: 1.75,
			x: -2.8,
			z: 0.7,
		},
		{
			scale: 1.05,
			x: -1.8,
			z: 0.25,
		},
		{
			scale: 0.86,
			x: 1.5,
			z: 1.75,
		},
	],
};
const house = new Group();
scene.add(house);

// Walls
const walls = new Mesh(
	new BoxGeometry(houseMeasurements.walls.width, houseMeasurements.walls.height, houseMeasurements.walls.depth),
	new MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallARMTexture,
		roughnessMap: wallARMTexture,
		metalnessMap: wallARMTexture,
		normalMap: wallNormalTexture,
	})
);
walls.position.y = houseMeasurements.walls.height / 2;
house.add(walls);

// Roof
const roof = new Mesh(
	new ConeGeometry(houseMeasurements.roof.radius, houseMeasurements.roof.height, houseMeasurements.roof.sides),
	new MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofARMTexture,
		roughnessMap: roofARMTexture,
		metalnessMap: roofARMTexture,
		normalMap: roofNormalTexture,
	})
);
roof.position.y = houseMeasurements.walls.height + houseMeasurements.roof.height / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new Mesh(
	new PlaneGeometry(houseMeasurements.door.width, houseMeasurements.door.height, 100, 100),
	new MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		displacementMap: doorHeightTexture,
		normalMap: doorNormalTexture,
		metalnessMap: doorMetalnessTexture,
		roughnessMap: doorRoughnessTexture,
		displacementScale: 0.15,
		displacementBias: -0.04,
	})
);
door.position.z = houseMeasurements.walls.width / 2 + 0.01;
door.position.y = houseMeasurements.door.height / 2 - 0.15;
house.add(door);

// Bushes
const bushGeometry = new SphereGeometry(0.5, 12, 12);
const bushMaterial = new MeshStandardMaterial({
	color: '#ccffcc',
	map: bushColorTexture,
	aoMap: bushARMTexture,
	roughnessMap: bushARMTexture,
	metalnessMap: bushARMTexture,
	normalMap: bushNormalTexture,
});
houseMeasurements.bushes.forEach((bushObj) => {
	const bush = new Mesh(bushGeometry, bushMaterial);
	bush.scale.setScalar(bushObj.scale);
	bush.rotation.x = -Math.PI / 3;
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
const graveMaterial = new MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: graveARMTexture,
	roughnessMap: graveARMTexture,
	metalnessMap: graveARMTexture,
	normalMap: graveNormalTexture,
});
for (let i = 0; i < 50; i++) {
	const grave = new Mesh(graveGeometry, graveMaterial);
	const angle = Math.random() * Math.PI * 2;
	const radius = 6 + Math.random() * 8;
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
