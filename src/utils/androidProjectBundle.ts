import JSZip from 'jszip';

export async function downloadAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root project files
  zip.file(
    'android/build.gradle',
    `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.3.2'
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.23'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`
  );

  zip.file(
    'android/settings.gradle',
    `rootProject.name = "MetaPulseAds"
include ':app'
`
  );

  zip.file(
    'android/gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`
  );

  // Gradle Wrapper
  zip.file(
    'android/gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  zip.file(
    'android/gradlew',
    `#!/bin/sh
APP_BASE_NAME=\`basename "$0"\`
APP_HOME="\`pwd -P\`"
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'

if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        JAVACMD="$JAVA_HOME/jre/sh/java"
    else
        JAVACMD="$JAVA_HOME/bin/java"
    fi
else
    JAVACMD="java"
fi

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar
exec "$JAVACMD" "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
`
  );

  zip.file(
    'android/gradlew.bat',
    `@if "%DEBUG%" == "" @echo off
if "%OS%"=="Windows_NT" setlocal
set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi
if defined JAVA_HOME goto findJavaFromJavaHome
set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto execute
goto fail
:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe
if exist "%JAVA_EXE%" goto execute
:execute
set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*
:fail
exit /b 1
`
  );

  // App module files
  zip.file(
    'android/app/build.gradle',
    `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    namespace 'com.metapulse.ads'
    compileSdk 34

    defaultConfig {
        applicationId "com.metapulse.ads"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = '17'
    }
    buildFeatures {
        viewBinding true
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
    implementation 'androidx.webkit:webkit:1.10.0'
}
`
  );

  zip.file(
    'android/app/proguard-rules.pro',
    `-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
}
`
  );

  zip.file(
    'android/app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.metapulse.ads">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MetaPulseAds"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:theme="@style/Theme.MetaPulseAds">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`
  );

  zip.file(
    'android/app/src/main/java/com/metapulse/ads/MainActivity.kt',
    `package com.metapulse.ads

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

    // Standalone local asset URL - 100% offline, zero cookie check
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

        assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        setupWebView()
        setupSwipeRefresh()
        setupBackNavigation()

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
        settings.userAgentString = settings.userAgentString + " MetaPulseAndroid/1.0"

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
                    val filename = "MetaPulse_Ads_Report_\${System.currentTimeMillis()}.csv"
                    val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                    val file = File(downloadsDir, filename)
                    FileOutputStream(file).use { it.write(decodedBytes) }
                    Toast.makeText(this, "Report saved to Downloads: \$filename", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this, "Failed to save file: \${e.message}", Toast.LENGTH_SHORT).show()
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
`
  );

  zip.file(
    'android/app/src/main/res/layout/activity_main.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#F8FAFC">

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="4dp"
        android:indeterminate="false"
        android:max="100"
        android:progressTint="#2563EB"
        android:visibility="gone"
        app:layout_constraintTop_toTopOf="parent" />

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefresh"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintTop_toBottomOf="@id/progressBar">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

</androidx.constraintlayout.widget.ConstraintLayout>
`
  );

  zip.file(
    'android/app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">MetaPulse Ads</string>
</resources>
`
  );

  zip.file(
    'android/app/src/main/res/values/colors.xml',
    `<resources>
    <color name="primary">#2563EB</color>
    <color name="primary_dark">#1D4ED8</color>
    <color name="accent">#38BDF8</color>
    <color name="background">#F8FAFC</color>
    <color name="white">#FFFFFF</color>
</resources>
`
  );

  zip.file(
    'android/app/src/main/res/values/themes.xml',
    `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.MetaPulseAds" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primary_dark</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="android:statusBarColor">@color/primary</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>
</resources>
`
  );

  zip.file(
    'android/README.md',
    `# MetaPulse Ads - Complete Android Studio Project

## How to build signed APK in Android Studio:
1. Extract this zip file.
2. Open Android Studio -> Select "Open Project" -> Pick the "android" folder.
3. Wait for Gradle sync to complete.
4. Go to top menu: Build > Generate Signed Bundle / APK...
5. Choose APK > Click Next.
6. Select or create your Keystore (.jks) > Enter password.
7. Select "release" build variant > Check V1 and V2 signature boxes.
8. Click Finish. The APK will be generated at: android/app/release/app-release.apk!
`
  );

  // Generate binary ZIP in client memory
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Trigger instantaneous client-side download via in-memory Object URL
  const blobUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'metapulse-android-project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

export async function downloadGithubReadyZip(): Promise<void> {
  try {
    const res = await fetch('./metapulse-github-ready.zip');
    if (!res.ok) throw new Error('Fetch status: ' + res.status);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'metapulse-github-ready.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn('Direct blob fetch fallback:', err);
    window.location.href = './metapulse-github-ready.zip';
  }
}

