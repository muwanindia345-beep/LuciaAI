package com.lucia.ai.api

import com.lucia.ai.model.GitHubRelease
import retrofit2.http.GET
import retrofit2.http.Path

interface GitHubService {
    @GET("repos/{owner}/{repo}/releases/latest")
    suspend fun getLatestRelease(
        @Path("owner") owner: String,
        @Path("repo") repo: String
    ): GitHubRelease
}
