"use client"

import { useState, useEffect } from "react"
import { supabase, checkSupabaseConnection } from "@/lib/supabase-client"

export default function SupabaseInfo() {
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [contactCount, setContactCount] = useState<number | null>(null)

  useEffect(() => {
    async function checkConnection() {
      const status = await checkSupabaseConnection()
      setConnectionStatus(status)

      if (status) {
        const { count, error } = await supabase.from("contacts").select("*", { count: "exact", head: true })

        if (error) {
          console.error("Error fetching contact count:", error)
        } else {
          setContactCount(count)
        }
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold mb-2">Supabase Connection Info</h2>
      <p>Connection Status: {connectionStatus === null ? "Checking..." : connectionStatus ? "Connected" : "Failed"}</p>
      {contactCount !== null && <p>Total Contacts: {contactCount}</p>}
    </div>
  )
}

