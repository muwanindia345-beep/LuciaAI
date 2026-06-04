package com.lucia.ai.model

data class Message(
    val content: String,
    val isUser: Boolean,
    val timestamp: String
)

data class ChatRequest(
    val message: String
)

data class ChatResponse(
    val reply: String
)

data class RecentChat(
    val title: String,
    val preview: String,
    val time: String
)

data class GitHubRelease(
    val tag_name: String,
    val name: String,
    val body: String,
    val assets: List<ReleaseAsset>
)

data class ReleaseAsset(
    val name: String,
    val browser_download_url: String
)
