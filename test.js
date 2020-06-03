const ipv6 = require('./index')

console.log(ipv6.checkipv6("2401:3480:3000::11"))
console.log(ipv6.checkipv6("2401:3480:3000::"))
console.log(ipv6.checkipv6("aaaa:12121:3000:0:0:0"))
console.log(ipv6.checkipv6("192.168.150.12"))

console.log(ipv6.calculate("2001:db8::/48"))
console.log(ipv6.subnet_slashes("2001:db8::/48", 50))