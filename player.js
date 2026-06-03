import * as THREE from 'three'
import { playerAppearance } from './personalizacion.js'

// ============================================
// MODELO DEL PERSONAJE COMPLETO
// ============================================

export function createPlayerModel(scene) {
  const playerModel = new THREE.Group()

  // Cabeza
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshStandardMaterial({
      color: 0xffd39b
    })
  )
  head.castShadow = true
  head.position.y = 2.2

  // Torso
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.0, 0.5),
    new THREE.MeshStandardMaterial({
      color: playerAppearance.shirtColor
    })
  )
  torso.castShadow = true
  torso.position.y = 1.5

  // Brazos
  const armLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.9, 0.3),
    new THREE.MeshStandardMaterial({
      color: 0xffd39b
    })
  )
  armLeft.castShadow = true
  armLeft.position.set(-0.55, 1.5, 0)

  const armRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.9, 0.3),
    new THREE.MeshStandardMaterial({
      color: 0xffd39b
    })
  )
  armRight.castShadow = true
  armRight.position.set(0.55, 1.5, 0)

  // Piernas
  const legLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.0, 0.3),
    new THREE.MeshStandardMaterial({
      color: playerAppearance.pantsColor
    })
  )
  legLeft.castShadow = true
  legLeft.position.set(-0.25, 0.5, 0)

  const legRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.0, 0.3),
    new THREE.MeshStandardMaterial({
      color: playerAppearance.pantsColor
    })
  )
  legRight.castShadow = true
  legRight.position.set(0.25, 0.5, 0)

  // Ojos
  const eyeLeft = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshStandardMaterial({
      color: 0x000000
    })
  )
  eyeLeft.position.set(-0.15, 2.35, 0.3)

  const eyeRight = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshStandardMaterial({
      color: 0x000000
    })
  )
  eyeRight.position.set(0.15, 2.35, 0.3)

  // Agregar todo al grupo
  playerModel.add(head)
  playerModel.add(torso)
  playerModel.add(armLeft)
  playerModel.add(armRight)
  playerModel.add(legLeft)
  playerModel.add(legRight)
  playerModel.add(eyeLeft)
  playerModel.add(eyeRight)

  scene.add(playerModel)

  return playerModel
}

// ============================================
// VISTA PREVIA DEL PERSONAJE EN ESQUINA
// ============================================

export function createPlayerPreview(playerModel, camera, renderer, scene) {
  // Crear canvas para la vista previa
  const previewCanvas = document.createElement('canvas')
  previewCanvas.width = 250
  previewCanvas.height = 300
  previewCanvas.style.position = 'absolute'
  previewCanvas.style.bottom = '20px'
  previewCanvas.style.right = '20px'
  previewCanvas.style.border = '2px solid rgba(255, 255, 255, 0.3)'
  previewCanvas.style.borderRadius = '8px'
  previewCanvas.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
  previewCanvas.style.zIndex = '200'
  document.body.appendChild(previewCanvas)

  // Crear escena para la vista previa
  const previewScene = new THREE.Scene()
  previewScene.background = new THREE.Color(0x1a1a2e)

  // Cámara de la vista previa
  const previewCamera = new THREE.PerspectiveCamera(
    45,
    previewCanvas.width / previewCanvas.height,
    0.1,
    1000
  )
  previewCamera.position.set(0, 1, 2.5)
  previewCamera.lookAt(0, 1, 0)

  // Renderizador de la vista previa
  const previewRenderer = new THREE.WebGLRenderer({ 
    canvas: previewCanvas, 
    antialias: true, 
    alpha: true 
  })
  previewRenderer.setSize(previewCanvas.width, previewCanvas.height)
  previewRenderer.shadowMap.enabled = true

  // Luz para la vista previa
  const previewLight = new THREE.DirectionalLight(0xffffff, 1.5)
  previewLight.position.set(2, 3, 2)
  previewLight.castShadow = true
  previewScene.add(previewLight)

  const previewAmbient = new THREE.AmbientLight(0xffffff, 0.6)
  previewScene.add(previewAmbient)

  // Clonar el modelo para la vista previa
  const previewModel = playerModel.clone()
  previewModel.position.set(0, 0, 0)
  previewScene.add(previewModel)

  // Piso para la vista previa
  const previewGround = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshStandardMaterial({
      color: 0x3d9140
    })
  )
  previewGround.rotation.x = -Math.PI / 2
  previewGround.receiveShadow = true
  previewScene.add(previewGround)

  // Retornar función para actualizar
  return function updatePlayerPreview() {
    // Copiar posición del personaje principal
    previewModel.position.copy(playerModel.position)
    
    // Rotar la cámara de vista previa alrededor del personaje
    const angle = Date.now() * 0.0005
    previewCamera.position.x = Math.sin(angle) * 2.5
    previewCamera.position.z = Math.cos(angle) * 2.5
    previewCamera.lookAt(previewModel.position.x, previewModel.position.y + 1, previewModel.position.z)
    
    previewRenderer.render(previewScene, previewCamera)
  }
}