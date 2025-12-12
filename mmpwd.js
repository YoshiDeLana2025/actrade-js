/* mMpswd algorithm ported from additional.php to JavaScript
   Exposes:
   - encodeTradeCode({codetype, itemnum, playername, townname, leadspace, custom}) -> {finalCode, raw28}
   - decodeTradeCode(codeString) -> object with decoded fields and data bytes
*/
(function(global){
  'use strict';

  // Arrays ported from additional.php
  const usable_to_fontnum = [
    0x62,0x4b,0x7a,0x35,0x63,0x71,0x59,0x5a,0x4f,0x64,0x74,0x36,0x6e,0x6c,0x42,0x79,
    0x6f,0x38,0x34,0x4c,0x6b,0x25,0x41,0x51,0x6d,0x44,0x50,0x49,0x37,0x2d,0x52,0x73,
    0x77,0x55,0x23,0x72,0x33,0x45,0x78,0x4d,0x43,0x40,0x65,0x39,0x67,0x76,0x56,0x47,
    0x75,0x4e,0x69,0x58,0x57,0x66,0x54,0x4a,0x46,0x53,0x48,0x70,0x32,0x61,0x6a,0x68
  ];

  const mMpswd_select_idx_table = [
    [ 0x11,0x0b,0x00,0x0a,0x0c,0x06,0x08,0x04 ],
    [ 0x03,0x08,0x0b,0x10,0x04,0x06,0x09,0x13 ],
    [ 0x09,0x0e,0x11,0x12,0x0b,0x0a,0x0c,0x02 ],
    [ 0x00,0x02,0x01,0x04,0x12,0x0a,0x0c,0x08 ],
    [ 0x11,0x13,0x10,0x07,0x0c,0x08,0x02,0x09 ],
    [ 0x10,0x03,0x01,0x08,0x12,0x04,0x07,0x06 ],
    [ 0x13,0x06,0x0a,0x11,0x03,0x10,0x08,0x09 ],
    [ 0x11,0x07,0x12,0x10,0x0c,0x02,0x0b,0x00 ],
    [ 0x06,0x02,0x0c,0x01,0x08,0x0e,0x00,0x10 ],
    [ 0x13,0x10,0x0b,0x08,0x11,0x03,0x06,0x0e ],
    [ 0x12,0x0c,0x02,0x07,0x0a,0x0b,0x01,0x0e ],
    [ 0x08,0x00,0x0e,0x02,0x07,0x0b,0x0c,0x11 ],
    [ 0x09,0x03,0x02,0x00,0x0b,0x08,0x0e,0x0a ],
    [ 0x0a,0x0b,0x0c,0x10,0x13,0x07,0x11,0x08 ],
    [ 0x13,0x08,0x06,0x01,0x11,0x09,0x0e,0x0a ],
    [ 0x09,0x07,0x11,0x0c,0x13,0x0a,0x01,0x0b ]
  ];

  const mMpswd_prime_number = (function(){
    // copied from PHP as numbers
    const arr = [
      0x0011,0x0013,0x0017,0x001d,0x001f,0x0025,0x0029,0x002b,
      0x002f,0x0035,0x003b,0x003d,0x0043,0x0047,0x0049,0x004f,
      0x0053,0x0059,0x0061,0x0065,0x0067,0x006b,0x006d,0x0071,
      0x007f,0x0083,0x0089,0x008b,0x0095,0x0097,0x009d,0x00a3,
      0x00a7,0x00ad,0x00b3,0x00b5,0x00bf,0x00c1,0x00c5,0x00c7,
      0x00d3,0x00df,0x00e3,0x00e5,0x00e9,0x00ef,0x00f1,0x00fb,
      0x0101,0x0107,0x010d,0x010f,0x0115,0x0119,0x011b,0x0125,
      0x0133,0x0137,0x0139,0x013d,0x014b,0x0151,0x015b,0x015d,
      0x0161,0x0167,0x016f,0x0175,0x017b,0x017f,0x0185,0x018d,
      0x0191,0x0199,0x01a3,0x01a5,0x01af,0x01b1,0x01b7,0x01bb,
      0x01c1,0x01c9,0x01cd,0x01cf,0x01d3,0x01df,0x01e7,0x01eb,
      0x01f3,0x01f7,0x01fd,0x0209,0x020b,0x021d,0x0223,0x022d,
      0x0233,0x0239,0x023b,0x0241,0x024b,0x0251,0x0257,0x0259,
      0x025f,0x0265,0x0269,0x026b,0x0277,0x0281,0x0283,0x0287,
      0x028d,0x0293,0x0295,0x02a1,0x02a5,0x02ab,0x02b3,0x02bd,
      0x02c5,0x02cf,0x02d7,0x02dd,0x02e3,0x02e7,0x02ef,0x02f5,
      0x02f9,0x0301,0x0305,0x0313,0x031d,0x0329,0x032b,0x0335,
      0x0337,0x033b,0x033d,0x0347,0x0355,0x0359,0x035b,0x035f,
      0x036d,0x0371,0x0373,0x0377,0x038b,0x038f,0x0397,0x03a1,
      0x03a9,0x03ad,0x03b3,0x03b9,0x03c7,0x03cb,0x03d1,0x03d7,
      0x03df,0x03e5,0x03f1,0x03f5,0x03fb,0x03fd,0x0407,0x0409,
      0x040f,0x0419,0x041b,0x0425,0x0427,0x042d,0x043f,0x0443,
      0x0445,0x0449,0x044f,0x0455,0x045d,0x0463,0x0469,0x047f,
      0x0481,0x048b,0x0493,0x049d,0x04a3,0x04a9,0x04b1,0x04bd,
      0x04c1,0x04c7,0x04cd,0x04cf,0x04d5,0x04e1,0x04eb,0x04fd,
      0x04ff,0x0503,0x0509,0x050b,0x0511,0x0515,0x0517,0x051b,
      0x0527,0x0529,0x052f,0x0551,0x0557,0x055d,0x0565,0x0577,
      0x0581,0x058f,0x0593,0x0595,0x0599,0x059f,0x05a7,0x05ab,
      0x05ad,0x05b3,0x05bf,0x05c9,0x05cb,0x05cf,0x05d1,0x05d5,
      0x05db,0x05e7,0x05f3,0x05fb,0x0607,0x060d,0x0611,0x0617,
      0x061f,0x0623,0x062b,0x062f,0x063d,0x0641,0x0647,0x0649,
      0x064d,0x0653,0x0655,0x065b,0x0665,0x0679,0x067f,0x0683
    ];
    return arr;
  })();

  const mMpswd_chg_code_table = (function(){
    return [
      0xf0,0x83,0xfd,0x62,0x93,0x49,0x0d,0x3e,0xe1,0xa4,0x2b,0xaf,0x3a,0x25,0xd0,0x82,
      0x7f,0x97,0xd2,0x03,0xb2,0x32,0xb4,0xe6,0x09,0x42,0x57,0x27,0x60,0xea,0x76,0xab,
      0x2d,0x65,0xa8,0x4d,0x8b,0x95,0x01,0x37,0x59,0x79,0x33,0xac,0x2f,0xae,0x9f,0xfe,
      0x56,0xd9,0x04,0xc6,0xb9,0x28,0x06,0x5c,0x54,0x8d,0xe5,0x00,0xb3,0x7b,0x5e,0xa7,
      0x3c,0x78,0xcb,0x2e,0x6d,0xe4,0xe8,0xdc,0x40,0xa0,0xde,0x2c,0xf5,0x1f,0xcc,0x85,
      0x71,0x3d,0x26,0x74,0x9c,0x13,0x7d,0x7e,0x66,0xf2,0x9e,0x02,0xa1,0x53,0x15,0x4f,
      0x51,0x20,0xd5,0x39,0x1a,0x67,0x99,0x41,0xc7,0xc3,0xa6,0xc4,0xbc,0x38,0x8c,0xaa,
      0x81,0x12,0xdd,0x17,0xb7,0xef,0x2a,0x80,0x9d,0x50,0xdf,0xcf,0x89,0xc8,0x91,0x1b,
      0xbb,0x73,0xf8,0x14,0x61,0xc2,0x45,0xc5,0x55,0xfc,0x8e,0xe9,0x8a,0x46,0xdb,0x4e,
      0x05,0xc1,0x64,0xd1,0xe0,0x70,0x16,0xf9,0xb6,0x36,0x44,0x8f,0x0c,0x29,0xd3,0x0e,
      0x6f,0x7c,0xd7,0x4a,0xff,0x75,0x6c,0x11,0x10,0x77,0x3b,0x98,0xba,0x69,0x5b,0xa3,
      0x6a,0x72,0x94,0xd6,0xd4,0x22,0x08,0x86,0x31,0x47,0xbe,0x87,0x63,0x34,0x52,0x3f,
      0x68,0xf6,0x0f,0xbf,0xeb,0xc0,0xce,0x24,0xa5,0x9a,0x90,0xed,0x19,0xb8,0xb5,0x96,
      0xfa,0x88,0x6e,0xfb,0x84,0x23,0x5d,0xcd,0xee,0x92,0x58,0x4c,0x0b,0xf7,0x0a,0xb1,
      0xda,0x35,0x5f,0x9b,0xc9,0xa9,0xe7,0x07,0x1d,0x18,0xf3,0xe3,0xf1,0xf4,0xca,0xb0,
      0x6b,0x30,0xec,0x4b,0x48,0x1c,0xad,0xe2,0x21,0x1e,0xa2,0xbd,0x5a,0xd8,0x43,0x7a
    ];
  })();

  const chg_ptr = [
    "NiiMasaru","KomatsuKunihiro","TakakiGentarou","MiyakeHiromichi","HayakawaKenzo","KasamatsuShigehiro",
    "SumiyoshiNobuhiro","NomaTakafumi","EguchiKatsuya","NogamiHisashi","IidaToki","IkegawaNoriko",
    "KawaseTomohiro","BandoTaro","TotakaKazuo","WatanabeKunio","RichAmtower","KyleHudson","MichaelKelbaugh",
    "RaycholeLAneff","LeslieSwan","YoshinobuMantani","KirkBuchanan","TimOLeary","BillTrinen","nAkAyOsInoNyuuSankin",
    "zendamaKINAKUDAMAkin","OishikutetUYOKUNARU","AsetoAminofen","fcSFCn64GCgbCGBagbVB","YossyIsland","KedamonoNoMori"
  ];

  const chg_len = [
    0x09,0x0f,0x0e,0x0f,0x0d,0x12,0x11,0x0c,0x0d,0x0d,0x08,0x0d,0x0e,0x09,0x0b,0x0d,0x0b,0x0a,0x0f,0x0e,0x0a,0x10,0x0c,0x09,0x0a,0x14,0x14,0x13,0x0d,0x14,0x0b,0x0e
  ];

  const key_idx = [0x12, 0x09];

  // Utility helpers: strings <-> byte arrays
  function strToBytes(s, length) {
    const arr = new Uint8Array(length || s.length);
    for (let i = 0; i < arr.length; i++) arr[i] = i < s.length ? s.charCodeAt(i) & 0xFF : 0;
    return arr;
  }
  function bytesToStr(bytes) {
    return Array.prototype.map.call(bytes, b => String.fromCharCode(b)).join('');
  }
  function copyBytes(src) { return new Uint8Array(src); }

  // hex2dec (4 hex chars) from PHP
  function hex2dec(numstr) {
    let s = ('' + numstr).toUpperCase();
    // allow various lengths; original expects up to 4 hex chars
    let final = 0;
    let multiplier = 1;
    for (let i = s.length - 1; i >= 0; i--) {
      const ch = s[i];
      let val = 0;
      if (ch >= '0' && ch <= '9') val = ch.charCodeAt(0) - 48;
      else if (ch >= 'A' && ch <= 'F') val = ch.charCodeAt(0) - 55;
      else val = 0;
      final += val * multiplier;
      multiplier *= 16;
    }
    return final;
  }

  function all2int(value) {
    if (typeof value !== 'string') return Number(value);
    const tempval = parseInt(value, 10);
    if ('' + tempval === value) return tempval;
    if (value.toLowerCase().startsWith('0x')) {
      return parseInt(value.substr(2), 16);
    }
    return parseInt(value, 16);
  }

  // mMpswd_adjust_letter (decoder path)
  function mMpswd_adjust_letter(pass) {
    let out = '';
    for (let i = 0; i < 28; i++) {
      const ch = pass[i] || '';
      if (ch === '0') out += 'O';
      else if (ch === '1') out += 'l';
      else out += ch;
    }
    return out;
  }

  // chg_password_font_code_sub: find index in usable_to_fontnum for a byte
  function mMpswd_chg_password_font_code_sub(inbyte) {
    for (let i = 0; i < usable_to_fontnum.length; i++) {
      if (usable_to_fontnum[i] === inbyte) return i;
    }
    return 0xFF;
  }

  // chg_password_font_code: converts 28-char string into 28 indices (but returns success and string)
  function mMpswd_chg_password_font_code(passcodeStr) {
    // passcodeStr length 28 expected
    const out = new Uint8Array(28);
    for (let i = 0; i < 28; i++) {
      const ch = passcodeStr.charCodeAt(i) || 0;
      const usable = mMpswd_chg_password_font_code_sub(ch);
      if (usable === 0xFF) return [0, passcodeStr];
      out[i] = usable;
    }
    return [1, bytesToStr(out)];
  }

  // chg_common_font_code: map 28 bytes -> font chars by index
  function mMpswd_chg_common_font_code(finalcodeBytes) {
    // finalcodeBytes is length 28 (Uint8Array), each value is 0..63 (index)
    const out = new Uint8Array(finalcodeBytes.length);
    for (let i = 0; i < finalcodeBytes.length; i++) {
      out[i] = usable_to_fontnum[finalcodeBytes[i] & 0x3F];
    }
    return bytesToStr(out);
  }

  // chg_6bits_code: pack 21 bytes -> 28 bytes of 6-bit combos
  function mMpswd_chg_6bits_code(passcodeBytes21) {
    // passcodeBytes21 length 21 (Uint8Array)
    const final = new Uint8Array(28);
    let code8bitsIndex = 0, code6bitsIndex = 0;
    let passbyte = 0, destbyte = 0;
    let bytectr = 0, ctr8bits = 0, ctr6bits = 0;
    while (true) {
      passbyte = passcodeBytes21[code8bitsIndex] >> ctr8bits;
      ctr8bits++;
      passbyte = (passbyte & 0x01) << ctr6bits;
      ctr6bits++;
      destbyte |= passbyte;
      if (ctr6bits === 6) {
        bytectr++;
        final[code6bitsIndex] = destbyte & 0xFF;
        ctr6bits = 0;
        code6bitsIndex++;
        if (bytectr === 28) return final;
        destbyte = 0;
      }
      if (ctr8bits === 8) {
        ctr8bits = 0;
        code8bitsIndex++;
        if (code8bitsIndex >= passcodeBytes21.length) code8bitsIndex = passcodeBytes21.length - 1;
      }
    }
  }

  // chg_8bits_code: unpack 28 -> 21 (decoder)
  function mMpswd_chg_8bits_code(passcode28Str) {
    const passcode = strToBytes(passcode28Str, 28);
    const passarr2 = new Uint8Array(21);
    let bit6idx = 0, bit8idx = 0, byte6idx = 0, byte8idx = 0, outbyte = 0;
    while (true) {
      const inbit = ((passcode[byte6idx] >> bit6idx) & 0x01) << bit8idx;
      bit8idx++;
      bit6idx++;
      outbyte |= inbit;
      if (bit8idx === 8) {
        passarr2[byte8idx] = outbyte & 0xFF;
        byte8idx++;
        if (byte8idx === 21) return bytesToStr(passarr2);
        bit8idx = 0;
        outbyte = 0;
      }
      if (bit6idx === 6) {
        bit6idx = 0;
        byte6idx++;
      }
    }
  }

  // transposition cipher (both encoder and decoder share same function)
  function mMpswd_transposition_cipher(passcodeBytesOrStr, negval, keynum) {
    // passcode may be string (21 bytes) or Uint8Array
    let passarr = typeof passcodeBytesOrStr === 'string' ? strToBytes(passcodeBytesOrStr,21) : copyBytes(passcodeBytesOrStr);
    const transdir = negval === 1 ? -1 : 1;
    const chgstroffset = passarr[key_idx[keynum]] & 0x0f;
    const chgstrnum = chgstroffset + (keynum * 16);
    const chgstrptr = chg_ptr[chgstrnum] || '';
    const chgstrlen = chg_len[chgstrnum] || chgstrptr.length;
    let chgstridx = 0;
    const out = new Uint8Array(21);
    for (let idx = 0; idx < 21; idx++) {
      out[idx] = passarr[idx];
    }
    for (let idx = 0; idx < 21; idx++) {
      if (key_idx[keynum] !== idx) {
        const transoffset = (chgstrptr.charCodeAt(chgstridx) || 0) * transdir;
        const tpasscode = passarr[idx];
        out[idx] = (tpasscode + transoffset) & 0xFF;
        chgstridx++;
        chgstridx %= chgstrlen;
      }
    }
    return out;
  }

  // bit shuffle (encoder) - ported
  function mMpswd_bit_shuffle(passcodeBytesOrStr, keynum) {
    const passcode = typeof passcodeBytesOrStr === 'string' ? strToBytes(passcodeBytesOrStr,21) : copyBytes(passcodeBytesOrStr);
    let charoffset, numchars;
    if (keynum === 0) { charoffset = 13; numchars = 19; }
    else { charoffset = 2; numchars = 20; }
    // create tempbuf by removing passcode[charoffset] from middle
    const tempbuf = new Uint8Array(numchars);
    // copy first part
    for (let i = 0; i < charoffset; i++) tempbuf[i] = passcode[i];
    // copy part after charoffset
    for (let i = charoffset; i < numchars; i++) tempbuf[i] = passcode[i+1];
    const tablenum = (passcode[charoffset] << 2) & 0x0c;
    const idxPtr = mMpswd_select_idx_table[tablenum >> 2];
    const newbuf = new Uint8Array(numchars);
    for (let idx1 = 0; idx1 < numchars; idx1++) {
      let tempbyte = tempbuf[idx1];
      for (let idx2 = 0; idx2 < 8; idx2++) {
        const outoffset = (idxPtr[idx2] + idx1) % numchars;
        let inbyte = (tempbyte >> idx2) & 0x01;
        inbyte = inbyte << idx2;
        newbuf[outoffset] = (newbuf[outoffset] | inbyte) & 0xFF;
      }
    }
    // reconstruct passcode with preserved charoffset byte
    const out = new Uint8Array(21);
    for (let i = 0; i < charoffset; i++) out[i] = newbuf[i];
    out[charoffset] = passcode[charoffset];
    for (let i = charoffset; i < numchars; i++) out[i+1] = newbuf[i];
    return out;
  }

  // decode_bit_shuffle (decoder)
  function mMpswd_decode_bit_shuffle(passcodeBytesOrStr, keynum) {
    const passcode = typeof passcodeBytesOrStr === 'string' ? strToBytes(passcodeBytesOrStr,21) : copyBytes(passcodeBytesOrStr);
    let charoffset, numchars;
    if (keynum === 0) { charoffset = 13; numchars = 19; }
    else { charoffset = 2; numchars = 20; }
    const tempbuf = new Uint8Array(numchars);
    for (let i = 0; i < charoffset; i++) tempbuf[i] = passcode[i];
    for (let i = charoffset; i < numchars; i++) tempbuf[i] = passcode[i+1];
    const tempbuf2 = new Uint8Array(numchars);
    const tablenum = (passcode[charoffset] << 2) & 0x0c;
    const idxPtr = mMpswd_select_idx_table[tablenum >> 2];
    for (let idx = 0; idx < numchars; idx++) {
      for (let idx2 = 0; idx2 < 8; idx2++) {
        const outoffset = (idxPtr[idx2] + idx) % numchars;
        const inbyte = (tempbuf[outoffset] >> idx2) & 0x01;
        tempbuf2[idx] |= (inbyte << idx2);
      }
    }
    const out = new Uint8Array(21);
    for (let i = 0; i < charoffset; i++) out[i] = tempbuf2[i];
    out[charoffset] = passcode[charoffset];
    for (let i = charoffset; i < numchars; i++) out[i+1] = tempbuf2[i];
    return out;
  }

  // bit_shift (both directions)
  function mMpswd_bit_shift(passcodeBytesOrStr, shiftamt) {
    let pass = typeof passcodeBytesOrStr === 'string' ? strToBytes(passcodeBytesOrStr,21) : copyBytes(passcodeBytesOrStr);
    // tempbuf is passcode except byte 1 (keep 0 and 2..20 contiguous)
    const tempbuf = new Uint8Array(20);
    tempbuf[0] = pass[0];
    for (let i = 1; i < 20; i++) tempbuf[i] = pass[i+1];
    const tempbuf2 = new Uint8Array(20);
    if (shiftamt > 0) {
      const destpos = Math.floor(shiftamt / 8);
      const destoffs = shiftamt % 8;
      for (let idx = 0; idx < 20; idx++) {
        if (idx > 0) {
          tempbuf2[(idx + destpos) % 20] = ((tempbuf[idx] << destoffs) | (tempbuf[(idx-1+20)%20] >>> (8 - destoffs))) & 0xFF;
        } else {
          tempbuf2[(idx + destpos) % 20] = ((tempbuf[idx] << destoffs) | (tempbuf[19] >>> (8 - destoffs))) & 0xFF;
        }
      }
      for (let idx = 0; idx < 20; idx++) tempbuf[idx] = tempbuf2[idx];
    } else if (shiftamt < 0) {
      for (let idx = 0; idx < 20; idx++) tempbuf2[idx] = tempbuf[19-idx];
      shiftamt = -shiftamt;
      const destpos = Math.floor(shiftamt / 8);
      const destoffs = shiftamt % 8;
      const temp = new Uint8Array(20);
      for (let idx = 0; idx < 20; idx++) {
        temp[(idx + destpos) % 20] = tempbuf2[idx];
      }
      for (let idx = 0; idx < 20; idx++) {
        if (idx > 0) tempbuf2[idx] = ((temp[idx] >>> destoffs) | (temp[(idx-1+20)%20] << (8 - destoffs))) & 0xFF;
        else tempbuf2[idx] = ((temp[idx] >>> destoffs) | (temp[19] << (8 - destoffs))) & 0xFF;
      }
      for (let idx = 0; idx < 20; idx++) tempbuf[idx] = tempbuf2[19-idx];
    }
    // reconstruct full 21 bytes (keep original byte 1)
    const out = new Uint8Array(21);
    out[0] = tempbuf[0];
    out[1] = pass[1];
    for (let i = 1; i < 20; i++) out[i+1] = tempbuf[i];
    return out;
  }

  // bit_reverse
  function mMpswd_bit_reverse(passcodeBytesOrStr) {
    const pass = typeof passcodeBytesOrStr === 'string' ? strToBytes(passcodeBytesOrStr,21) : copyBytes(passcodeBytesOrStr);
    for (let idx = 0; idx < 21; idx++) {
      if (idx !== 1) pass[idx] = (pass[idx] ^ 0xFF) & 0xFF;
    }
    return pass;
  }

  // bit_arrange_reverse
  function mMpswd_bit_arrange_reverse(passcodeBytesOrStr) {
    const pass = typeof passcodeBytesOrStr === 'string' ? strToBytes(passcodeBytesOrStr,21) : copyBytes(passcodeBytesOrStr);
    const tempbuf = new Uint8Array(21);
    const tempbuf2 = new Uint8Array(21);
    // tempbuf is pass except byte 1 removed (size 20), padded if necessary
    for (let i = 0; i < 20; i++) tempbuf[i] = pass[i < 1 ? i : i+1];
    for (let idx1 = 0; idx1 <= 19; idx1++) {
      const srcbyte = tempbuf[19 - idx1];
      const destbyte =
        ((srcbyte & 0x80) >> 7) |
        ((srcbyte & 0x40) >> 5) |
        ((srcbyte & 0x20) >> 3) |
        ((srcbyte & 0x10) >> 1) |
        ((srcbyte & 0x08) << 1) |
        ((srcbyte & 0x04) << 3) |
        ((srcbyte & 0x02) << 5) |
        ((srcbyte & 0x01) << 7);
      tempbuf2[idx1] = destbyte & 0xFF;
    }
    const out = new Uint8Array(21);
    out[0] = tempbuf2[0];
    out[1] = pass[1];
    for (let i = 1; i < 20; i++) out[i+1] = tempbuf2[i];
    return out;
  }

  // decode_bit_code
  function mMpswd_decode_bit_code(passcodeBytesOrStr) {
    let pass = typeof passcodeBytesOrStr === 'string' ? strToBytes(passcodeBytesOrStr,21) : copyBytes(passcodeBytesOrStr);
    const codemethod = pass[1] & 0x0F;
    if (codemethod > 12) {
      pass = mMpswd_bit_shift(pass, -codemethod * 3);
      pass = mMpswd_bit_reverse(pass);
      pass = mMpswd_bit_arrange_reverse(pass);
    } else if (codemethod > 8) {
      pass = mMpswd_bit_shift(pass, codemethod * 5);
      pass = mMpswd_bit_arrange_reverse(pass);
    } else if (codemethod > 4) {
      pass = mMpswd_bit_reverse(pass);
      pass = mMpswd_bit_shift(pass, codemethod * 5);
    } else {
      pass = mMpswd_bit_arrange_reverse(pass);
      pass = mMpswd_bit_shift(pass, -codemethod * 3);
    }
    return pass;
  }

  // get RSA key code
  function mMpswd_get_RSA_key_code(passcode) {
    const bit10 = passcode[15] % 4;
    let bit32 = Math.floor((passcode[15] & 0x0F) / 4);
    let b10 = bit10, b32 = bit32;
    let tbit10 = b10, tbit32 = b32;
    // replicate PHP logic
    let bit10v = b10, bit32v = b32;
    if (bit10v === 3) {
      bit10v = (bit10v ^ bit32v) & 0x03;
      if (bit10v === 3) bit10v = 0;
    }
    if (bit32v === 3) {
      bit32v = (bit10v + 1) & 0x03;
      if (bit32v === 3) bit32v = 1;
    }
    if (bit10v === bit32v) {
      bit32v = (bit10v + 1) & 0x03;
      if (bit32v === 3) bit32v = 1;
    }
    const bytetable = ((passcode[15] >> 2) & 0x3C) >> 2;
    const param1 = mMpswd_prime_number[bit10v];
    const param2 = mMpswd_prime_number[bit32v];
    const param3 = mMpswd_prime_number[passcode[5]];
    const param4 = mMpswd_select_idx_table[bytetable];
    return [param1,param2,param3,param4];
  }

  // decode RSA cipher
  function mMpswd_decode_RSA_cipher(pass) {
    // pass is Uint8Array length 21
    const tempprime = mMpswd_get_RSA_key_code(pass);
    const prime1 = tempprime[0], prime2 = tempprime[1], prime3 = tempprime[2];
    const idxtableptr = tempprime[3];
    const primeproduct = prime1 * prime2;
    const lessproduct = (prime1 - 1) * (prime2 - 1);

    // find modcount such that (modcount*lessproduct+1) % prime3 == 0
    let modcount = 0;
    let tempval, tempval2;
    do {
      modcount++;
      tempval = (modcount * lessproduct + 1) % prime3;
      tempval2 = (modcount * lessproduct + 1) / prime3;
    } while (tempval !== 0);

    for (let idx = 0; idx < 8; idx++) {
      let newbyte = pass[idxtableptr[idx]]; // byte value
      // PHP ORs high bit from pass[20] >> idx to newbyte, but ensure 9-bit value
      newbyte |= (((pass[20] >> idx) & 0x01) << 8);
      let currentbyte = newbyte;
      for (let idx2 = 0; idx2 < tempval2 - 1; idx2++) {
        newbyte = (newbyte * currentbyte) % primeproduct;
      }
      pass[idxtableptr[idx]] = newbyte & 0xFF;
    }
    return pass;
  }

  // chg_RSA_cipher (encoder)
  function mMpswd_chg_RSA_cipher(pass) {
    // pass: Uint8Array 21 bytes
    const tempprime = mMpswd_get_RSA_key_code(pass);
    const prime1 = tempprime[0], prime2 = tempprime[1], prime3 = tempprime[2];
    const idxtableptr = tempprime[3];
    const primeproduct = prime1 * prime2;
    let checkbyte = 0;
    for (let bytectr = 0; bytectr < 8; bytectr++) {
      let newbyte = pass[idxtableptr[bytectr]];
      const currentbyte = newbyte;
      for (let idx = 0; idx < prime3 - 1; idx++) {
        newbyte = (newbyte * currentbyte) % primeproduct;
      }
      pass[idxtableptr[bytectr]] = newbyte & 0xFF;
      const bit = (newbyte >> 8) & 0x01;
      checkbyte |= (bit << bytectr);
    }
    pass[20] = checkbyte & 0xFF;
    return pass;
  }

  // substitution cipher (encoder)
  function mMpswd_substitution_cipher(pass) {
    const out = copyBytes(pass);
    for (let idx = 0; idx < 21; idx++) {
      out[idx] = mMpswd_chg_code_table[out[idx] & 0xFF];
    }
    return out;
  }

  // decode substitution
  function mMpswd_decode_substitution_cipher(pass) {
    const out = copyBytes(pass);
    for (let idx = 0; idx < 21; idx++) {
      // find idx2 such that mMpswd_chg_code_table[idx2] == pass[idx]
      const val = pass[idx];
      let found = 0;
      for (let idx2 = 0; idx2 < 256; idx2++) {
        if (mMpswd_chg_code_table[idx2] === val) {
          out[idx] = idx2 & 0xFF;
          found = 1;
          break;
        }
      }
      if (!found) out[idx] = val;
    }
    return out;
  }

  // bit_mix_code (encoder)
  function mMpswd_bit_mix_code(pass) {
    const switchbyte = pass[1] & 0x0F;
    let out = pass;
    if ([13,14,15].includes(switchbyte)) {
      out = mMpswd_bit_arrange_reverse(out);
      out = mMpswd_bit_reverse(out);
      out = mMpswd_bit_shift(out, switchbyte * 3);
    } else if ([9,10,11,12].includes(switchbyte)) {
      out = mMpswd_bit_arrange_reverse(out);
      out = mMpswd_bit_shift(out, -switchbyte * 5);
    } else if ([5,6,7,8].includes(switchbyte)) {
      out = mMpswd_bit_shift(out, -switchbyte * 5);
      out = mMpswd_bit_reverse(out);
    } else {
      out = mMpswd_bit_shift(out, switchbyte * 3);
      out = mMpswd_bit_arrange_reverse(out);
    }
    return out;
  }

  // chg_custom: minimal support to process simple custom lines like &=0x..., |=0x..., byte=..., etc.
  function mMpswd_chg_custom(cCode, codename, secondary) {
    // return a JavaScript function body lines string to eval.
    const lines = cCode.split('\n');
    const allowed = ['&','|','^','<<','>>'];
    let returner = '';
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx].trim();
      if (line.length === 0) continue;
      if (line.startsWith('byte=') && secondary !== '') {
        const tempval = line.slice(5).replace(/\s+/g,'');
        // create assignment to secondary variable (codebyte)
        returner += `${secondary} = ${all2int(tempval)};\n`;
      } else {
        for (let idx2 = 0; idx2 < allowed.length; idx2++) {
          const op = allowed[idx2] + '=';
          if (line.startsWith(op)) {
            const tempval = line.slice(op.length).replace(/\s+/g,'');
            const jsop = op; // same in JS
            returner += `${codename} ${jsop} ${all2int(tempval)};\n`;
            break;
          }
        }
      }
    }
    return returner;
  }

  // password parsing (decoder)
  function mMpswd_password(pass) {
    // pass is Uint8Array length 21 (after decode_substitution etc.)
    const playernameBytes = pass.slice(2, 10);
    const townnameBytes = pass.slice(10, 18);
    const modbyte4 = (pass[0] & 0x18) >> 3;
    const modbyte2 = (pass[0] & 0xE0) >> 5;
    const itemnum = (pass[18] << 8) | pass[19];
    let modbyte0, modbyte1, modbyte3;
    switch (modbyte2) {
      case 0:
      case 4:
      case 5:
      case 6:
      case 7:
        modbyte0 = 0xFF; modbyte1 = 0xFF;
        modbyte3 = (pass[0] & 0x06) >> 1;
        break;
      case 1:
      case 2:
        modbyte0 = pass[0] & 0x01;
        modbyte1 = pass[1];
        modbyte3 = (pass[0] & 0x06) >> 1;
        break;
      case 3:
        modbyte0 = 0xFF; modbyte1 = 0xFF;
        modbyte3 = (((pass[0] & 0x06) >> 1) | ((pass[0] & 0x01) << 2));
        break;
    }
    const data = [];
    for (let i = 0; i < pass.length; i++) data.push(pass[i]);
    let playername = bytesToStr(playernameBytes).replace(/\0/g, ' ');
    let townname = bytesToStr(townnameBytes).replace(/\0/g, ' ');
    return {
      itemnum: itemnum,
      modbyte0: modbyte0,
      modbyte1: modbyte1,
      modbyte2: modbyte2,
      modbyte3: modbyte3,
      modbyte4: modbyte4,
      playername: playername,
      townname: townname,
      data: data
    };
  }

  // make_passcode (encoder) - returns 21-byte Uint8Array
  function mMpswd_make_passcode(paramR4, paramR5, playername, townname, itemnum, paramR9, codetype, leadspace, custom) {
    const pass = new Uint8Array(21);
    // default fill zeros
    for (let i = 0; i < 21; i++) pass[i] = 0;
    pass[0] = (((paramR4 & 0x07) << 5) | (paramR5 << 1) | (paramR9 & 0x01)) & 0xFF;
    pass[1] = 255; // 0xFF
    playername = (playername || '').padEnd(8,' ');
    townname = (townname || '').padEnd(8,' ');
    // place names
    for (let i = 0; i < 8; i++) pass[2 + i] = playername.charCodeAt(i) & 0xFF;
    for (let i = 0; i < 8; i++) pass[10 + i] = townname.charCodeAt(i) & 0xFF;
    if (playername.trim().length > 0 && playername.trim().length < 8 && leadspace) pass[2 + playername.trim().length] = 0;
    if (townname.trim().length > 0 && townname.trim().length < 8 && leadspace) pass[10 + townname.trim().length] = 0;
    pass[18] = (itemnum >> 8) & 0xFF;
    pass[19] = itemnum & 0xFF;
    // checksum calc
    let checksum = 0;
    for (let idx = 0; idx < 8; idx++) {
      checksum += pass[2 + idx]; checksum += pass[10 + idx];
    }
    checksum += itemnum;
    checksum += 0xFF;
    let checkbyte = pass[0] | ((checksum & 0x03) << 3);
    let codebyte = 255;
    switch (codetype) {
      case 'P':
        break;
      case 'N':
        checkbyte &= 0x1F;
        break;
      case 'U':
        checkbyte &= 0x18;
        checkbyte |= 0x61;
        break;
      case 'C':
        if (custom && custom.length) {
          // Evaluate custom operations (limited)
          // We will implement the same custom replacement as PHP: contruct statements that modify "checkbyte" and "codebyte"
          const js = mMpswd_chg_custom(custom, 'checkbyte', 'codebyte');
          try {
            // eslint-disable-next-line no-eval
            eval(js);
          } catch (e) {
            // ignore custom eval errors
          }
        }
        break;
    }
    pass[0] = checkbyte & 0xFF;
    pass[1] = codebyte & 0xFF;
    return pass;
  }

  // make_passcode_from_byte (not used directly but ported)
  function mMpswd_make_passcode_from_byte(paramR4, paramR5, playername, townname, itemnum, paramR9, leadspace, byte1, byte2) {
    const pass = new Uint8Array(21);
    for (let i = 0; i < 21; i++) pass[i] = 0;
    pass[0] = all2int(byte1) & 0xFF;
    pass[1] = all2int(byte2) & 0xFF;
    playername = (playername || '').padEnd(8,' ');
    townname = (townname || '').padEnd(8,' ');
    for (let i = 0; i < 8; i++) pass[2 + i] = playername.charCodeAt(i) & 0xFF;
    for (let i = 0; i < 8; i++) pass[10 + i] = townname.charCodeAt(i) & 0xFF;
    if (playername.trim().length > 0 && playername.trim().length < 8) pass[2 + playername.trim().length] = 0;
    if (townname.trim().length > 0 && townname.trim().length < 8) pass[10 + townname.trim().length] = 0;
    pass[18] = (itemnum >> 8) & 0xFF;
    pass[19] = itemnum & 0xFF;
    return pass;
  }

  // test_password and checksum_password ported for decoder outputs
  function mMpswd_test_password(paramR4, paramR5, playername, townname, itemnum, paramR9, byte0, byte1) {
    const firstcode = (((paramR4 & 0x07) << 5) | (paramR5 << 1) | (paramR9 & 0x01)) & 0xFF;
    let checksum = 0;
    playername = (playername || '').padEnd(8,' ');
    townname = (townname || '').padEnd(8,' ');
    for (let idx = 0; idx < 8; idx++) {
      checksum += playername.charCodeAt(idx);
      checksum += townname.charCodeAt(idx);
    }
    checksum += itemnum;
    checksum += 0xFF;
    let checkbyte = firstcode | ((checksum & 0x03) << 3);
    let cases;
    if (byte1 === 255) cases = [0,1,2];
    else cases = [];
    let breaker = false;
    let codetype = 'Unknown';
    for (let idx = 0; idx < 3; idx++) {
      const iscertain = cases.includes(idx) ? 1 : 0;
      let tester = checkbyte;
      let label = '';
      switch (idx) {
        case 0: label = "Player-to-Player (P)"; break;
        case 1: tester &= 0x1f; label = "NES Contest (N)"; break;
        case 2: tester &= 0x18; tester |= 0x61; label = "Universal (U)"; break;
      }
      if (tester === byte0) {
        if (!iscertain) label = "Uncertain - " + label;
        codetype = label;
        breaker = true;
        break;
      }
    }
    return codetype;
  }

  function mMpswd_checksum_password(paramR4, paramR5, playername, townname, itemnum, paramR9, byte0, byte1) {
    const firstcode = (((paramR4 & 0x07) << 5) | (paramR5 << 1) | (paramR9 & 0x01)) & 0xFF;
    let checksum = 0;
    playername = (playername || '').padEnd(8,' ');
    townname = (townname || '').padEnd(8,' ');
    for (let idx = 0; idx < 8; idx++) {
      checksum += playername.charCodeAt(idx);
      checksum += townname.charCodeAt(idx);
    }
    checksum += itemnum;
    checksum += 0xFF;
    const checkbyte = firstcode | ((checksum & 0x03) << 3);
    const checkbyte2 = firstcode | (((checksum - 0xFF) & 0x03) << 3);
    return [checksum, checkbyte, checksum - 0xFF, firstcode, checkbyte2];
  }

  // decode flow equivalent to decoder.php / decoderp.php
  function decodeTradeCode(passcode) {
    // Accept passcode string; do similar cleaning as PHP
    if (!passcode || !passcode.length) return { error: 'No data collected.' };
    let passcode2 = passcode;
    passcode2 = passcode2.replace(/\n/g,'').replace(/\r/g,'').replace(/\t/g,'').replace(/\0/g,'');
    // Accept both & and '-' (original used & in display); convert & to 0x2D if present
    passcode2 = passcode2.replace(/&/g, String.fromCharCode(0x2D));
    passcode2 = passcode2.replace(/ /g, '');
    // adjust letters 28 chars
    let tempcode = passcode2;
    tempcode = mMpswd_adjust_letter(tempcode);
    const tempcode2 = mMpswd_chg_password_font_code(tempcode);
    if (!tempcode2[0]) return { error: 'The code seems to be invalid.' };
    // tempcode2[1] is 28-char string of indices (0..63) -> then convert 28->21 via chg_8bits_code
    const tempcode3 = mMpswd_chg_8bits_code(tempcode2[1]); // returns 21-char string
    let outcode = strToBytes(tempcode3,21);
    // outcode is 21 bytes that need transposition(1,1), decode_bit_shuffle(1), decode_bit_code, decode_RSA, decode_bit_shuffle(0), transposition(0,0), decode_substitution, password
    outcode = mMpswd_transposition_cipher(outcode, 1, 1); // returns Uint8Array
    outcode = mMpswd_decode_bit_shuffle(outcode, 1);
    outcode = mMpswd_decode_bit_code(outcode);
    outcode = mMpswd_decode_RSA_cipher(outcode);
    outcode = mMpswd_decode_bit_shuffle(outcode, 0);
    outcode = mMpswd_transposition_cipher(outcode, 0, 0);
    outcode = mMpswd_decode_substitution_cipher(outcode);
    const outputcode = mMpswd_password(outcode);
    // additional fields as in decoder.php
    const codebyte0 = outcode[0];
    const codebyte1 = outcode[1];
    const trcode = passcode2.replace(String.fromCharCode(0x2D), '&');
    // produce human-friendly result object
    return {
      original_code: trcode,
      itemnum: outputcode.itemnum,
      codebyte0: codebyte0,
      codebyte1: codebyte1,
      modbyte0: outputcode.modbyte0,
      modbyte1: outputcode.modbyte1,
      modbyte2: outputcode.modbyte2,
      modbyte3: outputcode.modbyte3,
      modbyte4: outputcode.modbyte4,
      townname: outputcode.townname,
      playername: outputcode.playername,
      data: outputcode.data,
      passtype: mMpswd_test_password(4,1, outputcode.playername, outputcode.townname, outputcode.itemnum, 0, codebyte0, codebyte1),
      checksum_info: mMpswd_checksum_password(4,1, outputcode.playername, outputcode.townname, outputcode.itemnum, 0, codebyte0, codebyte1)
    };
  }

  // encode flow equivalent to codegenp.php
  function encodeTradeCode({codetype='P', itemnum=0, playername='', townname='', leadspace=false, custom=''}) {
    // accept itemnum as decimal or hex string (like "0x0A")
    let itemnumVal = itemnum;
    if (typeof itemnum === 'string') {
      if (itemnum.toLowerCase().startsWith('0x')) itemnumVal = hex2dec(itemnum.substr(2));
      else itemnumVal = parseInt(itemnum, 10);
      if (isNaN(itemnumVal)) return { error: "Invalid item number" };
    }
    // make passcode (21 bytes)
    let pass = mMpswd_make_passcode(4, 1, playername, townname, itemnumVal, 0, codetype, leadspace, custom);
    // run through algorithm sequence
    pass = mMpswd_substitution_cipher(pass);
    pass = mMpswd_transposition_cipher(pass, 1, 0);
    pass = mMpswd_bit_shuffle(pass, 0);
    pass = mMpswd_chg_RSA_cipher(pass);
    pass = mMpswd_bit_mix_code(pass);
    pass = mMpswd_bit_shuffle(pass, 1);
    pass = mMpswd_transposition_cipher(pass, 0, 1);
    // pack to 28 bytes of 6-bit values
    const final6 = mMpswd_chg_6bits_code(pass);
    // convert indices to font chars
    const finalcode = mMpswd_chg_common_font_code(final6);
    // replace '-' with '&' to match original
    const displayed = finalcode.split('').map(ch => ch === '-' ? '&' : ch).join('');
    return { finalCode: displayed, raw28: finalcode };
  }

  // Expose API on global
  global.mmpwd = {
    encodeTradeCode,
    decodeTradeCode,
    // expose lower-level functions if needed
    _internal: {
      mMpswd_chg_common_font_code,
      mMpswd_chg_8bits_code,
      mMpswd_chg_password_font_code,
      mMpswd_chg_code_table
    }
  };

})(window);
