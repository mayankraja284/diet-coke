// Sample prices only — this is a frontend demo.
export const PRODUCTS = [
  { id: 'can', kind: 'can', name: 'Diet Coke Original Can', desc: 'The classic 330ml can. Crisp, cold, zero sugar.', price: 1.2 },
  { id: 'multi', kind: 'multi', name: 'Diet Coke 12-Pack', desc: 'Twelve cans for the fridge, the office, the weekend.', price: 12.5 },
  { id: 'bottle', kind: 'bottle', name: 'Diet Coke Bottle 1.5L', desc: 'Sharing size. Same bold taste, more of it.', price: 2.4 },
]
export const money = (n) => `$${n.toFixed(2)}`
