import * as THREE from 'three'

export function createEnemy(scene, x, z) {
  const geometry = new THREE.BoxGeometry(1, 2, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })

  const enemy = new THREE.Mesh(geometry, material)

  enemy.position.set(x, 1, z)

  scene.add(enemy)

  return enemy
}

export function updateEnemies(enemies, player) {
  enemies.forEach((enemy) => {
    const direction = new THREE.Vector3()
      .subVectors(player.position, enemy.position)
      .normalize()

    enemy.position.add(direction.multiplyScalar(0.02))
  })
}