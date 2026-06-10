// ============================================
// SISTEMA DE VIDA, DAÑO, KNOCKBACK Y GAME OVER
// ============================================
//
// INTEGRACIÓN EN TU main.js:
//
//  import {
//    createHealthBar, updateHealthBar,
//    applyKnockback, updateKnockback,
//    checkEnemyAttacks,
//    createGameOverScreen, triggerGameOver
//  } from './gameOver.js'
//
//  // Al inicializar:
//  const healthBar = createHealthBar()
//  const gameOverScreen = createGameOverScreen(() => {
//    // tu función de reinicio (recargar escena, resetear estado, etc.)
//    location.reload()
//  })
//
//  // En tu game loop (función animate/update):
//  updateKnockback(player, delta)
//  checkEnemyAttacks(enemies, player, camera, healthBar, gameOverScreen)
//
// ============================================
 
import * as THREE from 'three'
 
// ─────────────────────────────────────────────
// ESTADO COMPARTIDO DEL JUGADOR
// ─────────────────────────────────────────────
 
export const playerState = {
  hp: 100,
  maxHp: 100,
  alive: true,
  invincible: false,          // ventana de invencibilidad post-golpe
  invincibleTimer: 0,
  invincibleDuration: 0,    // segundos sin recibir daño tras un golpe
 
  // Knockback
  knockbackVelocity: new THREE.Vector3(),
  knockbackDecay: 8.0,        // qué tan rápido se frena (mayor = frena antes)
}
 
// ─────────────────────────────────────────────
// BARRA DE VIDA (HUD)
// ─────────────────────────────────────────────
 
/**
 * Crea y monta la barra de vida en el DOM.
 * Devuelve el objeto { container, fill, label } para actualizarla.
 */
export function createHealthBar() {
  // Contenedor externo
  const container = document.createElement('div')
  container.id = 'health-bar-container'
  Object.assign(container.style, {
    position: 'fixed',
    top: '20px',
    left: '20px',
    width: '220px',
    zIndex: '500',
    fontFamily: 'Georgia, serif',
    userSelect: 'none',
  })
 
  // Etiqueta ❤ Vida
  const label = document.createElement('div')
  label.id = 'health-label'
  label.textContent = '❤ Vida  100 / 100'
  Object.assign(label.style, {
    color: '#f0dcc8',
    fontSize: '13px',
    marginBottom: '5px',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
    letterSpacing: '0.5px',
  })
 
  // Track (fondo de la barra)
  const track = document.createElement('div')
  Object.assign(track.style, {
    width: '100%',
    height: '14px',
    background: 'rgba(0,0,0,0.55)',
    borderRadius: '7px',
    border: '1px solid rgba(255,255,255,0.15)',
    overflow: 'hidden',
  })
 
  // Relleno (la barra real)
  const fill = document.createElement('div')
  fill.id = 'health-fill'
  Object.assign(fill.style, {
    height: '100%',
    width: '100%',
    background: 'linear-gradient(90deg, #c0392b, #e74c3c)',
    borderRadius: '7px',
    transition: 'width 0.25s ease, background 0.4s ease',
  })
 
  track.appendChild(fill)
  container.appendChild(label)
  container.appendChild(track)
  document.body.appendChild(container)
 
  return { container, fill, label }
}
 
/**
 * Actualiza el ancho y color de la barra según hp actual.
 * @param {{ fill: HTMLElement, label: HTMLElement }} healthBar
 */
export function updateHealthBar(healthBar) {
  const pct = Math.max(0, playerState.hp / playerState.maxHp)
  healthBar.fill.style.width = `${pct * 100}%`
  healthBar.label.textContent =
    `❤ Vida  ${Math.max(0, Math.round(playerState.hp))} / ${playerState.maxHp}`
 
  // Cambia color según nivel de vida
  if (pct > 0.5) {
    healthBar.fill.style.background = 'linear-gradient(90deg, #c0392b, #e74c3c)'
  } else if (pct > 0.25) {
    healthBar.fill.style.background = 'linear-gradient(90deg, #e67e22, #e74c3c)'
  } else {
    // Parpadeo rojo en vida crítica
    healthBar.fill.style.background = 'linear-gradient(90deg, #7b0000, #c0392b)'
    healthBar.fill.style.animation = 'hpCritical 0.6s ease-in-out infinite alternate'
  }
}
 
// Inyectar keyframe para el parpadeo crítico (solo una vez)
;(function injectCriticalKeyframe() {
  if (document.getElementById('hp-critical-style')) return
  const style = document.createElement('style')
  style.id = 'hp-critical-style'
  style.textContent = `
    @keyframes hpCritical {
      from { opacity: 1; }
      to   { opacity: 0.45; }
    }
  `
  document.head.appendChild(style)
})()
 
// ─────────────────────────────────────────────
// KNOCKBACK
// ─────────────────────────────────────────────
 
/**
 * Aplica un impulso de knockback al jugador alejándolo del atacante.
 * @param {THREE.Object3D} playerModel  - tu playerModel (Three.js Group)
 * @param {THREE.Object3D} attacker     - el enemigo que golpea
 * @param {number} force                - magnitud del empuje (default 6)
 */
export function applyKnockback(playerModel, attacker, force = 6) {
  const dir = new THREE.Vector3()
    .subVectors(playerModel.position, attacker.position)
    .setY(0)          // solo en el plano horizontal
    .normalize()
  playerState.knockbackVelocity.copy(dir.multiplyScalar(force))
}
 
/**
 * Actualiza la posición del jugador con el knockback activo.
 * Llámala en cada frame ANTES de procesar el input normal.
 * @param {THREE.Object3D} playerModel
 * @param {number} delta  - THREE.Clock delta (segundos)
 */
export function updateKnockback(playerModel, delta) {
  if (playerState.knockbackVelocity.lengthSq() < 0.001) return
 
  playerModel.position.addScaledVector(playerState.knockbackVelocity, delta)
 
  // Deceleración exponencial (frenado natural)
  playerState.knockbackVelocity.multiplyScalar(
    Math.max(0, 1 - playerState.knockbackDecay * delta)
  )
}
 


 
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
 