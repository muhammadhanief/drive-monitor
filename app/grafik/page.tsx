"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicBarChart = dynamic(
  () => import('recharts').then(mod => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = mod;
    return function Chart({ data }: { data: { user: string; downloads: number }[] }) {
      const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
      return (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="user" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} label={{ value: 'Jumlah Unduh', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: any) => [`${value} unduhan`, 'Jumlah']} labelFormatter={(label: string) => `User: ${label}`} />
              <Bar dataKey="downloads" name="Unduhan" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    };
  }),
  { ssr: false, loading: () => <div style={{ height: 400 }} className="flex items-center justify-center">Loading chart...</div> }
);

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

const KABKOT_DICTIONARY: Record<string, string> = {
  '3301': 'Cilacap',
  '3302': 'Banyumas',
  '3303': 'Purbalingga',
  '3304': 'Banjarnegara',
  '3305': 'Kebumen',
  '3306': 'Purworejo',
  '3307': 'Wonosobo',
  '3308': 'Magelang',
  '3309': 'Boyolali',
  '3310': 'Klaten',
  '3311': 'Sukoharjo',
  '3312': 'Wonogiri',
  '3313': 'Karanganyar',
  '3314': 'Sragen',
  '3315': 'Grobogan',
  '3316': 'Blora',
  '3317': 'Rembang',
  '3318': 'Pati',
  '3319': 'Kudus',
  '3320': 'Jepara',
  '3321': 'Demak',
  '3322': 'Semarang',
  '3323': 'Temanggung',
  '3324': 'Kendal',
  '3325': 'Batang',
  '3326': 'Pekalongan',
  '3327': 'Pemalang',
  '3328': 'Tegal',
  '3329': 'Brebes',
  '3371': 'Kota Magelang',
  '3372': 'Kota Surakarta',
  '3373': 'Kota Salatiga',
  '3374': 'Kota Semarang',
  '3375': 'Kota Pekalongan',
  '3376': 'Kota Tegal',
};

interface ApiResponse {
  success: boolean;
  data: DownloadItem[];
  error?: string;
}

export default function GrafikPage() {
  const [result, setResult] = useState<ApiResponse>({ success: true, data: [] });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ user: string; downloads: number }[]>([]);

  useEffect(() => {
    fetch('/api/download-activity')
      .then(res => res.json())
      .then(data => {
        setResult(data);
        
        const userDownloadCount = data.data.reduce((acc: Record<string, number>, item: DownloadItem) => {
          const user = item.user || 'unknown';
          const kabkotCode = item.kabkot || '-';
          const kabkotName = KABKOT_DICTIONARY[kabkotCode] || '';
          
          const displayUser = kabkotCode !== '-' 
            ? `${kabkotCode}-${kabkotName}-${user}` 
            : user;
            
          acc[displayUser] = (acc[displayUser] || 0) + 1;
          return acc;
        }, {});

        const processedData = Object.entries(userDownloadCount)
          .map(([user, count]) => ({ user, downloads: count as number }))
          .sort((a, b) => b.downloads - a.downloads);
        
        setChartData(processedData);
        setLoading(false);
      })
      .catch(err => {
        setResult({ success: false, data: [], error: err.message });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

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
          <>
            <div className="bg-white rounded-lg shadow p-6">

              <div style={{ width: '100%', height: 400 }}>
                <DynamicBarChart data={chartData} />
              </div>
            </div>


          </>
        )}
      </div>
    </div>
  );
}
