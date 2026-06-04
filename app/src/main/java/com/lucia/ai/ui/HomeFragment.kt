package com.lucia.ai.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.lucia.ai.R
import com.lucia.ai.model.RecentChat

class HomeFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val rvRecentChats = view.findViewById<RecyclerView>(R.id.rv_recent_chats)
        rvRecentChats.layoutManager = LinearLayoutManager(requireContext())
        val dummyChats = listOf(
            RecentChat("Explain quantum computing", "Quantum computing uses...", "9:30 AM"),
            RecentChat("Plan a 7-day workout", "Here's a balanced plan...", "Yesterday"),
            RecentChat("Write a blog post", "Being productive...", "Yesterday")
        )
        rvRecentChats.adapter = RecentChatsAdapter(dummyChats)
    }
}
