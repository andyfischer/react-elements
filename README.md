
# react-elements #

Helper components for using atomic CSS with React.

These components allow you to directly add CSS class names onto the React element.

Works great with Tailwind CSS. An alternative to using the `classnames` library.

### Quick Example ###

This sample code:

    import { Span } from '@andyfischer/react-elements'

    return (
      <Span m-1 p-1 flex border rounded-sm>...</Span>
    )

Renders HTML that looks like:

    <span class="m-1 p-1 flex border rounded-sm">...</span>

# API #

The library exports a few helper components that translate directly to an HTML element.

Each one will transform the incoming props into a className. (see below for the transformation rules).

| component | renders to HTML |
| --------- | --------------- |
| `<Button {...props}>` | `<button ...>`         |
| `<Block {...props}>` | `<div ...>`         |
| `<Form {...props}>` | `<form ...>`         |
| `<Img {...props}>` | `<img ...>`         |
| `<Input {...props}>` | `<input ...>`         |
| `<Span {...props}>` | `<span ...>`         |
| `<Select {...props}>` | `<select ...>`         |
| `<Pre {...props}>` | `<pre ...>`         |

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

# Prop transformation logic #

In most cases (with exceptions listed below), the logic for handling props on any react-elements components is as follows:

 1) If the prop's value is non-boolean, then preserve the property onto the underlying component. From there it follows the default React behavior.

Example:

    <Img src="url" />

The `src` has a string value so this renders to:

    <img src="url" />

 2) If the prop's value is exactly `true` then treat it as a CSS classname (with some exceptions below).

Example:

    <Span p-1 m-1 />

Renders to:

    <span className="p-1 m-1 />

 3) If the prop's value is exactly `false` then ignore it. This can help implement CSS classes that are conditional.

Example:

    <Span selected={false} />

Renders to:

    <span />

## Special Cases ##

#### Special prop: 'className' ####

You can add a className string and it'll be correctly combined with any additional CSS classes.

Example:

    <Block m-1 className="selected" />

Renders to:

    <Block className="m-1 selected" />

#### Props that map into the style={} section ####

For these props, if they have a non-boolean value, then they are passed into the element's `style` object.

Includes:

| prop name |
| --------- |
| `grid` |
| `gridArea` |
| `gridColumn` |
| `gridRow` |
| `flex` |

Example:

    <Block gridArea="1 / 2" />

Renders to:

    <div style={{ gridArea: "1 / 2 "}} 

#### Special prop: 'grid' ####

If the `grid` prop has a value, then it's copied into the `style` object, AND the element's style is set to `display: grid`.

Example:

    <Block grid="repeat(2, 60px) / auto-flow 80px" />

Renders to:

    <div style={{ display: 'grid', grid: 'repeat(2, 60px) / auto-flow 80px' }} />

#### Props that are style-focused tag names ####

This library takes an opinion in that some HTML tag names are primarily style-focused, and we can list them in
the same way as CSS classnames. When one of these is used, it overrides the default tag name.

This includes the tag names: `caption`,`del`,`h1`,`h2`,`h3`,`h4`,`h5`,`ins`,`nav`,`pre`.

Example:

    <Block h1 p-1>

Renders to:

    <h1 className="p-1" />

#### Props that start with `var--` ####

If the prop name starts with `var--` then it's treated as a CSS variable.

Example:

    <Block var--color="#fff">

Renders to:
    <div style={{'--color': '#fff'}} />

