// middleware/auth.js
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// HOC که محافظت از صفحه را انجام می‌دهد
export const authenticate = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    
    // دریافت سشن از next-auth
    const [session, setSession] = useState(null);

    useEffect(() => {
      const fetchSession = async () => {
        const currentSession = await getSession();
        if (!currentSession) {
          // اگر سشن وجود ندارد، کاربر را به صفحه لاگین هدایت می‌کنیم
          router.push("/login");
        } else {
          setSession(currentSession);
        }
      };

      fetchSession();
    }, [router]);

    // اگر هنوز سشن بارگذاری نشده است، صفحه را نمی‌کشیم
    if (session === null) {
      return <div>Loading...</div>;
    }

    // اگر سشن وجود داشته باشد، کامپوننت را رندر می‌کنیم
    return <WrappedComponent {...props} session={session} />;
  };
};
