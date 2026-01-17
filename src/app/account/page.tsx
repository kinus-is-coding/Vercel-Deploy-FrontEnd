import { getAuthStatus } from '@/lib/loginAction';
import { redirect } from 'next/navigation';
import LockerList from '@/components/LockerList';
import Layout from '@/components/Layout';

const AccountPage = async () => {
  const { isLoggedIn } = await getAuthStatus();

  if (!isLoggedIn) {
    redirect('/');
  }

  // Fetch virtual keys from our own API route (server-side fetch is fine)
  // Actually, since it's a server component, we could fetch directly from Django if we have the token
  // But using our proxy is also fine and keeps logic consistent.
  // However, server components calling their own API routes via fetch is sometimes discouraged in Next.js
  // if it can be done directly. But let's use the proxy for simplicity of headers etc.
  // Wait, the proxy needs the cookie which standard fetch won't send automatically on server-side 
  // unless we pass it. 

  // Better: just fetch from the Django API directly here or use the same logic as the proxy.

  const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('session_access_token')?.value;

  let lockers = [];
  try {
    const res = await fetch(`${DJANGO_API_BASE_URL}/posts/my_virtual_keys/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
    if (res.ok) {
      lockers = await res.json();
      console.log(lockers)
    }
  } catch (error) {
    console.error("Error fetching lockers:", error);
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">My Lockers (Virtual Keys)</h2>
        {lockers.length === 0 ? (
          <p className="text-gray-500">You don't have any active lockers.</p>
        ) : (
          <LockerList lockers={lockers} />
        )}
      </section>
    </div>
  );
};

export default AccountPage;
