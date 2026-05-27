import * as THREE from 'three'

export function createWorld(scene) {
  const groundGeometry = new THREE.PlaneGeometry(200, 200)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,
  })

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)

  ground.rotation.x = -Math.PI / 2

  scene.add(ground)

  for (let i = 0; i < 100; i++) {
    const tree = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    )

    tree.position.set(
      Math.random() * 180 - 90,
      1,
      Math.random() * 180 - 90
    )

    scene.add(tree)
  }
}