import {
	Clock,
	Mesh,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	ShaderMaterial,
	Vector2,
	WebGLRenderer,
} from 'three'

const vertexShader = `
void main() {
  gl_Position = vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    gl_FragColor=vec4(1.,0.,1.0,1.0);
}
`

const camera = new PerspectiveCamera(75, 1)
camera.position.z = 1

const scene = new Scene()
const clock = new Clock()

const geometry = new PlaneGeometry(2, 2)

const uniforms = {
	u_time: { type: 'f', value: 1.0 },
	u_resolution: { type: 'v2', value: new Vector2(800, 800) },
	u_mouse: { type: 'v2', value: new Vector2() },
}

const material = new ShaderMaterial({
	uniforms: uniforms,
	vertexShader,
	fragmentShader,
})

const mesh = new Mesh(geometry, material)
scene.add(mesh)

const renderer = new WebGLRenderer()
renderer.setSize(800, 800)

renderer.setPixelRatio(window.devicePixelRatio)

document.body.appendChild(renderer.domElement)

renderer.domElement.addEventListener('mousemove', (e) => {
	uniforms.u_mouse.value.x = e.clientX
	uniforms.u_mouse.value.y = e.clientY
})

function tic() {
	uniforms.u_time.value += clock.getDelta()
	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)
