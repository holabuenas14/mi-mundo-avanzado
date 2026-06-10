// ─────────────────────────────────────────────
// PANTALLA DE GAME OVER
// ─────────────────────────────────────────────
 
/**
 * Crea la pantalla de Game Over y la monta en el DOM (oculta inicialmente).
 * @param {Function} onRestart  - callback que se llama al pulsar "Reintentar"
 * @returns {{ overlay: HTMLElement }}
 */
export function createGameOverScreen(onRestart) {
  // Inyectar estilos
  if (!document.getElementById('gameover-styles')) {
    const style = document.createElement('style')
    style.id = 'gameover-styles'
    style.textContent = `
      #gameover-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        pointer-events: none;
        opacity: 0;
        transition: background 1.2s ease, opacity 0.1s;
      }
      #gameover-overlay.active {
        background: rgba(0, 0, 0, 0.82);
        opacity: 1;
        pointer-events: all;
      }
      #gameover-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        transform: translateY(40px) scale(0.92);
        opacity: 0;
        transition: transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.7s ease;
        transition-delay: 0.5s;
      }
      #gameover-overlay.active #gameover-card {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      #gameover-title {
        font-family: Georgia, serif;
        font-size: 72px;
        font-weight: bold;
        color: #c0392b;
        text-shadow:
          0 0 30px rgba(192, 57, 43, 0.9),
          0 0 60px rgba(192, 57, 43, 0.5),
          0 3px 6px rgba(0,0,0,0.8);
        letter-spacing: 4px;
        animation: gameoverPulse 2.5s ease-in-out infinite;
      }
      @keyframes gameoverPulse {
        0%, 100% { text-shadow: 0 0 30px rgba(192,57,43,0.9), 0 0 60px rgba(192,57,43,0.5), 0 3px 6px rgba(0,0,0,0.8); }
        50%       { text-shadow: 0 0 50px rgba(231,76,60,1.0),  0 0 90px rgba(231,76,60,0.7), 0 3px 6px rgba(0,0,0,0.8); }
      }
      #gameover-subtitle {
        font-family: Georgia, serif;
        font-size: 18px;
        color: #bdc3c7;
        letter-spacing: 2px;
        text-shadow: 0 1px 4px rgba(0,0,0,0.7);
      }
      #gameover-restart {
        margin-top: 12px;
        padding: 14px 44px;
        font-family: Georgia, serif;
        font-size: 18px;
        color: #fff;
        background: linear-gradient(135deg, #922b21, #c0392b);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        letter-spacing: 1px;
        box-shadow: 0 4px 20px rgba(192,57,43,0.5);
        transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
      }
      #gameover-restart:hover {
        background: linear-gradient(135deg, #c0392b, #e74c3c);
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(231,76,60,0.6);
      }
      #gameover-restart:active {
        transform: translateY(0);
      }
    `
    document.head.appendChild(style)
  }
 
  const overlay = document.createElement('div')
  overlay.id = 'gameover-overlay'
 
  const card = document.createElement('div')
  card.id = 'gameover-card'
 
  const title = document.createElement('div')
  title.id = 'gameover-title'
  title.textContent = 'GAME OVER'
 
  const subtitle = document.createElement('div')
  subtitle.id = 'gameover-subtitle'
  subtitle.textContent = 'Has sido derrotado'
 
  const restartBtn = document.createElement('button')
  restartBtn.id = 'gameover-restart'
  restartBtn.textContent = '↺  Reintentar'
  restartBtn.addEventListener('click', () => {
    overlay.classList.remove('active')
    // Resetear estado del jugador
    playerState.hp = playerState.maxHp
    playerState.alive = true
    playerState.invincible = false
    playerState.knockbackVelocity.set(0, 0, 0)
    setTimeout(() => onRestart(), 400)
  })
 
  card.appendChild(title)
  card.appendChild(subtitle)
  card.appendChild(restartBtn)
  overlay.appendChild(card)
  document.body.appendChild(overlay)
 
  return { overlay }
}
 
/**
 * Activa la secuencia de Game Over con fade + animación de cámara.
 * @param {{ overlay: HTMLElement }} gameOverScreen
 * @param {THREE.Object3D} playerModel
 * @param {THREE.Camera} camera
 */
export function triggerGameOver(gameOverScreen, playerModel, camera) {
  // 1. Flash rojo intenso
  const flash = document.createElement('div')
  flash.style.cssText = `
    position:fixed; inset:0; background:rgba(180,0,0,0.7);
    pointer-events:none; z-index:1999;
    animation: goFlash 0.6s ease-out forwards;
  `
  if (!document.getElementById('go-flash-style')) {
    const s = document.createElement('style')
    s.id = 'go-flash-style'
    s.textContent = '@keyframes goFlash { from{opacity:1} to{opacity:0} }'
    document.head.appendChild(s)
  }
  document.body.appendChild(flash)
  setTimeout(() => flash.remove(), 700)
 
  // 2. Hundir el modelo del personaje (caída visual)
  let fallProgress = 0
  const fallStart = playerModel.position.y
  const fallInterval = setInterval(() => {
    fallProgress += 0.04
    playerModel.position.y = fallStart - fallProgress * 1.2
    playerModel.rotation.z = fallProgress * 1.4   // cae de lado
    if (fallProgress >= 1) clearInterval(fallInterval)
  }, 16)
 
  // 3. Mostrar overlay de Game Over tras breve pausa
  setTimeout(() => {
    gameOverScreen.overlay.classList.add('active')
  }, 600)
}
 