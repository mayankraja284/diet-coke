import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useMotionValue } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, Instagram, Twitter, Youtube } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene, { scene } from './Scene.jsx'
import Cart from './Cart.jsx'
import { PRODUCTS, money } from './data.js'

const ease = [0.7, 0, 0.2, 1]
const Reveal = ({ children, from = 'up', delay = 0, className }) => {
  const r = useReducedMotion()
  const o = { up: { y: 60 }, left: { x: -120 }, right: { x: 120 }, scale: { scale: 0.8 } }[from]
  return <motion.div className={className} initial={r ? false : { opacity: 0, ...o }} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease, delay }}>{children}</motion.div>
}
function Magnetic({ children }) {
  const x = useMotionValue(0), y = useMotionValue(0), sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 })
  return <motion.span style={{ x: sx, y: sy, display: 'inline-block' }}
    onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.35) }}
    onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.span>
}
function Cursor() {
  const el = useRef()
  useEffect(() => {
    if (matchMedia('(pointer:coarse)').matches) return
    const mx = gsap.quickTo(el.current, 'x', { duration: 0.3 }), my = gsap.quickTo(el.current, 'y', { duration: 0.3 })
    const mv = e => { mx(e.clientX); my(e.clientY); el.current.classList.toggle('hot', !!e.target.closest('a,button')) }
    addEventListener('mousemove', mv); return () => removeEventListener('mousemove', mv)
  }, [])
  return <div ref={el} className="cursor" />
}

function Nav({ count, onCart }) {
  const [solid, setSolid] = useState(false), [menu, setMenu] = useState(false)
  useEffect(() => { const f = () => setSolid(scrollY > 80); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  const links = [['Home', '#home'], ['Our Story', '#story'], ['Products', '#products'], ['Experience', '#experience']]
  return (
    <nav className={`nav ${solid ? 'solid' : ''}`}>
      <a href="#home" className="logo">DIET COKE</a>
      <ul className={menu ? 'open' : ''}>{links.map(([t, h]) => <li key={t}><a href={h} onClick={() => setMenu(false)}>{t}</a></li>)}</ul>
      <div className="icons">
        <button aria-label="Search products" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}><Search size={20} /></button>
        <motion.button key={count} aria-label="Open bag" onClick={onCart} className="bag" animate={{ rotate: [0, -18, 14, -8, 0], scale: [1, 1.25, 1] }} transition={{ duration: 0.5 }}>
          <ShoppingBag size={20} />{count > 0 && <span>{count}</span>}</motion.button>
        <button className="burger" aria-label="Menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      </div>
    </nav>)
}

const Line = ({ children, cls = '' }) => <span className="mask"><span className={`h-line ${cls}`}>{children}</span></span>

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="slash" /><span className="ghost">DIET COKE</span>
      <h1><Line>NOTHING</Line><Line cls="ol">DOES IT</Line><Line>LIKE <b>DIET COKE.</b></Line></h1>
      <p className="sub">Bold taste. Zero sugar. Zero compromise.</p>
      <div className="ctas"><Magnetic><a className="btn dark" href="#story">EXPLORE DIET COKE</a></Magnetic><Magnetic><a className="btn white" href="#products">SHOP NOW</a></Magnetic></div>
      <div className="marquee"><div>{Array(8).fill('ZERO SUGAR ✦ ZERO COMPROMISE ✦ ').join('')}</div></div>
    </section>)
}

function Story() {
  return (
    <section id="story" className="story">
      <div className="s-intro"><Reveal from="left"><h2>NOTHING TASTES<br />LIKE IT.</h2></Reveal></div>
      <div className="chap c1"><span className="num">0</span><Reveal from="right"><small>01</small><h3>ZERO<br />SUGAR</h3><p>All the taste. None of the sugar. Nothing added except the feeling.</p></Reveal></div>
      <div className="chap c2"><Reveal from="left"><small>02</small><h3>CRISP &amp;<br /><i>refreshing</i></h3><p>Ice cold, sharp bubbles, a finish that resets everything.</p></Reveal>
        <div className="bubbles">{Array.from({ length: 14 }, (_, i) => <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${i * 0.4}s`, width: 8 + (i % 4) * 8, height: 8 + (i % 4) * 8 }} />)}</div></div>
      <div className="chap c3"><Reveal from="up"><small>03</small><h3 className="outline">ICONIC<br />TASTE</h3><p>An original that never needed to shout. It just tastes like Diet Coke.</p></Reveal></div>
    </section>)
}

function Panel({ p, i, onAdd }) {
  const [q, setQ] = useState(1), [added, setAdded] = useState(false)
  return (
    <article className={`panel ${i % 2 ? 'r' : ''}`}>
      <span className="bgname">{['CAN', '12×', '1.5L'][i]}</span>
      <div className="p-copy">
        <small>0{i + 1} / 03</small><h3>{p.name}</h3><p>{p.desc}</p>
        <div className="price">{money(p.price)}<small> sample price</small></div>
        <div className="buy">
          <div className="qty"><button aria-label="Less" onClick={() => setQ(Math.max(1, q - 1))}>−</button><motion.b key={q} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{q}</motion.b><button aria-label="More" onClick={() => setQ(q + 1)}>+</button></div>
          <Magnetic><motion.button className="btn red" whileTap={{ scale: 0.92 }} onClick={() => { onAdd(p, q); setQ(1); setAdded(true); setTimeout(() => setAdded(false), 1400) }}>
            <AnimatePresence mode="wait"><motion.span key={added} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} style={{ display: 'block' }}>{added ? 'ADDED ✓' : 'ADD TO CART'}</motion.span></AnimatePresence></motion.button></Magnetic>
        </div>
      </div>
    </article>)
}

function Campaign() {
  return (
    <section id="experience" className="campaign">
      <div className="silver" />
      <h2><span>BREAK</span><span className="k">THE</span><span>ORDINARY.</span></h2>
      <svg className="ring" viewBox="0 0 200 200" aria-hidden><defs><path id="c" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
        <text><textPath href="#c">REFRESH YOUR PERSPECTIVE ✦ KEEP YOUR OWN TASTE ✦ </textPath></text></svg>
      <Reveal><p className="msg">Refresh your perspective.<br />Keep your own taste.</p></Reveal>
    </section>)
}

function Footer() {
  const [ok, setOk] = useState(false)
  return (
    <footer className="footer">
      <h2>DIET COKE</h2>
      <form onSubmit={e => { e.preventDefault(); setOk(true) }}><label htmlFor="em">Join the newsletter</label>
        <input id="em" type="email" required placeholder="you@email.com" /><button className="btn red">{ok ? 'THANKS (DEMO)' : 'SUBSCRIBE'}</button></form>
      <ul>{[['Home', '#home'], ['Our Story', '#story'], ['Products', '#products'], ['Experience', '#experience']].map(([t, h]) => <li key={t}><a href={h}>{t}</a></li>)}</ul>
      <div className="social"><a aria-label="Instagram" href="#home"><Instagram /></a><a aria-label="Twitter" href="#home"><Twitter /></a><a aria-label="YouTube" href="#home"><Youtube /></a></div>
      <p className="legal">© 2026 Fan-made demo. Not affiliated with The Coca-Cola Company. · <a href="#home">Privacy</a> · <a href="#home">Terms</a></p>
    </footer>)
}

export default function App() {
  const [items, setItems] = useState([]), [open, setOpen] = useState(false), reduced = useReducedMotion()
  const { scrollYProgress } = useScroll(), bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const add = (p, q) => { setItems(s => s.some(i => i.id === p.id) ? s.map(i => i.id === p.id ? { ...i, qty: i.qty + q } : i) : [...s, { ...p, qty: q }]); setOpen(true) }
  const setQty = (id, q) => setItems(s => q < 1 ? s.filter(i => i.id !== id) : s.map(i => i.id === id ? { ...i, qty: q } : i))

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const m = innerWidth < 800, X = v => (m ? 0 : v)
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from(scene, { intro: Math.PI * 4, x: 0, scale: 1.3, duration: 2.6, ease: 'power3.inOut' })
        gsap.from('.h-line', { yPercent: 115, stagger: 0.12, duration: 1.1, ease: 'power4.out', delay: 1.5 })
        gsap.from('.sub,.ctas', { opacity: 0, y: 30, duration: 1, delay: 2.2, stagger: 0.15 })
      } else scene.spin = 0
      // Story: the can swaps sides for each chapter while spinning with the scroll
      const st = gsap.timeline({ scrollTrigger: { trigger: '#story', start: 'top 85%', end: 'bottom bottom', scrub: 1 } })
      st.to(scene, { x: X(-0.42), rot: 3.2, duration: 1 }).to(scene, { x: X(0.42), rot: 6.4, duration: 1 }).to(scene, { x: X(-0.42), rot: 9.6, duration: 1 })
      gsap.to(scene, { x: X(0.42), scale: 0.9, rot: 12.5, scrollTrigger: { trigger: '#products', start: 'top bottom', end: 'top top', scrub: 1 } })
      // Products: pinned horizontal showcase; can morphs per panel
      const track = document.querySelector('.track'); let last = 0
      const apply = i => gsap.to(scene, { pack: i === 1 ? 1 : 0, tall: i === 2 ? 1 : 0, ox: i === 1 ? -0.84 : 0, prot: i * 2.1, duration: 0.9, ease: 'power3.out' })
      gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: '#products', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: s => { const i = Math.round(s.progress * 2); if (i !== last) { last = i; apply(i) } },
        onLeave: () => gsap.to(scene, { pack: 0, tall: 0, ox: 0, duration: 0.5 }), onEnterBack: () => apply(last) } })
      gsap.to(scene, { x: 0, y: 0, scale: 1.7, rot: 16, scrollTrigger: { trigger: '#experience', start: 'top bottom', end: 'top 20%', scrub: 1 } })
      gsap.to('.ghost', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.num', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.c1', scrub: true } })
    })
    const r = () => ScrollTrigger.refresh(); addEventListener('load', r)
    return () => { removeEventListener('load', r); ctx.revert() }
  }, [reduced])

  return (<>
    <motion.div className="progress" style={{ scaleX: bar }} /><Cursor />
    <Nav count={items.reduce((s, i) => s + i.qty, 0)} onCart={() => setOpen(true)} />
    <Scene />
    <main>
      <Hero /><Story />
      <section id="products" className="products"><h2 className="range">THE RANGE</h2>
        <div className="track">{PRODUCTS.map((p, i) => <Panel key={p.id} p={p} i={i} onAdd={add} />)}</div></section>
      <Campaign />
    </main>
    <Footer />
    <Cart open={open} onClose={() => setOpen(false)} items={items} setQty={setQty} remove={id => setQty(id, 0)} clear={() => setItems([])} />
  </>)
}
