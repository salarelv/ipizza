var IpizzaBank = require('./ipizzabank')

function Sampo (opt) {
  this.name = 'nordea'
  IpizzaBank.apply(this, arguments)
}
Nordea.prototype = Object.create(IpizzaBank.prototype)

Nordea.prototype.gateways =
  { development: 'https://netbank.nordea.com/pnbepaytest/epayp.jsp'
  , production: 'https://netbank.nordea.com/pnbepay/epayp.jsp'
  }


module.exports = Sampo
