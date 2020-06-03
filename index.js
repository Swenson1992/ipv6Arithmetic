/**
 * @Author: songjian925
 * @Date:   2018-11-20 10:18:08
 * @Last Modified by: songjian925
 * @Last Modified time: 2020-06-03 18:28:29
*/

const BigInteger = require('big-integer')

/**
 * 检查是否为IPv6
 * @param {String} ip
 */
function checkipv6(ip) {
  return (/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))\s*$/.test(ip))
}

/**
 * 格式化IPv6显示
 * @param {String} ipv6
 */
function formatIPv6Preferred(ipv6) {
  let lowerIPV6 = "";
  let resInfo = "Not a valid IPv6 Address";
  let ipArr = [];
  if (checkipv6(ipv6)) {
    lowerIPV6 = ipv6.toLowerCase();
    ipArr = lowerIPV6.split(":");
    ipArr = trimColonsFromEnds(ipArr);
    ipArr = fillemptysegment(ipArr);
    ipArr = stripLeadingZeroes(ipArr);
    ipArr = removeConsecutiveZeroes(ipArr);
    resInfo = assembleBestRepresentation(ipArr);
  }
  return resInfo
}

/**
 * 格式化冒号从结尾
 * @param {String} ipArr
 */
function trimColonsFromEnds(ipArr) {
  let ipArrLen = ipArr.length;
  if ((ipArr[0] == "") && (ipArr[1] == "") && (ipArr[2] == "")) {
    ipArr.shift();
    ipArr.shift()
  } else {
    if ((ipArr[0] == "") && (ipArr[1] == "")) {
      ipArr.shift()
    } else {
      if ((ipArr[ipArrLen - 1] == "") && (ipArr[ipArrLen - 2] == "")) {
        ipArr.pop()
      }
    }
  }
  return ipArr
}

/**
 * 填充空的段
 * @param {String} ipArr
 */
function fillemptysegment(ipArr) {
  let index;
  let ipv6TotalGroup = 8;
  if (ipArr[ipArr.length - 1].indexOf(".") != -1) {
    ipv6TotalGroup = 7
  }
  for (index = 0; index < ipv6TotalGroup; index++) {
    if (ipArr[index] == "") {
      ipArr[index] = "0";
      break
    }
  }
  while (ipArr.length < ipv6TotalGroup) {
    ipArr.splice(index, 0, "0")
  }
  return ipArr
}

/**
 * 格式化IPv6连续的0
 * 将0000 => 0
 * @param {String} ipArr
 */
function stripLeadingZeroes(ipArr) {
  let ipArrLen = ipArr.length;
  for (let i = 0; i < ipArrLen; i++) {
    let segs = ipArr[i].split("");
    for (let j = 0; j < 3; j++) {
      if ((segs[0] == "0") && (segs.length > 1)) {
        segs.splice(0, 1)
      } else {
        break
      }
    }
    ipArr[i] = segs.join("")
  }
  return ipArr
}

/**
 * 移除连续的零
 * 将0:0:0:0等 格式化为 ::
 * @param {String} ipArr
 */
function removeConsecutiveZeroes(ipArr) {
  let finalZeroIndex = -1;//被清除0的开始位置
  let finalZeroNum = 0;//0的个数
  let findZeroflag = false; //发现0的标志
  let zeroNumDynamic = 0;//0的个数 【变化的】
  let zeroIndexDynamic = -1;//0出现的最初位置 【变化的】
  for (let index = 0; index < 8; index++) {
    if (findZeroflag) {
      if (ipArr[index] == "0") {
        zeroNumDynamic += 1
      } else {
        findZeroflag = false;
        if (zeroNumDynamic > finalZeroNum) {
          finalZeroIndex = zeroIndexDynamic;
          finalZeroNum = zeroNumDynamic
        }
      }
    } else {
      if (ipArr[index] == "0") {
        findZeroflag = true;
        zeroIndexDynamic = index;//g => 3
        zeroNumDynamic = 1
      }
    }
  }
  if (zeroNumDynamic > finalZeroNum) {
    finalZeroIndex = zeroIndexDynamic;
    finalZeroNum = zeroNumDynamic
  }
  if (finalZeroNum > 1) {
    ipArr.splice(finalZeroIndex, finalZeroNum, "")
  }

  return ipArr
}

/**
 * 生成最后的IPv6段
 * @param {String} ipArr
 */
function assembleBestRepresentation(ipArr) {
  let res = "";
  let ipArrLen = ipArr.length;
  if (ipArr[0] == "") {
    res = ":"
  }
  for (let index = 0; index < ipArrLen; index++) {
    res = res + ipArr[index];
    if (index == ipArrLen - 1) {
      break
    }
    res = res + ":"
  }
  if (ipArr[ipArrLen - 1] == "") {
    res = res + ":"
  }
  return res
}

/**
 * 补全IPv6显示
 * @param {String} ip
 */
function expand(ip) {
  //ip => 2001:db8:2002::
  let formatIPv6 = "";
  let resExpandedIPv6 = "";
  let ipv6GroupTotal = 8;
  let ipv6EachGroupNum = 4;
  //ip不包含::情况
  if (ip.indexOf("::") == -1) {
    formatIPv6 = ip
  } else {
    let ipv6Array = ip.split("::"); //ipv6Array => ["2001:db8:2002",""]
    let old_groupNum = 0;
    for (let index = 0; index < ipv6Array.length; index++) {
      old_groupNum += ipv6Array[index].split(":").length
    }
    formatIPv6 += ipv6Array[0] + ":";
    //补齐缺省的0
    for (let index = 0; index < ipv6GroupTotal - old_groupNum; index++) {
      formatIPv6 += "0000:"
    }
    formatIPv6 += ipv6Array[1];
  }
  let ipv6TotalArray = formatIPv6.split(":");
  for (let index = 0; index < ipv6GroupTotal; index++) {
    while (ipv6TotalArray[index].length < ipv6EachGroupNum) {
      ipv6TotalArray[index] = "0" + ipv6TotalArray[index]
    }
    resExpandedIPv6 += (index != ipv6GroupTotal - 1) ? ipv6TotalArray[index] + ":" : ipv6TotalArray[index]
  }
  return resExpandedIPv6
};

/**
 * 根据mask数量生成Prefix
 * @param {Number} mask
 */
function findprefix(mask) {
  let maskString = "";
  for (let index = 0; index < mask; index++) {
    maskString += "1";
    if ((index + 1) % 16 == 0) {
      maskString += ":"
    }
  }
  let maskArray = maskString.split(":");
  let maskArrayLen = maskArray.length;
  while (maskArray[maskArrayLen - 1].length < 16) {
    maskArray[maskArrayLen - 1] += "0"
  }
  for (let index = 0; index < maskArrayLen; index++) {
    maskArray[index] = parseInt(maskArray[index], 2);
    maskArray[index] = maskArray[index].toString(16);
  }
  return maskArray.join(":");
}

/**
 * prefix和IPv6作 & 计算
 * @param {String} prefix
 * @param {String} ipv6
 */
function prefixBitAndIPv6(prefix, ipv6) {
  let ipv6TotalGroupNum = 8;
  let prefixArray = prefix.split(":");
  let ipv6Array = ipv6.split(":");
  let resArray = new Array;
  for (let index = 0; index < ipv6TotalGroupNum; index++) {
    prefixArray[index] = parseInt(prefixArray[index], 16);
    ipv6Array[index] = parseInt(ipv6Array[index], 16);
    resArray[index] = prefixArray[index] & ipv6Array[index];
    resArray[index] = resArray[index].toString(16)
  }
  return resArray.join(":")
}

/**
 * 生成末尾地址
 * @param {String} prefix
 * @param {String} firstAddress
 */
function makeLastAddress(prefix, firstAddress) {
  let _firstAddress = firstAddress.split(":");
  let _prefix = prefix.split(":");
  let resArray = new Array;
  for (let index = 0; index < 8; index++) {
    _firstAddress[index] = parseInt(_firstAddress[index], 16);
    _prefix[index] = parseInt(_prefix[index], 16);
    _prefix[index] = _prefix[index] ^ 65535;
    resArray[index] = _prefix[index] ^ _firstAddress[index];
    resArray[index] = resArray[index].toString(16);
  }
  return resArray.join(":")
}

/**
 * 通过ip段计算下列值
 * @return {Object} 
 * Compressed Address:	2001:db8::/48
 * Expanded Address:	2001:0db8:0000:0000:0000:0000:0000:0000/48
 * Prefix:	ffff:ffff:ffff:0000:0000:0000:0000:0000
 * First_Address:	2001:db8:0:0:0:0:0:0
 * Last_Address: 2001:db8:0:ffff:ffff:ffff:ffff:ffff
 * Number of /64s:	65536
 * @param {String} ipSeg
 */
function calculate(ipSeg) {
  let ipSegArr = ipSeg.replace(/\s/g, "").split("/");
  let ipv6 = ipSegArr[0];
  let maskIPv6 = ipSegArr[1];
  let res = {};
  if (!checkipv6(ipv6)) {
    console.error(`[${ipv6}] This does not look like a valid IPv6 address`)
  }
  res.Compressed_Address = formatIPv6Preferred(ipv6) + "/" + maskIPv6;
  res.Expanded_Address = expand(formatIPv6Preferred(ipv6)) + "/" + maskIPv6;
  res.Prefix = expand(findprefix(maskIPv6) + "::");
  res.First_Address = prefixBitAndIPv6(expand(findprefix(maskIPv6) + "::"), expand(formatIPv6Preferred(ipv6)));
  res.Last_Address = makeLastAddress(expand(findprefix(maskIPv6) + "::"), res.First_Address);
  res.Number_MaskIs64 = Math.pow(2, 64 - maskIPv6);

  return res
}

/**
 * 生成IPv6子段
 * @param {String} ipSeg
 * @param {Number} mask
 * @return {Array} resIPv6SegArray
 * [ '2001:db8:2002::/52','2001:db8:2002:1000::/52','2001:db8:2002:2000::/52','2001:db8:2002:3000::/52',
 *   '2001:db8:2002:4000::/52','2001:db8:2002:5000::/52','2001:db8:2002:6000::/52','2001:db8:2002:7000::/52',
 *   '2001:db8:2002:8000::/52','2001:db8:2002:9000::/52','2001:db8:2002:a000::/52','2001:db8:2002:b000::/52',
 *   '2001:db8:2002:c000::/52','2001:db8:2002:d000::/52','2001:db8:2002:e000::/52',2001:db8:2002:f000::/52' ]
 */
function subnet_slashes(ipSeg, mask) {

  let ipSegArr = ipSeg.replace(/\s/g, "").split("/"); //ipSegArr => ["2001:db8:2002::",48]
  let ipv6 = expand(ipSegArr[0]); //ipv6 => 2001:0db8:2002:0000:0000:0000:0000:0000
  let old_mask = parseInt(ipSegArr[1]); //old_mask => 48

  if (!checkipv6(ipv6)) {
    return `[ERROR] ${ipv6} looks like an invalid IPv6 address `
  }

  //计算生成的段总数
  let ipSegNum = Math.pow(2, mask - old_mask);
  if (mask < old_mask) {
    return `[ERROR] ${ipv6} Make sure the selected slashes fit into the given network`;
  }

  let prefix = expand(findprefix(old_mask) + "::");
  let expanded_Address = expand(prefixBitAndIPv6(prefix, ipv6));

  let ipv6String16 = expanded_Address.replace(/:/g, "");

  let ipv6BigInt = new BigInteger(ipv6String16, 16);
  let offset = new BigInteger("2").pow(128 - mask);
  let ipv6BigIntArray = new Array;

  ipv6BigIntArray[0] = ipv6BigInt.toString(16);
  let resIPv6SegArray = [];
  resIPv6SegArray.push(formatIPv6Preferred(bigIntToIPv6(ipv6BigIntArray[0])) + "/" + mask);

  for (let index = 1; index < ipSegNum; index++) {
    ipv6BigIntArray[index] = ipv6BigInt.add(offset).toString(16);
    ipv6BigInt = ipv6BigInt.add(offset);
    resIPv6SegArray.push(formatIPv6Preferred(bigIntToIPv6(ipv6BigIntArray[index])) + "/" + mask);
  }
  return resIPv6SegArray
}

function getStartIndex(ipSeg) {
  let ipSegArr = ipSeg.replace(/\s/g, "").split("/"); //ipSegArr => ["2001:db8:2002::",48]
  let ipv6 = expand(ipSegArr[0]); //ipv6 => 2001:0db8:2002:0000:0000:0000:0000:0000

  if (!checkipv6(ipv6)) {
    return `[ERROR] ${ipv6} looks like an invalid IPv6 address `
  }

  let ipv6String16 = ipv6.replace(/:/g, "");

  let ipv6BigInt = new BigInteger(ipv6String16, 16);
  return ipv6BigInt.toString(10)
}

/**
 * 将BigInt类型转换为IPv6格式
 * @param {BigInt} ipv6BigInt
 * @return {String} IPv6格式
 */
function bigIntToIPv6(ipv6BigInt) {
  let ipv6Array = [];
  for (let index = 0; index < 8; index++) {
    ipv6Array.push(ipv6BigInt.slice(index * 4, (index + 1) * 4))
  }
  return ipv6Array.join(":")
}

exports.calculate = calculate;
exports.subnet_slashes = subnet_slashes;

exports.getStartIndex = getStartIndex;
exports.checkipv6 = checkipv6;
exports.assembleBestRepresentation = assembleBestRepresentation;
exports.bigIntToIPv6 = bigIntToIPv6;
exports.expand = expand;
exports.trimColonsFromEnds = trimColonsFromEnds;
exports.stripLeadingZeroes = stripLeadingZeroes;
exports.removeConsecutiveZeroes = removeConsecutiveZeroes;
exports.prefixBitAndIPv6 = prefixBitAndIPv6;
exports.makeLastAddress = makeLastAddress;
exports.formatIPv6Preferred = formatIPv6Preferred;
exports.findprefix = findprefix;
exports.fillemptysegment = fillemptysegment;