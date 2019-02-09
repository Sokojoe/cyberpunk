const yaml = require('js-yaml')
const fs = require('fs')

const weapons = yaml.load(fs.readFileSync('./game/weapons/weapons.yml'))

function getWeaponDamage (name) {
  return weapons.Weapons[name].damage
}

module.exports = getWeaponDamage
