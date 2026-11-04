package com.metapulse.ads

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.util.Base64
import android.view.View
import android.webkit.*
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import androidx.webkit.WebViewAssetLoader
import java.io.File
import java.io.FileOutputStream

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var assetLoader: WebViewAssetLoader

    // Local standalone asset URL (No server, No Cookie check, 100% Offline & Stable)
    private val localAssetUrl = "https://appassets.androidplatform.net/assets/index.html"
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

    private val filePickerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val intentData = result.data
            val results: Array<Uri>? = when {
                intentData?.dataString != null -> arrayOf(Uri.parse(intentData.dataString))
                intentData?.clipData != null -> {
                    val count = intentData.clipData!!.itemCount
                    Array(count) { i -> intentData.clipData!!.getItemAt(i).uri }
                }
                else -> null
            }
            fileUploadCallback?.onReceiveValue(results)
        } else {
            fileUploadCallback?.onReceiveValue(null)
        }
        fileUploadCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefresh)
        progressBar = findViewById(R.id.progressBar)

        // Configure modern WebViewAssetLoader to securely load bundled assets without network requests
        assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        setupWebView()
        setupSwipeRefresh()
        setupBackNavigation()

        // Load local bundled web application
        webView.loadUrl(localAssetUrl)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                request?.url?.let { uri ->
                    val response = assetLoader.shouldInterceptRequest(uri)
                    if (response != null) return response
                }
                return super.shouldInterceptRequest(view, request)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    // Fallback to direct file schema if domain intercept encounters issues
                    webView.loadUrl("file:///android_asset/index.html")
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress == 100) progressBar.visibility = View.GONE
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                    addCategory(Intent.CATEGORY_OPENABLE)
                }
                try {
                    filePickerLauncher.launch(intent)
                } catch (e: Exception) {
                    fileUploadCallback = null
                    return false
                }
                return true
            }
        }

        webView.setDownloadListener { url, _, _, mimetype, _ ->
            handleDownload(url, mimetype)
        }
    }

    private fun handleDownload(url: String, mimetype: String) {
        if (url.startsWith("data:")) {
            try {
                val parts = url.split(",")
                if (parts.size >= 2) {
                    val encodedData = parts[1]
                    val isBase64 = parts[0].contains("base64")
                    val decodedBytes = if (isBase64) Base64.decode(encodedData, Base64.DEFAULT) else Uri.decode(encodedData).toByteArray(Charsets.UTF_8)
                    val filename = "MetaPulse_Ads_Report_${System.currentTimeMillis()}.csv"
                    val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                    val file = File(downloadsDir, filename)
                    FileOutputStream(file).use { it.write(decodedBytes) }
                    Toast.makeText(this, "Report saved to Downloads: $filename", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this, "Failed to save file: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        } else {
            val request = DownloadManager.Request(Uri.parse(url)).apply {
                setMimeType(mimetype)
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "MetaPulse_Report.csv")
            }
            val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            dm.enqueue(request)
            Toast.makeText(this, "Downloading report...", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupSwipeRefresh() {
        swipeRefresh.setOnRefreshListener { webView.reload() }
        swipeRefresh.setColorSchemeResources(android.R.color.holo_blue_bright, android.R.color.holo_green_light)
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })
    }
}
