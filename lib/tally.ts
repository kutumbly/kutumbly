/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

export function generateTallyXML(db: any): string {
  if (!db) return '';
  try {
    const res = db.exec("SELECT date, amount, category, type FROM transactions ORDER BY date ASC");
    if (!res || !res.length) return '';
    const rows = res[0].values;
    
    let xml = `<ENVELOPE>\n  <HEADER>\n    <TALLYREQUEST>Import Data</TALLYREQUEST>\n  </HEADER>\n  <BODY>\n    <IMPORTDATA>\n      <REQUESTDESC>\n        <REPORTNAME>Vouchers</REPORTNAME>\n      </REQUESTDESC>\n      <REQUESTDATA>\n`;
    
    rows.forEach((v: any[]) => {
      const dateStr = String(v[0]).replace(/-/g, '');
      const amtStr = String(v[1]);
      const cat = String(v[2]);
      const type = String(v[3]);
      
      const vchType = type === 'income' ? 'Receipt' : 'Payment';
      
      xml += `        <TALLYMESSAGE xmlns:UDF="TallyUDF">\n`;
      xml += `          <VOUCHER VCHTYPE="${vchType}" ACTION="Create">\n`;
      xml += `            <DATE>${dateStr}</DATE>\n`;
      xml += `            <VOUCHERTYPENAME>${vchType}</VOUCHERTYPENAME>\n`;
      xml += `            <NARRATION>Kutumbly Export: ${cat}</NARRATION>\n`;
      xml += `            <ALLLEDGERENTRIES.LIST>\n`;
      xml += `              <LEDGERNAME>${cat}</LEDGERNAME>\n`;
      xml += `              <ISDEEMEDPOSITIVE>${type === 'income' ? 'No' : 'Yes'}</ISDEEMEDPOSITIVE>\n`;
      xml += `              <AMOUNT>${type === 'income' ? amtStr : `-${amtStr}`}</AMOUNT>\n`;
      xml += `            </ALLLEDGERENTRIES.LIST>\n`;
      xml += `            <ALLLEDGERENTRIES.LIST>\n`;
      xml += `              <LEDGERNAME>Cash</LEDGERNAME>\n`;
      xml += `              <ISDEEMEDPOSITIVE>${type === 'income' ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>\n`;
      xml += `              <AMOUNT>${type === 'income' ? `-${amtStr}` : amtStr}</AMOUNT>\n`;
      xml += `            </ALLLEDGERENTRIES.LIST>\n`;
      xml += `          </VOUCHER>\n`;
      xml += `        </TALLYMESSAGE>\n`;
    });
    
    xml += `      </REQUESTDATA>\n    </IMPORTDATA>\n  </BODY>\n</ENVELOPE>`;
    return xml;
  } catch (e) {
    console.error("Tally XML Gen Error:", e);
    return '';
  }
}

export function downloadTallyXML(db: any) {
  const xml = generateTallyXML(db);
  if (!xml) return;
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Kutumbly_Tally_${new Date().toISOString().slice(0,10)}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function pushToTallyBridge(db: any, bridgeUrl: string): Promise<boolean> {
  const xml = generateTallyXML(db);
  if (!xml) return false;
  try {
    const res = await fetch(bridgeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xml
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to push to Tally Bridge:", e);
    return false;
  }
}
