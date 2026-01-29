import { redirect } from "next/navigation"

export default async function Page({ searchParams }: { searchParams?: Promise<{ view?: string; event?: string }> | { view?: string; event?: string } }) {
  // Await searchParams for Next.js 15+ async params
  const sp = await searchParams;
  const view = sp?.view
  const event = sp?.event

  // If the request is asking for dashboard-related content, redirect to /dashboard
  if (view && ["dashboard", "athletes", "medals", "sports", "provinces"].includes(view)) {
    const queryString = event ? `?event=${event}&view=${view}` : `?view=${view}`
    redirect(`/dashboard${queryString}`)
  }

  // If an event id is present, redirect to dashboard
  if (event) {
    redirect(`/dashboard?event=${event}`)
  }

  // Otherwise, send users to the public registration page
  redirect('/register')
}
