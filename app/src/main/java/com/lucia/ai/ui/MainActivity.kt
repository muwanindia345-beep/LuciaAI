package com.lucia.ai.ui

import android.animation.ObjectAnimator
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.lucia.ai.R
import com.lucia.ai.model.RecentChat

class MainActivity : AppCompatActivity() {

    private lateinit var bottomSheet: View
    private lateinit var dimOverlay: View
    private var sheetHeight = 480f
    private var dragStartY = 0f
    private var sheetStartY = 0f
    private var isSheetOpen = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        bottomSheet = findViewById(R.id.bottom_sheet)
        dimOverlay = findViewById(R.id.dim_overlay)
        val btnNewChat = findViewById<TextView>(R.id.btn_new_chat)
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_nav)
        val btnThreeDot = findViewById<View>(R.id.btn_three_dot)

        sheetHeight = resources.displayMetrics.density * 480

        // Setup history RecyclerView
        val rvHistory = findViewById<RecyclerView>(R.id.rv_history)
        rvHistory.layoutManager = LinearLayoutManager(this)
        rvHistory.adapter = RecentChatsAdapter(listOf(
            RecentChat("Explain quantum computing", "Quantum computing uses...", "9:30 AM"),
            RecentChat("Plan a 7-day workout", "Here's a balanced plan...", "Yesterday"),
            RecentChat("Write a blog post", "Being productive...", "Yesterday")
        ))

        loadFragment(HomeFragment())

        // New chat pill
        btnNewChat.setOnClickListener {
            loadFragment(ChatFragment())
            bottomNav.selectedItemId = R.id.nav_home
        }

        // 3-dot opens history sheet
        btnThreeDot.setOnClickListener {
            openSheet()
        }

        // Dim overlay tap = close sheet
        dimOverlay.setOnClickListener {
            closeSheet()
        }

        // Drag to open/close sheet
        bottomSheet.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    dragStartY = event.rawY
                    sheetStartY = bottomSheet.translationY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dy = event.rawY - dragStartY
                    val newY = (sheetStartY + dy).coerceIn(0f, sheetHeight)
                    bottomSheet.translationY = newY
                    dimOverlay.alpha = 1f - (newY / sheetHeight)
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (bottomSheet.translationY > sheetHeight * 0.5f) {
                        closeSheet()
                    } else {
                        openSheet()
                    }
                    true
                }
                else -> false
            }
        }

        // Bottom nav
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> loadFragment(HomeFragment())
                R.id.nav_discover -> loadFragment(HomeFragment())
                R.id.nav_history -> openSheet()
                R.id.nav_profile -> loadFragment(HomeFragment())
            }
            true
        }
    }

    private fun openSheet() {
        isSheetOpen = true
        dimOverlay.visibility = View.VISIBLE
        dimOverlay.alpha = 0f
        ObjectAnimator.ofFloat(bottomSheet, "translationY", 0f).apply {
            duration = 300
            start()
        }
        ObjectAnimator.ofFloat(dimOverlay, "alpha", 1f).apply {
            duration = 300
            start()
        }
    }

    private fun closeSheet() {
        isSheetOpen = false
        ObjectAnimator.ofFloat(bottomSheet, "translationY", sheetHeight).apply {
            duration = 300
            start()
        }
        ObjectAnimator.ofFloat(dimOverlay, "alpha", 0f).apply {
            duration = 300
            start()
        }.also {
            bottomSheet.postDelayed({ dimOverlay.visibility = View.GONE }, 300)
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
