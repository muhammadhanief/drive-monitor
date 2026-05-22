import { DataTable } from '@/app/components/DataTable';

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
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  error?: string;
}

async function getDownloadData(page: number, limit: number): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/download-activity?scope=all&page=${page}&limit=${limit}`, {
      cache: 'no-store'
    });
    if (!res.ok) return { success: false, data: [], error: `Failed to fetch: ${res.statusText}` };
    return res.json();
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export default async function AllActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const limit = Math.max(1, parseInt(params.limit || '10', 10) || 10);

  const result = await getDownloadData(page, limit);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Riwayat Unduh File (Semua)
        </h1>
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

        </div>

        {!result.success ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Gagal memuat data: {result.error}</p>
          </div>
        ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <DataTable
                data={result.data}
                page={result.page!}
                limit={result.limit!}
                total={result.total!}
                totalPages={result.totalPages!}
              />
            </div>
        )}
      </div>
    </div>
  );
}
