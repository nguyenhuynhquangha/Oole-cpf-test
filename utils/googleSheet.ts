import { google } from 'googleapis'
import fs from 'fs'

const SPREADSHEET_ID = '1TnCX3WfR5vP0Z9Qgt3ygjK2lhBUkPSQ4f-0akEEQoCs'

// Tạo auth dùng chung
function getAuth() {
    let credentialsJson: string
    
    // Try to read from environment variable first (for CI/CD)
    if (process.env.SERVICE_ACCOUNT_JSON) {
        credentialsJson = process.env.SERVICE_ACCOUNT_JSON
    } else {
        // Fall back to file (for local development)
        credentialsJson = fs.readFileSync('service-account.json', 'utf8')
    }
    
    return new google.auth.GoogleAuth({
        credentials: JSON.parse(credentialsJson),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'], // ✅ READ + WRITE
    })
}

async function getSheets() {
    const auth = await getAuth()
    return google.sheets({ version: 'v4', auth })
}

//
// ===============================
// 1️⃣ LẤY DANH SÁCH WALKERS
// ===============================
//
export async function getWalkerList() {
    const sheets = await getSheets()

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Walkers!C2:C',
    })

    const rows = response.data.values || []

    return rows.map(row => row[0]).filter(Boolean)
}

//
// ===============================
// 2️⃣ UPDATE A2 (View By Walker)
// ===============================
//
export async function updateWalkerInViewSheet(walkerName: string) {
    const sheets = await getSheets()

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'View By Walker!A2',
        valueInputOption: 'RAW',
        requestBody: {
            values: [[walkerName]],
        },
    })
}

//
// ===============================
// 3️⃣ GET SPECIFIC DATA (GIỮ NGUYÊN)
// ===============================
//
export async function getSpecificData() {

    const sheets = await getSheets()

    const response = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: SPREADSHEET_ID,
        ranges: [
            'View By Walker!A2',
            'View By Walker!A5',
            'View By Walker!D5',
            'View By Walker!A8',
            'View By Walker!B8',
            'View By Walker!C8',
            'View By Walker!D8',
            'View By Walker!E8',
            'View By Walker!F8',
            'View By Walker!G8',
            'View By Walker!H8',
            'View By Walker!B12:B'
        ],
    })

    const ranges = response.data.valueRanges || []

    const jobRows = ranges[11]?.values || []

    const jobs = jobRows
        .map(row => row[0])
        .filter(Boolean)

    return {
        A2: ranges[0]?.values?.[0]?.[0],
        A5: ranges[1]?.values?.[0]?.[0],
        D5: ranges[2]?.values?.[0]?.[0],
        A8: ranges[3]?.values?.[0]?.[0],
        B8: ranges[4]?.values?.[0]?.[0],
        C8: ranges[5]?.values?.[0]?.[0],
        D8: ranges[6]?.values?.[0]?.[0],
        E8: ranges[7]?.values?.[0]?.[0],
        F8: ranges[8]?.values?.[0]?.[0],
        G8: ranges[9]?.values?.[0]?.[0],
        H8: ranges[10]?.values?.[0]?.[0],
        jobs
    }
}