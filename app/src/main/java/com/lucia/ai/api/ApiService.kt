package com.lucia.ai.api

import com.lucia.ai.model.ChatRequest
import com.lucia.ai.model.ChatResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("/chat")
    suspend fun sendMessage(@Body request: ChatRequest): ChatResponse
}
