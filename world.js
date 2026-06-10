import * as THREE from 'three'

export function createWorld(scene) {
  const groundGeometry = new THREE.PlaneGeometry(2000, 2000)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,
  })

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)

  ground.rotation.x = -Math.PI / 2

  scene.add(ground)

  for (let i = 0; i < 200; i++) {
    const tree = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 5),
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