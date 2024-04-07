
# react-elements #

Helper library for easily using atomic CSS styles in React.js components.
Lets you declare your CSS class names directly on the React element. Works great with Tailwind CSS.

An alternative to the commonly used `classnames` library (aka the `cn` prop).

### Quick Example ###

This sample code:

    import { Span } from '@andyfischer/react-elements'

    return <Span m-1 p-1 flex border rounded-sm>...</Span>

Renders HTML that looks like:

    <span class="m-1 p-1 flex border rounded-sm">...</span>

# API #

The library exports a few helper components that translate directly to an HTML element.

Each one will transform the incoming props into a className. (see below for the transformation rules).

| component | renders to HTML |
| --------- | --------------- |
| `<Block {...props}>` | `<div ...>`         |
| `<Span {...props}>` | `<span ...>`         |
| `<Img {...props}>` | `<img ...>`         |
| `<Button {...props}>` | `<button ...>`         |

### StyleWrap

Another export is called `<StyleWrap/>`.

This will transform the incoming props, but instead of creating an element, StyleWrap will
apply the styles to the child element.

Can be useful if you want to add CSS styling onto an element that isn't declared above.

Example:

    import { StyleWrap } from '@andyfischer/react-elements'

    <StyleWrap bg-slate-200>
      <table>
        ...
      </table>
    </StyleWrap>

Renders HTML that looks like:

    <table class="bg-slate-200">
      ...
    </table>

# Prop transformation rules #

All the components use the following rules for transforming the incoming props into the className (or other props).

| incoming prop | translates to |
| ------------- | ------------- |
| `key`         | preserved as `key` prop    |
| `children`    | preserved as `children` prop    |
| `id`          | preserved as `id` prop |
| `type`        | preserved as `type` prop |
| `src`         | preserved as `src` prop |
| `tabIndex`    | preserved as `tabIndex` prop |
| `style`       | preserved as `style` prop. The contents of the 'style' object might be combined with other props. |
| `class`       | maps to `className` |
| `className`   | preserved as `className` prop. May be combined with other class names. |
| looks like `on...` (such as `onClick`) | preserved as a React prop. |
| `disabled`    | preserved as `disabled` prop and also adds `.disabled` to the CSS classes. |
| `grid`        | adds `.grid` to the CSS classes. Also if this prop has a value, it's used as `{grid: ...}` in the `style` object |
| `gridArea`    | sets the value as `{gridArea: ...}` in the `style` object. |
| `gridColumn`    | sets the value as `{gridColumn: ...}` in the `style` object. |
| `gridRow`    | sets the value as `{gridRow: ...}` in the `style` object. |
| `caption`,`del`,`h1`,`h2`,`h3`,`h4`,`h5`,`ins`,`nav`,`pre`  | overrides the element name (such as `<h1>...</h1>`) and also adds the name to the CSS classes. See "Style-focused HTML tags" below. |
| `passthrough` | passes the object's contents directly into the underlying element's props. |
| anything else not not mentioned above | adds the prop as a CSS class. If the prop has a value, then the class is only added if the value is truthy. |

### Example: Truthy props ###

For props that are interpreted as CSS classes, these can use a boolean value to control whether they are enabled or not.

This example code uses a boolean on the `selected` class:

    const items = [{},{},{}]
    const selectedIndex = 1;

    return items.map((item, index) =>
        <Block
            key={index}
            selected={index === selectedIndex}
        />
    );

This renders the following HTML:

    <div key="0"></div>
    <div key="1" class="selected"></div>
    <div key="2"></div>

### Example: Style-focused HTML tags ###

This library takes a little opinion in categorizing HTML tags into some that are mainly style-focused, compared to some tags that define structure or behavior.

The "style-focused" HTML tags here are: `caption`,`del`,`h1`,`h2`,`h3`,`h4`,`h5`,`ins`,`nav`,`pre`.

For props that match one of these tags, we handle them by:

 1) Overriding the HTML element to that tag (instead of `<div>`)
 2) Also adding that name as one of the CSS classes.

Example:

    <Block h1 />

Renders the following HTML:

    <h1 class="h1">
