'use server';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username dan Password wajib diisi.' };
  }

  try {
    const apiKey = 'cff0d1e8a59e84cc093561082f6cae5103a3cd1f19882913c993e72ff6092c93';
    
    const res = await fetch('https://jateng.web.bps.go.id/apiconnect/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Origin': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      },
      body: JSON.stringify({ username, password })
    });

    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return { error: `Respons API bukan JSON. Status: ${res.status}, Body: ${responseText.substring(0, 200)}` };
    }

    if (!res.ok) {
      return { error: `Gagal login. Status: ${res.status}. Data: ${JSON.stringify(data)}` };
    }

    // Checking if the API actually succeeded but wrapped in { success: false }
    if (data.success === false || data.status === 'error') {
      return { error: `Gagal dari API: ${JSON.stringify(data)}` };
    }

    // Batasi akses hanya untuk Satker 3300 (BPS Provinsi Jawa Tengah)
    if (data.data?.kd_satker !== '3300') {
      return { error: `Akses ditolak. Aplikasi ini hanya untuk pegawai BPS Provinsi Jawa Tengah (Satker 3300).` };
    }

    await createSession(data);
    
  } catch (error: any) {
    return { error: `Terjadi kesalahan internal: ${error.message}` };
  }

  redirect('/grafik');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
