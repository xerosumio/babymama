module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-HK'],
    localeDetection: false,
  },
  fallbackLng: {
    default: ['en'],
    'zh-HK': ['zh-HK', 'en'],
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}

