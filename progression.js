export const levelSystem = {
  level: 1,
  xp: 0,
}

export function gainXP(amount) {
  levelSystem.xp += amount

  if (levelSystem.xp >= 100) {
    levelSystem.level++
    levelSystem.xp = 0

    console.log(`Subiste al nivel ${levelSystem.level}`)
  }
}