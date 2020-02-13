# PostCSS Safe Area [![Build Status][ci-img]][ci]

[PostCSS] plugin that adds browser fallbacks for safe-area env variables.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/plegner/postcss-safe-area.svg
[ci]:      https://travis-ci.org/plegner/postcss-safe-area

Old iOS and Android browsers don't support environment variables that are required for CSS safe areas. This plugin adds all neccessary fallbacks, and supports `calc()` as well as shorthand properties for multiple margin or padding values.

```css
.foo {
  padding-top: env(safe-area-inset-top);
  margin: 5em 5em calc(5em + env(safe-area-inset-bottom)) 5em;
}
```

```css
.foo {
  padding-top: 0;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  margin: 5em 5em calc(5em + 0px) 5em;
  margin: 5em 5em calc(5em + constant(safe-area-inset-bottom)) 5em;
  margin: 5em 5em calc(5em + env(safe-area-inset-bottom)) 5em;
}
```

## Installation and Usage

Install this dependency using

```
npm install postcss-safe-area --save-dev
```

Now you can use the plugin using

```js
postcss([require('postcss-safe-area')])
```

See [PostCSS] docs for examples for your environment.
