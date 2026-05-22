import mysql from 'mysql2/promise';
import { NextRequest } from 'next/server';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000
};

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get('page');
  const limitParam = request.nextUrl.searchParams.get('limit');
  const scope = request.nextUrl.searchParams.get('scope') || 'dtsen';
  const hasPagination = pageParam !== null || limitParam !== null;

  const fileFilter = scope === 'all' ? '' : "AND file LIKE '%DTSEN/%'";

  let page = 1, limit = 0;
  if (hasPagination) {
    page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limitParam || '50', 10) || 50));
  }

  try {
    const conn = await mysql.createConnection(dbConfig);

    let total = 0;
    if (hasPagination) {
      const [countResult] = await conn.execute(
        `SELECT COUNT(*) as total FROM oc_activity
         WHERE app = 'files_downloadactivity' ${fileFilter}`
      );
      total = (countResult as any[])[0].total;
    }

    const offset = limit > 0 ? (page - 1) * limit : 0;

    const [rows] = await conn.execute(
      `SELECT activity_id, timestamp, user, affecteduser, subject, subjectparams, file
       FROM oc_activity
       WHERE app = 'files_downloadactivity' ${fileFilter}
       ORDER BY timestamp DESC
       ${limit > 0 ? 'LIMIT ? OFFSET ?' : ''}`,
      limit > 0 ? [limit, offset] : []
    );

    await conn.end();

    interface ActivityRow {
      activity_id: number;
      timestamp: number;
      user: string;
      affecteduser: string;
      subject: string;
      subjectparams: string;
      file: string;
    }

    const rawData = (rows as ActivityRow[]).map(row => {
      let fileName = row.file;
      let token = '';

      try {
        const params = JSON.parse(row.subjectparams);
        if (Array.isArray(params) && params.length > 0) {
          fileName = params[0].replace(/^\\/g, '');
          if (params.length > 1) token = params[1];
        }
      } catch {
        // use raw values if parsing fails
      }

      return {
        id: row.activity_id,
        timestamp: row.timestamp,
        user: row.user,
        affecteduser: row.affecteduser,
        fileName,
        token,
        filePath: row.file
      };
    });

    const userKabkotMap: Record<string, string> = {};
    rawData.forEach(item => {
      const match = item.filePath.match(/\d{4}\/(\d{4})\b/);
      if (match && match[1]) {
        userKabkotMap[item.user] = match[1];
      }
    });

    const data = rawData.map(item => ({
      ...item,
      kabkot: userKabkotMap[item.user] || '-'
    }));

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    return Response.json({
      success: true,
      data,
      ...(hasPagination ? { total, page, limit, totalPages } : {})
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
