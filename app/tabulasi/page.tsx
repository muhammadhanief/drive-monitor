"use client";

import { useState, useEffect } from 'react';
import { SummaryTable } from '@/app/components/SummaryTable';

const KABKOT_DICTIONARY: Record<string, string> = {
  '3301': 'Kab. Cilacap',
  '3302': 'Kab. Banyumas',
  '3303': 'Kab. Purbalingga',
  '3304': 'Kab. Banjarnegara',
  '3305': 'Kab. Kebumen',
  '3306': 'Kab. Purworejo',
  '3307': 'Kab. Wonosobo',
  '3308': 'Kab. Magelang',
  '3309': 'Kab. Boyolali',
  '3310': 'Kab. Klaten',
  '3311': 'Kab. Sukoharjo',
  '3312': 'Kab. Wonogiri',
  '3313': 'Kab. Karanganyar',
  '3314': 'Kab. Sragen',
  '3315': 'Kab. Grobogan',
  '3316': 'Kab. Blora',
  '3317': 'Kab. Rembang',
  '3318': 'Kab. Pati',
  '3319': 'Kab. Kudus',
  '3320': 'Kab. Jepara',
  '3321': 'Kab. Demak',
  '3322': 'Kab. Semarang',
  '3323': 'Kab. Temanggung',
  '3324': 'Kab. Kendal',
  '3325': 'Kab. Batang',
  '3326': 'Kab. Pekalongan',
  '3327': 'Kab. Pemalang',
  '3328': 'Kab. Tegal',
  '3329': 'Kab. Brebes',
  '3371': 'Kota Magelang',
  '3372': 'Kota Surakarta',
  '3373': 'Kota Salatiga',
  '3374': 'Kota Semarang',
  '3375': 'Kota Pekalongan',
  '3376': 'Kota Tegal',
};

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

interface UserSummary {
  kabkot: string;
  user: string;
  downloads: number | string;
}

export default function TabulasiPage() {
  const [result, setResult] = useState<ApiResponse>({ success: true, data: [] });
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<UserSummary[]>([]);

  useEffect(() => {
    fetch('/api/download-activity')
      .then(res => res.json())
      .then(data => {
        setResult(data);
        
        const userDownloadCount = data.data.reduce((acc: Record<string, { kabkot: string; user: string; downloads: number }>, item: DownloadItem) => {
          const user = item.user || 'unknown';
          const kabkotCode = item.kabkot || '-';
          const key = `${kabkotCode}-${user}`;
          
          if (!acc[key]) {
            acc[key] = { kabkot: kabkotCode, user, downloads: 0 };
          }
          acc[key].downloads += 1;
          return acc;
        }, {} as Record<string, { kabkot: string; user: string; downloads: number }>);

        const finalData: UserSummary[] = [];
        const seenKeys = new Set<string>();

        // Process dictionary items
        Object.keys(KABKOT_DICTIONARY).sort().forEach(code => {
          const name = KABKOT_DICTIONARY[code];
          const usersInKabkot = Object.values(userDownloadCount).filter(u => u.kabkot === code);
          
          if (usersInKabkot.length > 0) {
            usersInKabkot.forEach(u => {
              finalData.push({
                kabkot: `${code} - ${name}`,
                user: u.user,
                downloads: u.downloads
              });
              seenKeys.add(`${u.kabkot}-${u.user}`);
            });
          } else {
            finalData.push({
              kabkot: `${code} - ${name}`,
              user: '',
              downloads: ''
            });
          }
        });

        // Add any items from data not in dictionary
        Object.values(userDownloadCount).forEach(u => {
          if (!seenKeys.has(`${u.kabkot}-${u.user}`)) {
            finalData.push({
              kabkot: u.kabkot,
              user: u.user,
              downloads: u.downloads
            });
          }
        });
        
        setSummaryData(finalData);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabulasi Rekapitulasi per User</h1>
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
          <SummaryTable data={summaryData} />
        )}
      </div>
    </div>
  );
}
