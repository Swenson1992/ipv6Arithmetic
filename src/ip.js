// let ipv6_to_str = (ipv6_add) =>  {
//   /* ipv6地址128位，数组ip维数默认为4 */
//   /* 输出格式为: A:B:C:D:E:F:G:H. */
//   let addr_str = "";
//   for (let index = 0; index < 4; index++) {
//     let msw = ipv6_add[index].toString(16);
//     let lsw = ipv6_add[index] & 0x0000ffff;
//     addr_str += msw + ":" + lsw + ":";
//   }
//   // console.log(addr_str)
// }

// let ipv61 = [
//   536939944,
//   537137152,
//   33685782,
//   2887193267
// ]

// ipv6_to_str(ipv61);

// let ipv6 = require("ip6addr")

// let addr = ipv6.parse("fd00::0011");

// // console.log("addr >>> ",addr.tolong())

// console.log(ipv61[0].toString(16));
// console.log(ipv61[1].toString(16));
// console.log(ipv61[2].toString(16));
// console.log(ipv61[3].toString(16));
// console.log(parseInt("0x0da8", 2))

// let ip = require('cidr-tools');
// let a = ip.expand(['2001:db8::/126']);
// console.log(a[0])
// console.log(ip.merge(['1.0.0.0/24', '1.0.1.0/24']));

let ipv6Seg = require('./ipseg');

// console.log(ipv6Seg.calculate("2001:db8:2002::/48"));
// console.log(ipv6Seg.subnet_slashes("240E:00EA:0000:5F::/64"))
console.log(ipv6Seg.getStartIndex("240e:ea:3456:5f:f000::/65"))
console.log(ipv6Seg.getStartIndex("240e:ea:3456:5f:8000::/65"))
console.log(ipv6Seg.getStartIndex("240e:ea:3456:5f:7000::/65"))

// let applyIPv6 = (ipv6Seg, num) => {
//   let ipv6 = ipv6Seg.split('/')[0];
//   ipv6Seg.prefixBitAndIPv6()
// }
