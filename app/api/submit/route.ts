import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Configuración para conectarse a Google Apps Script (Webhook)
    // Para Vercel + Google Sheets sin auth compleja de Service Accounts, la mejor forma 
    // es crear un Web App script en tu Google Sheet que acepte POST.
    
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    
    if (!GOOGLE_SCRIPT_URL) {
      // Si aún no está configurado, solo simulamos éxito en Vercel
      console.log("Datos recibidos (simulación):", body);
      return NextResponse.json({ success: true, message: "Modo simulación" }, { status: 200 });
    }

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Error al guardar en Google Sheets" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error en el API route:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}