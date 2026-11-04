import React, { useState } from 'react';
import { Language } from '../types/ads';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { downloadAndroidProjectZip, downloadGithubReadyZip } from '../utils/androidProjectBundle';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  QrCode, 
  Copy, 
  Check 
} from 'lucide-react';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'studio' | 'github'>('github');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  if (!isOpen) return null;

  const appLiveUrl = "https://ais-pre-3bn7w35bw7sw7gwxqdvukm-785439135164.asia-southeast1.run.app";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appLiveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Initial release of MetaPulse Ads"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main`;

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'en' ? 'MetaPulse Deployment & Android APK' : 'মেটাপালস লাইভ ডিপ্লয় ও অ্যান্ড্রয়েড APK'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'en' 
                  ? 'Host live on GitHub Pages or build Android APK with zero cookie check' 
                  : 'গিটহাব পেজেসে সম্পূর্ণ ফ্রিতে লাইভ করুন অথবা সাইনড অ্যান্ড্রয়েড APK ডাউনলোড করুন'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-5 pt-3 gap-4 bg-white text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🚀</span>
            <span>{lang === 'en' ? 'GitHub Live & Free Hosting' : 'GitHub থেকে লাইভ (ফ্রি হোস্টিং)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instant')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'instant'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'en' ? '1-Tap Phone Install' : 'সরাসরি ফোনে ইনস্টল'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'studio'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'en' ? 'Android Studio APK' : 'Android Studio APK'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {activeTab === 'github' ? (
            <div className="space-y-5">
              {/* GitHub Pages Banner & 1-Click Code Download */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌐</span>
                      <span className="font-bold text-blue-900 text-sm">
                        {lang === 'en' ? 'Live on GitHub Pages (Zero-Terminal Method)' : 'GitHub থেকে লাইভ (টার্মিনাল ছাড়া সবচেয়ে সহজ উপায়)'}
                      </span>
                    </div>
                    <p className="text-blue-800 text-xs mt-1 leading-relaxed">
                      {lang === 'en'
                        ? 'Download the complete GitHub-ready source code ZIP, upload it directly on github.com in your browser, and turn on GitHub Pages in 2 clicks.'
                        : 'টার্মিনাল বা কমান্ড প্রম্পটে এরর আসলে চিন্তা নেই! সরাসরি নিচের বাটনে ক্লিক করে পুরো প্রজেক্ট জিপ ফাইলটি নামিয়ে ব্রাউজারে ড্র্যাগ-অ্যান্ড-ড্রপ করে আপলোড করে দিন।'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await downloadGithubReadyZip();
                      } catch (e) {
                        console.error('Failed to download zip:', e);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Project ZIP</span>
                  </button>
                </div>
              </div>

              {/* Step by step without terminal */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  {lang === 'en' ? 'Method A: Upload via Browser (Zero Terminal Required)' : 'পদ্ধতি ১: ব্রাউজার দিয়ে সরাসরি আপলোড (টার্মিনাল বা কমান্ড লাগবে না):'}
                </h3>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>জিপ ফাইলটি ডাউনলোড করে আনজিপ করুন</span>
                    </div>
                    <p className="text-slate-600 text-[11px] ml-7">
                      উপরের <strong>"Download Project ZIP"</strong> বাটনে ক্লিক করে <code>metapulse-github-ready.zip</code> ফাইলটি ডাউনলোড করুন এবং আপনার কম্পিউটারে Extract/Unzip করুন।
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>GitHub-এ আপলোড করুন</span>
                    </div>
                    <p className="text-slate-600 text-[11px] ml-7 leading-relaxed">
                      <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">github.com/new</a>-এ গিয়ে রিপোজিটরি তৈরি করুন। এরপর পেজে <strong>"uploading an existing file"</strong> বাটনে ক্লিক করে আনজিপ করা ফোল্ডারের ফাইলগুলো টেনে এনে ড্রপ করুন এবং <strong>Commit changes</strong> চাপুন।
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                      <span>GitHub Pages চালু করুন (মাত্র ২টি ক্লিক)</span>
                    </div>
                    <p className="text-emerald-800 text-[11px] ml-7 leading-relaxed">
                      রিপোজিটরি পেজের <strong>Settings</strong> $\rightarrow$ <strong>Pages</strong>-এ যান। <strong>Source</strong> ড্রপডাউন থেকে <strong>`GitHub Actions`</strong> সিলেক্ট করুন। সাথে সাথেই আপনার সাইট লাইভ হয়ে যাবে!
                    </p>
                  </div>
                </div>
              </div>

              {/* Terminal instructions as Alternative */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">
                    পদ্ধতি ২: টার্মিনাল কমান্ড (কমান্ড এরর সমাধান):
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyGit}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {copiedGitCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedGitCmd ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  কমান্ড রান না হওয়ার কারণ: আপনার কম্পিউটারে <strong>Git</strong> সফটওয়্যার ইনস্টল নেই। সমাধান: সরাসরি পদ্ধতি ১ দিয়ে ব্রাউজারে আপলোড করুন, অথবা <a href="https://git-scm.com/downloads" target="_blank" rel="noreferrer" className="text-blue-600 underline">git-scm.com</a> থেকে Git ইনস্টল করে নিন।
                </div>
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-[11px] overflow-x-auto whitespace-pre">
                  {gitCommands}
                </div>
              </div>

              {/* Live URL Preview box */}
              <div className="p-3 bg-slate-100 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium">আপনার লাইভ ওয়েবসাইট ঠিকানা হবে:</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    https://&lt;your-username&gt;.github.io/&lt;repo-name&gt;/
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Free HTTPS & 100% Uptime
                </span>
              </div>
            </div>
          ) : activeTab === 'instant' ? (
            <div className="space-y-5">
              {/* Phone Install Banner */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-900 text-sm">
                      {lang === 'en' ? 'Direct Mobile Installation Ready' : 'ফোনে সরাসরি ইনস্টলেশন প্রস্তুত'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Standalone WebAPK
                  </span>
                </div>

                <p className="text-emerald-800 text-xs leading-relaxed">
                  {lang === 'en'
                    ? 'Android Chrome automatically packages this app into a native WebAPK. It installs directly on your homescreen, operates full-screen with offline support, and does not require manual file downloads.'
                    : 'আপনার অ্যান্ড্রয়েড ফোনের গুগল ক্রোম ব্রাউজার এই অ্যাপটিকে স্বয়ংক্রিয়ভাবে নেটিভ WebAPK-এ রূপান্তর করে। এটি অ্যাপ আইকন সহ সরাসরি হোমস্ক্রিনে ইনস্টল হয়ে যায় এবং অফলাইনেও কাজ করে।'}
                </p>

                {/* Direct Install Button (if browser event available) */}
                {isInstallable && (
                  <button
                    type="button"
                    onClick={install}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Tap to Install on this Device Now' : 'এখনই এই ডিভাইসে ইনস্টল করুন'}</span>
                  </button>
                )}
              </div>

              {/* Step by step for opening on phone */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  {lang === 'en' ? 'How to install on any Android phone:' : 'যেকোনো অ্যান্ড্রয়েড ফোনে ইনস্টল করার সহজ নিয়ম:'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <div className="font-bold text-slate-900">১. লিংকটি ওপেন করুন</div>
                    <div className="text-slate-600 text-[11px]">
                      আপনার অ্যান্ড্রয়েড ফোনের <strong>Chrome</strong> ব্রাউজারে অ্যাপটির লাইভ লিংকটি ওপেন করুন।
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <div className="font-bold text-slate-900">২. মেনুতে ট্যাপ করুন</div>
                    <div className="text-slate-600 text-[11px]">
                      Chrome-এর ডানদিকের ৩-ডট মেনুতে ট্যাপ করে <strong>Install app</strong> বা <strong>Add to Home screen</strong> চাপুন।
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <div className="font-bold text-slate-900">৩. অ্যাপ রেডি!</div>
                    <div className="text-slate-600 text-[11px]">
                      আপনার ফোনের অ্যাপ লিস্ট ও হোমস্ক্রিনে মেটাপালসের অ্যাপ আইকন চলে আসবে।
                    </div>
                  </div>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div className="p-3.5 bg-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
                  <span>{lang === 'en' ? 'Live Mobile App URL:' : 'ফোনে ওপেন করার লাইভ লিংক:'}</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-800 break-all select-all bg-white p-2 rounded border border-slate-200">
                  {appLiveUrl}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Project Download Strip */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm">
                      {lang === 'en' ? 'Complete Android Studio Project Source' : 'সম্পূর্ণ Android Studio প্রজেক্ট সোর্স কোড'}
                    </h3>
                    <p className="text-blue-800 text-[11px] mt-0.5">
                      Includes Gradle Wrapper (gradlew), Gradle 8, Kotlin, WebView, Material 3, and AndroidManifest permissions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await downloadAndroidProjectZip();
                      } catch (err) {
                        console.error('Failed to generate zip:', err);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Project (.zip)</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  {lang === 'en' ? 'Step-by-Step: Generate Signed APK in Android Studio' : 'Android Studio দিয়ে Signed APK তৈরির সহজ ধাপ:'}
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900">প্রজেক্ট ওপেন করুন:</strong> 
                      <span className="text-slate-600 ml-1">
                        ডাউনলোড করা <code>metapulse-android-project.zip</code> ফাইলটি আনজিপ করুন। Android Studio ওপেন করে <strong>Open Project</strong> দিয়ে <code>android</code> ফোল্ডারটি সিলেক্ট করুন।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900">Gradle Sync হতে দিন:</strong> 
                      <span className="text-slate-600 ml-1">
                        Android Studio স্বয়ংক্রিয়ভাবে প্রয়োজনীয় লাইব্রেরি ও SDK সিঙ্ক করে নেবে (১-২ মিনিট সময় লাগতে পারে)।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900">Generate Signed APK মেনুতে যান:</strong> 
                      <span className="text-slate-600 ml-1">
                        Android Studio-র ওপরের মেনু বার থেকে <strong>Build</strong> $\rightarrow$ <strong>Generate Signed Bundle / APK...</strong> অপশনে ক্লিক করুন।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <strong className="text-slate-900">APK অপশন সিলেক্ট করুন:</strong> 
                      <span className="text-slate-600 ml-1">
                        <strong>APK</strong> রেডিও বাটনটি সিলেক্ট করে <strong>Next</strong> চাপুন।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      5
                    </span>
                    <div>
                      <strong className="text-slate-900">Keystore তৈরি বা সিলেক্ট করুন:</strong> 
                      <span className="text-slate-600 ml-1">
                        যদি আগে Keystore না থাকে, <strong>Create new...</strong>-এ ক্লিক করে একটি পাসওয়ার্ড দিয়ে Keystore তৈরি করে নিন, অথবা <strong>debug</strong> মোডে সরাসরি রান করুন।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      6
                    </span>
                    <div>
                      <strong className="text-slate-900">Build Variants:</strong> 
                      <span className="text-slate-600 ml-1">
                        <strong>release</strong> সিলেক্ট করে <strong>V1 ও V2 (Full APK Signature)</strong> চেকমার্ক দিয়ে <strong>Finish</strong> চাপুন।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      7
                    </span>
                    <div>
                      <strong className="text-emerald-900">APK প্রস্তুত ও ফোনে ইনস্টল:</strong> 
                      <span className="text-emerald-800 ml-1">
                        Android Studio আপনার সাইনড APK ফাইলটি তৈরি করে <code>android/app/release/app-release.apk</code>-তে সেভ করবে। ফাইলটি যেকোনো উপায়ে ফোনে নিয়ে ক্লিক করলেই সরাসরি ইনস্টল হয়ে যাবে!
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>প্রজেক্টে অন্তর্ভুক্ত অ্যান্ড্রয়েড পারমিশনসমূহ:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                  <div>✓ INTERNET</div>
                  <div>✓ ACCESS_NETWORK_STATE</div>
                  <div>✓ WRITE_EXTERNAL_STORAGE</div>
                  <div>✓ DOWNLOAD_WITHOUT_NOTIFICATION</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
