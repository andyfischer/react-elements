
import { createElement, cloneElement, Children, ReactElement, useState, useEffect } from 'react'

export { useCallbackWithElement } from './useCallbackWithElement.js'
export { Block, Span, StyleWrap, Img, Button } from './StyleElements.js'

const hexAlphanumeric = '0123456789abcdef';
const hexAlpha = 'abcdef';

function randInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function randomHex(length: number) {
    let out = '';

    out += hexAlpha[randInt(hexAlpha.length)];
    length--;

    while (length > 0) {
        out += hexAlphanumeric[randInt(hexAlphanumeric.length)];
        length--;
    }
    return out;
}

export function useRandomId() {
    const [ id ] = useState(() => randomHex(8));
    return id;
}
