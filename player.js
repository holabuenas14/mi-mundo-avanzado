import * as THREE from 'three'

export function createPlayer(scene) {
  const geometry = new THREE.BoxGeometry(1, 2, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })

  const player = new THREE.Mesh(geometry, material)
  player.position.y = 1

  scene.add(player)

  return player
}

export function movePlayer(player, keys) {
  const speed = 0.15

  if (keys['w']) player.position.z -= speed
  if (keys['s']) player.position.z += speed
  if (keys['a']) player.position.x -= speed
  if (keys['d']) player.position.x += speed
}