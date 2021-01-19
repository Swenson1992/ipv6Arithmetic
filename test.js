const ipv6 = require('./index')

console.log(ipv6.checkipv6("2401:3480:3000::11"))
console.log(ipv6.checkipv6("2401:3480:3000::"))
console.log(ipv6.checkipv6("aaaa:12121:3000:0:0:0"))
console.log(ipv6.checkipv6("192.168.150.12"))

// console.log(ipv6.calculate("2001:db8::/48"))
console.log(ipv6.subnet_slashes("2001:db8::/48", 50))

// console.log(ipv6.getStartIndex("2001:db8::/48"))
// console.log(ipv6.expand("2401:3480:3000::"))

// let arr = [ '2001','db8','0000','0000','0000','/50']
// console.log(ipv6.assembleBestRepresentation(arr))
// console.log(ipv6.trimColonsFromEnds(['2001','db8','0000','','','/50']))

// console.log(ipv6.stripLeadingZeroes(arr))

// console.log(ipv6.findprefix(64))
// console.log(ipv6.prefixBitAndIPv6("ffff:ffff:ffff:ffff:0","2001:db8::"))
console.log(ipv6.formatIPv6Preferred("2001:db8::"))

// console.log(ipv6.makeLastAddress("ffff:ffff:ffff:ffff:0","2001:db8::"))