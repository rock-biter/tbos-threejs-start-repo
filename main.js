import './style.css'
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

#define PI 3.14159265359

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct) {   
		return smoothstep( pct-0.005, pct, st.y) -
		smoothstep( pct, pct+0.005, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
		float tile = 7.;
		float val = abs(sin((st.x) * PI + u_time ) * 0.5 + 0.5 ) * 10.;
		float y = 1. - ceil( (st.x ) * tile) / tile;
		float x = 1. - ceil( (st.y ) * tile) / tile;
		vec3 color = mix( mix( vec3(y,0.,0.), vec3(0,x,x), 0.5 ), vec3(x,x*y, y), 0.5 );

    // Plot a line
    // float pct = plot(st,y);
    color = mix(color,vec3(0.,1.,0.),0.);
    
    gl_FragColor=vec4(color,1.0);
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
