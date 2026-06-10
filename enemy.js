import * as THREE from 'three'

// ============================================
// SISTEMA DE ENEMIGOS CON BARRAS DE VIDA
// ============================================

export function createEnemy(scene, x, z, isBoss = false, modelPath = null) {
  const enemyGroup = new THREE.Group()
  
  if (isBoss) {
    // ============================================
    // JEFE FINAL
    // ============================================
    
    // Cuerpo más grande
    const bossBody = new THREE.Group()
    // cuerpo principal como cilindro con esferas para suavizar
    const bossCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.8, 4.9, 56),
      new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 1
      })
    )
    bossCore.castShadow = true
    bossCore.position.y = 1

    const bossTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 12, 12),
      bossCore.material
    )
    bossTop.position.y = 1.9

    bossBody.add(bossCore)
    bossBody.add(bossTop)
    bossBody.castShadow = true
    bossBody.position.y = 1.25
    
    // Cabeza del jefe
    const bossHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffaa88,
        emissive: 0xff6600,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 1
      })
    )
    bossHead.castShadow = true
    bossHead.position.y = 2.5
    
    // Brazos más grandes
    const bossArmLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8),
      new THREE.MeshStandardMaterial({
        color: 0xffaa88,
        transparent: true,
        opacity: 1
      })
    )
    bossArmLeft.castShadow = true
    bossArmLeft.position.set(-0.9, 1.5, 0)
    
    const bossArmRight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8),
      bossArmLeft.material
    )
    bossArmRight.castShadow = true
    bossArmRight.position.set(0.9, 1.5, 0)
    
    // Ojos del jefe (rojos)
    const bossEyeLeft = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 1
      })
    )
    bossEyeLeft.position.set(-0.2, 2.7, 0.5)
    
    const bossEyeRight = bossEyeLeft.clone()
    bossEyeRight.position.set(0.2, 2.7, 0.5)
    
    enemyGroup.add(bossBody)
    enemyGroup.add(bossHead)
    enemyGroup.add(bossArmLeft)
    enemyGroup.add(bossArmRight)
    enemyGroup.add(bossEyeLeft)
    enemyGroup.add(bossEyeRight)
    
    // Propiedades del jefe
    enemyGroup.maxHealth = 200
    enemyGroup.health = 200
    enemyGroup.damage = 30
    enemyGroup.speed = 0.05
    enemyGroup.isBoss = true
    enemyGroup.attackRange = 3
    enemyGroup.attackCooldown = 800
    enemyGroup.lastAttack = 0
    
  } else {
    // ============================================
    // ENEMIGO NORMAL
    // ============================================
    
    // Cuerpo estilo cápsula (cilindro + esferas)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 1
    })

    const enemyBody = new THREE.Group()
    const bodyCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.9, 12),
      coreMat
    )
    bodyCore.castShadow = true
    bodyCore.position.y = 0.6

    const bodyTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 12, 12),
      coreMat
    )
    bodyTop.position.y = 1.05

    const bodyBottom = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 12, 12),
      coreMat
    )
    bodyBottom.position.y = 0.15

    enemyBody.add(bodyCore)
    enemyBody.add(bodyTop)
    enemyBody.add(bodyBottom)
    
    // Cabeza (esfera)
    const enemyHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffaa88,
        transparent: true,
        opacity: 1
      })
    )
    enemyHead.castShadow = true
    enemyHead.position.y = 1.5
    
    // Brazos
    const armLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8),
      new THREE.MeshStandardMaterial({
        color: 0xffaa88,
        transparent: true,
        opacity: 1
      })
    )
    armLeft.castShadow = true
    armLeft.position.set(-0.5, 0.8, 0)
    
    const armRight = armLeft.clone()
    armRight.castShadow = true
    armRight.position.set(0.5, 0.8, 0)
    
    // Ojos
    const eyeLeft = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 1
      })
    )
    eyeLeft.position.set(-0.15, 1.7, 0.3)
    
    const eyeRight = eyeLeft.clone()
    eyeRight.position.set(0.15, 1.7, 0.3)
    
    enemyGroup.add(enemyBody)
    enemyGroup.add(enemyHead)
    enemyGroup.add(armLeft)
    enemyGroup.add(armRight)
    enemyGroup.add(eyeLeft)
    enemyGroup.add(eyeRight)
    
    // Propiedades del enemigo normal
    enemyGroup.maxHealth = 50
    enemyGroup.health = 50
    enemyGroup.damage = 15
    enemyGroup.speed = 0.03
    enemyGroup.isBoss = false
    enemyGroup.attackRange = 2
    enemyGroup.attackCooldown = 1000
    enemyGroup.lastAttack = 0

  }
  
  enemyGroup.position.set(x, 0, z)
  enemyGroup.isDying = false
  enemyGroup.deathTime = 0

  // Física básica por enemigo
  enemyGroup.velocity = new THREE.Vector3(0, 0, 0)
  enemyGroup.gravity = -0.02
  enemyGroup.floorY = 0
  enemyGroup.mixer = null
  enemyGroup.animActions = {}
  enemyGroup.animTime = 0

  // Método update por enemigo (avanza mixer y animaciones procedurales)
  enemyGroup.update = function(deltaSeconds) {
    if (this.mixer) this.mixer.update(deltaSeconds)

    // Procedural idle/walk bobbing si no hay animaciones
    if (!this.mixer && !this.isDying) {
      this.animTime = (this.animTime || 0) + deltaSeconds
      const bob = Math.sin(this.animTime * 3) * 0.02
      this.children.forEach(child => {
        if (child === this.healthBar) return
      })
      this.position.y = Math.max(this.floorY, this.position.y + bob * deltaSeconds)
    }
  }
  
  // Crear barra de vida
  createHealthBar(enemyGroup)
  
  scene.add(enemyGroup)

  // Si se suministra un modelo glTF, cargarlo (asíncrono)
  if (modelPath) {
    loadEnemyModel(enemyGroup, modelPath)
  }
  
  return enemyGroup
}

// ============================================
// BARRAS DE VIDA
// ============================================

function createHealthBar(enemy) {
  // Canvas para la barra de vida
  const canvas = document.createElement('canvas')
  const width = enemy.isBoss ? 200 : 100
  const height = 20
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  
  // Renderizar barra inicial
  updateHealthBarTexture(ctx, enemy, canvas)
  
  // Crear textura
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  
  // Crear plano para la barra
  const barGeometry = new THREE.PlaneGeometry(width / 100, height / 100)
  const barMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })
  const healthBar = new THREE.Mesh(barGeometry, barMaterial)
  
  // Posicionar barra sobre la cabeza del enemigo
  healthBar.position.y = enemy.isBoss ? 3.5 : 2.2
  healthBar.position.z = 0.5
  healthBar.renderOrder = 100
  
  enemy.add(healthBar)
  enemy.healthBar = healthBar
  enemy.healthBarCanvas = canvas
  enemy.healthBarContext = ctx
  enemy.healthBarTexture = texture
}

function updateHealthBarTexture(ctx, enemy, canvas) {
  const width = canvas.width
  const height = canvas.height
  
  // Limpiar
  ctx.clearRect(0, 0, width, height)
  
  // Fondo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(0, 0, width, height)
  
  // Borde
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, width - 2, height - 2)
  
  // Barra de vida
  const healthPercent = enemy.health / enemy.maxHealth
  const barWidth = (width - 4) * healthPercent
  
  // Color según salud
  if (healthPercent > 0.5) {
    ctx.fillStyle = '#00ff00'
  } else if (healthPercent > 0.25) {
    ctx.fillStyle = '#ffff00'
  } else {
    ctx.fillStyle = '#ff0000'
  }
  
  ctx.fillRect(2, 2, barWidth, height - 4)
  
  // Texto de salud
  ctx.fillStyle = 'white'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${Math.ceil(enemy.health)} / ${enemy.maxHealth}`, width / 2, height / 2)
}

export function updateEnemyHealthBars(enemies) {
  enemies.forEach(enemy => {
    if (enemy.healthBarContext && enemy.healthBarCanvas) {
      updateHealthBarTexture(enemy.healthBarContext, enemy, enemy.healthBarCanvas)
      enemy.healthBarTexture.needsUpdate = true
    }
  })
}

// ============================================
// MOVIMIENTO Y COMBAT DE ENEMIGOS
// ============================================

export function updateEnemies(enemies, playerPosition, scene, deltaSeconds = 1/60) {
  enemies.forEach((enemy, index) => {
    if (enemy.isDying) return

    // Física simple: gravedad
    enemy.velocity.y += enemy.gravity
    enemy.position.y += enemy.velocity.y

    if (enemy.position.y <= enemy.floorY) {
      enemy.position.y = enemy.floorY
      enemy.velocity.y = 0
    }

    const direction = new THREE.Vector3()
    direction.subVectors(playerPosition, enemy.position).normalize()

    const distance = playerPosition.distanceTo(enemy.position)

    // Perseguir si está cerca
    if (distance < 25) {

  if (distance > 2) {

    enemy.position.add(
      direction.clone().multiplyScalar(enemy.speed)
    )

  }

}

    // Avanzar animaciones/mixer
    if (typeof enemy.update === 'function') enemy.update(deltaSeconds)
  })
}

// Cargar modelo glTF opcional (asíncrono). Si se provee modelPath, el modelo se intentará cargar y usado como visual.
export function loadEnemyModel(enemyGroup, modelPath) {
  if (!modelPath) return
  console.log('[enemy] loadEnemyModel:', modelPath)

  ;(async () => {
    let GLTFLoaderCtor = null
    try {
      // Intentar import dinámico desde el paquete local (si el entorno lo soporta)
      const mod = await import('three/examples/jsm/loaders/GLTFLoader.js')
      GLTFLoaderCtor = mod.GLTFLoader || mod.default
    } catch (err) {
      try {
        // Fallback a CDN
        const mod = await import('https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js')
        GLTFLoaderCtor = mod.GLTFLoader || mod.default
      } catch (err2) {
        console.warn('No se pudo cargar GLTFLoader (local ni CDN).', err, err2)
        return
      }
    }

    const loader = new GLTFLoaderCtor()
    loader.load(modelPath, gltf => {
      const model = gltf.scene || gltf.scenes[0]
      model.traverse(n => { if (n.isMesh) { n.castShadow = true } })
      // centrar y añadir
      model.position.set(0, 0, 0)
      enemyGroup.add(model)

      if (gltf.animations && gltf.animations.length > 0) {
        enemyGroup.mixer = new THREE.AnimationMixer(model)
        gltf.animations.forEach(clip => {
          const action = enemyGroup.mixer.clipAction(clip)
          enemyGroup.animActions[clip.name.toLowerCase()] = action
        })

        // intentar reproducir idle si existe
        if (enemyGroup.animActions.idle) {
          enemyGroup.animActions.idle.play()
        }
      }
    }, undefined, err => {
      console.error('Error cargando modelo glTF:', err)
    })
  })()
}

// ============================================
// ANIMACIÓN DE MUERTE
// ============================================

export function damageEnemy(enemy, amount) {
  if (enemy.isDying) return
  
  enemy.health = Math.max(0, enemy.health - amount)
  playEnemyHitSound()
  
  if (enemy.health <= 0) {
    startDeathAnimation(enemy)
  }
}

function startDeathAnimation(enemy) {
  enemy.isDying = true
  enemy.deathTime = 0
  enemy.deathDuration = 1000 // 1 segundo
  enemy.startScale = enemy.scale.clone()
  enemy.startRotation = enemy.rotation.clone()

  // Asegurar que todos los materiales soporten transparencia para el fade
  enemy.traverse(obj => {
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => { m.transparent = true; m.opacity = 1 })
      } else {
        obj.material.transparent = true
        obj.material.opacity = 1
      }
    }
  })

  // Si hay animación de muerte definida, reproducirla y ajustar la duración
  if (enemy.mixer && enemy.animActions && enemy.animActions.death) {
    enemy.animActions.death.reset().play()
    const clip = enemy.animActions.death.getClip()
    if (clip && clip.duration) {
      enemy.deathDuration = clip.duration * 1000
    }
  }

  playEnemyDeathSound()
}

// Simple WebAudio para efectos de enemigo
let _enemyAudioCtx = null
function getEnemyAudioCtx() {
  if (!_enemyAudioCtx) _enemyAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return _enemyAudioCtx
}

function playEnemyHitSound() {
  const ctx = getEnemyAudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.value = 600
  gain.gain.value = 0.06
  osc.connect(gain); gain.connect(ctx.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
  osc.stop(ctx.currentTime + 0.12)
}

function playEnemyDeathSound() {
  const ctx = getEnemyAudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.value = 120
  gain.gain.value = 0.12
  osc.connect(gain); gain.connect(ctx.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
  osc.stop(ctx.currentTime + 0.5)
}

export function updateDeathAnimations(enemies, scene, onEnemyDeath, deltaTimeMs = 16.67) {
  const enemiesToRemove = []

  enemies.forEach((enemy, index) => {
    if (!enemy.isDying) return

    enemy.deathTime += deltaTimeMs
    const progress = Math.min(enemy.deathTime / enemy.deathDuration, 1)

    // Escalar hacia abajo
    const scale = enemy.startScale.x * (1 - progress * 0.7)
    enemy.scale.set(scale, scale, scale)

    // Rotar ligeramente
    enemy.rotation.x += 0.02
    enemy.rotation.y += 0.04

    // Desvanecer materiales de forma segura
    enemy.traverse(obj => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => { if (m.opacity !== undefined) m.opacity = 1 - progress })
        } else {
          if (obj.material.opacity !== undefined) obj.material.opacity = 1 - progress
        }
      }
    })

    // Hundir ligeramente al morir
    enemy.position.y -= progress * 0.002 * enemy.deathDuration

    if (progress >= 1) {
      scene.remove(enemy)
      enemiesToRemove.push(index)
      if (onEnemyDeath) onEnemyDeath(enemy)
    }
  })

  // Eliminar en orden inverso para mantener indices
  enemiesToRemove.reverse().forEach(index => {
    enemies.splice(index, 1)
  })
}

// ============================================
// DAÑO A JUGADOR
// ============================================

export function checkEnemyPlayerCollision(enemies, playerPosition, player) {
  enemies.forEach(enemy => {
    if (enemy.isDying) return
    
    const distance = playerPosition.distanceTo(enemy.position)
    
    if (distance < enemy.attackRange) {
      player.health -= enemy.damage
    }
  })
}

// ─────────────────────────────────────────────
// DETECCIÓN DE ATAQUES ENEMIGOS
// ─────────────────────────────────────────────
 
/**
 * Comprueba si algún enemigo está lo suficientemente cerca para golpear.
 * Integra daño, knockback, invencibilidad temporal y detección de muerte.
 *
 * @param {Array}  enemies       - array de objetos enemigo { mesh, attackRange, damage, attackCooldown, _attackTimer }
 * @param {THREE.Object3D} playerModel
 * @param {THREE.Camera} camera   - necesario para el efecto de pantalla roja
 * @param {object} healthBar      - retorno de createHealthBar()
 * @param {object} gameOverScreen - retorno de createGameOverScreen()
 * @param {number} delta
 *
 * Estructura esperada de cada enemigo:
 *   {
 *     mesh: THREE.Mesh | THREE.Group,
 *     attackRange: 2.0,     // distancia en unidades para golpear
 *     damage: 15,           // puntos de vida que quita
 *     attackCooldown: 1.5,  // segundos entre ataques
 *     _attackTimer: 0       // inicializar en 0; el sistema lo maneja
 *   }
 */
export function checkEnemyAttacks(enemies, playerModel, camera, healthBar, gameOverScreen, delta) {
  if (!playerState.alive) return
 
  // Actualizar invencibilidad
  if (playerState.invincible) {
    playerState.invincibleTimer -= delta
    if (playerState.invincibleTimer <= 0) {
      playerState.invincible = false
    }
  }
 
  for (const enemy of enemies) {
    // Asegurar que el timer exista
    if (enemy._attackTimer === undefined) enemy._attackTimer = 0
    enemy._attackTimer -= delta
 
    const dist = playerModel.position.distanceTo(enemy.mesh.position)
 
    if (dist <= (enemy.attackRange ?? 2.0) && enemy._attackTimer <= 0) {
      enemy._attackTimer = enemy.attackCooldown ?? 1.5
 
      if (!playerState.invincible) {
        // ── Aplicar daño ──
        playerState.hp -= enemy.damage ?? 15
        updateHealthBar(healthBar)
 
        // ── Knockback ──
        applyKnockback(playerModel, enemy.mesh, 5)
 
        // ── Flash rojo en pantalla ──
        flashDamageScreen()
 
        // ── Iniciar invencibilidad temporal ──
        playerState.invincible = true
        playerState.invincibleTimer = playerState.invincibleDuration
 
        // ── Verificar muerte ──
        if (playerState.hp <= 0) {
          playerState.hp = 0
          playerState.alive = false
          updateHealthBar(healthBar)
          triggerGameOver(gameOverScreen, playerModel, camera)
          return
        }
      }
    }
  }
}
 
// ─────────────────────────────────────────────
// FLASH DE DAÑO (overlay rojo momentáneo)
// ─────────────────────────────────────────────
 
function flashDamageScreen() {
  let overlay = document.getElementById('damage-flash')
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'damage-flash'
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(200, 0, 0, 0.35)',
      pointerEvents: 'none',
      zIndex: '900',
      opacity: '0',
      transition: 'opacity 0.08s ease-in',
    })
    document.body.appendChild(overlay)
  }
 
  overlay.style.opacity = '1'
  clearTimeout(overlay._fadeTimeout)
  overlay._fadeTimeout = setTimeout(() => {
    overlay.style.transition = 'opacity 0.5s ease-out'
    overlay.style.opacity = '0'
  }, 80)
}