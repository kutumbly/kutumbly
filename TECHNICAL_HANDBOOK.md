## 6. Module Implementation Dictionary
Comprehensive registry of all functional units currently integrated into the Sovereign OS.

| Module | Technical ID | Purpose | Key Features | Primary Files |
| :--- | :--- | :--- | :--- | :--- |
| **Aangan** | `home` | Core Hub | Top-level family metrics, next actions, birth-day alerts. | `AanganModule.tsx` |
| **Diary** | `diary` | Secure Journal | Encrypted daily entries, mood tracking, rich-text snapshots. | `DiaryModule.tsx` |
| **Money** | `money` | Family Finance | Expense ledger, Tally-Prime XML exports, Budget controls. | `MoneyModule.tsx`, `lib/tally.ts` |
| **Nevata** | `nevata` | Relationship Log | Cultural gift tracking (Shagun), Event guest lists, reciprocity ledgers. | `NevataModule.tsx` |
| **Vidya** | `vidya` | Learning Hub | Distraction-free study resource library, session timer, learner profiles. | `VidyaModule.tsx` |
| **Health** | `health` | Vitals Tracker | Multi-member medical record logging (BP, Sugar, Pulse, Weight). | `HealthModule.tsx` |
| **Invest** | `invest` | Wealth Management | SIP tracker, current value monitoring, principal growth logs. | `InvestModule.tsx` |
| **Grocery** | `grocery` | Supply Chain | Categorized shopping lists, price estimation, inventory status. | `GroceryModule.tsx` |
| **Staff** | `staff` | Domestic Service | HomeStaff salary ledger, attendance tracking, advance payments. | `StaffModule.tsx` |

### Phase 5: Discovery-First Onboarding [COMPLETED]
- **Sovereign Discovery**: The setup flow now begins with an **Identity Lookup**. Entering an email triggers a multi-source scan (GDrive + Local handles).
- **Identity Enforcement on Restore**: Cloud restoration now includes a post-decryption verify. Even if a user as the PIN, they cannot complete the restore if their logged-in Google account is not in the vault's internal whitelist.
- **Other Media Support**: Added generic file handles for "Other Media" (USB, OTG, Legacy browsers) ensuring data can be retrieved from physical blocks anywhere.

### Phase 6: Sovereign Media Bridge [COMPLETED]
- **Auto-Link Detection**: The OS now automatically identifies URLs in any text placeholder (Diary, Nevata, Home Feed).
- **Privacy-First Media**: YouTube videos are embedded using `youtube-nocookie.com`. Players are "Click-to-Load", preventing data leakage to Google until the user chooses to watch.
- **Rich Link Cards**: Generic URLs are transformed into premium, bounded cards with automatic favicon discovery and domain identification.
- **Universal Utility**: Centralized `parseRichContent` utility ensures high-fidelity media rendering across all operating system modules.

---

## 7. Glossary of Sovereign Terms

- **.kutumb**: The proprietary binary format for storing SQL-WASM databases encrypted with AES-256-GCM.
- **Burn Protocol**: A device-level wipe command that purges browser memory and disk caches without deleting the source cloud backups.
- **Cloud-Syncript**: A hybrid synchronization method where encrypted blobs are sent to the user's personal Google Drive without intermediary servers.
- **Syncript**: A portmanteau of "Sync" and "Encrypt"—representing the atomic action of encrypting a vault locally before syncing to the cloud.
- **Zero-Cloud**: An engineering standard where no user data is stored on Kutumbly’s infrastructure; the app is entirely self-hosted in the user's browser.
- **Vault Gateway**: The entry-point UI (Unlock/Create/Import/Restore) that manages the initial decryption and DB mounting.

---
## 8. Development Standards
- **Styling**: Vanilla CSS with a gold/amber/black high-fidelity aesthetic.
- **Type Safety**: All database queries must use `runQuery<T>` or equivalent typed wrappers.
- **PWA Ready**: The system is designed to be installed as a standalone app, functioning entirely offline until a Syncript event is triggered.

---

## 9. Sovereign Release Protocol (SDRP)
Formal multi-tier workflow for pushing code across verified levels.

### 🧪 Stage 1: Alpha (Hardening)
- **Branch**: `alpha`
- **Focus**: Technical validation, "Unbreakable" boundary checks.
- **Merge Logic**: Feature branches merge here first.
- **Command**: `git merge <feature-branch> --no-ff`

### 🛡️ Stage 2: Beta (Cultural Polish)
- **Branch**: `beta`
- **Focus**: Localization audits, UI fidelity, and family testing.
- **Merge Logic**: Merged from `alpha` after technical verification.
- **Command**: `git merge alpha --no-ff`

### 💎 Stage 3: Production (Stable)
- **Branch**: `production`
- **Focus**: Stable, final encrypted release.
- **Merge Logic**: Merged from `beta` after cultural verification.
- **Command**: `git merge beta --no-ff`

### Automation Utilities
Use the sovereign CLI for promotion:
- `npm run sovereign:alpha`
- `npm run sovereign:beta`
- `npm run sovereign:prod`

---
© 2026 Kutumbly.com — Sovereign Division
*Document Signed by: Antigravity AI Implementation Team*
