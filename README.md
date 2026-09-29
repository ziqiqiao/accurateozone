# Accurate Ozone

一个使用现有 logo 和产品概念图的英文单页网站，无导航栏，适配电脑及手机。

## 本地查看

直接用浏览器打开 `index.html` 即可查看，无需安装依赖。

也可以使用 Node.js 启动本地服务：

```sh
npm start
```

浏览器访问 <http://localhost:4173>。

## 文件

- `index.html`：品牌、产品介绍、图片弹窗。
- `styles.css`：页面布局、配色、响应式样式。
- `script.js`：图片放大、关闭和自动更新年份。
- `Accozone_Logo.png`：原始 logo。
- `b01e2a562b3c2cbc24d8feab952c1faa.png`：原始产品概念图。

页面只使用当前已提供的资料，产品名称、参数及联系方式可在 `index.html` 中补充。当前没有接入询价、订单或支付功能。

## 部署

将 `index.html`、`styles.css`、`script.js` 和两张 PNG 图片放入任意静态网站托管服务即可，无需构建步骤。`server.mjs` 仅供本地预览。

### GitHub Pages（当前部署方式）

仓库：<https://github.com/ziqiqiao/accurateozone>

在仓库 Settings → Pages 中，发布来源使用 **Deploy from a branch**，分支选择 **main**，目录选择 **/(root)**。

启用并部署成功后，默认网站地址为 <https://ziqiqiao.github.io/accurateozone/>。以后将页面修改提交并推送到 `main`，GitHub Pages 会自动更新网站。

`.nojekyll` 使 GitHub Pages 直接发布静态文件。网站的图片、样式及脚本使用相对路径，兼容默认项目地址和后续自定义域名。绑定 `accozone.com` 时，需要在 Pages 的 Custom domain 中配置域名，再按 GitHub 提供的值设置 GoDaddy DNS。

官方说明：[发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

### GoDaddy Web Hosting（cPanel）

`accurate-ozone-godaddy.zip` 是当前页面的上传包，包含上述 5 个文件，解压后没有额外的外层文件夹。后续修改页面后需要重新打包。

1. 登录 GoDaddy，在 My Products → Web Hosting 中找到对应主机，点击 Manage。
2. 在 Websites 下选择目标域名的 File Manager。
3. 打开目标域名的网站根目录。主域名通常为 `public_html`；附加域名应以其实际根目录为准。
4. 如果该目录已有网站，先下载备份现有文件，再进行替换。
5. 点击 Upload，上传 ZIP；完成后返回文件管理器，选中 ZIP 并点击 Extract，解压到当前网站根目录。
6. 确认 `index.html`、`styles.css`、`script.js` 和两张图片都直接位于网站根目录。完成后可删除服务器上的 ZIP。
7. 确认域名已连接到这台主机、HTTPS 证书已启用，然后通过域名访问，检查图片、样式和放大按钮。

无需上传 `package.json`、`server.mjs` 或此 README，也无需在主机上运行 npm。

此流程适用于 Web Hosting（cPanel）。GoDaddy 的 Websites + Marketing 使用建站编辑器及自定义 HTML 区块，上传入口不同；只有域名时还需要网站托管服务。

官方说明：[上传文件](https://www.godaddy.com/help/upload-files-using-my-web-hosting-cpanel-file-manager-3239)、[Websites + Marketing 自定义代码](https://www.godaddy.com/help/add-html-or-custom-code-to-my-site-27252)。
