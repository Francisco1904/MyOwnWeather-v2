// Focus plugin for consistent focus styles
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addBase }) {
  addBase({
    // Base focus state - remove default outline in favor of our custom styles
    ':focus': {
      outline: 'none',
    },

    // Visible focus state for keyboard navigation only
    // This ensures focus styles show up only when using keyboard
    ':focus-visible': {
      outline: 'none',
      '--tw-ring-color': 'rgba(255, 255, 255, 0.7)',
      '--tw-ring-offset-width': '2px',
      '--tw-ring-width': '2px',
      '--tw-ring-offset-color': 'transparent',
      'box-shadow':
        '0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), 0 0 0 calc(var(--tw-ring-width) + var(--tw-ring-offset-width)) var(--tw-ring-color)',
    },

    // Dark mode focus-visible style
    '.dark :focus-visible': {
      '--tw-ring-color': 'rgba(148, 163, 184, 0.7)',
      '--tw-ring-offset-color': 'transparent',
    },
  });
});
