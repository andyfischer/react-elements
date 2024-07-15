
import { createElement, cloneElement, Children, } from 'react'

const c_prop = 1;
const c_ignore = 3;
const c_styleObject = 4;
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
    style: c_styleObject,
    passthrough: c_passthrough,

    // Class name
    class: c_className,
    className: c_className,

    // HTML props
    grid: c_grid,
    gridArea: c_styleField,
    gridColumn: c_styleField,
    gridRow: c_styleField,
    flex: c_styleField,

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

        case c_styleObject:
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
            if (value) {
                if (value == true) {
                    classNames.push('grid');
                } else {
                    finalProps.style = finalProps.style || {};
                    finalProps.style['grid'] = value;
                    finalProps.style['display'] = 'grid';
                }
            }
            continue;

        case c_styleField:
            if (value) {
                if (value == true) {
                    classNames.push(key);
                } else {
                    finalProps.style = finalProps.style || {};
                    finalProps.style[key] = value;
                }
            }
            continue;
        }

        // Didn't find it in the propBehavior map.

        // Pass var--* through as a CSS variable.
        if (key.indexOf('var--') === 0) {
            // CSS variable
            key = key.replace('var', '');
            finalProps.style = finalProps.style || {};
            finalProps.style[key] = value;
            continue;
        }

        // Check the value - if it's boolean 'true' then treat it as a CSS class name.
        if (value === true) {
            key = key.replace('__', ':');
            classNames.push(key);
            continue;
        }

        // Certain falsy values are ignored
        if (value === false || value === null || value === undefined) {
            continue;
        }

        // Finally: Treat it as a normal prop.
        finalProps[key] = value;
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

export function Select(props: any) {
    const derived = deriveProps(props, 'select');
    return createElement(derived.elementName, derived.finalProps);
}

export function Input(props: any) {
    const derived = deriveProps(props, 'input');
    return createElement(derived.elementName, derived.finalProps);
}

export function Form(props: any) {
    const derived = deriveProps(props, 'form');
    return createElement(derived.elementName, derived.finalProps);
}

export function Pre(props: any) {
    const derived = deriveProps(props, 'pre');
    return createElement(derived.elementName, derived.finalProps);
}

export function StyleWrap(props: any) {

    let derived = deriveProps(props, 'div');

    delete derived.finalProps.children;

    return Children.map(props.children, child => {

        let classProp = 'className';

        // Check for web component
        try {
            if (typeof child.type === 'string' && /^[a-z]/.test(child.type) && child.type.includes('-')) {
                classProp = 'class';
            }
        } catch (e) { }

        let existingClass = child.props[classProp] || '';
        let newClass = derived.finalProps.className;

        if (newClass && newClass != '')
            newClass = existingClass + '  ' + newClass;

        const cloned = cloneElement(child, {
            ...derived.finalProps,
            [ classProp ]: newClass
        });

        return cloned;
    });
}

