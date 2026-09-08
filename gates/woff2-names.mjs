// The name records of a woff2 file, read by the gate itself [R6-Q1, AR39].
//
// A family that carries a Reserved Font Name ships as a renamed subset,
// and the claim "the file carries the new name and none of the reserved
// word" has to be measured on the file, not on the plan that says so.
// This reads the WOFF2 container (a header, a table directory with
// UIntBase128 lengths, one Brotli stream for every table) far enough to
// find the `name` table and decode its records. Nothing else is parsed.

import { brotliDecompressSync } from 'node:zlib';

/** The known table tags of the WOFF2 directory, by index (the spec's list). */
const KNOWN_TAGS = [
    'cmap',
    'head',
    'hhea',
    'hmtx',
    'maxp',
    'name',
    'OS/2',
    'post',
    'cvt ',
    'fpgm',
    'glyf',
    'loca',
    'prep',
    'CFF ',
    'VORG',
    'EBDT',
    'EBLC',
    'gasp',
    'hdmx',
    'kern',
    'LTSH',
    'PCLT',
    'VDMX',
    'vhea',
    'vmtx',
    'BASE',
    'GDEF',
    'GPOS',
    'GSUB',
    'EBSC',
    'JSTF',
    'MATH',
    'CBDT',
    'CBLC',
    'COLR',
    'CPAL',
    'SVG ',
    'sbix',
    'acnt',
    'avar',
    'bdat',
    'bloc',
    'bsln',
    'cvar',
    'fdsc',
    'feat',
    'fmtx',
    'fvar',
    'gvar',
    'hsty',
    'just',
    'lcar',
    'mort',
    'morx',
    'opbd',
    'prop',
    'trak',
    'Zapf',
    'Silf',
    'Glat',
    'Gloc',
    'Feat',
    'Sill',
];

/**
 * @param {Buffer} buffer
 * @param {{ at: number }} cursor
 */
function base128(buffer, cursor) {
    let value = 0;
    for (let i = 0; i < 5; i++) {
        const byte = buffer[cursor.at++];
        value = value * 128 + (byte & 0x7f);
        if ((byte & 0x80) === 0) return value;
    }
    throw new Error('UIntBase128 longer than five bytes');
}

/**
 * Every name record of the file: `{ id, text }`, platform 3 (UTF-16BE) and
 * platform 1 (ASCII) decoded, others skipped.
 *
 * @param {Buffer} buffer the woff2 file
 * @returns {{ id: number, text: string }[]}
 */
export function nameRecords(buffer) {
    if (buffer.toString('latin1', 0, 4) !== 'wOF2') throw new Error('not a woff2 file');
    const numTables = buffer.readUInt16BE(12);
    const totalCompressedSize = buffer.readUInt32BE(20);
    const cursor = { at: 48 };
    /** @type {{ tag: string, length: number }[]} */
    const tables = [];
    for (let i = 0; i < numTables; i++) {
        const flags = buffer[cursor.at++];
        const index = flags & 0x3f;
        const version = flags >> 6;
        let tag;
        if (index === 63) {
            tag = buffer.toString('latin1', cursor.at, cursor.at + 4);
            cursor.at += 4;
        } else tag = KNOWN_TAGS[index] ?? `#${index}`;
        const origLength = base128(buffer, cursor);
        const transformed = tag === 'glyf' || tag === 'loca' ? version === 0 : version !== 0;
        const length = transformed ? base128(buffer, cursor) : origLength;
        tables.push({ tag, length });
    }
    const data = brotliDecompressSync(buffer.subarray(cursor.at, cursor.at + totalCompressedSize));
    let offset = 0;
    /** @type {Buffer | null} */
    let name = null;
    for (const table of tables) {
        if (table.tag === 'name') name = data.subarray(offset, offset + table.length);
        offset += table.length;
    }
    if (name === null) return [];
    const count = name.readUInt16BE(2);
    const stringOffset = name.readUInt16BE(4);
    /** @type {{ id: number, text: string }[]} */
    const out = [];
    for (let i = 0; i < count; i++) {
        const at = 6 + i * 12;
        const platform = name.readUInt16BE(at);
        const id = name.readUInt16BE(at + 6);
        const length = name.readUInt16BE(at + 8);
        const start = stringOffset + name.readUInt16BE(at + 10);
        const bytes = name.subarray(start, start + length);
        if (platform === 3 || platform === 0)
            out.push({ id, text: bytes.toString('utf16le') === '' ? '' : Buffer.from(bytes).swap16().toString('utf16le') });
        else if (platform === 1) out.push({ id, text: bytes.toString('latin1') });
    }
    return out;
}
