// The date picker's numeric display is dd/mm/yyyy for every reader [datetime-M1,
// rule 52], whatever the reader's locale; `format: 'locale'` keeps the
// locale's own order for a consumer who asks for it.
//
// Red first: before 10.1.0 the picker wrote what `Intl` said for the browser's
// language, "09/04/2026" under en-US (month first) and "04.09.2026" under
// de-DE, so the same date read as two different days.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { datePattern, formatDate, parseDate } from '../js/locale.js';

const day = new Date(2026, 8, 4); // 4 September 2026

test('rule 52: a date is dd/mm/yyyy in every locale', () => {
    for (const locale of ['en-US', 'en-GB', 'nl-NL', 'de-DE', 'ja-JP', 'ar-EG', 'sv-SE', undefined]) {
        assert.equal(formatDate(day, locale, 'rule52'), '04/09/2026', String(locale));
    }
    assert.equal(formatDate(new Date(2026, 0, 1), 'en-US', 'rule52'), '01/01/2026');
});

test('rule 52: the hint and the order are day, month, year', () => {
    for (const locale of ['en-US', 'de-DE', 'ja-JP']) {
        const pattern = datePattern(locale, 'rule52');
        assert.deepEqual(pattern.parts, ['day', 'month', 'year']);
        assert.equal(pattern.hint, 'dd/mm/yyyy');
    }
});

test('rule 52: typing is read day first, whatever the locale', () => {
    for (const locale of ['en-US', 'ja-JP', 'de-DE']) {
        for (const text of ['04/09/2026', '4-9-2026', '04.09.2026', '4 9 26']) {
            const date = parseDate(text, locale, 'rule52');
            assert.ok(date, `${locale} ${text}`);
            assert.equal(formatDate(date, locale, 'rule52'), '04/09/2026');
        }
        assert.equal(parseDate('2026-09-04', locale, 'rule52')?.getDate(), 4, 'ISO still accepted');
        assert.equal(parseDate('31/02/2026', locale, 'rule52'), null, 'an impossible day is refused');
        assert.equal(parseDate('13/13/2026', locale, 'rule52'), null, 'a thirteenth month is refused');
    }
});

test("the locale's own order stays available as format 'locale'", () => {
    assert.equal(formatDate(day, 'en-US', 'locale'), '09/04/2026');
    assert.equal(formatDate(day, 'de-DE', 'locale'), '04.09.2026');
    assert.equal(datePattern('de-DE', 'locale').hint, 'dd.mm.yyyy');
    // The default of the library functions is unchanged: the locale.
    assert.equal(formatDate(day, 'en-US'), '09/04/2026');
    assert.equal(parseDate('09/04/2026', 'en-US')?.getDate(), 4);
});
