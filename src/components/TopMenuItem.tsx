import Link from 'next/link';

interface TopMenuItemProps {
  title: string;
  pageRef: string;
}

export default function TopMenuItem({ title, pageRef }: TopMenuItemProps) {
  return (
    <Link href={pageRef} className="font-bold text-[#704F54] hover:text-gray-900 transition-colors">
      {title}
    </Link>
  );
}