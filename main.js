import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import {
  createEnemy as createEnemyObj,
  updateEnemies as updateEnemiesSystem,
  updateEnemyHealthBars,
  updateDeathAnimations,
  damageEnemy
} from './enemy.js'
import {
  createInventoryUI,
  updateInventoryUI,
  toggleInventory
} from './inventory.js'

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

// CAMERA
const camera = new THREE.PerspectiveCamera(
  100,
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

const cameraConfig = {
  fov: 100,
  cameraHeight: 1.6,
  moveSpeed: 0.2
}

function updateCameraSettings() {
  camera.fov = cameraConfig.fov
  camera.updateProjectionMatrix()
  physics.floorHeight = cameraConfig.cameraHeight
  player.speed = cameraConfig.moveSpeed
  if (controls.isLocked || controls.getObject().position.y <= physics.floorHeight + 0.01) {
    controls.getObject().position.y = physics.floorHeight
  }
}

function createCameraControlPanel() {
  const panel = document.createElement('div')
  panel.id = 'camera-control-panel'
  panel.style.position = 'absolute'
  panel.style.top = '20px'
  panel.style.right = '20px'
  panel.style.width = '260px'
  panel.style.padding = '14px'
  panel.style.background = 'rgba(20, 20, 20, 0.72)'
  panel.style.color = 'white'
  panel.style.fontFamily = 'Arial, sans-serif'
  panel.style.fontSize = '14px'
  panel.style.borderRadius = '12px'
  panel.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)'
  panel.style.zIndex = '110'

  const panelTitle = document.createElement('div')
  panelTitle.textContent = 'Ajustes de cámara'
  panelTitle.style.fontSize = '16px'
  panelTitle.style.fontWeight = '700'
  panelTitle.style.marginBottom = '10px'
  panel.appendChild(panelTitle)

  const createSlider = (labelText, min, max, step, value, onChange) => {
    const wrapper = document.createElement('div')
    wrapper.style.marginBottom = '12px'

    const label = document.createElement('label')
    label.textContent = labelText
    label.style.display = 'block'
    label.style.marginBottom = '4px'
    wrapper.appendChild(label)

    const valueDisplay = document.createElement('div')
    valueDisplay.textContent = `${value}`
    valueDisplay.style.fontSize = '12px'
    valueDisplay.style.marginBottom = '4px'
    valueDisplay.style.color = '#cfcfcf'
    wrapper.appendChild(valueDisplay)

    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = min
    slider.max = max
    slider.step = step
    slider.value = value
    slider.style.width = '100%'
    slider.addEventListener('input', (event) => {
      const newValue = parseFloat(event.target.value)
      valueDisplay.textContent = `${newValue}`
      onChange(newValue)
    })
    wrapper.appendChild(slider)

    return wrapper
  }

  panel.appendChild(createSlider('Campo de visión (FOV)', 50, 120, 1, cameraConfig.fov, (value) => {
    cameraConfig.fov = value
    updateCameraSettings()
  }))

  panel.appendChild(createSlider('Altura de cámara', 0.8, 3.2, 0.1, cameraConfig.cameraHeight, (value) => {
    cameraConfig.cameraHeight = value
    updateCameraSettings()
  }))

  panel.appendChild(createSlider('Velocidad de movimiento', 0.05, 1.0, 0.01, cameraConfig.moveSpeed, (value) => {
    cameraConfig.moveSpeed = value
    updateCameraSettings()
  }))

  document.body.appendChild(panel)
}

const physics = {
  velocity: new THREE.Vector3(0, 0, 0),
  gravity: -0.01,
  jumpStrength: 0.2,
  canJump: false,
  floorHeight: cameraConfig.cameraHeight
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
  tools: ['Puños'],
  equippedTool: 'Puños',
  rocks: 110,
  coins: 390
}

createCameraControlPanel()
updateCameraSettings()

const inventoryUI = createInventoryUI()
updateInventoryUI(player)

let weaponMesh = null
function createWeaponMesh(toolName) {
  const weapon = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.4 })
  if (toolName === 'Hacha') {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), material)
    handle.rotation.z = Math.PI / 2
    handle.position.set(0.1, -0.3, 0)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.15), material)
    head.position.set(-0.1, -0.3, 0)
    weapon.add(handle, head)
  } else if (toolName === 'Espada') {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.06), material)
    blade.position.set(0, -0.2, 0)
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.18), material)
    guard.position.set(0, -0.65, 0)
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), material)
    grip.rotation.z = Math.PI / 2
    grip.position.set(0, -0.9, 0)
    weapon.add(blade, guard, grip)
  } else if (toolName === 'Arco') {
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.03, 16, 100, Math.PI), material)
    bow.rotation.z = Math.PI / 2
    bow.rotation.x = Math.PI / 12
    bow.position.set(0, -0.3, 0)
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.9, 4), new THREE.MeshStandardMaterial({ color: 0x444444 }))
    string.rotation.z = Math.PI / 2
    string.position.set(0, -0.3, 0)
    weapon.add(bow, string)
  } else {
    const fist = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), material)
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), material)
    forearm.rotation.z = Math.PI / 2
    forearm.position.set(0.15, -0.45, 0)
    fist.position.set(0.5, -0.45, 0)
    weapon.add(forearm, fist)
  }
  return weapon
}

function updateWeaponModel(toolName) {
  if (weaponMesh) {
    camera.remove(weaponMesh)
    weaponMesh = null
  }
  weaponMesh = createWeaponMesh(toolName)
  weaponMesh.position.set(0.4, -0.45, -0.8)
  weaponMesh.rotation.set(-0.2, 0.3, 0)
  camera.add(weaponMesh)
}

updateWeaponModel(player.equippedTool)

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
      Math.random() * 30 + 40,
      Math.random() * 50 + 40,
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
// ENEMIES (integración con enemy.js)
// ============================================

const enemies = []

// Generar enemigos normales y un jefe final
for (let i = 0; i < 18; i++) {
  enemies.push(createEnemyObj(scene, Math.random() * 300 - 150, Math.random() * 300 - 150, false))
}

// Crear un jefe cerca del origen
enemies.push(createEnemyObj(scene, 10, -10, true))

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

  if (e.key.toLowerCase() === 'i') {
    toggleInventory()
    updateInventoryUI(player)
  }
})

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false
})

// ============================================
// ATTACK SYSTEM
// ============================================

window.addEventListener('click', () => {
  // Ataque cuerpo a cuerpo: daño a enemigos cercanos
  enemies.forEach(enemy => {
    const distance = playerGroup.position.distanceTo(enemy.position)
    if (distance < 3 && !enemy.isDying) {
      damageEnemy(enemy, 25)
      console.log('Enemy hit (melee)')
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
    player.equippedTool = 'Hacha'
  }

  if (player.level === 3) {
    player.tools.push('Espada')
    player.equippedTool = 'Espada'
  }

  if (player.level === 5) {
    player.tools.push('Arco')
    player.equippedTool = 'Arco'
  }

  if (player.equippedTool) {
    updateWeaponModel(player.equippedTool)
  }
  updateInventoryUI(player)

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
  const hits = raycaster.intersectObjects(enemies, true)

  if (hits.length > 0 && hits[0].distance < 4) {
    // Encontrar el objeto enemigo (group) desde el mesh golpeado
    let obj = hits[0].object
    while (obj && obj.parent && obj.health === undefined) obj = obj.parent
    if (obj && obj.health !== undefined) {
      damageEnemy(obj, 40)
      playHitSound()
      console.log('Golpeaste al enemigo!')
    }
  }
}

function rechargeAttackEnergy(delta) {
  attackState.energy = Math.min(
    attackState.maxEnergy,
    attackState.energy + attackState.regenRate * delta
  )
}

// Enemy AI is handled by the imported enemy system (updateEnemiesSystem)

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
  ⚡ Estamina: ${Math.floor(player.stamina)}
  <br>
  ⭐ XP: ${player.xp}
  <br>
  🛠️ Herramienta: ${player.equippedTool}
  <br>
  🪨 Rocas: ${player.rocks}
  <br>
  🪙 Monedas: ${player.coins}
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
  const delta = clock.getDelta()

  // Actualizar enemigos (IA + físicas básicas)
  updateEnemiesSystem(enemies, playerGroup.position, scene, delta)

  // Barras de vida y animaciones de muerte
  updateEnemyHealthBars(enemies)
  updateDeathAnimations(enemies, scene, (deadEnemy) => {
    // Callback cuando un enemigo termina su animación de muerte
    player.xp += deadEnemy.isBoss ? 200 : 20
    levelUp()
  }, delta * 1000)

  updateDayNight()
  rechargeAttackEnergy(delta)

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