/* global expect, it */
const postcss = require('postcss')
const plugin = require('./')

function run(input, output, opts = {}) {
  return postcss([plugin(opts)]).process(input).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings()).toHaveLength(0)
  })
}

it('adds safe area fallbacks', function() {
  return run('a{padding-top:env(safe-area-inset-top, 2px);}',
    'a{padding-top:2px;padding-top:constant(safe-area-inset-top, 2px);padding-top:env(safe-area-inset-top, 2px);}')
})

// TODO More tests for calc() and padding/margin shorthands.
