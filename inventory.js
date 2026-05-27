export const inventory = ['Madera']

export function unlockTool(tool) {
  if (!inventory.includes(tool)) {
    inventory.push(tool)
    console.log(`${tool} desbloqueado`)
  }
}