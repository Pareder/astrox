module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining'
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  }
}
