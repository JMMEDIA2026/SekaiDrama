import crypto from "crypto";
import { execSync } from "child_process";
import https from "https";
import http from "http";
import fs from "fs";
import { DramaboxApp, headers, getSignatureHeaders } from "./sign.js";
import { ko } from "./language.js";
import token from "./token.js";
import { v4 as uuidv4 } from "uuid";

function getRandomNumber() {
    return Math.floor(Math.random() * 2) + 1;
}

const randomdrama = async () => {
    try {
        const payload = {
            "pageNo": getRandomNumber(), // default 1
            "pageFlag": "", // ini harusnya hilang
            "startType": 0,
            "firstStartUp": false
        }

        // Coba generate signature saja untuk tes
        const testSig = getSignatureHeaders(payload);
        // console.log(testSig);

        // console.log(DramaboxApp.dramabox("test string"));

        const url = `https://sapi.dramaboxdb.com/drama-box/he001/recommendChannel?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET RANDOM DRAMA`);
        return res.data.chapterList
    } catch (error) {
        throw error;
    }
}

const latest = async () => {
    try {
        const payload = {
            "rankType": 3
        }

        // Coba generate signature saja untuk tes
        const testSig = getSignatureHeaders(payload);
        // console.log(testSig);

        // console.log(DramaboxApp.dramabox("test string"));

        const url = `https://sapi.dramaboxdb.com/drama-box/he001/rank?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET LATEST`);
        return res.data.rankList
    } catch (error) {
        throw error;
    }
}

const search = async (keyword) => {
    try {
        const payload = {
            keyword: keyword, // keyword pencarian
        }

        const testSig = getSignatureHeaders(payload);

        const url = `https://sapi.dramaboxdb.com/drama-box/search/suggest?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET SEARCH`);
        // console.log(res.data.suggestList); 
        return res.data.suggestList;
    } catch (error) {
        throw error;
    }
}

// Biasanya token limit karena terlalu sering request (limit IP)
// jadi sarankan untuk pakai proxy
async function tokenx() {
    try {
        const data = fs.readFileSync(new URL('./token2.json', import.meta.url), 'utf-8');
        const tokens = JSON.parse(data);
        const randomItem = tokens[Math.floor(Math.random() * tokens.length)];
        return randomItem.token;
    } catch (e) {
        console.error("Error reading token2.json:", e);
        return null;
    }
}

function randomAndroidId() {
    return "00000000" + crypto.randomBytes(8).toString("hex") + "00000000";
}

// 1. LIMITER CONFIG (Tetap pakai limiter agar RAM 1GB aman)
const MAX_CONCURRENT_REQUESTS = 10;
let activeRequests = 0;
const queue = [];

// 2. CACHE SYSTEM
// 120 menit (2 jam)
const cache = new Map();
const CACHE_DURATION = 120 * 60 * 1000;

function randomLetters(length = 5) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

// Template Header
const BASE_HEADERS = {
    "accept-encoding": "gzip",
    "active-time": "48610",
    "afid": "1765426707100-3399426610238541236",
    "android-id": randomAndroidId(),
    "apn": "0",
    "brand": "vivo",
    "build": "Build/PQ3A.190705.09121607",
    "cid": "DAUAG1050238",
    "connection": "Keep-Alive",
    "content-type": "application/json; charset=UTF-8",
    "country-code": "KR",
    "current-language": ko,
    "device-id": uuidv4(36),
    "device-score": "55",
    "host": "sapi.dramaboxdb.com",
    "ins": "1765426707269",
    "instanceid": "8f1ff8f305a5fe5a1a09cb6f0e6f1265",
    "is_emulator": "0",
    "is_root": "1",
    "is_vpn": "1",
    "language": ko,
    "lat": "0",
    "local-time": "2025-12-11 12:32:12.278 +0900",
    "locale": "ko_KR",
    "mbid": "60000000000",
    "mcc": "450",
    "mchid": "DAUAG1050238",
    "md": "V2309A",
    "mf": "VIVO",
    "nchid": "DRA1000042",
    "ov": "9",
    "over-flow": "new-fly",
    "p": "61",
    "package-name": "com.storymatrix.drama",
    "pline": "ANDROID",
    "srn": "900x1600",
    "store-source": "store_google",
    "time-zone": "+0900",
    "tn": "",
    "tz": "-540",
    "user-agent": "okhttp/4.10.0",
    "userid": "359146421",
    "version": "611",
    "vn": "6.1.1",
    "st": `cK4n10B_0tTQBrxF${randomLetters()}`
}

// Fungsi Helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- HELPER: CURL POST (bypass Akamai TLS fingerprint detection) ---
function curlPost(url, payload, requestHeaders, options = {}) {
    const curl = process.platform === 'win32' ? 'curl.exe' : 'curl';
    const curlHeaders = Object.entries(requestHeaders)
        .filter(([k, v]) => v !== '' && v !== undefined && k.toLowerCase() !== 'accept-encoding')
        .map(([k, v]) => `-H "${k}: ${v}"`)
        .join(' ');
    const bodyStr = JSON.stringify(payload).replace(/"/g, '\\"');
    const cmd = `${curl} -sS --fail --compressed -X POST "${url}" ${curlHeaders} -d "${bodyStr}"`;

    const out = execSync(cmd, {
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024 * 10,
        timeout: options.timeout || 60000
    });

    try {
        return JSON.parse(out);
    } catch {
        throw new Error(`curl 응답 파싱 실패 (HTTP 오류일 수 있음): ${out.slice(0, 200)}`);
    }
}

// --- HELPER: AMBIL TOKEN STRING ---
async function fetchTokenString() {
    try {
        if (tokenx()) {
            return tokenx();
        }
        return null;
    } catch (e) {
        console.error("❌ Gagal fetch token list:", e.message);
        return null;
    }
}

// --- HELPER: SIGNATURE ---
function generateSignature(payload, currentHeaders) {
    const timestamp = Date.now();
    const deviceId = currentHeaders["device-id"];
    const androidId = currentHeaders["android-id"];
    const tn = currentHeaders["tn"];

    const strPayload = `timestamp=${timestamp}${JSON.stringify(payload)}${deviceId}${androidId}${tn}`;
    const signature = DramaboxApp.dramabox(strPayload);
    return {
        signature: signature,
        timestamp: timestamp.toString()
    };
}

// --- QUEUE PROCESSOR ---
async function runWithLimit(fn) {
    if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        await new Promise(resolve => queue.push(resolve));
    }

    activeRequests++;
    try {
        return await fn();
    } finally {
        activeRequests--;
        if (queue.length > 0) {
            const next = queue.shift();
            next();
        }
    }
}

// ================= MAIN FUNCTION (EXPORTED) =================
const linkStream = async (targetBookId) => {

    // CACHING
    const cachedData = cache.get(targetBookId);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        console.log(`⚡ [CACHE] ID: ${targetBookId} - Cache Size: ${cache.size}`);
        cache.delete(targetBookId);
        cache.set(targetBookId, cachedData)
        return cachedData.data;
    }

    return runWithLimit(async () => {
        const resultData = await scrapeProcess(targetBookId);

        if (resultData && resultData.length > 0) {
            cache.set(targetBookId, {
                data: resultData,
                timestamp: Date.now()
            });
            if (cache.size > 700) {
                console.log(`⚡ [CACHE] Size: ${cache.size}, delete cache`);
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
        }

        return resultData;
    });
};

// ================= CORE SCRAPING LOGIC =================
async function scrapeProcess(targetBookId) {
    let savedPayChapterNum = 0;
    let result = [];

    const localHeaders = { ...BASE_HEADERS };

    console.log(`🚀 Start [${activeRequests}/${MAX_CONCURRENT_REQUESTS}]: ${targetBookId}`);

    // TOKEN AWAL
    const initToken = await fetchTokenString();
    if (initToken) {
        localHeaders["tn"] = `Bearer ${initToken}`;
    } else {
        console.error(`❌ Gagal dapat token awal untuk ${targetBookId}`);
        return [];
    }

    // INTERNAL FETCH
    async function fetchBatch(index, bookId, isRetry = false) {
        const payload = {
            "boundaryIndex": 0,
            "comingPlaySectionId": -1,
            "index": index,
            "currencyPlaySourceName": "首页发现_Untukmu_推荐列表",
            "rid": "",
            "enterReaderChapterIndex": 0,
            "loadDirection": 1,
            "startUpKey": "10942710-5e9e-48f2-8927-7c387e6f5fac",
            "bookId": bookId,
            "currencyPlaySource": "discover_175_rec",
            "needEndRecommend": 0,
            "preLoad": false,
            "pullCid": ""
        };

        const currentSig = generateSignature(payload, localHeaders);
        const url = `https://sapi.dramaboxdb.com/drama-box/chapterv2/batch/load?timestamp=${currentSig.timestamp}`;
        const requestHeaders = { ...localHeaders, 'sn': currentSig.signature };

        try {
            const res = curlPost(url, payload, requestHeaders);

            // Validasi Response
            if (!res || !res.data || !res.data.chapterList || res.data.chapterList.length === 0) {
                // Ignore error message jika sedang unlock payChapterNum (misal fetch -1, hasilnya error, tetap dianggap sukses unlock)
                if (index !== savedPayChapterNum) {
                    // Throw error agar masuk ke catch dan trigger refresh token
                    throw new Error("Soft Error: Data kosong / Token Expired");
                }
            }
            return res.data;

        } catch (error) {
            if (!isRetry) {
                // REFRESH TOKEN
                const newToken = await fetchTokenString();

                if (newToken) {
                    localHeaders["tn"] = `Bearer ${newToken}`;

                    // --- PERBAIKAN LOGIKA PAY CHAPTER ---
                    // Cek: savedPayChapterNum TIDAK SAMA DENGAN 0. 
                    // Artinya: Angka positif (13, 15) atau negatif (-1) akan diproses.
                    // Jika savedPayChapterNum == -1, maka kondisi (-1 !== 0) adalah TRUE, jadi fetch(-1) dijalankan.
                    if (savedPayChapterNum !== 0 && index !== savedPayChapterNum) {
                        // console.log(`🔓 Unlocking trigger ${savedPayChapterNum}...`);
                        await fetchBatch(savedPayChapterNum, bookId, true).catch(() => { });
                        await delay(1000);
                    }

                    // Langsung coba lagi ambil chapter target
                    await delay(1500);
                    return fetchBatch(index, bookId, true);
                }
            }
            return null;
        }
    }

    // FLOW UTAMA
    try {
        const firstBatchData = await fetchBatch(1, targetBookId);

        if (firstBatchData) {
            const totalChapters = firstBatchData.chapterCount;
            const bookName = firstBatchData.bookName;

            // Simpan PayChapterNum
            // Jika API return -1, variabel ini jadi -1. 
            if (firstBatchData.payChapterNum !== undefined) {
                savedPayChapterNum = firstBatchData.payChapterNum;
            }

            console.log(`📖 [${targetBookId}] ${bookName} (${totalChapters} eps) | PayEps: ${savedPayChapterNum}`);

            if (firstBatchData.chapterList) {
                result.push(...firstBatchData.chapterList);
            }

            let currentIdx = 6;
            let retryCount = 0;
            let consecutiveSkips = 0;
            const MAX_RETRIES = 3;

            while (currentIdx <= totalChapters) {
                const batchData = await fetchBatch(currentIdx, targetBookId);

                let isValid = false;
                if (batchData && batchData.chapterList && batchData.chapterList.length > 0) {
                    const receivedIndex = batchData.chapterList[0].chapterIndex;
                    if (receivedIndex >= (currentIdx - 5)) {
                        isValid = true;
                    }
                }

                if (isValid) {
                    result.push(...batchData.chapterList);
                    currentIdx += 5;
                    retryCount = 0;
                    consecutiveSkips = 0;
                } else {
                    retryCount++;
                    console.log(`❌ [${targetBookId}] Gagal idx ${currentIdx}. (${retryCount}/${MAX_RETRIES})`);

                    if (retryCount >= MAX_RETRIES) {
                        console.error(`🚨 [${targetBookId}] Skip idx ${currentIdx}.`);
                        currentIdx += 5;
                        retryCount = 0;
                        consecutiveSkips++;

                        if (consecutiveSkips >= 2) {
                            console.error(`💀 [${targetBookId}] Terlalu banyak error beruntun. Stop.`);
                            break;
                        }

                    } else {
                        await delay(2000 + (Math.random() * 1000));
                    }
                }

                await delay(800);
            }
        } else {
            console.log(`⚠️ [${targetBookId}] Gagal Batch 1.`);
        }

        const uniqueResult = Array.from(new Map(result.map(item => [item.chapterId, item])).values());
        uniqueResult.sort((a, b) => a.chapterIndex - b.chapterIndex);

        console.log(`✅ DONE [${targetBookId}]. Total: ${uniqueResult.length}`);

        return uniqueResult;

    } catch (error) {
        console.error(`Critical Error [${targetBookId}]:`, error.message);
        return [];
    }
}

const populersearch = async () => {
    try {
        const payload = {
            "rankType": 2
        }


        // Coba generate signature saja untuk tes
        const testSig = getSignatureHeaders(payload);
        // console.log(testSig);

        // console.log(DramaboxApp.dramabox("test string"));

        const url = `https://sapi.dramaboxdb.com/drama-box/he001/rank?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET POPULERSEARCH`);
        return res.data.rankList
    } catch (error) {
        throw error;
    }
}

const trendings = async () => {
    try {
        const payload = {
            "rankType": 1
        }


        // Coba generate signature saja untuk tes
        const testSig = getSignatureHeaders(payload);
        // console.log(testSig);

        // console.log(DramaboxApp.dramabox("test string"));

        const url = `https://sapi.dramaboxdb.com/drama-box/he001/rank?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET TRENDING`);
        return res.data.rankList;
    } catch (error) {
        throw error;
    }
}

const foryou = async () => {
    try {
        const payload = {
            "isNeedRank": 1,
            "specialColumnId": 0,
            "pageNo": getRandomNumber()
        }

        // Coba generate signature saja untuk tes
        const testSig = getSignatureHeaders(payload);
        // console.log(testSig);

        // console.log(DramaboxApp.dramabox("test string"));

        const url = `https://sapi.dramaboxdb.com/drama-box/he001/recommendBook?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET FORYOU`);
        return res.data.recommendList.records;
    } catch (error) {
        throw error;
    }
}

const foryouPage = async (pageNo = 1) => {
    try {
        const payload = {
            "isNeedRank": 1,
            "specialColumnId": 0,
            "pageNo": pageNo
        }

        const testSig = getSignatureHeaders(payload);
        const url = `https://sapi.dramaboxdb.com/drama-box/he001/recommendBook?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET FORYOU PAGE ${pageNo}`);
        return res.data.recommendList.records;
    } catch (error) {
        throw error;
    }
}

const vip = async () => {
    try {
        const payload = {
            "homePageStyle": 0,
            "isNeedRank": 1,
            "index": 4,
            "type": 0,
            "channelId": 205
        }

        // Coba generate signature saja untuk tes
        const testSig = getSignatureHeaders(payload);
        // console.log(testSig);

        // console.log(DramaboxApp.dramabox("test string"));

        const url = `https://sapi.dramaboxdb.com/drama-box/he001/theater?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET VIP`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

const detail = async (bookId) => {
    try {
        const payload = {
            bookId: bookId,
        }
        const testSig = getSignatureHeaders(payload);
        const url = `https://sapi.dramaboxdb.com/drama-box/he001/reserveBookDetail?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET DETAIL`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

const dubindo = async (classify, page) => {
    try {
        const payload = {
            "typeList": [
                {
                    "type": 1,
                    "value": ""
                },
                {
                    "type": 2,
                    "value": "1"
                },
                {
                    "type": 3,
                    "value": ""
                },
                {
                    "type": 4,
                    "value": ""
                },
                {
                    "type": 4,
                    "value": ""
                },
                {
                    "type": 5,
                    "value": classify // 1 = terpopuler, 2 = terbaru
                }
            ],
            "showLabels": false,
            "pageNo": page,
            "pageSize": 15
        }

        // Coba generate signature saja untuk tes
        const testSig = getSignatureHeaders(payload);
        // console.log(testSig);

        // console.log(DramaboxApp.dramabox("test string"));

        const url = `https://sapi.dramaboxdb.com/drama-box/he001/classify?timestamp=${testSig.timestamp}`;
        const requestHeaders = {
            ...headers,
            'sn': testSig.signature
        };
        const res = curlPost(url, payload, requestHeaders)
        console.log(`✅ SUCCESS GET DUB INDO`);
        return res.data.classifyBookList.records;
    } catch (error) {
        throw error;
    }
}

// ==================== DRAMABOX PURE DECRYPTOR ====================
const MASTER_KEY = Buffer.from('6eba09062155dcd2', 'utf8');

function _findBox(buf, s, e, t) {
    let p = s;
    while (p + 8 <= e) {
        const sz = buf.readUInt32BE(p);
        const tp = buf.toString('ascii', p + 4, p + 8);
        if (sz < 8) break;
        if (tp === t) return { s: p, e: Math.min(p + sz, e), d: p + 8 };
        p += sz;
    }
    return null;
}

function _extractAliyunUri(data) {
    const keysStr = Buffer.from('keys');
    let ki = data.indexOf(keysStr);
    while (ki !== -1) {
        if (ki >= 4) {
            const boxSz = data.readUInt32BE(ki - 4);
            if (boxSz > 20 && boxSz < 10000) {
                ki -= 4;
                const keysSize = data.readUInt32BE(ki);
                const keysData = data.slice(ki + 8, ki + keysSize);
                const cnt = keysData.readUInt32BE(4);
                const names = [];
                let kp = 8;
                for (let i = 0; i < cnt && kp + 8 < keysData.length; i++) {
                    const ks = keysData.readUInt32BE(kp);
                    names.push(keysData.toString('utf8', kp + 8, kp + ks));
                    kp += ks;
                }
                const ilstBuf = Buffer.from('ilst');
                let ilstIdx = data.indexOf(ilstBuf, ki);
                if (ilstIdx !== -1) {
                    ilstIdx -= 4;
                    const ilstSize = data.readUInt32BE(ilstIdx);
                    const ilst = data.slice(ilstIdx + 8, ilstIdx + ilstSize);
                    let pos = 0;
                    while (pos + 8 < ilst.length) {
                        const itemSz = ilst.readUInt32BE(pos);
                        if (itemSz < 8) break;
                        const idx = ilst.readUInt32BE(pos + 4);
                        if (pos + 24 <= pos + itemSz) {
                            const dSz = ilst.readUInt32BE(pos + 8);
                            const dTag = ilst.toString('ascii', pos + 12, pos + 16);
                            if (dTag === 'data' && dSz > 16) {
                                const val = ilst.slice(pos + 24, pos + 8 + dSz);
                                const kn = names[idx - 1] || '';
                                if (kn.includes('PrivateKeyUri'))
                                    return val.toString('utf8').trim();
                            }
                        }
                        pos += itemSz;
                    }
                }
                break;
            }
        }
        ki = data.indexOf(keysStr, ki + 5);
    }
    return null;
}

function _deriveAESKey(aliyunB64) {
    const encBlob = Buffer.from(aliyunB64, 'base64');
    const d1 = crypto.createDecipheriv('aes-128-cbc', MASTER_KEY, MASTER_KEY);
    d1.setAutoPadding(true);
    let jsonBuf = d1.update(encBlob);
    jsonBuf = Buffer.concat([jsonBuf, d1.final()]);
    const json = JSON.parse(jsonBuf.toString('utf8'));
    const { ClientRand, ServerRand, PlainText } = json;

    const md5cr = crypto.createHash('md5').update(ClientRand).digest();
    const keyA = md5cr.slice(4, 12).toString('hex');
    const keyAbuf = Buffer.from(keyA, 'utf8');

    const srBytes = Buffer.from(ServerRand, 'base64');
    const d2 = crypto.createDecipheriv('aes-128-cbc', keyAbuf, keyAbuf);
    d2.setAutoPadding(true);
    let srDec = d2.update(srBytes);
    srDec = Buffer.concat([srDec, d2.final()]);

    const md5c = crypto.createHash('md5').update(ClientRand + srDec.toString('utf8')).digest();
    const keyB = md5c.slice(4, 12).toString('hex');
    const keyBbuf = Buffer.from(keyB, 'utf8');

    const ptBytes = Buffer.from(PlainText, 'base64');
    const d3 = crypto.createDecipheriv('aes-128-cbc', keyBbuf, keyAbuf);
    d3.setAutoPadding(true);
    let ptDec = d3.update(ptBytes);
    ptDec = Buffer.concat([ptDec, d3.final()]);
    return Buffer.from(ptDec.toString('utf8'), 'base64');
}

function _parseStsz(b, s, e) { const x = _findBox(b, s, e, 'stsz'); if (!x) return []; const d = x.d, def = b.readUInt32BE(d + 4), n = b.readUInt32BE(d + 8), r = []; if (def === 0) { for (let i = 0; i < n; i++)r.push(b.readUInt32BE(d + 12 + i * 4)); } else { for (let i = 0; i < n; i++)r.push(def); } return r; }
function _parseStco(b, s, e) { let x = _findBox(b, s, e, 'stco'); if (x) { const n = b.readUInt32BE(x.d + 4), r = []; for (let i = 0; i < n; i++)r.push(b.readUInt32BE(x.d + 8 + i * 4)); return r; } x = _findBox(b, s, e, 'co64'); if (x) { const n = b.readUInt32BE(x.d + 4), r = []; for (let i = 0; i < n; i++)r.push(Number(b.readBigUInt64BE(x.d + 8 + i * 8))); return r; } return []; }
function _parseStsc(b, s, e) { const x = _findBox(b, s, e, 'stsc'); if (!x) return []; const n = b.readUInt32BE(x.d + 4), r = []; for (let i = 0; i < n; i++)r.push({ fc: b.readUInt32BE(x.d + 8 + i * 12), spc: b.readUInt32BE(x.d + 12 + i * 12) }); return r; }

function _getSamples(b, ss, se) {
    const sz = _parseStsz(b, ss, se), ch = _parseStco(b, ss, se), sc = _parseStsc(b, ss, se);
    const r = []; let si = 0;
    for (let ci = 0; ci < ch.length; ci++) { let spc = 1; for (let j = sc.length - 1; j >= 0; j--)if (ci + 1 >= sc[j].fc) { spc = sc[j].spc; break; } let off = ch[ci]; for (let k = 0; k < spc && si < sz.length; k++) { r.push({ offset: off, size: sz[si] }); off += sz[si]; si++; } }
    return r;
}

function _parseTracks(b) {
    const m = _findBox(b, 0, b.length, 'moov');
    if (!m) return { video: [], audio: [] };
    const result = { video: [], audio: [] };
    let p = m.d;
    while (p + 8 <= m.e) {
        const sz = b.readUInt32BE(p), tp = b.toString('ascii', p + 4, p + 8), te = Math.min(p + sz, m.e);
        if (tp === 'trak') {
            const md = _findBox(b, p + 8, te, 'mdia');
            if (md) {
                const hd = _findBox(b, md.d, md.e, 'hdlr');
                if (hd) {
                    const ht = b.toString('ascii', hd.d + 8, hd.d + 12);
                    const mi = _findBox(b, md.d, md.e, 'minf');
                    if (mi) {
                        const st = _findBox(b, mi.d, mi.e, 'stbl');
                        if (st) {
                            const s = _getSamples(b, st.d, st.e);
                            if (ht === 'vide') result.video = s;
                            else if (ht === 'soun') result.audio = s;
                        }
                    }
                }
            }
        }
        p = te;
    }
    return result;
}

function _downloadBuffer(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        const parsed = new URL(url);
        const options = {
            hostname: parsed.hostname,
            path: parsed.pathname + parsed.search,
            port: parsed.port,
            timeout: 120000,
            headers: {
                'User-Agent': 'okhttp/4.10.0',
                'Accept': '*/*',
                'Accept-Encoding': 'identity',
            }
        };
        const req = mod.get(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return _downloadBuffer(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Download timeout')); });
    });
}

/**
 * Download encrypted DramaBox video → extract key → decrypt → return Buffer
 * @param {string} encryptedUrl - URL video terenkripsi dari CDN DramaBox
 * @returns {Promise<{buffer: Buffer, key: string|null, tracks: {video: number, audio: number}}>}
 */
const decryptDramaboxVideo = async (encryptedUrl) => {
    // console.log(`[DramaBox-Decrypt] Downloading...`);
    const data = await _downloadBuffer(encryptedUrl);
    // console.log(`[DramaBox-Decrypt] Downloaded ${(data.length / 1048576).toFixed(1)} MB`);

    const b64 = _extractAliyunUri(data);
    if (!b64) return { buffer: data, key: null, tracks: { video: 0, audio: 0 } };

    const aesKey = _deriveAESKey(b64);
    // console.log(`[DramaBox-Decrypt] Key: ${aesKey.toString('hex')}`);

    const output = Buffer.from(data);
    const tracks = _parseTracks(data);
    let pv = 0, pa = 0;

    for (const s of tracks.video) {
        if (s.size < 16) continue;
        const nB = Math.floor(s.size / 16);
        const enc = data.slice(s.offset, s.offset + nB * 16);
        const d = crypto.createDecipheriv('aes-128-ecb', aesKey, null);
        d.setAutoPadding(false);
        let dec = d.update(enc); dec = Buffer.concat([dec, d.final()]);
        dec.copy(output, s.offset); pv++;
    }
    for (const s of tracks.audio) {
        if (s.size < 16) continue;
        const nB = Math.floor(s.size / 16);
        const enc = data.slice(s.offset, s.offset + nB * 16);
        const d = crypto.createDecipheriv('aes-128-ecb', aesKey, null);
        d.setAutoPadding(false);
        let dec = d.update(enc); dec = Buffer.concat([dec, d.final()]);
        dec.copy(output, s.offset); pa++;
    }

    // console.log(`[DramaBox-Decrypt] Done: ${pv} video + ${pa} audio samples`);
    return { buffer: output, key: aesKey.toString('hex'), tracks: { video: pv, audio: pa } };
};

export { latest, search, linkStream, trendings, foryou, foryouPage, populersearch, randomdrama, vip, detail, dubindo, decryptDramaboxVideo };
export default { latest, search, linkStream, trendings, foryou, foryouPage, populersearch, randomdrama, vip, detail, dubindo, decryptDramaboxVideo };