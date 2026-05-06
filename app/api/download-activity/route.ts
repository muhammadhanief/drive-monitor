import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000
};

export async function GET() {
  try {
    const conn = await mysql.createConnection(dbConfig);

    const [rows] = await conn.execute(
      `SELECT activity_id, timestamp, user, affecteduser, subject, subjectparams, file
       FROM oc_activity
       WHERE app = 'files_downloadactivity' AND file LIKE '%DTSEN/%'
       ORDER BY timestamp DESC
       LIMIT 100`
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

    return Response.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
