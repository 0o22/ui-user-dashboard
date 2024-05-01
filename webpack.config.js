function webpack(config) {
  config.experiments.asyncWebAssembly = true;

  const fileLoaderRule = config.module.rules.find((rule) =>
    rule.test?.test?.('.svg')
  );

  config.module.rules.push(
    {
      ...fileLoaderRule,
      test: /\.svg$/i,
      resourceQuery: /url/, // *.svg?url
    },
    {
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
          },
        },
      ],
    },
    {
      test: /\.wasm$/i,
      type: 'webassembly/async',
    }
  );

  fileLoaderRule.exclude = /\.svg$/i;

  return config;
}

module.exports = webpack;
