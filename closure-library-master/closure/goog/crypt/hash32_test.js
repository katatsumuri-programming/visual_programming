/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview
 * @suppress {strictMissingProperties,missingProperties} suppression added to
 * enable type checking
 */

goog.module('goog.crypt.hash32Test');
goog.setTestOnly();

const TestCase = goog.require('goog.testing.TestCase');
const hash32 = goog.require('goog.crypt.hash32');
const testSuite = goog.require('goog.testing.testSuite');

// NOTE: This test uses a custom test case, see end of script block

// Test data based on known input/output pairs generated using
// http://go/hash.java

function createByteArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(i);
  }
  return arr;
}

const byteArrays = {
  0: 1539411136,
  1: 1773524747,
  2: -254958930,
  3: 1532114172,
  4: 1923165449,
  5: 1611874589,
  6: 1502126780,
  7: -751745251,
  8: -292491321,
  9: 1106193218,
  10: -722791438,
  11: -2130666060,
  12: -259304553,
  13: 871461192,
  14: 865773084,
  15: 1615738330,
  16: -1836636447,
  17: -485722519,
  18: -120832227,
  19: 1954449704,
  20: 491312921,
  21: -1955462668,
  22: 168565425,
  23: -105893922,
  24: 620486614,
  25: -1789602428,
  26: 1765793554,
  27: 1723370948,
  28: -1275405721,
  29: 140421019,
  30: -1438726307,
  31: 538438903,
  32: -729123980,
  33: 1213490939,
  34: -1814248478,
  35: 1943703398,
  36: 1603073219,
  37: -2139639543,
  38: -694153941,
  39: 137511516,
  40: -249943726,
  41: -1166126060,
  42: 53464833,
  43: -915350862,
  44: 1306585409,
  45: 1064798289,
  46: 335555913,
  47: 224485496,
  48: 275599760,
  49: 409559869,
  50: 673770580,
  51: -2113819879,
  52: -791338727,
  53: -1716479479,
  54: 1795018816,
  55: 2020139343,
  56: -1652827750,
  57: -1509632558,
  58: 751641995,
  59: -217881377,
  60: -476546900,
  61: -1893349644,
  62: -729290332,
  63: 1359899321,
  64: 1811814306,
  65: 2100363086,
  66: -794920327,
  67: -1667555017,
  68: -549980099,
  69: -21170740,
  70: -1324143722,
  71: 1406730195,
  72: 2111381574,
  73: -1667480052,
  74: 1071811178,
  75: -1080194099,
  76: -181186882,
  77: 268677507,
  78: -546766334,
  79: 555953522,
  80: -981311675,
  81: 1988867392,
  82: 773172547,
  83: 1160806722,
  84: -1455460187,
  85: 83493600,
  86: 155365142,
  87: 1714618071,
  88: 1487712615,
  89: -810670278,
  90: 2031655097,
  91: 1286349470,
  92: -1873594211,
  93: 1875867480,
  94: -1096259787,
  95: -1054968610,
  96: -1723043458,
  97: 1278708307,
  98: -601104085,
  99: 1497928579,
  100: 1329732615,
  101: -1281696190,
  102: 1471511953,
  103: -62666299,
  104: 807569747,
  105: -1927974759,
  106: 1462243717,
  107: -862975602,
  108: 824369927,
  109: -1448816781,
  110: 1434162022,
  111: -881501413,
  112: -1554381107,
  113: -1730883204,
  114: 431236217,
  115: 1877278608,
  116: -673864625,
  117: 143000665,
  118: -596902829,
  119: 1038860559,
  120: 805884326,
  121: -1536181710,
  122: -1357373256,
  123: 1405134250,
  124: -860816481,
  125: 1393578269,
  126: -810682545,
  127: -635515639,
};

let testCase;
if (globalThis.G_testRunner) {
  testCase = new TestCase(document.title);
  testCase.autoDiscoverTests();
  globalThis.G_testRunner.initialize(testCase);
}
testSuite({
  testEncodeInteger() {
    assertEquals(898813988, hash32.encodeInteger(305419896));
  },

  testEncodeByteArray() {
    assertEquals(-1497024495, hash32.encodeByteArray([10, 20, 30, 40]));
    assertEquals(-961586214, hash32.encodeByteArray([3, 1, 4, 1, 5, 9]));
    assertEquals(-1482202299, hash32.encodeByteArray([127, 0, 0, 0, 123, 45]));
    assertEquals(170907881, hash32.encodeByteArray([9, 1, 1]));
  },

  /** @suppress {missingProperties} suppression added to enable type checking */
  testKnownByteArrays() {
    for (let i = 0; i < byteArrays.length; i++) {
      assertEquals(byteArrays[i], hash32.encodeByteArray(createByteArray(i)));
    }
  },

  testEncodeString() {
    assertEquals(-937588052, hash32.encodeString('Hello, world'));
    assertEquals(62382810, hash32.encodeString('Sch\xF6n'));
  },

  testEncodeBinaryString() {
    assertEquals(-937588052, hash32.encodeBinaryString('Hello, world'));
    assertEquals(62382810, hash32.encodeBinaryString('Sch\xF6n'));
  },

  testEncodeStringUtf8() {
    assertEquals(-937588052, hash32.encodeStringUtf8('Hello, world'));
    assertEquals(-833263351, hash32.encodeStringUtf8('Sch\xF6n'));

    assertEquals(-1771620293, hash32.encodeStringUtf8('\u043A\u0440'));
  },

  testEncodeText() {
    assertEquals(-937588052, hash32.encodeText('Hello, world'));
    assertEquals(-833263351, hash32.encodeText('Sch\xF6n'));

    assertEquals(-1771620293, hash32.encodeText('\u043A\u0440'));
  },

  testEncodeString_ascii() {
    assertEquals(
        'For ascii characters UTF8 should be the same',
        hash32.encodeText('abc123'), hash32.encodeBinaryString('abc123'));

    assertEquals(
        'For ascii characters UTF8 should be the same',
        hash32.encodeText('The,quick.brown-fox'),
        hash32.encodeBinaryString('The,quick.brown-fox'));

    assertNotEquals(
        'For non-ascii characters UTF-8 encoding is different',
        hash32.encodeText('Sch\xF6n'), hash32.encodeBinaryString('Sch\xF6n'));
  },

  testEncodeString_poe() {
    const poe =
        'Once upon a midnight dreary, while I pondered weak and weary,' +
        'Over many a quaint and curious volume of forgotten lore,' +
        'While I nodded, nearly napping, suddenly there came a tapping,' +
        'As of some one gently rapping, rapping at my chamber door.' +
        '`\'Tis some visitor,\' I muttered, `tapping at my chamber door -' +
        'Only this, and nothing more.\'' +
        'Ah, distinctly I remember it was in the bleak December,' +
        'And each separate dying ember wrought its ghost upon the floor.' +
        'Eagerly I wished the morrow; - vainly I had sought to borrow' +
        'From my books surcease of sorrow - sorrow for the lost Lenore -' +
        'For the rare and radiant maiden whom the angels named Lenore -' +
        'Nameless here for evermore.' +
        'And the silken sad uncertain rustling of each purple curtain' +
        'Thrilled me - filled me with fantastic terrors never felt before;' +
        'So that now, to still the beating of my heart, I stood repeating' +
        '`\'Tis some visitor entreating entrance at my chamber door -' +
        'Some late visitor entreating entrance at my chamber door; -' +
        'This it is, and nothing more,\'' +
        'Presently my soul grew stronger; hesitating then no longer,' +
        '`Sir,\' said I, `or Madam, truly your forgiveness I implore;' +
        'But the fact is I was napping, and so gently you came rapping,' +
        'And so faintly you came tapping, tapping at my chamber door,' +
        'That I scarce was sure I heard you\' - here I opened wide the door; -' +
        'Darkness there, and nothing more.' +
        'Deep into that darkness peering, long I stood there wondering, ' +
        'fearing,' +
        'Doubting, dreaming dreams no mortal ever dared to dream before' +
        'But the silence was unbroken, and the darkness gave no token,' +
        'And the only word there spoken was the whispered word, `Lenore!\'' +
        'This I whispered, and an echo murmured back the word, `Lenore!\'' +
        'Merely this and nothing more.' +
        'Back into the chamber turning, all my soul within me burning,' +
        'Soon again I heard a tapping somewhat louder than before.' +
        '`Surely,\' said I, `surely that is something at my window lattice;' +
        'Let me see then, what thereat is, and this mystery explore -' +
        'Let my heart be still a moment and this mystery explore; -' +
        '\'Tis the wind and nothing more!\'';

    assertEquals(147608747, hash32.encodeBinaryString(poe));
    assertEquals(147608747, hash32.encodeText(poe));
  },

  testBenchmarking_binary() {
    if (!testCase) return;
    // Not a real test, just outputs some timing
    for (let i = 0; i < 50000; i += 10000) {
      const str = makeString(i, 256);
      const start = Date.now();
      const hash = hash32.encodeBinaryString(str);

      const diff = Date.now() - start;
      testCase.saveMessage(
          `testBenchmarking_binary: hashing ${i} chars in ${diff}ms (${hash})`);
    }
  },

  testBenchmarking_text() {
    if (!testCase) return;
    // Not a real test, just outputs some timing
    for (let i = 0; i < 50000; i += 10000) {
      const str = makeString(i, 0xd000);  // avoid unpaired surrogates
      const start = Date.now();
      const hash = hash32.encodeText(str);
      const diff = Date.now() - start;
      testCase.saveMessage(
          `testBenchmarking_text: hashing ${i} chars in ${diff}ms (${hash})`);
    }
  },
});

/**
 * Build a random string of the given length and range of characters.
 * @param {number} n Length of string
 * @param {number=} max Maximum charcode for each character
 * @return {string}
 */
function makeString(n, max = 256) {
  const str = [];
  for (let i = 0; i < n; i++) {
    str.push(String.fromCharCode(Math.floor(Math.random() * max)));
  }
  return str.join('');
}
