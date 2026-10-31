import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Shared, GSAP-driven state. ScrollTrigger tweens write here; the render loop reads it.
export const scene = { x: 0.42, y: 0, ox: 0, rot: 0, prot: 0, intro: 0, scale: 1, pack: 0, tall: 0, px: 0, py: 0, spin: 0.25 }

function paint(c) {
  const g = c.getContext('2d'), W = 2048, H = 1024
  const bg = g.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#d5d8dc'); bg.addColorStop(0.5, '#f6f7f8'); bg.addColorStop(1, '#aeb3ba')
  g.fillStyle = bg; g.fillRect(0, 0, W, H)
  g.fillStyle = '#E31837'; g.fillRect(0, 640, W, 70)
  g.textAlign = 'center'
  g.font = 'italic 300px Anton, Impact, sans-serif'
  g.fillStyle = '#E31837'; g.fillText('Diet', 512, 400)
  g.fillStyle = '#111'; g.fillText('Coke', 512, 610)
  g.fillStyle = '#111'; g.font = '130px Anton, Impact, sans-serif'; g.fillText('ZERO SUGAR', 1536, 420)
  g.font = '56px Anton, Impact, sans-serif'; g.fillStyle = '#E31837'; g.fillText('NOTHING TASTES LIKE IT.', 1536, 520)
  // condensation
  for (let i = 0; i < 320; i++) {
    const x = Math.random() * W, y = Math.random() * H, r = 3 + Math.random() * 11
    const d = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r)
    d.addColorStop(0, 'rgba(255,255,255,.95)'); d.addColorStop(0.6, 'rgba(255,255,255,.25)'); d.addColorStop(1, 'rgba(0,0,0,.28)')
    g.fillStyle = d; g.beginPath(); g.ellipse(x, y, r * 0.8, r, 0, 0, 7); g.fill()
  }
}
function makeLabel() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1024
  paint(c)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  document.fonts.load('300px Anton').then(() => { paint(c); t.needsUpdate = true })
  return t
}

function Can({ tex }) {
  const cap = useMemo(() => new THREE.LatheGeometry(
    [[.33, .5], [.31, .54], [.28, .575], [.285, .6], [.22, .6], [.22, .575], [.1, .56], [0, .56]].map(p => new THREE.Vector2(...p)), 48), [])
  return (
    <group>
      <mesh><cylinderGeometry args={[.33, .33, 1, 72, 1, true]} />
        <meshPhysicalMaterial map={tex} metalness={0.8} roughness={0.32} clearcoat={0.7} clearcoatRoughness={0.15} side={THREE.DoubleSide} /></mesh>
      {[1, -1].map(s => <mesh key={s} geometry={cap} scale={[1, s, 1]}>
        <meshStandardMaterial color="#cfd2d7" metalness={1} roughness={0.2} side={THREE.DoubleSide} /></mesh>)}
    </group>)
}

function Rig() {
  const g = useRef(), one = useRef(), pack = useRef()
  const tex = useMemo(makeLabel, [])
  useEffect(() => {
    const f = e => { scene.px = e.clientX / innerWidth - 0.5; scene.py = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', f); return () => removeEventListener('pointermove', f)
  }, [])
  useFrame(({ clock, viewport: v }) => {
    const m = v.width < v.height, t = clock.elapsedTime
    const s = Math.min(v.height / 3.15, v.width / 1.8) * 1.5 * scene.scale * (m ? 0.7 : 1)
    g.current.scale.set(s, s * (1 + 0.3 * scene.tall), s)
    g.current.position.set(m ? 0 : (scene.x + scene.ox) * v.width / 2, scene.y * v.height / 2 + Math.sin(t * 1.2) * 0.05 * s + (m ? -v.height * 0.12 : 0), 0)
    g.current.rotation.set(scene.py * 0.25, scene.rot + scene.prot + scene.intro + t * scene.spin, -scene.px * 0.2)
    one.current.visible = scene.pack < 0.5; pack.current.visible = !one.current.visible
  })
  return (
    <group ref={g} rotation-order="YXZ">
      <group ref={one}><Can tex={tex} /></group>
      <group ref={pack}>{[-0.7, 0, 0.7].map((x, i) => <group key={i} position={[x, 0, i === 1 ? 0.25 : 0]}><Can tex={tex} /></group>)}</group>
    </group>)
}

export default function Scene() {
  return (
    <Canvas className="scene" dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 35 }} gl={{ alpha: true, antialias: true }}
      onCreated={({ gl, scene: sc }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; sc.environment = new THREE.PMREMGenerator(gl).fromScene(new RoomEnvironment(), 0.04).texture }}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <pointLight position={[-3, -1, 2]} intensity={40} color="#E31837" />
      <spotLight position={[-2, 3, -3]} intensity={60} color="#ffffff" />
      <Rig />
    </Canvas>)
}
