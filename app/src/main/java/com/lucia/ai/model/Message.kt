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
