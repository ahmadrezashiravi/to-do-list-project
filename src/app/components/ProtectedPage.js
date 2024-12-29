// components/ProtectedPage.js
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function ProtectedPage({ children }) {
  const router = useRouter();
  const session = getSession();

  if (!session) {
    // اگر کاربر وارد نشده بود، به صفحه ورود هدایت می‌شود
    router.push('/auth/login');
    return null;
  }

  return children;
}
