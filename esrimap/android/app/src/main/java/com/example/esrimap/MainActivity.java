package com.example.esrimap;

import androidx.annotation.RequiresApi;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebResourceError;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private WebViewAssetLoader assetLoader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        
        // 配置WebView
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        // 支持ES模块
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        // 启用DOM存储
        webSettings.setDomStorageEnabled(true);
        // 启用数据库存储
        webSettings.setDatabaseEnabled(true);
        // 设置缓存模式
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        // 允许文件访问
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        // 允许跨域请求
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        // 启用混合内容模式（允许同时加载HTTP和HTTPS内容）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        
        // 初始化WebViewAssetLoader，用于虚拟主机映射
        assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        
        // 设置WebChromeClient，用于查看JavaScript控制台日志
        webView.setWebChromeClient(new android.webkit.WebChromeClient() {
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                // 打印JavaScript控制台日志到Android日志
                android.util.Log.d("WebViewConsole", consoleMessage.message() + " -- From line " 
                        + consoleMessage.lineNumber() + " of " 
                        + consoleMessage.sourceId());
                return true;
            }
        });
        
        // 设置WebViewClient，拦截请求并使用WebViewAssetLoader处理
        webView.setWebViewClient(new WebViewClient() {
            @Override
            @RequiresApi(21)
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            @SuppressWarnings("deprecation")
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return assetLoader.shouldInterceptRequest(Uri.parse(url));
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                // 打印加载错误信息
                android.util.Log.e("WebViewError", "Error loading " + failingUrl + ": " + description + " (Code: " + errorCode + ")");
            }
            
            @Override
            @RequiresApi(23)
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // 打印加载错误信息（API 23+）
                android.util.Log.e("WebViewError", "Error loading " + request.getUrl() + ": " + error.getDescription() + " (Code: " + error.getErrorCode() + ")");
            }
        });
        // 加载本地网站，使用Android官方推荐的虚拟主机名
        webView.loadUrl("https://appassets.androidplatform.net/index.html");
    }

    @Override
    public void onBackPressed() {
        // 如果WebView可以返回，则返回上一页，否则退出应用
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}