import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Clinica. Todos os direitos reservados. <Link href="https://www.instagram.com/cicerosnt" className="hover:text-emerald-500">@cicerosnt </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}