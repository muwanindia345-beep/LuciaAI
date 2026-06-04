package com.lucia.ai.utils

import android.app.Activity
import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Build
import android.os.Environment
import androidx.appcompat.app.AlertDialog
import androidx.core.content.FileProvider
import com.lucia.ai.BuildConfig
import com.lucia.ai.api.GitHubClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

object UpdateManager {

    private const val OWNER = "muwanindia345-beep"
    private const val REPO = "LuciaAI"

    fun checkForUpdate(activity: Activity) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val release = GitHubClient.instance.getLatestRelease(OWNER, REPO)
                val latestVersion = release.tag_name.removePrefix("v")
                val currentVersion = BuildConfig.VERSION_NAME

                if (isNewerVersion(latestVersion, currentVersion)) {
                    val apkAsset = release.assets.firstOrNull { it.name.endsWith(".apk") }
                    if (apkAsset != null) {
                        withContext(Dispatchers.Main) {
                            showUpdateDialog(activity, latestVersion, release.body, apkAsset.browser_download_url)
                        }
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun isNewerVersion(latest: String, current: String): Boolean {
        val latestParts = latest.split(".").map { it.toIntOrNull() ?: 0 }
        val currentParts = current.split(".").map { it.toIntOrNull() ?: 0 }
        for (i in 0 until maxOf(latestParts.size, currentParts.size)) {
            val l = latestParts.getOrElse(i) { 0 }
            val c = currentParts.getOrElse(i) { 0 }
            if (l > c) return true
            if (l < c) return false
        }
        return false
    }

    private fun showUpdateDialog(activity: Activity, version: String, changelog: String, downloadUrl: String) {
        AlertDialog.Builder(activity)
            .setTitle("Update Available v$version")
            .setMessage("What's new:\n$changelog")
            .setPositiveButton("Update") { _, _ ->
                downloadAndInstall(activity, downloadUrl)
            }
            .setNegativeButton("Later", null)
            .show()
    }

    private fun downloadAndInstall(activity: Activity, url: String) {
        val request = DownloadManager.Request(Uri.parse(url))
            .setTitle("Nova AI Update")
            .setDescription("Downloading update...")
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "NovaAI-update.apk")
            .setAllowedOverMetered(true)

        val dm = activity.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
        val downloadId = dm.enqueue(request)

        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                val id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1)
                if (id == downloadId) {
                    installApk(activity)
                    activity.unregisterReceiver(this)
                }
            }
        }

        activity.registerReceiver(receiver, IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE))
    }

    private fun installApk(activity: Activity) {
        val file = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
            "NovaAI-update.apk"
        )
        val uri = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            FileProvider.getUriForFile(activity, "${activity.packageName}.provider", file)
        } else {
            Uri.fromFile(file)
        }
        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        activity.startActivity(intent)
    }
}
