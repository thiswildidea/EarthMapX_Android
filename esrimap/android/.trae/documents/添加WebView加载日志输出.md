# 添加WebView加载日志输出计划

## 目标
在MainActivity.java中添加WebView加载网站相关的日志输出，以便追踪网站加载过程中的错误。

## 实现步骤

1. **添加日志导入**
   - 在文件顶部添加`import android.util.Log;`，用于使用Android日志系统

2. **在WebViewClient中添加生命周期日志**
   - 添加`onPageStarted`方法：记录页面开始加载的URL
   - 添加`onPageFinished`方法：记录页面加载完成的URL和耗时
   - 添加`onReceivedError`方法：记录网络错误信息
   - 添加`onReceivedHttpError`方法：记录HTTP错误信息
   - 添加`onReceivedSslError`方法：记录SSL错误信息

3. **在shouldInterceptRequest方法中添加日志**
   - 在两个shouldInterceptRequest重载方法中添加日志，记录拦截的请求URL和处理结果

4. **添加WebChromeClient追踪JavaScript错误**
   - 设置WebChromeClient
   - 添加`onConsoleMessage`方法：记录JavaScript控制台日志
   - 添加`onJsError`方法：记录JavaScript错误

5. **在loadUrl前后添加日志**
   - 在调用loadUrl前记录准备加载的URL
   - 可以考虑添加WebViewClient的`onLoadResource`方法记录资源加载情况

## 预期效果
- 能够追踪WebView加载过程中的各个阶段
- 能够捕获网络错误、HTTP错误和SSL错误
- 能够查看JavaScript控制台日志和错误
- 便于调试和分析WebView加载问题

## 代码修改点
- 文件：`MainActivity.java`
- 主要修改区域：WebViewClient和WebChromeClient的设置部分

## 注意事项
- 日志标签统一使用"WebViewLog"，便于过滤
- 只在调试阶段启用详细日志，避免影响性能
- 敏感信息（如完整URL路径）可以适当脱敏

这个计划将帮助我们全面追踪WebView加载网站的过程，及时发现和定位加载过程中的错误。