import ContactList from "@/components/ContactList"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function ContactsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contact List</h1>
      <ErrorBoundary>
        <ContactList />
      </ErrorBoundary>
    </div>
  )
}

