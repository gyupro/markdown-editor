import { redirect } from 'next/navigation';

// Redirect root to default locale (English)
export default function RootPage() {
  redirect('/en');
}
