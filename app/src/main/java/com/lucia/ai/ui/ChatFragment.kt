package com.lucia.ai.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.lucia.ai.R
import com.lucia.ai.api.RetrofitClient
import com.lucia.ai.model.ChatRequest
import com.lucia.ai.model.Message
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ChatFragment : Fragment() {

    private lateinit var rvMessages: RecyclerView
    private lateinit var etMessage: EditText
    private lateinit var btnSend: ImageButton
    private lateinit var tvStatus: TextView
    private lateinit var adapter: ChatAdapter
    private val messages = mutableListOf<Message>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_chat, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rvMessages = view.findViewById(R.id.rv_messages)
        etMessage = view.findViewById(R.id.et_message)
        btnSend = view.findViewById(R.id.btn_send)
        tvStatus = view.findViewById(R.id.tv_status)

        adapter = ChatAdapter(messages)
        rvMessages.layoutManager = LinearLayoutManager(requireContext()).apply {
            stackFromEnd = true
        }
        rvMessages.adapter = adapter

        btnSend.setOnClickListener {
            val text = etMessage.text.toString().trim()
            if (text.isNotEmpty()) {
                sendMessage(text)
                etMessage.setText("")
            }
        }
    }

    private fun sendMessage(text: String) {
        val time = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
        adapter.addMessage(Message(text, true, time))
        rvMessages.scrollToPosition(messages.size - 1)

        tvStatus.text = "typing..."
        btnSend.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.sendMessage(ChatRequest(text))
                val aiTime = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
                adapter.addMessage(Message(response.reply, false, aiTime))
                rvMessages.scrollToPosition(messages.size - 1)
                tvStatus.text = "online"
            } catch (e: Exception) {
                adapter.addMessage(Message("Error: ${e.message}", false, time))
                rvMessages.scrollToPosition(messages.size - 1)
                tvStatus.text = "online"
            } finally {
                btnSend.isEnabled = true
            }
        }
    }
}
