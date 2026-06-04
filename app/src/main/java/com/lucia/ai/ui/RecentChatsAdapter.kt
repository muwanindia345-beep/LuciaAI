package com.lucia.ai.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.lucia.ai.R
import com.lucia.ai.model.RecentChat

class RecentChatsAdapter(private val chats: List<RecentChat>) :
    RecyclerView.Adapter<RecentChatsAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvTitle: TextView = view.findViewById(R.id.tv_chat_title)
        val tvPreview: TextView = view.findViewById(R.id.tv_chat_preview)
        val tvTime: TextView = view.findViewById(R.id.tv_chat_time)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_recent_chat, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val chat = chats[position]
        holder.tvTitle.text = chat.title
        holder.tvPreview.text = chat.preview
        holder.tvTime.text = chat.time
    }

    override fun getItemCount() = chats.size
}
