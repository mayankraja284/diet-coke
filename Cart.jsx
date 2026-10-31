import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { money } from './data.js'

export default function Cart({ open, onClose, items, setQty, remove, clear }) {
  const [done, setDone] = useState(false)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const close = () => { setDone(false); onClose() }
  return (
    <AnimatePresence>
      {open && (<>
        <motion.div className="scrim" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.aside className="drawer" aria-label="Shopping bag" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ ease: [0.7, 0, 0.2, 1], duration: 0.5 }}>
          <header><h2>Your bag</h2><button aria-label="Close" onClick={close}><X /></button></header>
          {done ? (
            <div className="empty"><h3>Demo checkout complete</h3><p>This is a frontend demo. No payment was taken and no order was placed.</p>
              <button className="btn red" onClick={() => { clear(); close() }}>Back to shop</button></div>
          ) : items.length === 0 ? <p className="empty">Your bag is empty.</p> : (<>
            <ul>{items.map(i => (
              <li key={i.id}><div><b>{i.name}</b><span>{money(i.price)}</span></div>
                <div className="qty"><button aria-label="Decrease" onClick={() => setQty(i.id, i.qty - 1)}><Minus size={14} /></button>{i.qty}
                  <button aria-label="Increase" onClick={() => setQty(i.id, i.qty + 1)}><Plus size={14} /></button>
                  <button aria-label="Remove" onClick={() => remove(i.id)}><Trash2 size={14} /></button></div></li>))}</ul>
            <footer><p><span>Subtotal</span><b>{money(subtotal)}</b></p>
              <button className="btn red full" onClick={() => setDone(true)}>CHECKOUT (DEMO)</button></footer></>)}
        </motion.aside></>)}
    </AnimatePresence>
  )
}
