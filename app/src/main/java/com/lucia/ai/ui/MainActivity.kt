package com.lucia.ai.ui

import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.lucia.ai.R
import com.lucia.ai.model.RecentChat

class MainActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        drawerLayout = findViewById(R.id.drawer_layout)

        val btnMenu = findViewById<View>(R.id.btn_menu)
        val btnNewChatTop = findViewById<View>(R.id.btn_new_chat_top)
        val btnNewChatSidebar = findViewById<View>(R.id.btn_new_chat_sidebar)
        val btnProfile = findViewById<View>(R.id.btn_profile)

        // Sidebar chat history
        val rvSidebar = findViewById<RecyclerView>(R.id.rv_sidebar_chats)
        rvSidebar.layoutManager = LinearLayoutManager(this)
        rvSidebar.adapter = RecentChatsAdapter(listOf(
            RecentChat("Explain quantum computing", "Quantum computing uses...", "9:30 AM"),
            RecentChat("Plan a 7-day workout", "Here's a balanced plan...", "Yesterday"),
            RecentChat("Write a blog post", "Being productive...", "Mon")
        ))

        loadFragment(HomeFragment())

        btnMenu.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        btnNewChatTop.setOnClickListener {
            loadFragment(ChatFragment())
        }

        btnNewChatSidebar.setOnClickListener {
            drawerLayout.closeDrawer(GravityCompat.START)
            loadFragment(ChatFragment())
        }

        btnProfile.setOnClickListener {
            drawerLayout.closeDrawer(GravityCompat.START)
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
