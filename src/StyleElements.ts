import { createElement, cloneElement, Children, } from 'react'

const c_prop = 1;
const c_propAndClassName = 2;
const c_ignore = 3;
const c_style = 4;
const c_passthrough = 5;
const c_className = 6;
const c_styleField = 7;
const c_elementName = 8;
const c_grid = 9;

const propBehavior: { [name:string]: number } = {
    // React
    key: c_prop,
    children: c_prop,
    ref: c_ignore,
    style: c_style,
    passthrough: c_passthrough,

    // Class name
    class: c_className,
    className: c_className,

    // HTML props
    id: c_prop,
    type: c_prop,
    src: c_prop,
    tabIndex: c_prop,
    grid: c_grid,
    gridArea: c_styleField,
    gridColumn: c_styleField,
    gridRow: c_styleField,
    disabled: c_propAndClassName,

    // Element names
    ins: c_elementName,
    del: c_elementName,
    nav: c_elementName,
    caption: c_elementName,
    pre: c_elementName,
    h1: c_elementName,
    h2: c_elementName,
    h3: c_elementName,
    h4: c_elementName,
    h5: c_elementName,
}

function isUpperCase(s: string) {
    return s && (s === s.toUpperCase());
}

export function deriveProps(props: any, defaultElementName: string = 'div'): { elementName: string, finalProps: any } {

    let classNames = [];
    let finalProps: any = {};
    let elementName: string = defaultElementName;

    for (let [key, value] of Object.entries(props)) {

        switch (propBehavior[key]) {
        case c_ignore:
            continue;

        case c_className:
            classNames.push(value);
            continue;

        case c_prop:
            finalProps[key] = value;
            continue;

        case c_propAndClassName:
            if (value)
                classNames.push(key);
            finalProps[key] = value;
            continue;

        case c_style:
            if (finalProps.style) {
                finalProps.style = {
                    ...finalProps.style,
                    ...(value as any),
                }
            } else {
                finalProps.style = value;
            }
            continue;

        case c_passthrough:
            finalProps = {
                ...finalProps,
                ...(value as any),
            };
            continue;

        case c_elementName:
            classNames.push(key);
            elementName = key as string;
            continue;

        case c_grid:
            classNames.push('grid')
            if (value && value !== '' && value != true) {
                finalProps.style = finalProps.style || {};
                finalProps.style['grid'] = value;
            }
            continue;

        case c_styleField:
            finalProps.style = finalProps.style || {};
            finalProps.style[key] = value;
            continue;
        }

        // Didn't find it in the propBehavior map.

        // Look for event handlers like onX. Pass those through as React props.
        if (key[0] === 'o' && key[1] === 'n' && isUpperCase(key[2])) {
            finalProps[key] = value;
            continue;
        }

        // Pass data-* through as HTML attributes
        if (key.startsWith('data-')) {
            finalProps[key] = value;
            continue;
        }
        
        // Pass var--* through as a CSS variable.
        if (key.indexOf('var--') === 0) {
            // CSS variable
            key = key.replace('var', '');
            finalProps.style = finalProps.style || {};
            finalProps.style[key] = value;
            continue;
        }

        // Unrecognized key, treat it as a CSS class name.
        if (value) {
            key = key.replace('__', ':');
            classNames.push(key);
        }
    }

    if (classNames.length > 0)
        finalProps.className = classNames.join(' ');

    return { elementName, finalProps };
}

export function Block(props: any) {
    const derived = deriveProps(props, 'div');
    return createElement(derived.elementName, derived.finalProps);
}

export function Span(props: any) {
    const derived = deriveProps(props, 'span');
    return createElement(derived.elementName, derived.finalProps);
}

export function Button(props: any) {
    const derived = deriveProps(props, 'button');
    return createElement(derived.elementName, derived.finalProps);
}

export function Img(props: any) {
    const { src, width, height, ...rest }  = props;

    rest.style = rest.style || [];
    rest.style.width = width;
    rest.style.height = height;
    const derived = deriveProps(rest, 'img');

    return createElement('img', { src, ...derived.finalProps });
}

export function StyleWrap(props: any) {
    let derived = deriveProps(props, 'div');

    delete derived.finalProps.children;

    return Children.map(props.children, child => {

        let className = derived.finalProps.className;

        if (child.props.className && child.props.className != '')
            className = child.props.className + '  ' + className;


        const cloned = cloneElement(child, {
            ...derived.finalProps,
            className,
        });

        return cloned;
    });
}


