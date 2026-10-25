#!/usr/bin/env node
/*
 * Animax shared-styles refactor.
 * Usage (from project root, after npm install):
 *   node refactor-styles.cjs           # preview only
 *   node refactor-styles.cjs --write   # apply changes
 *   node refactor-styles.cjs --check   # exit 1 when refactoring is available
 *
 * Uses project's TypeScript parser, preserving component logic and style overrides.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const ROOT = process.cwd();
const STYLES_FILE = path.join(ROOT, 'src', 'styles', 'index.ts');
const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check');

const patterns = [
    // Existing global classes are reused first.
    { name: 'SectionInputIcon', min: 1 },
    { name: 'HeaderScreenIcon', min: 1 },
    { name: 'Section', min: 2 },
    { name: 'Input', min: 2 },
    { name: 'ModalContainer', min: 2 },
    { name: 'MiniModalContainer', min: 2 },

    // New classes are added only when shared by at least two different styles.
    { name: 'AuthTitle', min: 2, props: {
        marginTop: '25', color: 'COLOR_TEXT_PRIMARY', fontFamily: "'Outfit'",
        fontSize: '26', fontWeight: "'600'",
    } },
    { name: 'AuthTitleContainer', min: 2, props: {
        width: "'100%'", alignItems: "'center'", justifyContent: "'center'",
    } },
    { name: 'AuthTitleImage', min: 2, props: {
        width: '115', height: '115',
    } },
    { name: 'AuthContainer', min: 2, props: {
        width: "'90%'", height: "'100%'",
    } },
    { name: 'AuthScreen', min: 2, props: {
        alignItems: "'center'", paddingBottom: '25',
    } },
    { name: 'ModalImage', min: 2, props: {
        marginTop: '15', width: '270', height: '270',
    } },
    { name: 'ModalTitle', min: 2, props: {
        marginTop: '20', color: 'COLOR_PRIMARY', fontFamily: "'Outfit'", fontSize: '24',
    } },
    { name: 'ModalText', min: 2, props: {
        marginTop: '15', color: 'COLOR_TEXT_PRIMARY', fontFamily: "'Outfit'",
        fontSize: '14', width: "'80%'", textAlign: "'center'",
    } },
    { name: 'ModalPanel', min: 3, props: {
        backgroundColor: 'COLOR_BACKGROUND_SECONDARY', alignItems: "'center'",
    } },
    { name: 'ModalShelf', min: 2, props: {
        width: '40', height: '4', backgroundColor: "'#424242'",
        borderRadius: '20', alignSelf: "'center'", marginTop: '8',
    } },
    { name: 'ModalLine', min: 2, props: {
        width: "'90%'", height: '1', backgroundColor: "'#424242'",
        borderRadius: '50', alignSelf: "'center'", marginTop: '16',
    } },
    { name: 'ErrorText', min: 2, props: {
        marginTop: '5', color: "'red'", fontFamily: "'Outfit'",
        justifyContent: "'center'", textAlign: "'center'",
    } },
    { name: 'FullScreen', min: 3, props: {
        width: "'100%'", height: "'100%'", alignItems: "'center'",
    } },
    { name: 'Center', min: 3, props: {
        justifyContent: "'center'", alignItems: "'center'",
    } },
    { name: 'RowCenter', min: 3, props: {
        flexDirection: "'row'", alignItems: "'center'",
    } },
    { name: 'FullSize', min: 3, props: {
        width: "'100%'", height: "'100%'",
    } },
    { name: 'TextPrimary', min: 3, props: {
        color: 'COLOR_TEXT_PRIMARY', fontFamily: "'Outfit'",
    } },
];

function die(message) {
    console.error('ERROR: ' + message);
    process.exit(2);
}

function walk(dir, files = []) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        if (item.name.startsWith('.') || item.name === 'node_modules') continue;
        const abs = path.join(dir, item.name);
        if (item.isDirectory()) walk(abs, files);
        else if (/\.(tsx?|jsx?)$/.test(item.name) && !item.name.endsWith('.d.ts') && abs !== STYLES_FILE) files.push(abs);
    }
    return files;
}

function parse(file, content) {
    const kind = /\.tsx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sf = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, kind);
    if (sf.parseDiagnostics.length) {
        const d = sf.parseDiagnostics[0];
        die(`Couldn't parse ${path.relative(ROOT, file)}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
    }
    return sf;
}

function findSheets(sf) {
    const result = [];
    const visit = node => {
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
            && node.expression.expression.getText(sf) === 'StyleSheet'
            && node.expression.name.text === 'create'
            && node.arguments.length === 1 && ts.isObjectLiteralExpression(node.arguments[0])) {
            result.push(node.arguments[0]);
        }
        ts.forEachChild(node, visit);
    };
    visit(sf);
    return result;
}

function keyOf(property, sf) {
    if (!ts.isPropertyAssignment(property)) return null;
    if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) return property.name.text;
    return null;
}

function normalize(value) {
    const v = value.replace(/\s+/g, ' ').trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
        return JSON.stringify(v.slice(1, -1));
    }
    return v;
}

function propsFromObject(obj, sf) {
    const props = new Map();
    for (const p of obj.properties) {
        const name = keyOf(p, sf);
        if (name !== null) props.set(name, { value: normalize(p.initializer.getText(sf)), node: p });
    }
    return props;
}

function matching(pattern, props) {
    return Object.entries(pattern.props).every(([key, value]) =>
        props.has(key) && props.get(key).value === normalize(value));
}

function canRemoveLine(sf, property) {
    const content = sf.text;
    const start = content.lastIndexOf('\n', property.getStart(sf) - 1) + 1;
    const end = content.indexOf('\n', property.getEnd());
    if (end < 0) return null;
    const before = content.slice(start, property.getStart(sf));
    const after = content.slice(property.getEnd(), end);
    if (!/^[ \t]*$/.test(before) || !/^,?[ \t]*\r?$/.test(after)) return null;
    return { start, end: end + 1, text: '' };
}

function applyEdits(content, edits) {
    edits.sort((a, b) => b.start - a.start || b.end - a.end);
    for (let i = 1; i < edits.length; i++) {
        if (edits[i].end > edits[i - 1].start) die('Overlapping source edits; no files were written');
    }
    for (const e of edits) content = content.slice(0, e.start) + e.text + content.slice(e.end);
    return content;
}

function hasGlobalImport(sf) {
    return sf.statements.some(n => ts.isImportDeclaration(n)
        && n.moduleSpecifier.text === '@Styles/index'
        && n.importClause?.name?.text === 'globalStyles');
}

function addGlobalImport(sf, edits) {
    if (hasGlobalImport(sf)) return;
    const imports = sf.statements.filter(ts.isImportDeclaration);
    if (!imports.length) die(`Could not determine import location in ${sf.fileName}`);
    const first = imports[0];
    const eol = sf.text.includes('\r\n') ? '\r\n' : '\n';
    edits.push({ start: first.end, end: first.end, text: `${eol}import globalStyles from '@Styles/index';` });
}

if (!fs.existsSync(STYLES_FILE)) die('Run from the Animax project root (src/styles/index.ts is missing)');
const globalContent = fs.readFileSync(STYLES_FILE, 'utf8');
const globalSf = parse(STYLES_FILE, globalContent);
const globalSheet = findSheets(globalSf)[0];
if (!globalSheet) die('globalStyles StyleSheet.create not found');

const existing = new Map();
for (const property of globalSheet.properties) {
    const name = keyOf(property, globalSf);
    if (name && ts.isObjectLiteralExpression(property.initializer)) {
        existing.set(name, Object.fromEntries([...propsFromObject(property.initializer, globalSf)]
            .map(([key, item]) => [key, item.node.initializer.getText(globalSf)])));
    }
}

const candidates = patterns.map(p => ({...p, props: p.props || existing.get(p.name)}))
    .filter(p => p.props && (!existing.has(p.name) || Object.entries(p.props)
        .every(([key, val]) => normalize(existing.get(p.name)?.[key] || '') === normalize(val))));

const sources = walk(path.join(ROOT, 'src')).map(file => {
    const original = fs.readFileSync(file, 'utf8');
    const sf = parse(file, original);
    return {file, original, sf, sheets: findSheets(sf)};
});

// Require reuse by >= min style objects for new shared classes.
const occurrences = new Map(candidates.map(p => [p.name, new Set()]));
for (const {file, sf, sheets} of sources) {
    for (const sheet of sheets) for (const style of sheet.properties) {
        if (!ts.isPropertyAssignment(style) || !ts.isObjectLiteralExpression(style.initializer)) continue;
        const props = propsFromObject(style.initializer, sf);
        for (const candidate of candidates) if (matching(candidate, props)) {
            occurrences.get(candidate.name).add(`${file}:${style.getStart(sf)}`);
        }
    }
}

const active = candidates.filter(p => existing.has(p.name) || occurrences.get(p.name).size >= p.min);
const added = active.filter(p => !existing.has(p.name));
const results = [];

for (const {file, original, sf, sheets} of sources) {
    const edits = [];
    let replacements = 0;
    for (const sheet of sheets) for (const style of sheet.properties) {
        if (!ts.isPropertyAssignment(style) || !ts.isObjectLiteralExpression(style.initializer)) continue;
        const obj = style.initializer;
        const rest = obj.properties.filter(p => ts.isSpreadAssignment(p));
        if (rest.length > 0) continue; // Avoid reordering or changing existing spread precedence.
        const props = propsFromObject(obj, sf);
        const possible = active.filter(p => matching(p, props))
            .filter(p => Object.keys(p.props).every(key => canRemoveLine(sf, props.get(key).node)));
        if (!possible.length) continue;
        // Choose the largest useful base, then add disjoint groups where worthwhile.
        possible.sort((a,b) => Object.keys(b.props).length - Object.keys(a.props).length);
        const taken = new Set();
        const selected = [];
        for (const p of possible) {
            const keys = Object.keys(p.props);
            if (keys.some(k => taken.has(k))) continue;
            if (keys.length < 2) continue;
            selected.push(p);
            keys.forEach(k => taken.add(k));
        }
        if (!selected.length) continue;
        const opening = obj.getStart(sf);
        const closing = obj.getEnd();
        if (!/^[ \t]*\r?\n/.test(original.slice(opening + 1, closing))) continue;
        const firstProp = obj.properties[0];
        const lineStart = original.lastIndexOf('\n', firstProp.getStart(sf)-1)+1;
        const indent = original.slice(lineStart, firstProp.getStart(sf));
        if (!/^[ \t]+$/.test(indent)) continue;
        const eol = original.includes('\r\n') ? '\r\n' : '\n';
        edits.push({start:opening+1,end:opening+1,text:eol+selected.map(p=>indent+'...globalStyles.'+p.name+',').join(eol)});
        for (const key of taken) edits.push(canRemoveLine(sf,props.get(key).node));
        replacements++;
    }
    if (!replacements) continue;
    addGlobalImport(sf, edits);
    const updated = applyEdits(original, edits);
    parse(file, updated);
    results.push({ file, original, updated, replacements });
}

if (added.length) {
    const edits = [];
    const last = globalSheet.properties[globalSheet.properties.length - 1];
    if (!last) die('Empty globalStyles object');
    const between = globalContent.slice(last.getEnd(), globalSheet.getEnd()-1);
    if (!/^\s*,/.test(between)) edits.push({start:last.getEnd(),end:last.getEnd(),text:','});
    const closePos = globalSheet.getEnd()-1;
    const closeLineStart = globalContent.lastIndexOf('\n',closePos-1)+1;
    const indent = '\t';
    const eol = globalContent.includes('\r\n') ? '\r\n' : '\n';
    const declarations = added.map(p => {
        const entries = Object.entries(p.props).map(([key,val]) => `${indent}${indent}${key}: ${val},`).join(eol);
        return `${indent}${p.name}: {${eol}${entries}${eol}${indent}},`;
    }).join(eol);
    edits.push({start:closeLineStart,end:closeLineStart,text:declarations+eol});

    // New global classes may reference constants not imported by the original file.
    const requestedConstants = new Set(added.flatMap(p => Object.values(p.props)
        .flatMap(value => [...value.matchAll(/\bCOLOR_[A-Z0-9_]+\b/g)].map(match => match[0]))));
    const availableConstants = new Set();
    for (const statement of globalSf.statements) {
        if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== '@Data/constants') continue;
        const bindings = statement.importClause?.namedBindings;
        if (bindings && ts.isNamedImports(bindings)) {
            for (const spec of bindings.elements) availableConstants.add(spec.name.text);
        }
    }
    const missingConstants = [...requestedConstants].filter(name => !availableConstants.has(name));
    if (missingConstants.length) {
        const first = globalSf.statements.find(ts.isImportDeclaration);
        edits.push({start:first.end,end:first.end,
            text:`${eol}import { ${missingConstants.join(', ')} } from '@Data/constants';`});
    }
    const updated = applyEdits(globalContent, edits);
    parse(STYLES_FILE, updated);
    results.unshift({file:STYLES_FILE,original:globalContent,updated,replacements:added.length});
}

console.log(`Found ${sources.filter(s=>s.sheets.length).length} source files with StyleSheet.create.`);
console.log(`New global styles (${added.length}): ${added.map(p=>p.name).join(', ') || '(none)'}`);
for(const item of results) console.log(`${WRITE?'WRITE':'WOULD UPDATE'} ${path.relative(ROOT,item.file)} (${item.replacements} styles)`);
console.log(`Files changed: ${results.length}.`);
if (WRITE) {
    for (const item of results) fs.writeFileSync(item.file, item.updated, 'utf8');
    console.log('Done. Review with git diff and test your project.');
}
if (CHECK && results.length) process.exitCode = 1;
