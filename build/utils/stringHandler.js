"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeString = exports.isExactMatch = void 0;
const escapeRegExpMatch = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
const isExactMatch = (str, match) => {
    return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str);
};
exports.isExactMatch = isExactMatch;
const normalizeString = (str) => {
    const htmlTagsRegex = /(&nbsp;|<([^>]+)>)/g;
    return str
        .trim()
        .replace(/(\r\n|\n|\r|\")/gm, '')
        .replace(htmlTagsRegex, '');
};
exports.normalizeString = normalizeString;
