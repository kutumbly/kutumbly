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

/**
 * lib/googleBridge.ts
 * Generalized Data Orchestration Engine
 */

export interface BridgeField {
  title: string;
  description?: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'CHOICE';
  required?: boolean;
  options?: string[]; // Only for CHOICE
}

export interface UniversalBridgePayload {
  title: string;
  description?: string;
  fields: BridgeField[];
}

/**
 * CREATE UNIVERSAL BRIDGE FORM
 */
export async function createUniversalBridge(accessToken: string, payload: UniversalBridgePayload) {
  try {
    // 1. Create base form
    const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        info: {
          title: payload.title,
          description: payload.description || "Mission Orchestrated by Kutumbly Sovereign OS",
          documentTitle: `NVT-BRIDGE-${Date.now()}`
        }
      })
    });

    if (!createRes.ok) throw new Error("Google Bridge: Form Creation Failed");
    const form = await createRes.json();
    const formId = form.formId;

    // 2. Batch Update to add questions
    const requests = payload.fields.map((field, index) => {
      const question: any = { required: !!field.required };
      
      if (field.type === 'NUMBER' || field.type === 'TEXT') {
        question.textQuestion = {}; // Forms API uses textQuestion for both, validation can be added later
      } else if (field.type === 'DATE') {
        question.dateQuestion = { includeTime: false, includeYear: true };
      } else if (field.type === 'CHOICE') {
        question.choiceQuestion = {
          type: 'RADIO',
          options: field.options?.map(o => ({ value: o })) || []
        };
      }

      return {
        createItem: {
          item: {
            title: field.title,
            description: field.description || "",
            questionItem: { question }
          },
          location: { index }
        }
      };
    });

    const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });

    if (!updateRes.ok) throw new Error("Google Bridge: Question Batch Update Failed");

    return {
      formId,
      responderUri: form.responderUri,
    };
  } catch (err) {
    console.error("Universal Bridge Error:", err);
    throw err;
  }
}

/**
 * SYNC UNIVERSAL RESPONSES
 */
export async function fetchUniversalResponses(accessToken: string, formId: string) {
  try {
    const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error("Universal Bridge: Response Fetch Failed");
    const data = await res.json();
    return data.responses || [];
  } catch (err) {
    console.error("Universal Bridge Sync Error:", err);
    throw err;
  }
}
