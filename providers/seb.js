var IpizzaBank = require('./ipizzabank')

function Seb (opt) {
  this.name = 'seb'
  IpizzaBank.apply(this, arguments)
}
Seb.prototype = Object.create(IpizzaBank.prototype)

Seb.prototype.gateways =
  { development: 'https://www.seb.ee/cgi-bin/dv.sh/un3min.rk'
  , production: 'https://www.seb.ee/cgi-bin/unet3.sh/un3min.rk'
  }


module.exports = Seb
