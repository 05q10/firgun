import { CreativeWritingForm } from "@/components/creative-writing-form"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6 bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-200">
      <h1 className="text-3xl font-bold text-center mb-8">Creative Writing Prompt Generator</h1>
      <div className="max-w-3xl mx-auto">
        <CreativeWritingForm />
      </div>
    </main>
  )
}

