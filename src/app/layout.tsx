import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "ESG Reporting MVP",
  description: "MVP workspace for ESG report production"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <strong>ESG Reporting MVP</strong>
          <div className="links">
            <Link href="/">Overview</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/reports">Reports</Link>
            <Link href="/sections">Sections</Link>
            <Link href="/kpis">KPIs</Link>
            <Link href="/requirements">Requirements</Link>
            <Link href="/mappings">Mappings</Link>
            <Link href="/evidence">Evidence</Link>
            <Link href="/coverage">Coverage</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
