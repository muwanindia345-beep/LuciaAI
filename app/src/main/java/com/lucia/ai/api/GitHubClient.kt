package com.lucia.ai.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object GitHubClient {
    val instance: GitHubService by lazy {
        Retrofit.Builder()
            .baseUrl("https://api.github.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(GitHubService::class.java)
    }
}
