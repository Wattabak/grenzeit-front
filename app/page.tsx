import Link from 'next/link'
import * as Ces from "cesium";

Ces.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNTcyMWYwMi0yZGQ5LTRmODYtYjhmOS1mYTMzNWIxZGU2ZWEiLCJpZCI6MTAwNTk0LCJpYXQiOjE2NTczMjAzODZ9._CN9Nveo0jvNiWgNDR-B3NKhUWEmbXZS1IQHt_qciCM";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Link href="/countries">List of countries</Link>
      </div>
    </main>
  )
}
