// ============================================
// INVENTARIO DEL JUGADOR
// ============================================
 
export function createInventoryUI() {
  // Contenedor principal estilo libro
  const inventoryContainer = document.createElement('div')
  inventoryContainer.id = 'inventory-container'
  inventoryContainer.style.position = 'fixed'
  inventoryContainer.style.top = '50%'
  inventoryContainer.style.left = '50%'
  inventoryContainer.style.transform = 'translate(-50%, -50%)'
  inventoryContainer.style.width = '920px'
  inventoryContainer.style.height = '640px'
  inventoryContainer.style.zIndex = '1000'
  inventoryContainer.style.display = 'none'
 
  // Fondo tipo libro (dos páginas)
  const book = document.createElement('div')
  book.style.width = '100%'
  book.style.height = '100%'
  book.style.display = 'flex'
  book.style.alignItems = 'stretch'
  book.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6)'
  book.style.borderRadius = '8px'
  book.style.overflow = 'hidden'
 
  // Página izquierda (grid de slots)
  const leftPage = document.createElement('div')
  leftPage.style.flex = '1'
  leftPage.style.background = 'linear-gradient(#f6efe2, #efe6d4)'
  leftPage.style.padding = '36px'
  leftPage.style.boxSizing = 'border-box'
  leftPage.style.borderRight = '1px solid rgba(0,0,0,0.08)'
 
  const leftTitle = document.createElement('div')
  leftTitle.textContent = 'Inventario'
  leftTitle.style.fontFamily = 'Georgia, serif'
  leftTitle.style.fontSize = '24px'
  leftTitle.style.marginBottom = '18px'
  leftTitle.style.color = '#5b472f'
  leftPage.appendChild(leftTitle)
 
  const slotsGrid = document.createElement('div')
  slotsGrid.id = 'items-list'
  slotsGrid.style.display = 'grid'
  slotsGrid.style.gridTemplateColumns = 'repeat(5, 1fr)'
  slotsGrid.style.gridTemplateRows = 'repeat(6, 1fr)'
  slotsGrid.style.gap = '12px'
  slotsGrid.style.width = '100%'
  slotsGrid.style.height = 'calc(100% - 56px)'
  leftPage.appendChild(slotsGrid)
 
  // Página derecha (personaje + equipo)
  const rightPage = document.createElement('div')
  rightPage.style.width = '380px'
  rightPage.style.background = 'linear-gradient(#fbf7ee, #f0e9d8)'
  rightPage.style.padding = '36px'
  rightPage.style.boxSizing = 'border-box'
 
  const rightTitle = document.createElement('div')
  rightTitle.textContent = 'Personaje'
  rightTitle.style.fontFamily = 'Georgia, serif'
  rightTitle.style.fontSize = '24px'
  rightTitle.style.marginBottom = '18px'
  rightTitle.style.color = '#5b472f'
  rightPage.appendChild(rightTitle)
 
  const charPanel = document.createElement('div')
  charPanel.style.display = 'flex'
  charPanel.style.flexDirection = 'column'
  charPanel.style.alignItems = 'center'
  charPanel.style.justifyContent = 'space-between'
  charPanel.style.height = '100%'
 
  const characterFigure = document.createElement('div')
  characterFigure.style.width = '220px'
  characterFigure.style.height = '320px'
  characterFigure.style.background = '#f8f0de'
  characterFigure.style.border = '2px solid rgba(0,0,0,0.08)'
  characterFigure.style.borderRadius = '12px'
  characterFigure.style.display = 'flex'
  characterFigure.style.flexDirection = 'column'
  characterFigure.style.alignItems = 'center'
  characterFigure.style.justifyContent = 'center'
  characterFigure.style.paddingTop = '20px'
  characterFigure.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.06)'
 
  const charHead = document.createElement('div')
  charHead.style.width = '64px'
  charHead.style.height = '64px'
  charHead.style.background = '#d8b38f'
  charHead.style.borderRadius = '50%'
  charHead.style.boxShadow = 'inset 0 4px 0 rgba(0,0,0,0.08)'
 
  const charBody = document.createElement('div')
  charBody.style.width = '100px'
  charBody.style.height = '140px'
  charBody.style.background = 'linear-gradient(#e9d4b2, #c9a57b)'
  charBody.style.borderRadius = '20px'
  charBody.style.marginTop = '16px'
  charBody.style.position = 'relative'
 
  const leftArm = document.createElement('div')
  leftArm.style.position = 'absolute'
  leftArm.style.left = '-22px'
  leftArm.style.top = '20px'
  leftArm.style.width = '24px'
  leftArm.style.height = '72px'
  leftArm.style.background = '#c9a57b'
  leftArm.style.borderRadius = '12px'
 
  const rightArm = leftArm.cloneNode()
  rightArm.style.left = '98px'
 
  const legContainer = document.createElement('div')
  legContainer.style.display = 'flex'
  legContainer.style.gap = '14px'
  legContainer.style.marginTop = '18px'
 
  const leg = document.createElement('div')
  leg.style.width = '24px'
  leg.style.height = '80px'
  leg.style.background = '#c9a57b'
  leg.style.borderRadius = '12px'
 
  const leftLeg = leg.cloneNode()
  const rightLeg = leg.cloneNode()
  legContainer.appendChild(leftLeg)
  legContainer.appendChild(rightLeg)
 
  charBody.appendChild(leftArm)
  charBody.appendChild(rightArm)
  characterFigure.appendChild(charHead)
  characterFigure.appendChild(charBody)
  characterFigure.appendChild(legContainer)
 
  const equippedLabel = document.createElement('div')
  equippedLabel.id = 'equipped-weapon-label'
  equippedLabel.style.marginTop = '18px'
  equippedLabel.style.fontSize = '16px'
  equippedLabel.style.color = '#5b472f'
  equippedLabel.style.textAlign = 'center'
  equippedLabel.style.padding = '10px 14px'
  equippedLabel.style.background = 'rgba(255,255,255,0.72)'
  equippedLabel.style.borderRadius = '10px'
  equippedLabel.textContent = 'Arma equipada: Puños'
 
  // ── BLOQUE DE CANVAS ELIMINADO DE AQUÍ ──
  // dibujarEspada / actualizar no pertenecen dentro de createInventoryUI.
  // Si necesitas dibujar en un canvas del juego, exporta drawSword() por separado
  // y llámala desde tu game loop principal (ver al final del archivo).
 
  const equipTitle = document.createElement('div')
  equipTitle.textContent = 'Equipo'
  equipTitle.style.fontSize = '18px'
  equipTitle.style.color = '#6b4a2d'
  equipTitle.style.marginTop = '18px'
  equipTitle.style.alignSelf = 'flex-start'
 
  const equipList = document.createElement('div')
  equipList.id = 'equip-list'
  equipList.style.display = 'flex'
  equipList.style.flexDirection = 'column'
  equipList.style.gap = '10px'
  equipList.style.marginTop = '10px'
  equipList.style.width = '100%'
 
  const equipNames = ['Cabeza', 'Armadura', 'Mano', 'Piernas', 'Botas']
  for (let i = 0; i < equipNames.length; i++) {
    const name = equipNames[i]
    const slot = document.createElement('div')
    slot.style.width = '100%'
    slot.style.height = '48px'
    slot.style.background = 'rgba(0,0,0,0.03)'
    slot.style.border = '1px solid rgba(0,0,0,0.06)'
    slot.style.borderRadius = '6px'
    slot.style.display = 'flex'
    slot.style.alignItems = 'center'
    slot.style.justifyContent = 'space-between'
    slot.style.padding = '0 12px'
    slot.style.color = '#6b6b6b'
    slot.textContent = name
    equipList.appendChild(slot)
  }
 
  const resources = document.createElement('div')
  resources.style.display = 'flex'
  resources.style.gap = '18px'
  resources.style.marginBottom = '6px'
  resources.style.marginTop = '16px'
 
  const res1 = document.createElement('div')
  res1.id = 'inventory-rocks'
  res1.style.width = '88px'
  res1.style.height = '88px'
  res1.style.borderRadius = '50%'
  res1.style.background = 'linear-gradient(#e6f7ea,#dfe6d1)'
  res1.style.display = 'flex'
  res1.style.alignItems = 'center'
  res1.style.justifyContent = 'center'
  res1.style.flexDirection = 'column'
  res1.innerHTML = '<div style="font-size:20px; color:#2a6b2a; font-weight:bold">110</div><div style="font-size:12px;color:#6b6b6b">Rocas</div>'
 
  const res2 = document.createElement('div')
  res2.id = 'inventory-coins'
  res2.style.width = '88px'
  res2.style.height = '88px'
  res2.style.borderRadius = '50%'
  res2.style.background = 'linear-gradient(#fff1d8,#efe0c2)'
  res2.style.display = 'flex'
  res2.style.alignItems = 'center'
  res2.style.justifyContent = 'center'
  res2.style.flexDirection = 'column'
  res2.innerHTML = '<div style="font-size:20px; color:#7a4f1a; font-weight:bold">390</div><div style="font-size:12px;color:#6b6b6b">Monedas</div>'
 
  resources.appendChild(res1)
  resources.appendChild(res2)
 
  charPanel.appendChild(characterFigure)
  charPanel.appendChild(equippedLabel)
  charPanel.appendChild(equipTitle)
  charPanel.appendChild(equipList)
  charPanel.appendChild(resources)
 
  rightPage.appendChild(charPanel)
 
  book.appendChild(leftPage)
  book.appendChild(rightPage)
 
  const title = document.createElement('div')
  title.textContent = 'Inventario'
  title.style.position = 'absolute'
  title.style.top = '10px'
  title.style.left = '50%'
  title.style.transform = 'translateX(-50%)'
  title.style.fontFamily = 'Georgia, serif'
  title.style.fontSize = '34px'
  title.style.color = '#1b3b1b'
  title.style.letterSpacing = '1px'
  title.style.textShadow = '0 1px 0 rgba(255,255,255,0.7)'
 
  inventoryContainer.appendChild(book)
  inventoryContainer.appendChild(title)
 
  // Información inferior
  const footer = document.createElement('div')
  footer.style.position = 'absolute'
  footer.style.bottom = '14px'
  footer.style.left = '50%'
  footer.style.transform = 'translateX(-50%)'
  footer.style.fontSize = '13px'
  footer.style.color = '#5b5b5b'
  footer.textContent = 'Presiona I para cerrar'
  inventoryContainer.appendChild(footer)
 
  if (document.body) {
    document.body.appendChild(inventoryContainer)
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(inventoryContainer)
    }, { once: true })
  }
 
  return inventoryContainer
}
 
// ============================================
// DIBUJO DE ESPADA EN CANVAS DEL JUEGO
// Llama a drawSword(ctx, x, y) desde tu game loop,
// no desde aquí directamente.
// ============================================
 
export function drawSword(ctx, x, y) {
  // Hoja
  ctx.fillStyle = '#C0C0C0'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + 15, y + 100)
  ctx.lineTo(x - 15, y + 100)
  ctx.closePath()
  ctx.fill()
 
  // Guarda
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(x - 40, y + 95, 80, 10)
 
  // Empuñadura
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x - 5, y + 105, 10, 50)
 
  // Pomelo
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(x, y + 160, 10, 0, Math.PI * 2)
  ctx.fill()
}
 
// ============================================
// INVENTARIO — ACTUALIZACIÓN Y TOGGLE
// ============================================
 
const itemIcons = {
  Madera: '🪵',
  Hacha: '🪓',
  Espada: '🗡️',
  Arco: '🏹',
  Puños: '🥊',
  Piedra: '🪨',
  Manzana: '🍎'
}
 
export function updateInventoryUI(player) {
  const container = document.getElementById('inventory-container')
  if (!container) return
 
  const slotsGrid = document.getElementById('items-list')
  slotsGrid.innerHTML = ''
 
  const entries = []
  for (let i = 0; i < player.tools.length; i++) {
    entries.push({ type: 'tool', name: player.tools[i] })
  }
 
  const counts = {}
  for (let i = 0; i < player.inventory.length; i++) {
    const itemName = player.inventory[i]
    counts[itemName] = (counts[itemName] || 0) + 1
  }
  Object.entries(counts).forEach(([name, qty]) => entries.push({ type: 'item', name, qty }))
 
  const maxSlots = 30
  for (let i = 0; i < maxSlots; i++) {
    const slot = document.createElement('div')
    slot.style.background = 'rgba(255,255,255,0.7)'
    slot.style.border = '1px solid rgba(0,0,0,0.08)'
    slot.style.borderRadius = '8px'
    slot.style.display = 'flex'
    slot.style.alignItems = 'center'
    slot.style.justifyContent = 'center'
    slot.style.position = 'relative'
    slot.style.fontFamily = 'Arial, sans-serif'
    slot.style.flexDirection = 'column'
    slot.style.padding = '10px'
    slot.style.minHeight = '72px'
 
    if (entries[i]) {
      const e = entries[i]
      const icon = document.createElement('div')
      icon.style.fontSize = '28px'
      icon.style.marginBottom = '6px'
      icon.textContent = itemIcons[e.name] || '❓'
      slot.appendChild(icon)
 
      const label = document.createElement('div')
      label.style.fontSize = '12px'
      label.style.textAlign = 'center'
      label.style.color = '#5d442a'
      label.textContent = e.name
      slot.appendChild(label)
 
      if (e.type === 'tool' && e.name === player.equippedTool) {
        slot.style.border = '2px solid #4a7a2a'
      }
 
      if (e.qty && e.qty > 1) {
        const badge = document.createElement('div')
        badge.style.position = 'absolute'
        badge.style.right = '6px'
        badge.style.bottom = '6px'
        badge.style.background = '#3b6b3b'
        badge.style.color = 'white'
        badge.style.padding = '4px 6px'
        badge.style.borderRadius = '12px'
        badge.style.fontSize = '12px'
        badge.textContent = `x${e.qty}`
        slot.appendChild(badge)
      }
    } else {
      slot.style.opacity = '0.65'
    }
 
    slotsGrid.appendChild(slot)
  }
 
  const equippedLabel = document.getElementById('equipped-weapon-label')
  if (equippedLabel) {
    equippedLabel.textContent = `Arma equipada: ${player.equippedTool || 'Ninguna'}`
  }
 
  const rocksCounter = document.getElementById('inventory-rocks')
  if (rocksCounter) {
    const parts = rocksCounter.querySelectorAll('div')
    if (parts[0]) parts[0].textContent = player.rocks || 0
  }
 
  const coinsCounter = document.getElementById('inventory-coins')
  if (coinsCounter) {
    const parts = coinsCounter.querySelectorAll('div')
    if (parts[0]) parts[0].textContent = player.coins || 0
  }
}
 
export function toggleInventory() {
  const container = document.getElementById('inventory-container')
  if (!container) return
 
  const isVisible = container.style.display === 'block'
  container.style.display = isVisible ? 'none' : 'block'
}
 
export function openInventory() {
  const container = document.getElementById('inventory-container')
  if (container && container.style.display === 'none') {
    toggleInventory()
  }
}
 
export function closeInventory() {
  const container = document.getElementById('inventory-container')
  if (container && container.style.display === 'block') {
    toggleInventory()
  }
}
