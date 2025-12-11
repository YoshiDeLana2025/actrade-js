// app.js - port of additional.php + tools_includer pipeline to browser JS.
// Exposes window.ACTrade.createPassword(...) and window.ACTrade.decodePassword(...)

(() => {
  // --- Tables from additional.php (ported) ---
  const usable_to_fontnum = [
    0x62,0x4b,0x7a,0x35,0x63,0x71,0x59,0x5a,0x4f,0x64,0x74,0x36,0x6e,0x6c,0x42,0x79,
    0x6f,0x38,0x34,0x4c,0x6b,0x25,0x41,0x51,0x6d,0x44,0x50,0x49,0x37,0x2d,0x52,0x73,
    0x77,0x55,0x23,0x72,0x33,0x45,0x78,0x4d,0x43,0x40,0x65,0x39,0x67,0x76,0x56,0x47,
    0x75,0x4e,0x69,0x58,0x57,0x66,0x54,0x4a,0x46,0x53,0x48,0x70,0x32,0x61,0x6a,0x68
  ];

  const mMpswd_select_idx_table = [
    [0x11,0x0b,0x00,0x0a,0x0c,0x06,0x08,0x04],
    [0x03,0x08,0x0b,0x10,0x04,0x06,0x09,0x13],
    [0x09,0x0e,0x11,0x12,0x0b,0x0a,0x0c,0x02],
    [0x00,0x02,0x01,0x04,0x12,0x0a,0x0c,0x08],
    [0x11,0x13,0x10,0x07,0x0c,0x08,0x02,0x09],
    [0x10,0x03,0x01,0x08,0x12,0x04,0x07,0x06],
    [0x13,0x06,0x0a,0x11,0x03,0x10,0x08,0x09],
    [0x11,0x07,0x12,0x10,0x0c,0x02,0x0b,0x00],
    [0x06,0x02,0x0c,0x01,0x08,0x0e,0x00,0x10],
    [0x13,0x10,0x0b,0x08,0x11,0x03,0x06,0x0e],
    [0x12,0x0c,0x02,0x07,0x0a,0x0b,0x01,0x0e],
    [0x08,0x00,0x0e,0x02,0x07,0x0b,0x0c,0x11],
    [0x09,0x03,0x02,0x00,0x0b,0x08,0x0e,0x0a],
    [0x0a,0x0b,0x0c,0x10,0x13,0x07,0x11,0x08],
    [0x13,0x08,0x06,0x01,0x11,0x09,0x0e,0x0a],
    [0x09,0x07,0x11,0x0c,0x13,0x0a,0x01,0x0b]
  ];

  const mMpswd_prime_number = [
    0x0011,0x0013,0x0017,0x001d,0x001f,0x0025,0x0029,0x002b,0x002f,0x0035,0x003b,0x003d,0x0043,0x0047,0x0049,0x004f,
    0x0053,0x0059,0x0061,0x0065,0x0067,0x006b,0x006d,0x0071,0x007f,0x0083,0x0089,0x008b,0x0095,0x0097,0x009d,0x00a3,
    0x00a7,0x00ad,0x00b3,0x00b5,0x00bf,0x00c1,0x00c5,0x00c7,0x00d3,0x00df,0x00e3,0x00e5,0x00e9,0x00ef,0x00f1,0x00fb,
    0x0101,0x0107,0x010d,0x010f,0x0115,0x0119,0x011b,0x0125,0x0133,0x0137,0x0139,0x013d,0x014b,0x0151,0x015b,0x015d,
    0x0161,0x0167,0x016f,0x0175,0x017b,0x017f,0x0185,0x018d,0x0191,0x0199,0x01a3,0x01a5,0x01af,0x01b1,0x01b7,0x01bb,
    0x01c1,0x01c9,0x01cd,0x01cf,0x01d3,0x01df,0x01e7,0x01eb,0x01f3,0x01f7,0x01fd,0x0209,0x020b,0x021d,0x0223,0x022d,
    0x0233,0x0239,0x023b,0x0241,0x024b,0x0251,0x0257,0x0259,0x025f,0x0265,0x0269,0x026b,0x0277,0x0281,0x0283,0x0287,
    0x028d,0x0293,0x0295,0x02a1,0x02a5,0x02ab,0x02b3,0x02bd,0x02c5,0x02cf,0x02d7,0x02dd,0x02e3,0x02e7,0x02ef,0x02f5,
    0x02f9,0x0301,0x0305,0x0313,0x031d,0x0329,0x032b,0x0335,0x0337,0x033b,0x033d,0x0347,0x0355,0x0359,0x035b,0x035f,
    0x036d,0x0371,0x0373,0x0377,0x038b,0x038f,0x0397,0x03a1,0x03a9,0x03ad,0x03b3,0x03b9,0x03c7,0x03cb,0x03d1,0x03d7,
    0x03df,0x03e5,0x03f1,0x03f5,0x03fb,0x03fd,0x0407,0x0409,0x040f,0x0419,0x041b,0x0425,0x0427,0x042d,0x043f,0x0443,
    0x0445,0x0449,0x044f,0x0455,0x045d,0x0463,0x0469,0x047f,0x0481,0x048b,0x0493,0x049d,0x04a3,0x04a9,0x04b1,0x04bd,
    0x04c1,0x04c7,0x04cd,0x04cf,0x04d5,0x04e1,0x04eb,0x04fd,0x04ff,0x0503,0x0509,0x050b,0x0511,0x0515,0x0517,0x051b,
    0x0527,0x0529,0x052f,0x0551,0x0557,0x055d,0x0565,0x0577,0x0581,0x058f,0x0593,0x0595,0x0599,0x059f,0x05a7,0x05ab,
    0x05ad,0x05b3,0x05bf,0x05c9,0x05cb,0x05cf,0x05d1,0x05d5,0x05db,0x05e7,0x05f3,0x05fb,0x0607,0x060d,0x0611,0x0617,
    0x061f,0x0623,0x062b,0x062f,0x063d,0x0641,0x0647,0x0649,0x064d,0x0653,0x0655,0x065b,0x0665,0x0679,0x067f,0x0683
  ];

  const mMpswd_chg_code_table = [
    0xf0,0x83,0xfd,0x62,0x93,0x49,0x0d,0x3e,0xe1,0xa4,0x2b,0xaf,0x3a,0x25,0xd0,0x82,
    0x7f,0x97,0xd2,0x03,0xb2,0x32,0xb4,0xe6,0x09,0x42,0x57,0x27,0x60,0xea,0x76,0xab,
    0x2d,0x65,0xa8,0x4d,0x8b,0x95,0x01,0x37,0x59,0x79,0x33,0xac,0x2f,0xae,0x9f,0xfe,
    0x56,0xd9,0x04,0xc6,0xb2,0x28,0x06,0x5c,0x54,0x8d,0xe5,0x00,0xb3,0x7b,0x5e,0xa7,
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

  const chg_ptr = [
    "NiiMasaru","KomatsuKunihiro","TakakiGentarou","MiyakeHiromichi","HayakawaKenzo",
    "KasamatsuShigehiro","SumiyoshiNobuhiro","NomaTakafumi","EguchiKatsuya","NogamiHisashi",
    "IidaToki","IkegawaNoriko","KawaseTomohiro","BandoTaro","TotakaKazuo","WatanabeKunio",
    "RichAmtower","KyleHudson","MichaelKelbaugh","RaycholeLAneff","LeslieSwan","YoshinobuMantani",
    "KirkBuchanan","TimOLeary","BillTrinen","nAkAyOsInoNyuuSankin","zendamaKINAKUDAMAkin","OishikutetUYOKUNARU",
    "AsetoAminofen","fcSFCn64GCgbCGBagbVB","YossyIsland","KedamonoNoMori"
  ];

  const chg_len = [
    0x09,0x0f,0x0e,0x0f,0x0d,0x12,0x11,0x0c,0x0d,0x0d,0x08,0x0d,0x0e,0x09,0x0b,0x0d,
    0x0b,0x0a,0x0f,0x0e,0x0a,0x10,0x0c,0x09,0x0a,0x14,0x14,0x13,0x0d,0x14,0x0b,0x0e
  ];

  const key_idx = [0x12, 0x09];

  // ---------------- Helper utilities ----------------
  function padRightStr(s, len, padChar = '\0') {
    if (s.length >= len) return s.slice(0, len);
    return s + padChar.repeat(len - s.length);
  }

  function hex2dec(numstr) {
    // expects up to 4 hex digits string (like "04D2")
    return parseInt(numstr, 16);
  }

  function all2int(value) {
    if (typeof value !== 'string') return value;
    // try decimal
    const intval = parseInt(value, 10);
    if (!isNaN(intval) && intval.toString() === value) return intval;
    if (value.slice(0,2).toLowerCase() === '0x') {
      return parseInt(value.slice(2), 16);
    }
    const h = parseInt(value, 16);
    return isNaN(h) ? 0 : h;
  }

  function strToByteArray(s, length = null) {
    // convert JS string to array of numeric bytes (0..255)
    const arr = [];
    for (let i = 0; i < s.length; i++) arr.push(s.charCodeAt(i) & 0xFF);
    if (length !== null) {
      while (arr.length < length) arr.push(0);
      if (arr.length > length) arr.length = length;
    }
    return arr;
  }

  function bytesToString(arr) {
    return arr.map(b => String.fromCharCode(b & 0xFF)).join('');
  }

  // ----------------- Ported mMpswd helpers -----------------
  function mMpswd_adjust_letter(passcode) {
    // expects string
    const arr = passcode.split('');
    for (let i = 0; i < 28 && i < arr.length; i++) {
      if (arr[i] === '0') arr[i] = 'O';
      if (arr[i] === '1') arr[i] = 'l';
    }
    return arr.join('');
  }

  function mMpswd_chg_password_font_code_sub(inbyte) {
    for (let idx = 0; idx < 64; idx++) {
      if (usable_to_fontnum[idx] === inbyte) return idx;
    }
    return 0xFF;
  }

  function mMpswd_chg_password_font_code(passcode) {
    // passcode: string length 28 expected
    const temparr = [];
    for (let idx = 0; idx < 28; idx++) {
      const ch = passcode.charCodeAt(idx) || 0;
      const usablebyte = mMpswd_chg_password_font_code_sub(ch);
      if (usablebyte === 0xff) return [0, passcode];
      temparr[idx] = String.fromCharCode(usablebyte);
    }
    return [1, temparr.join('')];
  }

  function mMpswd_chg_common_font_code(finalcode) {
    // finalcode: string of length 28 with bytes to be mapped by usable_to_fontnum (indexing by char code)
    const arr = finalcode.split('');
    for (let idx = 0; idx < 28; idx++) {
      const c = arr[idx].charCodeAt(0) & 0xFF;
      arr[idx] = String.fromCharCode(usable_to_fontnum[c]);
    }
    return arr.join('');
  }

  function mMpswd_chg_6bits_code(passcode) {
    // encode 21-byte passcode into 28 bytes of 6-bit packed format
    // passcode is string of 21 bytes
    const code8 = strToByteArray(passcode, 21);
    let code8bitsIndex = 0;
    let code6bitsIndex = 0;
    let passbyte = 0;
    let destbyte = 0;
    let bytectr = 0;
    let ctr8bits = 0;
    let ctr6bits = 0;
    const finalcode = new Array(28).fill(0);
    while (true) {
      passbyte = code8[code8bitsIndex] >> ctr8bits;
      ctr8bits++;
      passbyte = (passbyte & 0x01) << ctr6bits;
      ctr6bits++;
      destbyte |= passbyte;
      if (ctr6bits === 6) {
        bytectr++;
        finalcode[code6bitsIndex] = destbyte;
        ctr6bits = 0;
        code6bitsIndex++;
        if (bytectr === 28) {
          return bytesToString(finalcode);
        }
        destbyte = 0;
      }
      if (ctr8bits === 8) {
        ctr8bits = 0;
        code8bitsIndex++;
      }
    }
  }

  function mMpswd_chg_8bits_code(passcode) {
    // reverse of 6bits -> 8 bits: passcode input is 28 bytes; returns 21 bytes
    const inp = strToByteArray(passcode, 28);
    let bit6idx = 0, bit8idx = 0, byte6idx = 0, byte8idx = 0;
    let inbit = 0, outbyte = 0;
    const passarr2 = [];
    while (true) {
      inbit = (inp[byte6idx] >> bit6idx) & 0x01;
      inbit <<= bit8idx;
      bit8idx++;
      bit6idx++;
      outbyte |= inbit;
      if (bit8idx === 8) {
        passarr2[byte8idx] = outbyte & 0xFF;
        byte8idx++;
        if (byte8idx === 21) {
          return bytesToString(passarr2);
        }
        bit8idx = 0;
        outbyte = 0;
      }
      if (bit6idx === 6) {
        bit6idx = 0;
        byte6idx++;
      }
    }
  }

  function mMpswd_transposition_cipher(passcode, negval, keynum) {
    // passcode is string length 21; returns new string
    const passarr = strToByteArray(passcode, 21);
    let transdir = (negval === 1) ? -1 : 1;
    const chgstroffset = passarr[key_idx[keynum]] & 0x0f;
    const chgstrnum = chgstroffset + (keynum * 16);
    const chgstrptr = chg_ptr[chgstrnum];
    const chgstrlen = chg_len[chgstrnum];
    let chgstridx = 0;
    const out = passarr.slice();
    for (let idx = 0; idx < 21; idx++) {
      if (key_idx[keynum] !== idx) {
        const transoffset = (chgstrptr.charCodeAt(chgstridx) || 0) * transdir;
        const tpasscode = passarr[idx];
        out[idx] = ((tpasscode + transoffset) & 0xFF);
        chgstridx++;
        chgstridx %= chgstrlen;
      } else {
        out[idx] = passarr[idx];
      }
    }
    return bytesToString(out);
  }

  function mMpswd_bit_shuffle(passcode, keynum) {
    // passcode: 21-byte string
    const passarr = strToByteArray(passcode, 21);
    let charoffset, numchars;
    if (keynum === 0) { charoffset = 13; numchars = 19; } else { charoffset = 2; numchars = 20; }
    const newbuf = new Array(numchars).fill(0);
    // build tempbuf = passcode[0:charoffset] + passcode[charoffset+1 : charoffset+1+20-charoffset]
    const tempbuf = [];
    for (let i = 0; i < charoffset; i++) tempbuf.push(passarr[i]);
    for (let i = charoffset + 1; i < charoffset + 1 + (20 - charoffset); i++) tempbuf.push(passarr[i]);
    const tablenum = ((passarr[charoffset] << 2) & 0x0c);
    const idxPtr = mMpswd_select_idx_table[(tablenum >> 2)];
    for (let idx1 = 0; idx1 < numchars; idx1++) {
      const tempbyte = tempbuf[idx1];
      for (let idx2 = 0; idx2 < 8; idx2++) {
        let outoffset = idxPtr[idx2] + idx1;
        outoffset %= numchars;
        let inbyte = tempbyte >> idx2;
        let outbyte = newbuf[outoffset];
        inbyte = inbyte & 0x01;
        inbyte = inbyte << idx2;
        inbyte = inbyte | outbyte;
        newbuf[outoffset] = inbyte;
      }
    }
    // convert to chars
    const tempbuf3 = newbuf.map(x => x & 0xFF);
    // reconstruct passcode: substr(tempbuf3,0,charoffset) + passcode[charoffset] + substr(tempbuf3,charoffset,20-charoffset)
    const outarr = [];
    for (let i = 0; i < charoffset; i++) outarr.push(tempbuf3[i]);
    outarr.push(passarr[charoffset]);
    for (let i = charoffset; i < 20; i++) outarr.push(tempbuf3[i]);
    // fill to 21
    while (outarr.length < 21) outarr.push(0);
    return bytesToString(outarr);
  }

  function mMpswd_decode_bit_shuffle(passcode, keynum) {
    const passarr = strToByteArray(passcode, 21);
    let charoffset, numchars;
    if (keynum === 0) { charoffset = 13; numchars = 19; } else { charoffset = 2; numchars = 20; }
    const tempbuf = [];
    for (let i = 0; i < charoffset; i++) tempbuf.push(passarr[i]);
    for (let i = charoffset + 1; i < charoffset + 1 + (20 - charoffset); i++) tempbuf.push(passarr[i]);
    const tempbuf2 = new Array(numchars).fill(0);
    const tablenum = ((passarr[charoffset] << 2) & 0x0c);
    const idxPtr = mMpswd_select_idx_table[(tablenum >> 2)];
    for (let idx = 0; idx < numchars; idx++) {
      for (let idx2 = 0; idx2 < 8; idx2++) {
        let outoffset = idxPtr[idx2] + idx;
        outoffset %= numchars;
        let inbyte = tempbuf[outoffset];
        inbyte = (inbyte >> idx2) & 0x01;
        inbyte <<= idx2;
        tempbuf2[idx] |= inbyte;
      }
    }
    const tempbuf3 = tempbuf2.map(x => x & 0xFF);
    const passcodet = [];
    for (let i = 0; i < charoffset; i++) passcodet.push(tempbuf3[i]);
    passcodet.push(passarr[charoffset]);
    for (let i = charoffset; i < 20; i++) passcodet.push(tempbuf3[i]);
    while (passcodet.length < 21) passcodet.push(0);
    return bytesToString(passcodet);
  }

  function mMpswd_bit_shift(passcode, shiftamt) {
    // passcode: string length 21
    const passarr = strToByteArray(passcode, 21);
    // tempbuf = passcode[0] + passcode[2..20] (skips index 1 per original)
    const tempbuf = [];
    tempbuf.push(passarr[0]);
    for (let i = 2; i < 21; i++) tempbuf.push(passarr[i]);
    // now tempbuf length = 20 (indexes 0..19)
    if (shiftamt > 0) {
      const destpos = Math.floor(shiftamt / 8);
      const destoffs = shiftamt % 8;
      const tempbuf2 = new Array(20);
      for (let idx = 0; idx < 20; idx++) {
        if (idx > 0) {
          tempbuf2[(idx + destpos) % 20] = ((tempbuf[idx] << destoffs) | (tempbuf[(idx - 1) % 20] >> (8 - destoffs))) & 0xFF;
        } else {
          tempbuf2[(idx + destpos) % 20] = ((tempbuf[idx] << destoffs) | (tempbuf[19] >> (8 - destoffs))) & 0xFF;
        }
      }
      for (let idx = 0; idx < 20; idx++) tempbuf[idx] = tempbuf2[idx];
    } else if (shiftamt < 0) {
      const tempbuf2 = new Array(20);
      for (let idx = 0; idx < 20; idx++) tempbuf2[idx] = tempbuf[19 - idx];
      shiftamt = -shiftamt;
      const destpos = Math.floor(shiftamt / 8);
      const destoffs = shiftamt % 8;
      for (let idx = 0; idx < 20; idx++) {
        tempbuf[(idx + destpos) % 20] = tempbuf2[idx];
      }
      const tempbuf3 = new Array(20);
      for (let idx = 0; idx < 20; idx++) {
        if (idx > 0) {
          tempbuf3[idx] = ((tempbuf[idx] >> destoffs) | (tempbuf[(idx - 1) % 20] << (8 - destoffs))) & 0xFF;
        } else {
          tempbuf3[idx] = ((tempbuf[idx] >> destoffs) | (tempbuf[19] << (8 - destoffs))) & 0xFF;
        }
      }
      for (let idx = 0; idx < 20; idx++) tempbuf[idx] = tempbuf3[19 - idx];
    }
    // reconstruct passcode: tempbuf[0] + original byte1 + tempbuf[1..19]
    const outarr = [];
    outarr.push(tempbuf[0]);
    outarr.push(passarr[1]);
    for (let i = 1; i < 20; i++) outarr.push(tempbuf[i]);
    return bytesToString(outarr);
  }

  function mMpswd_bit_reverse(passcode) {
    // XOR bytes other than index 1 with 0xFF
    const arr = strToByteArray(passcode, 21);
    for (let idx = 0; idx < 21; idx++) {
      if (idx !== 1) arr[idx] = arr[idx] ^ 0xFF;
    }
    return bytesToString(arr);
  }

  function mMpswd_bit_arrange_reverse(passcode) {
    let tempbuf = strToByteArray(passcode, 21);
    // make a buffer that excludes index 1
    const tb = [];
    tb.push(tempbuf[0]);
    for (let i = 2; i < 21; i++) tb.push(tempbuf[i]);
    // tb length should be 20; do reverse bit arrangement
    const tempbuf2 = new Array(20).fill(0);
    for (let idx1 = 0; idx1 <= 19; idx1++) {
      const srcbyte = tb[19 - idx1];
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
    // reconstruct passcode: tempbuf2[0..char] + original[1] + tempbuf2[1..]
    const outarr = [];
    outarr.push(tempbuf2[0]);
    outarr.push(tempbuf[1]);
    for (let i = 1; i < 20; i++) outarr.push(tempbuf2[i]);
    return bytesToString(outarr);
  }

  function mMpswd_decode_bit_code(passcode) {
    const codemethod = (passcode.charCodeAt(1) & 0x0f);
    let pc = passcode;
    if (codemethod > 12) {
      pc = mMpswd_bit_shift(pc, (-codemethod) * 3);
      pc = mMpswd_bit_reverse(pc);
      pc = mMpswd_bit_arrange_reverse(pc);
    } else if (codemethod > 8) {
      pc = mMpswd_bit_shift(pc, codemethod * 5);
      pc = mMpswd_bit_arrange_reverse(pc);
    } else if (codemethod > 4) {
      pc = mMpswd_bit_reverse(pc);
      pc = mMpswd_bit_shift(pc, codemethod * 5);
    } else {
      pc = mMpswd_bit_arrange_reverse(pc);
      pc = mMpswd_bit_shift(pc, (-codemethod) * 3);
    }
    return pc;
  }

  function mMpswd_get_RSA_key_code(passcode) {
    const passarr = strToByteArray(passcode, 21);
    let bit10 = passarr[15] % 4;
    let bit32 = Math.floor((passarr[15] & 0x0f) / 4);
    if (bit10 === 3) {
      bit10 = (bit10 ^ bit32) & 0x03;
      if (bit10 === 3) bit10 = 0;
    }
    if (bit32 === 3) {
      bit32 = (bit10 + 1) & 0x03;
      if (bit32 === 3) bit32 = 1;
    }
    if (bit10 === bit32) {
      bit32 = (bit10 + 1) & 0x03;
      if (bit32 === 3) bit32 = 1;
    }
    const bytetable = ((passarr[15] >> 2) & 0x3c) >> 2;
    const param1 = mMpswd_prime_number[bit10];
    const param2 = mMpswd_prime_number[bit32];
    const param3 = mMpswd_prime_number[passarr[5]];
    const param4 = mMpswd_select_idx_table[bytetable];
    return [param1, param2, param3, param4];
  }

  function mMpswd_decode_RSA_cipher(passcode) {
    // uses pseudo-RSA multiple exponents; we keep algorithm as-is
    const passarr = strToByteArray(passcode, 21);
    const tempprime = mMpswd_get_RSA_key_code(passcode);
    const prime1 = tempprime[0], prime2 = tempprime[1], prime3 = tempprime[2], idxtableptr = tempprime[3];
    const primeproduct = prime1 * prime2;
    const lessproduct = (prime1 - 1) * (prime2 - 1);
    let modcount = 0;
    let tempval, tempval2;
    do {
      modcount++;
      tempval = (modcount * lessproduct + 1) % prime3;
      tempval2 = (modcount * lessproduct + 1) / prime3;
    } while (tempval !== 0);
    // tempval2 is the exponent used in decoder loop
    for (let idx = 0; idx < 8; idx++) {
      let newbyte = passarr[idxtableptr[idx]];
      newbyte |= ((passarr[20] >> idx) << 8) & 0x100;
      let currentbyte = newbyte;
      for (let idx2 = 0; idx2 < tempval2 - 1; idx2++) {
        newbyte = (newbyte * currentbyte) % primeproduct;
      }
      passarr[idxtableptr[idx]] = newbyte & 0xFF;
    }
    return bytesToString(passarr);
  }

  function mMpswd_chg_RSA_cipher(passcode) {
    const passarr = strToByteArray(passcode, 21);
    const tempprime = mMpswd_get_RSA_key_code(passcode);
    const prime1 = tempprime[0], prime2 = tempprime[1], prime3 = tempprime[2], idxtableptr = tempprime[3];
    const primeproduct = prime1 * prime2;
    let checkbyte = 0;
    for (let bytectr = 0; bytectr < 8; bytectr++) {
      let newbyte = passarr[idxtableptr[bytectr]];
      let currentbyte = newbyte;
      for (let idx = 0; idx < prime3 - 1; idx++) {
        newbyte = (newbyte * currentbyte) % primeproduct;
      }
      passarr[idxtableptr[bytectr]] = newbyte & 0xFF;
      newbyte = (newbyte >> 8) & 0x01;
      checkbyte |= (newbyte << bytectr);
    }
    passarr[20] = checkbyte & 0xFF;
    return bytesToString(passarr);
  }

  function mMpswd_substitution_cipher(passcode) {
    const passarr = strToByteArray(passcode, 21);
    for (let idx = 0; idx < 21; idx++) {
      passarr[idx] = mMpswd_chg_code_table[passarr[idx] & 0xFF] & 0xFF;
    }
    return bytesToString(passarr);
  }

  function mMpswd_decode_substitution_cipher(passcode) {
    const passarr = strToByteArray(passcode, 21);
    // for each byte, find index in mMpswd_chg_code_table that matches ord(passcode[idx])
    for (let idx = 0; idx < 21; idx++) {
      const v = passarr[idx];
      let found = 0;
      for (let idx2 = 0; idx2 < 256; idx2++) {
        if (v === mMpswd_chg_code_table[idx2]) {
          passarr[idx] = idx2 & 0xFF;
          found = 1;
          break;
        }
      }
      if (!found) passarr[idx] = v;
    }
    return bytesToString(passarr);
  }

  function mMpswd_bit_mix_code(passcode) {
    const switchbyte = (passcode.charCodeAt(1) & 0x0f);
    let pc = passcode;
    if ([13,14,15].includes(switchbyte)) {
      pc = mMpswd_bit_arrange_reverse(pc);
      pc = mMpswd_bit_reverse(pc);
      pc = mMpswd_bit_shift(pc, switchbyte * 3);
    } else if ([9,10,11,12].includes(switchbyte)) {
      pc = mMpswd_bit_arrange_reverse(pc);
      pc = mMpswd_bit_shift(pc, (-switchbyte) * 5);
    } else if ([5,6,7,8].includes(switchbyte)) {
      pc = mMpswd_bit_shift(pc, (-switchbyte) * 5);
      pc = mMpswd_bit_reverse(pc);
    } else {
      pc = mMpswd_bit_shift(pc, switchbyte * 3);
      pc = mMpswd_bit_arrange_reverse(pc);
    }
    return pc;
  }

  // mMpswd_password to extract fields
  function mMpswd_password(passcode) {
    const passarr = strToByteArray(passcode, 21);
    const playername = bytesToString(passarr.slice(2, 10)).replace(/\0/g, ' ');
    const townname = bytesToString(passarr.slice(10, 18)).replace(/\0/g, ' ');
    const modbyte4 = (passarr[0] & 0x18) >> 3;
    const modbyte2 = (passarr[0] & 0xe0) >> 5;
    let modbyte0, modbyte1, modbyte3;
    const itemnum = (passarr[18] << 8) | passarr[19];
    if ([0,4,5,6,7].includes(modbyte2)) {
      modbyte0 = 0xFF; modbyte1 = 0xFF;
      modbyte3 = (passarr[0] & 0x06) >> 1;
    } else if ([1,2].includes(modbyte2)) {
      modbyte0 = passarr[0] & 0x01;
      modbyte1 = passarr[1];
      modbyte3 = (passarr[0] & 0x06) >> 1;
    } else if (modbyte2 === 3) {
      modbyte0 = 0xFF; modbyte1 = 0xFF;
      modbyte3 = ((passarr[0] & 0x06) >> 1) | (((passarr[0] & 0x01) << 2));
    }
    const data = passarr.slice();
    return {
      itemnum, modbyte0, modbyte1, modbyte2, modbyte3, modbyte4, playername, townname, data
    };
  }

  // mMpswd_make_passcode
  function mMpswd_make_passcode(paramR4, paramR5, playername, townname, itemnum, paramR9, codetype, leadspace, custom = '') {
    // Create 21-byte passcode
    const pass = new Array(21).fill(0);
    pass[0] = (((paramR4 & 0x07) << 5) | (paramR5 << 1) | (paramR9 & 0x01)) & 0xFF;
    pass[1] = 255;
    // pad names to 8 chars
    playername = padRightStr(playername, 8, ' ');
    townname = padRightStr(townname, 8, ' ');
    // fill
    for (let i = 0; i < 8; i++) pass[2 + i] = playername.charCodeAt(i) & 0xFF;
    for (let i = 0; i < 8; i++) pass[10 + i] = townname.charCodeAt(i) & 0xFF;
    if (leadspace && playername.trim().length > 0 && playername.trim().length < 8) pass[2 + playername.trim().length] = 0;
    if (leadspace && townname.trim().length > 0 && townname.trim().length < 8) pass[10 + townname.trim().length] = 0;
    pass[18] = (itemnum >> 8) & 0xFF;
    pass[19] = itemnum & 0xFF;
    // checksum
    let checksum = 0;
    for (let idx = 0; idx < 8; idx++) {
      checksum += pass[2 + idx];
      checksum += pass[10 + idx];
    }
    checksum += itemnum;
    checksum += 0xFF;
    let checkbyte = pass[0] | (((checksum & 0x03) << 3) & 0xFF);
    let codebyte = 255;
    switch (codetype) {
      case 'P':
        break;
      case 'N':
        checkbyte &= 0x1f;
        break;
      case 'U':
        checkbyte &= 0x18;
        checkbyte |= 0x61;
        break;
      case 'C':
        // custom algorithm support: the original PHP used eval on generated code;
        // for security we support a minimal custom: apply two operators lines like "&=0x18" or "|=0x61"
        // parse custom parameter if provided:
        if (custom && custom.trim()) {
          const lines = custom.split(/\r?\n/);
          for (const L of lines) {
            const s = L.trim();
            if (!s) continue;
            // e.g. "&=0x00000018"
            const m = s.match(/^([&|^]|<<|>>)=\s*(0x[0-9A-Fa-f]+|\d+)$/);
            if (m) {
              const op = m[1], val = all2int(m[2]);
              if (op === '&') checkbyte &= val;
              else if (op === '|') checkbyte |= val;
              else if (op === '^') checkbyte ^= val;
              else if (op === '<<') checkbyte = (checkbyte << val) & 0xFF;
              else if (op === '>>') checkbyte = (checkbyte >> val) & 0xFF;
            }
          }
        }
        break;
    }
    pass[0] = checkbyte & 0xFF;
    pass[1] = codebyte & 0xFF;
    return bytesToString(pass);
  }

  function mMpswd_make_passcode_from_byte(paramR4, paramR5, playername, townname, itemnum, paramR9, leadspace, byte1, byte2) {
    const pass = new Array(21).fill(0);
    pass[0] = all2int(byte1) & 0xFF;
    pass[1] = all2int(byte2) & 0xFF;
    playername = padRightStr(playername, 8, ' ');
    townname = padRightStr(townname, 8, ' ');
    for (let i = 0; i < 8; i++) pass[2 + i] = playername.charCodeAt(i) & 0xFF;
    for (let i = 0; i < 8; i++) pass[10 + i] = townname.charCodeAt(i) & 0xFF;
    if (leadspace && playername.trim().length > 0 && playername.trim().length < 8) pass[2 + playername.trim().length] = 0;
    if (leadspace && townname.trim().length > 0 && townname.trim().length < 8) pass[10 + townname.trim().length] = 0;
    pass[18] = (itemnum >> 8) & 0xFF;
    pass[19] = itemnum & 0xFF;
    return bytesToString(pass);
  }

  // pipeline wrappers used in tools_includer
  function create_password(playername, townname, itemnum, codetype, leadspace, custom = '') {
    if (typeof itemnum === 'string' && itemnum.toLowerCase().startsWith('0x')) itemnum = hex2dec(itemnum.slice(2));
    itemnum = Number(itemnum) || 0;
    const passcode = mMpswd_make_passcode(4, 1, playername, townname, itemnum, 0, codetype, leadspace, custom);
    let t = mMpswd_substitution_cipher(passcode);
    t = mMpswd_transposition_cipher(t, 1, 0);
    t = mMpswd_bit_shuffle(t, 0);
    t = mMpswd_chg_RSA_cipher(t);
    t = mMpswd_bit_mix_code(t);
    t = mMpswd_bit_shuffle(t, 1);
    t = mMpswd_transposition_cipher(t, 0, 1);
    let finalcode = mMpswd_chg_6bits_code(t);
    finalcode = mMpswd_chg_common_font_code(finalcode);
    finalcode = finalcode.replace(/-/g, '&');
    return finalcode;
  }

  function create_password_from_byte(playername, townname, itemnum, leadspace, byte1, byte2) {
    if (typeof itemnum === 'string' && itemnum.toLowerCase().startsWith('0x')) itemnum = hex2dec(itemnum.slice(2));
    itemnum = Number(itemnum) || 0;
    const passcode = mMpswd_make_passcode_from_byte(4,1,playername,townname,itemnum,0,leadspace,byte1,byte2);
    let t = mMpswd_substitution_cipher(passcode);
    t = mMpswd_transposition_cipher(t, 1, 0);
    t = mMpswd_bit_shuffle(t, 0);
    t = mMpswd_chg_RSA_cipher(t);
    t = mMpswd_bit_mix_code(t);
    t = mMpswd_bit_shuffle(t, 1);
    t = mMpswd_transposition_cipher(t, 0, 1);
    let finalcode = mMpswd_chg_6bits_code(t);
    finalcode = mMpswd_chg_common_font_code(finalcode);
    finalcode = finalcode.replace(/-/g, '&');
    return finalcode;
  }

  function decode_password(passcode) {
    let passcode2 = (passcode || '').toString();
    passcode2 = passcode2.replace(/\r?\n/g, '');
    passcode2 = passcode2.replace(/\x00/g, '');
    passcode2 = passcode2.replace(/\t/g, '');
    passcode2 = passcode2.replace(/\r/g, '');
    passcode2 = passcode2.replace(/ /g, '');
    passcode2 = passcode2.replace(/&/g, String.fromCharCode(0x2D));
    // normalize
    let tempcode = mMpswd_adjust_letter(passcode2);
    const tempcode2 = mMpswd_chg_password_font_code(tempcode);
    if (tempcode2[0]) {
      const tempcode3 = mMpswd_chg_8bits_code(tempcode2[1]);
      let outcode = mMpswd_transposition_cipher(tempcode3, 1, 1);
      let outcode2 = mMpswd_decode_bit_shuffle(outcode, 1);
      let outcode3 = mMpswd_decode_bit_code(outcode2);
      let outcode4 = mMpswd_decode_RSA_cipher(outcode3);
      let outcode5 = mMpswd_decode_bit_shuffle(outcode4, 0);
      let outcode6 = mMpswd_transposition_cipher(outcode5, 0, 0);
      let outcode7 = mMpswd_decode_substitution_cipher(outcode6);
      const outputcode = mMpswd_password(outcode7);
      const itemnum = outputcode.itemnum;
      const codebyte0 = outcode7.charCodeAt(0) & 0xFF;
      const codebyte1 = outcode7.charCodeAt(1) & 0xFF;
      const modbyte0 = outputcode.modbyte0;
      const modbyte1 = outputcode.modbyte1;
      const modbyte2 = outputcode.modbyte2;
      const modbyte3 = outputcode.modbyte3;
      const modbyte4 = outputcode.modbyte4;
      const playername = outputcode.playername;
      const townname = outputcode.townname;
      // compute checksum / type detection
      // (reuse simple versions of mMpswd_test_password and checksum)
      const test = mMpswd_test_password(4,1,playername,townname,itemnum,0,codebyte0,codebyte1);
      const checksum = mMpswd_checksum_password(4,1,playername,townname,itemnum,0,codebyte0,codebyte1);
      return {
        original: passcode,
        itemnum: itemnum,
        itemnum_hex: '0x' + itemnum.toString(16).padStart(4, '0'),
        codebyte0: '0x' + codebyte0.toString(16).padStart(2,'0'),
        codebyte1: '0x' + codebyte1.toString(16).padStart(2,'0'),
        modbytes: [modbyte0, modbyte1, modbyte2, modbyte3, modbyte4],
        playername, townname,
        passtype: test,
        checksum,
        data: outputcode.data
      };
    }
    return null;
  }

  // mMpswd_test_password and checksum functions (ports)
  function mMpswd_test_password(paramR4, paramR5, playername, townname, itemnum, paramR9, byte0, byte1) {
    const firstcode = (((paramR4 & 0x07) << 5) | (paramR5 << 1) | (paramR9 & 0x01)) & 0xFF;
    let checksum = 0;
    playername = padRightStr(playername, 8);
    townname = padRightStr(townname, 8);
    for (let idx = 0; idx < 8; idx++) {
      checksum += playername.charCodeAt(idx);
      checksum += townname.charCodeAt(idx);
    }
    checksum += itemnum;
    checksum += 0xFF;
    const checkbyte = firstcode | (((checksum & 0x03) << 3) & 0xFF);
    let cases = [];
    if (byte1 === 255) cases = [0,1,2];
    else cases = [];
    let breaker = false;
    let codetype = "Unknown";
    for (let idx = 0; idx < 3; idx++) {
      const iscertain = (cases.includes(idx) ? 1 : 0);
      let tester = checkbyte;
      switch (idx) {
        case 0: codetype = "Player-to-Player (P)"; break;
        case 1: tester &= 0x1f; codetype = "NES Contest (N)"; break;
        case 2: tester &= 0x18; tester |= 0x61; codetype = "Universal (U)"; break;
      }
      if (tester === byte0) {
        if (!iscertain) codetype = "Uncertain - " + codetype;
        breaker = true;
        break;
      }
    }
    return codetype;
  }

  function mMpswd_checksum_password(paramR4, paramR5, playername, townname, itemnum, paramR9, byte0, byte1) {
    const firstcode = (((paramR4 & 0x07) << 5) | (paramR5 << 1) | (paramR9 & 0x01)) & 0xFF;
    let checksum = 0;
    playername = padRightStr(playername, 8);
    townname = padRightStr(townname, 8);
    for (let idx = 0; idx < 8; idx++) {
      checksum += playername.charCodeAt(idx);
      checksum += townname.charCodeAt(idx);
    }
    checksum += itemnum;
    checksum += 0xFF;
    const checkbyte = firstcode | (((checksum & 0x03) << 3) & 0xFF);
    const checkbyte2 = firstcode | ((((checksum - 0xFF) & 0x03) << 3) & 0xFF);
    return [checksum, checkbyte, checksum - 0xFF, firstcode, checkbyte2];
  }

  // Expose API to window for UI integration
  window.ACTrade = {
    createPassword: (playername, townname, itemnum, codetype, leadspace, custom) => {
      try {
        return create_password(playername || '', townname || '', itemnum || 0, codetype || 'U', !!leadspace, custom || '');
      } catch (e) {
        return `Error generating code: ${e.message}`;
      }
    },
    createPasswordFromByte: (playername, townname, itemnum, leadspace, byte1, byte2) => {
      try {
        return create_password_from_byte(playername || '', townname || '', itemnum || 0, !!leadspace, byte1, byte2);
      } catch (e) {
        return `Error generating code from byte: ${e.message}`;
      }
    },
    decodePassword: (passcode) => {
      try {
        return decode_password(passcode || '');
      } catch (e) {
        return null;
      }
    }
  };
})();