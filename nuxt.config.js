const { BugsnagBuildReporterPlugin, BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins')
require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Zootrope',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Turn Youtube videos into scrollable caption-based slideshows' },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#f9183d' },
  /*
  ** Build configuration
  */
  build: {
    extend (config, { isDev, isClient }) {
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      // Bugsnag
      if (!isDev && isClient) {
        config.devtool = '#source-map'
        config.plugins.push(
          new BugsnagBuildReporterPlugin({
            apiKey: 'c1e2241fdaa9785ed9f9288526498ae4',
            appVersion: process.env.RELEASE,
            releaseStage: 'production'
          })
        )
        config.plugins.push(
          new BugsnagSourceMapUploaderPlugin({
            apiKey: 'c1e2241fdaa9785ed9f9288526498ae4',
            appVersion: process.env.RELEASE,
            releaseStage: 'production',
          })
        )
      }
    },
    postcss: {
      plugins: {
        'postcss-easing-gradients': {}
      }
    }
  },
  plugins: [
    { src: '~/plugins/bugsnag.js', ssr: false },
    { src: '~/plugins/persistedstate.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/dotenv',
  ]
}

