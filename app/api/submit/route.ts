import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Método 1: Vía un Google Apps Script Webhook (Si configuras esta variable)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (GOOGLE_SCRIPT_URL) {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return res.ok 
        ? NextResponse.json({ success: true, method: "Webhook" }, { status: 200 })
        : NextResponse.json({ success: false, message: "Error al guardar con Webhook" }, { status: 500 });
    }

    // Método 2: Usando googleapis directamente (Recomendado, requiere Service Account en Google Cloud)
    const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID } = process.env;

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID) {
      console.log("Faltan variables de entorno para Google Sheets (simulación activada):", body);
      return NextResponse.json({ success: true, message: "Modo simulación" }, { status: 200 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // En Vercel a veces los saltos de línea literales \n vienen como texto, hay que reemplazarlos
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Extraemos campos basados en los IDs de questions de app/page.tsx
    const rowData = [
      new Date().toISOString(), // Fecha/hora de envío
      body.DEM01, body.DEM02, body.DEM03, // Demográficos
      body.FIL01, body.FIL02,             // Hábitos & Filtro
      body.UP01, body.UP02, body.UP03,    // Utilidad Percibida
      body.FU01, body.FU02, body.FU03,    // Facilidad de Uso
      body.IS01, body.IS02, body.IS03,    // Influencia Social
      body.CO01, body.CO02, body.CO03,    // Confianza
      body.VA01, body.VA02, body.VA03,    // Socioeconómicas
      body.IP01, body.IP02, body.IP03     // Intención Final
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: 'A:A', // Usamos A:A para que Google Sheets busque el final en toda la columna y no empuje las celdas desde A1
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS', // Inserta fila nueva al final de la tabla real
      requestBody: {
        values: [rowData],
      },
    });

    return NextResponse.json({ success: true, method: "Google API" }, { status: 200 });
    
  } catch (error) {
    console.error("Error en el API route (Google Sheets):", error);
    return NextResponse.json({ success: false, message: "Error interno al guardar en Google Sheets" }, { status: 500 });
  }
}