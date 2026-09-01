import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ko } from "./language.js";

function randomAndroidId() {
  return "00000000" + crypto.randomBytes(8).toString("hex") + "00000000"; //16
}

export function decodeString(str = "") {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c >= 33 && c <= 126) { // printable ASCII
      c -= 20;
      if (c < 33) c += 126 - 33;
    }
    result += String.fromCharCode(c);
  }
  return result;
}

export class DramaboxApp {
  static #privateKey = null;

  static #initPrivateKey() {
    try {
      const part1 =
        "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9Q4Y5QX5j08HrnbY3irfKdkEllAU2OORnAjlXDyCzcm2Z6ZRrGvtTZUAMelfU5PWS6XGEm3d4kJEKbXi4Crl8o2E/E3YJPk1lQD1d0JTdrvZleETN1ViHZFSQwS3L94Woh0E3TPebaEYq88eExvKu1tDdjSoFjBbgMezySnas5Nc2xF28";
      const part2 = decodeString(
        `l|d,WL$EI,?xyw+*)^#?U\`[whXlG\`-GZif,.jCxbKkaY"{w*y]_jax^/1iVDdyg(Wbz+z/$xVjCiH0lZf/d|%gZglW)"~J,^~}w"}m(E'eEunz)eyEy\`XGaVF|_(Kw)|awUG"'{{e#%$0E.ffHVU++$giHzdvC0ZLXG|U{aVUUYW{{YVU^x),J'If\`nG|C[\`ZF),xLv(-H'}ZIEyCfke0dZ%aU[V)"V0}mhKvZ]Gw%-^a|m'\`\\f}{(~kzi&zjG+|fXX0$IH#j\`+hfnME"|fa/{.j.xf,"LZ.K^bZy%c.W^/v{x#(J},Ua,ew#.##K(ki)$LX{a-1\\MG/zL&JlEKEw'Hg|D&{EfuKYM[nGKx1V#lFu^V_LjVzw+n%+,Xd`
      );
      const part3 =
        "x52e71nafqfbjXxZuEtpu92oJd6A9mWbd0BZTk72ZHUmDcKcqjfcEH19SWOphMJFYkxU5FRoIEr3/zisyTO4Mt33ZmwELOrY9PdlyAAyed7ZoH+hlTr7c025QROvb2LmqgRiUT56tMECgYEA+jH5m6iMRK6XjiBhSUnlr3DzRybwlQrtIj5sZprWe2my5uYHG3jbViYIO7GtQvMTnDrBCxNhuM6dPrL0cRnbsp/iBMXe3pyjT/aWveBkn4R+UpBsnbtDn28r1MZpCDtr5UNc0TPj4KFJvjnV/e8oGoyYEroECqcw1LqNOGDiLhkCgYEAwaemNePYrXW+MVX/hatfLQ96tpxwf7yuHdENZ2q5AFw73GJWYvC8VY+TcoKPAmeoCUMltI3TrS6K5Q/GoLd5K2BsoJrSxQNQFd3ehWAtdOuPDvQ5rn/2fsvgvc3rOvJh7uNnwEZCI/45WQg+UFWref4PPc+ArNtp9Xj2y7LndwkCgYARojIQeXmhYZjG6JtSugWZLuHGkwUDzChYcIPd";
      const part4 =
        "W25gdluokG/RzNvQn4+W/XfTryQjr7RpXm1VxCIrCBvYWNU2KrSYV4XUtL+B5ERNj6In6AOrOAifuVITy5cQQQeoD+AT4YKKMBkQfO2gnZzqb8+ox130e+3K/mufoqJPZeyrCQKBgC2fobjwhQvYwYY+DIUharri+rYrBRYTDbJYnh/PNOaw1CmHwXJt5PEDcml3+NlIMn58I1X2U/hpDrAIl3MlxpZBkVYFI8LmlOeR7ereTddN59ZOE4jY/OnCfqA480Jf+FKfoMHby5lPO5OOLaAfjtae1FhrmpUe3EfIx9wVuhKBAoGBAPFzHKQZbGhkqmyPW2ctTEIWLdUHyO37fm8dj1WjN4wjRAI4ohNiKQJRh3QE11E1PzBTl9lZVWT8QtEsSjnrA/tpGr378fcUT7WGBgTmBRaAnv1P1n/Tp0TSvh5XpIhhMuxcitIgrhYMIG3GbP9JNAarxO/qPW6Gi0xWaF7il7Or";

      const fullPem = part1 + part2 + part3 + part4;
      const formattedKey = `-----BEGIN PRIVATE KEY-----\n${fullPem}\n-----END PRIVATE KEY-----`;

      DramaboxApp.#privateKey = crypto.createPrivateKey({
        key: formattedKey,
        format: "pem",
      });
      // console.log(DramaboxApp.#privateKey);
    } catch (err) {
      console.error("[dramaboxapp] Failed to initialize private key:", err);
    }
  }

  static sign(str) {
    if (!DramaboxApp.#privateKey) DramaboxApp.#initPrivateKey();
    try {
      const sign = crypto.createSign("RSA-SHA256");
      sign.update(Buffer.from(str, "utf-8"));
      const signature = sign.sign(DramaboxApp.#privateKey);
      return signature.toString("base64");
    } catch (err) {
      console.error("[dramaboxapp] Sign error:", err);
      return null;
    }
  }

  static dramabox(str) {
    return DramaboxApp.sign(str);
  }
}

export function getSignatureHeaders(payload) {
  const timestamp = Date.now();

  const deviceId = headers["device-id"];
  const androidId = headers["android-id"];
  const tn = headers["tn"];

  const strPayload = `timestamp=${timestamp}${JSON.stringify(payload)}${deviceId}${androidId}${tn}`;
  const signature = DramaboxApp.dramabox(strPayload);
  return {
    signature: signature,
    timestamp: timestamp.toString()
  };
}

function randomLetters(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export const headers = {
  'User-Agent': 'okhttp/4.12.0',
  'Accept-Encoding': 'br,gzip',
  'version': '611',
  'package-name': 'com.storymatrix.drama',
  'p': '61',
  'cid': 'DLLPF1127624',
  'apn': '1',
  'country-code': 'KR',
  'mchid': 'DLLPF1127624',
  'mbid': '41000116646',
  'tz': '-540',
  'language': ko,
  'mcc': '450',
  'locale': 'ko_KR',
  'is_root': '0',
  'device-id': uuidv4(36),
  'nchid': 'DRA1000042',
  'instanceid': '',
  'md': 'SM-A042F',
  'store-source': 'store_google',
  'mf': 'SAMSUNG',
  'device-score': '60',
  'local-time': '2026-06-03 21:52:50.514 +0900',
  'time-zone': '+0900',
  'brand': 'samsung',
  'lat': '0',
  'is_emulator': '0',
  'current-language': ko,
  'ov': '13',
  'userid': '292895731',
  'afid': '1780494770547-2606434330543900105',
  'android-id': randomAndroidId(),
  'srn': '720x1600',
  'ins': '',
  'is_vpn': '1',
  'build': 'Build/TP1A.220624.014',
  'pline': 'ANDROID',
  'vn': '6.1.1',
  'over-flow': 'new-fly',
  'tn': 'Bearer ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnlaV2RwYzNSbGNsUjVjR1VpT2lKVVJVMVFJaXdpZFhObGNrbGtJam8xTkRJMU9URTNPVEY5LkZrNUhwejNsbFZRcXkxVmRrWEZ1OUF3bGRPZkl4Vnc0dVM1VWNHeTY2aEk=',
  'sn': 'SA6Pk+8fk7NsKeZXLp1dmJODj+OxMmdgSmStgBRhOMpEMOUzlFm+/Lj9P2D390UtbWcofFpixbLR7+gGVDQGA/8OVqcPErEG24YqlyQ935SH9ZL8BAywVB0M73xit2S6OdHemA/jO8zj6Dm+6PphLa1M7//v+xlEqc2k+0GhwBJAnXSHspibEmUtxXG3x/Mh3n5/qilRb0eK3ndyCy3uBtyDU+vmxr3K5WyTWuyVvm/76uIX5HXWpmkklV9M9Sfa5B9FaesDyaWRM1eIQMVSeX31b9U5Fd/v2tsqQwZgjOX5C4k6qa/14+Wzva6xnAy6wNRjazmAF8k/zYVYoFQfKA==',
  'st': `cK4n10B_0tTQBrxF${randomLetters()}`,
  'active-time': '7411',
  'content-type': 'application/json; charset=UTF-8'
}


// console.log(DramaboxApp.dramabox("test string"));
export const dramabox = DramaboxApp.dramabox;