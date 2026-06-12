import { createHash, randomUUID } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed += 1;
    console.log(`PASS ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL ${name}`);
  }
}

function formatJson(input) {
  return JSON.stringify(JSON.parse(input), null, 2);
}

function encodeBase64(text) {
  return Buffer.from(text, "utf-8").toString("base64");
}

function decodeBase64(value) {
  return Buffer.from(value.trim(), "base64").toString("utf-8");
}

function decodeJwt(token) {
  const [header, payload, signature] = token.split(".");
  return {
    header: JSON.parse(Buffer.from(header, "base64url").toString("utf-8")),
    payload: JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")),
    signature,
  };
}

function getTextStats(text) {
  return {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
    lines: text.split(/\r?\n/).length,
  };
}

function findAndReplace(text, search, replacement, matchCase = false) {
  if (!search) return text;
  if (matchCase) return text.split(search).join(replacement);
  const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  return text.replace(regex, replacement);
}

function getCompressionStats(originalSize, compressedSize) {
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savedPercent =
    originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;
  return { originalSize, compressedSize, savedBytes, savedPercent };
}

assert("JSON format", formatJson('{"a":1}').includes('"a": 1'));
assert("Base64 encode/decode", decodeBase64(encodeBase64("PowerDesk")) === "PowerDesk");
assert("UUID format", /^[0-9a-f-]{36}$/.test(randomUUID()));
assert(
  "SHA-256 hash",
  createHash("sha256").update("PowerDesk").digest("hex").length === 64,
);
assert("JWT decode", decodeJwt(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUG93ZXJEZXNrIn0.x",
).payload.name === "PowerDesk");
assert("Text stats", getTextStats("one two three").words === 3);
assert(
  "Find and replace",
  findAndReplace("Hello PowerDesk", "powerdesk", "World", false) === "Hello World",
);
assert(
  "Compression stats",
  getCompressionStats(1000, 400).savedPercent === 60,
);

function analyzePlagiarism(text, referenceText) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 80) return { ok: false };

  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const unique = new Set(words);
  const uniqueWordRatio = words.length ? unique.size / words.length : 0;

  let penalty = uniqueWordRatio < 0.35 ? 12 : 0;
  if (referenceText?.trim()) {
    const a = new Set(words);
    const b = new Set(referenceText.toLowerCase().split(/\s+/).filter(Boolean));
    let overlap = 0;
    for (const word of a) if (b.has(word)) overlap += 1;
    const similarity = overlap / Math.max(a.size, b.size, 1);
    if (similarity > 0.35) penalty += 20;
  }

  return {
    ok: true,
    originalityScore: Math.max(5, 100 - penalty),
    uniqueWordRatio: Math.round(uniqueWordRatio * 100),
  };
}

assert(
  "Plagiarism short text rejected",
  analyzePlagiarism("too short").ok === false,
);
assert(
  "Plagiarism originality score",
  analyzePlagiarism(
    "This is a sufficiently long original paragraph with unique wording and structure for testing plagiarism analysis in PowerDesk workspace tools.",
  ).originalityScore >= 75,
);

async function runAsyncTests() {
  const docA = await PDFDocument.create();
  docA.addPage();
  docA.addPage();
  const docB = await PDFDocument.create();
  docB.addPage();
  const bytesA = await docA.save();
  const bytesB = await docB.save();

  const merged = await PDFDocument.create();
  const pdfA = await PDFDocument.load(bytesA);
  const pdfB = await PDFDocument.load(bytesB);
  const pagesA = await merged.copyPages(pdfA, pdfA.getPageIndices());
  const pagesB = await merged.copyPages(pdfB, pdfB.getPageIndices());
  pagesA.forEach((page) => merged.addPage(page));
  pagesB.forEach((page) => merged.addPage(page));
  assert("PDF merge page count", merged.getPageCount() === 3);

  const splitSource = await PDFDocument.load(bytesA);
  const splitOutput = await PDFDocument.create();
  const [singlePage] = await splitOutput.copyPages(splitSource, [0]);
  splitOutput.addPage(singlePage);
  assert("PDF split single page", splitOutput.getPageCount() === 1);

  const zip = new JSZip();
  zip.file("hello.txt", "PowerDesk archive");
  zip.file("nested/readme.md", "# PowerDesk");
  const zipBlob = await zip.generateAsync({ type: "nodebuffer" });
  const loaded = await JSZip.loadAsync(zipBlob);
  const names = Object.keys(loaded.files).filter((name) => !loaded.files[name].dir);
  assert("ZIP create entries", names.includes("hello.txt") && names.includes("nested/readme.md"));

  const extracted = await loaded.file("hello.txt").async("string");
  assert("ZIP extract content", extracted === "PowerDesk archive");

  const paddedZip = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 1 },
  });
  const loadedPadded = await JSZip.loadAsync(paddedZip);
  const recompressed = await loadedPadded.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
  assert(
    "ZIP re-compress",
    recompressed.length <= paddedZip.length || paddedZip.length < 100,
  );
}

await runAsyncTests();

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
