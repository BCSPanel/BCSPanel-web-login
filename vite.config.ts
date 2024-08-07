import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
// import viteCompression from 'vite-plugin-compression'
// import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import htmlMinimize from '@sergeymakinen/vite-plugin-html-minimize'


// https://vitejs.dev/config/
export default defineConfig({
	server: {
		// 监听所有地址（包括局域网与公网），方便内网调试
		host: '0.0.0.0',
	},
	base: './',
	plugins: [
		// mockDevServerPlugin(),
		// viteCompression({
		//   algorithm: 'gzip',
		//   threshold: 256, // >=256字节时压缩
		//   verbose: true, // 打印压缩结果
		//   deleteOriginFile: false, // 不删除源文件
		//   filter: /\.(js|json|css)$/i // 文件名匹配
		// }),
		htmlMinimize({
			minifierOptions: {
				collapseWhitespace: true,
				html5: true,
				keepClosingSlash: false,
				minifyCSS: true,
				minifyJS: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
			}
		}),
		// {
		//   // script执行前阻止网页渲染
		//   // https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script
		//   name: "scriptBlockingRender",
		//   transformIndexHtml(html) {
		//     return html.replaceAll(
		//       '<script type="module"',
		//       '<script type="module" blocking="render" async'
		//     );
		//   }
		// },
		{
			name: "removeI18nElement",
			transformIndexHtml(html) {
				return html.replaceAll(
					'I18nElement',
					''
				);
			}
		},
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	build: {
		target: 'es2022',
		minify: 'terser',
		reportCompressedSize: true, // 是否使用vite自带的方式打印压缩后的大小
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
				manualChunks(id) {
					if (id.includes("/node_modules/")) {
						return "node_modules"
					}
				},
			}
		},
		modulePreload: {
			polyfill: false,
		},
		chunkSizeWarningLimit: Infinity,
		cssCodeSplit: true,
		assetsInlineLimit: 0,
	}
})
