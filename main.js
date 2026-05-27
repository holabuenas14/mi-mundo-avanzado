import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)

camera.position.set(0, 5, 10)

// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

const clock = new THREE.Clock()

document.body.appendChild(renderer.domElement)

const controls = new PointerLockControls(camera, renderer.domElement)
controls.getObject().position.set(0, 1.6, 10)

const instructions = document.createElement('div')
instructions.style.position = 'absolute'
instructions.style.top = '20px'
instructions.style.left = '20px'
instructions.style.color = 'white'
instructions.style.fontSize = '18px'
instructions.style.fontFamily = 'Arial'
instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
instructions.style.padding = '10px'
instructions.style.borderRadius = '6px'
instructions.style.zIndex = '100'
instructions.textContent = 'Haz clic para entrar en primera persona. Usa W/A/S/D para moverte, SPACE para saltar y F para golpear.'
document.body.appendChild(instructions)

controls.addEventListener('lock', () => {
  instructions.style.display = 'none'
})

controls.addEventListener('unlock', () => {
  instructions.style.display = 'block'
})

document.body.addEventListener('click', () => {
  if (!controls.isLocked) controls.lock()
})

const physics = {
  velocity: new THREE.Vector3(0, 0, 0),
  gravity: -0.01,
  jumpStrength: 0.2,
  canJump: false,
  floorHeight: 1.6
}

let attackReady = true
const attackCooldown = 500
const raycaster = new THREE.Raycaster()
let audioContext = null

function playHitSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }

  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()

  osc.type = 'square'
  osc.frequency.value = 220
  gain.gain.value = 0.08

  osc.connect(gain)
  gain.connect(audioContext.destination)

  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.12)
  osc.stop(audioContext.currentTime + 0.12)
}

// LIGHTS
const sun = new THREE.DirectionalLight(0xffffff, 2)
sun.position.set(50, 100, 50)
sun.castShadow = true

scene.add(sun)

const ambient = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambient)

// ============================================
// PLAYER
// ============================================

const playerGroup = new THREE.Group()

const body = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshStandardMaterial({
    color: 0x00ff99
  })
)

body.castShadow = true
body.visible = false
body.position.y = 1

playerGroup.add(body)

scene.add(playerGroup)

playerGroup.position.copy(controls.getObject().position)

// PLAYER STATS
const player = {
  speed: 0.2,
  health: 100,
  stamina: 100,
  xp: 0,
  level: 1,
  inventory: ['Madera'],
  tools: ['Puños']
}

const attackState = {
  energy: 100,
  maxEnergy: 100,
  drain: 30,
  regenRate: 15,
  cooldownActive: false
}

// ============================================
// WORLD
// ============================================

// GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshStandardMaterial({
    color: 0x3d9140
  })
)

ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true

scene.add(ground)

// TREES
for (let i = 0; i < 300; i++) {

  const tree = new THREE.Group()

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.5, 4),
    new THREE.MeshStandardMaterial({
      color: 0x8b4513
    })
  )

  trunk.position.y = 2

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshStandardMaterial({
      color: 0x228b22
    })
  )

  leaves.position.y = 5

  tree.add(trunk)
  tree.add(leaves)

  tree.position.set(
    Math.random() * 800 - 400,
    0,
    Math.random() * 800 - 400
  )

  scene.add(tree)
}

// MOUNTAINS
for (let i = 0; i < 40; i++) {

  const mountain = new THREE.Mesh(
    new THREE.ConeGeometry(
      Math.random() * 20 + 10,
      Math.random() * 50 + 20,
      4
    ),
    new THREE.MeshStandardMaterial({
      color: 0x777777
    })
  )

  mountain.position.set(
    Math.random() * 900 - 450,
    20,
    Math.random() * 900 - 450
  )

  scene.add(mountain)
}

const lanternLights = []
let moon
let moonLight

const lanternPositions = [
  [20, 0, 20],
  [-30, 0, 15],
  [50, 0, -40],
  [-60, 0, -60],
  [0, 0, -80]
]

lanternPositions.forEach(([x, y, z]) => {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 4),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  )
  pole.position.set(x, 2, z)
  scene.add(pole)

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.4),
    new THREE.MeshStandardMaterial({
      color: 0xffddaa,
      emissive: 0xffdd88,
      emissiveIntensity: 1
    })
  )
  bulb.position.set(x, 3.2, z)
  scene.add(bulb)

  const light = new THREE.PointLight(0xffcc88, 0.1, 25, 2)
  light.position.set(x, 3.2, z)
  scene.add(light)
  lanternLights.push(light)
})

moon = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffee,
    emissive: 0xffffee,
    emissiveIntensity: 1,
    transparent: true,
    opacity: 0.9
  })
)
moon.position.set(0, 200, -200)
scene.add(moon)

moonLight = new THREE.DirectionalLight(0xaaaaff, 0)
moonLight.position.copy(moon.position)
scene.add(moonLight)

// ============================================
// ENEMIES
// ============================================

const enemies = []

function createEnemy(x, z) {

  const enemy = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({
      color: 0xff0000
    })
  )

  enemy.position.set(x, 1, z)

  enemy.health = 50

  scene.add(enemy)

  enemies.push(enemy)
}

for (let i = 0; i < 20; i++) {

  createEnemy(
    Math.random() * 300 - 150,
    Math.random() * 300 - 150
  )
}

// ============================================
// DAY/NIGHT CYCLE
// ============================================

let time = 0

function updateDayNight() {

  time += 0.001

  sun.position.x = Math.sin(time) * 100
  sun.position.y = Math.cos(time) * 100
  moon.position.set(-sun.position.x * 2, 200, -sun.position.z * 2)
  moonLight.position.copy(moon.position)

  if (sun.position.y < 0) {
    sun.intensity = 0
    ambient.intensity = 0.09
    scene.background = new THREE.Color(0x000022)
    moonLight.intensity = 0.8
    lanternLights.forEach(light => light.intensity = 1.2)
    moon.visible = true
  } else {
    sun.intensity = 1.4
    ambient.intensity = 0.4
    scene.background = new THREE.Color(0x87ceeb)
    moonLight.intensity = 0
    lanternLights.forEach(light => light.intensity = 0.1)
    moon.visible = false
  }
}

// ============================================
// CONTROLS
// ============================================

const keys = {}

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true

  if (e.code === 'Space' && physics.canJump && controls.isLocked) {
    physics.velocity.y = physics.jumpStrength
    physics.canJump = false
  }

  if (e.key.toLowerCase() === 'f' && controls.isLocked) {
    performAttack()
  }
})

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false
})

// ============================================
// ATTACK SYSTEM
// ============================================

window.addEventListener('click', () => {

  enemies.forEach(enemy => {

    const distance = playerGroup.position.distanceTo(enemy.position)

    if (distance < 3) {

      enemy.health -= 25

      console.log('Enemy hit')

      if (enemy.health <= 0) {

        scene.remove(enemy)

        player.xp += 20

        console.log('Enemy defeated')

        levelUp()
      }
    }
  })
})

// ============================================
// LEVEL SYSTEM
// ============================================

function levelUp() {

  if (player.xp >= player.level * 100) {

    player.level++

    player.health += 20

    console.log('LEVEL UP')

    unlockTools()
  }
}

// ============================================
// TOOL PROGRESSION
// ============================================

function unlockTools() {

  if (player.level === 2) {
    player.tools.push('Hacha')
  }

  if (player.level === 3) {
    player.tools.push('Espada')
  }

  if (player.level === 5) {
    player.tools.push('Arco')
  }

  console.log(player.tools)
}

// ============================================
// MOVEMENT
// ============================================

function movement() {
  if (!controls.isLocked) return

  if (keys['w']) controls.moveForward(player.speed)
  if (keys['s']) controls.moveForward(-player.speed)
  if (keys['a']) controls.moveRight(-player.speed)
  if (keys['d']) controls.moveRight(player.speed)

  playerGroup.position.copy(controls.getObject().position)
}

function applyPhysics() {
  physics.velocity.y += physics.gravity
  controls.getObject().position.y += physics.velocity.y

  if (controls.getObject().position.y <= physics.floorHeight) {
    physics.velocity.y = 0
    controls.getObject().position.y = physics.floorHeight
    physics.canJump = true
  }
}

function performAttack() {
  if (!attackReady) return

  if (attackState.energy < attackState.drain) return

  attackReady = false
  attackState.cooldownActive = true
  attackState.energy = Math.max(0, attackState.energy - attackState.drain)
  setTimeout(() => {
    attackReady = true
    attackState.cooldownActive = false
  }, attackCooldown)

  const origin = controls.getObject().position.clone()
  const direction = new THREE.Vector3()
  camera.getWorldDirection(direction)

  raycaster.set(origin, direction)
  const hits = raycaster.intersectObjects(enemies, false)

  if (hits.length > 0 && hits[0].distance < 4) {
    const enemy = hits[0].object
    enemy.health -= 40
    playHitSound()
    console.log('Golpeaste al enemigo!')

    if (enemy.health <= 0) {
      scene.remove(enemy)
      enemies.splice(enemies.indexOf(enemy), 1)
      player.xp += 20
      console.log('Enemigo derrotado')
      levelUp()
    }
  }
}

function rechargeAttackEnergy(delta) {
  attackState.energy = Math.min(
    attackState.maxEnergy,
    attackState.energy + attackState.regenRate * delta
  )
}

// ============================================
// ENEMY AI
// ============================================

function updateEnemies() {

  enemies.forEach(enemy => {

    const direction = new THREE.Vector3()

    direction.subVectors(
      playerGroup.position,
      enemy.position
    ).normalize()

    const distance = playerGroup.position.distanceTo(enemy.position)

    if (distance < 20) {
      enemy.position.add(
        direction.multiplyScalar(0.03)
      )
    }

    if (distance < 2) {
      player.health -= 0.1
    }
  })
}

// ============================================
// UI
// ============================================

const ui = document.createElement('div')

ui.style.position = 'absolute'
ui.style.top = '20px'
ui.style.left = '20px'
ui.style.color = 'white'
ui.style.fontSize = '20px'
ui.style.fontFamily = 'Arial'

document.body.appendChild(ui)

function updateUI() {

  ui.innerHTML = `
  
  ❤️ Vida: ${Math.floor(player.health)}
  <br>
  ⚡ Nivel: ${player.level}
  <br>
  ⭐ XP: ${player.xp}
  <br>
  🛠️ Herramientas: ${player.tools.join(', ')}
  <br>
  🔥 Energía de ataque: ${Math.floor(attackState.energy)} / ${attackState.maxEnergy}
  <br>
  ⚔️ Estado: ${attackState.energy >= attackState.drain && attackReady ? 'Listo' : 'Recargando'}
  <br>
  <div style="width: 220px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; overflow: hidden; margin-top: 6px;">
    <div style="width: ${Math.floor((attackState.energy / attackState.maxEnergy) * 100)}%; height: 10px; background: #ff5555;"></div>
  </div>
  `
}

// ============================================
// GAME LOOP
// ============================================

function animate() {

  requestAnimationFrame(animate)

  movement()
  applyPhysics()
  updateEnemies()

  updateDayNight()
  rechargeAttackEnergy(clock.getDelta())

  updateUI()

  renderer.render(scene, camera)
}

animate()

// ============================================
// RESPONSIVE
// ============================================

window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight

  camera.updateProjectionMatrix()

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  )
})