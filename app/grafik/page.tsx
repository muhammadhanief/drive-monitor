import GrafikClient from './GrafikClient';

interface DownloadItem {
  id: number;
  timestamp: number;
  user: string;
  affecteduser: string;
  fileName: string;
  token: string;
  filePath: string;
  kabkot?: string;
}

interface ApiResponse {
  success: boolean;
  data: DownloadItem[];
  error?: string;
}

async function getDownloadData(): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/download-activity`, {
      cache: 'no-store'
    });
    if (!res.ok) return { success: false, data: [], error: `Failed to fetch: ${res.statusText}` };
    return res.json();
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export default async function GrafikPage() {
  const result = await getDownloadData();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grafik Unduh File</h1>
        <div className="flex flex-col gap-1 mb-8">
          <p className="text-gray-600">
            Data terakhir diperbarui: {new Date().toLocaleString('id-ID', { 
              weekday: 'long', 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Asia/Jakarta'
            }).replace(/\./g, ':')} WIB
          </p>
          <p className="text-[11px] font-bold text-blue-600/60 uppercase tracking-widest">
            Data terekam mulai 06/05/2026 12:00 WIB
          </p>
        </div>

        {!result.success ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Gagal memuat data: {result.error}</p>
          </div>
        ) : (
          <GrafikClient data={result.data} />
        )}
      </div>
    </div>
  );
}
