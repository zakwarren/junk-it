import Link from "next/link";

interface Props {
  currentUser: {
    id: string;
    email: string;
  } | null;
}

export const Header = ({ currentUser }: Props) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter(Boolean)
    .map(
      (l) =>
        l && (
          <li
            key={l.href}
            className="inline-block mt-0 mr-4 text-white hover:text-purple-200 cursor-pointer"
          >
            <Link href={l.href}>
              <a>{l.label}</a>
            </Link>
          </li>
        )
    );

  return (
    <nav className="flex items-center justify-between flex-wrap bg-purple-800 p-6">
      <div className="flex items-center flex-no-shrink text-white mr-6 hover:text-purple-200">
        <Link href="/">
          <a className="font-semibold text-xl tracking-tight">Junk It</a>
        </Link>
      </div>
      <div className="block flex flex-grow items-center w-auto text-right">
        <ul className="text-sm flex-grow">{links}</ul>
      </div>
    </nav>
  );
};
