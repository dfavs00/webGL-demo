const GlslifyWebpackPlugin = require('glslify-webpack-plugin');

module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.glsl$/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      }
    ]
  },
  plugins: [
    new GlslifyWebpackPlugin()
  ],
  // ...
}