const { override, fixBabelImports, addLessLoader } = require("customize-cra");
const darkTheme = require("@ant-design/dark-theme");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      ...darkTheme.default,
      "@primary-color": "#1DA57A",
      "@body-background": "#202124",
      "@component-background": "#202124",
      "@border-radius-base": "20px",
      "@border-color-base ": "#d9d9d9",
      "@layout-header-background": "#191919",
      "@menu-bg ": "@layout-header-background",
      "@layout-trigger-background": "@layout-header-background",
      "@input-bg": "#202124",
    },
  })
);
