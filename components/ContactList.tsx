"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDebounce } from "@/hooks/useDebounce"
import { Loader2 } from "lucide-react"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const fetchContacts = useCallback(async () => {
    try {
      setError(null)
      let query = supabase.from("contacts").select("*").order("name", { ascending: true })

      if (debouncedSearchTerm) {
        query = query.or(
          `name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%,company.ilike.%${debouncedSearchTerm}%`,
        )
      }

      const { data, error } = await query

      if (error) throw error

      setContacts(data || [])
    } catch (err) {
      console.error("Error fetching contacts:", err)
      setError("Failed to fetch contacts. Please try again.")
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </div>

      {error ? (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchContacts} variant="outline" className="mt-2">
            Try again
          </Button>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            {debouncedSearchTerm ? "No contacts found matching your search." : "No contacts available."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.company}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

