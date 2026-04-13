# Kutumbly Sovereign OS — Error Glossary & Support Guide

This document is for support staff to identify and resolve common errors encountered by users of the Sovereign OS.

## 🛡️ Gateway & Security Errors

### `PERMISSION_DENIED`
- **Cause**: The browser’s File System Access API requires a fresh "user gesture" to access files after a page refresh. If the user denies the "Allow Access" prompt, this error is thrown.
- **Solution**: Instruct the user to click the "Unlock" button again and ensure they click **"Allow"** or **"Authorize"** in the browser's permission bar (usually at the top of the screen).

### `WRONG_PIN`
- **Cause**: The 4-digit PIN entered does not match the key used to encrypt the `.kutumb` file.
- **Solution**: Verify the user is opening the correct file. If they have forgotten their PIN, the data **cannot** be recovered (Zero-Cloud security). Suggest they restore from a previous backup if available.

### `USE_FILE_INPUT`
- **Cause**: The user's browser (e.g., older Android Chrome or some versions of Safari) does not support the modern File System Access API.
- **Solution**: The app will automatically fall back to a standard file picker. The user must manually select their `.kutumb` file each time they open the vault.

## 💾 Database & Persistence Errors

### `DATABASE_LOCKED` / `SQLITE_BUSY`
- **Cause**: Multiple tabs are trying to write to the same in-memory database or a file operation is hanging.
- **Solution**: Refresh the page. Since Kutumbly is local-first, a refresh clears the memory and allows a fresh connection.

### `FILE_NOT_FOUND`
- **Cause**: The `.kutumb` file was moved or deleted from its original location on the user's device.
- **Solution**: Ask the user to click **"Open .kutumb File"** and re-select the file from its new location.

## 📱 PWA & Installation Errors

### `MANIFEST_NOT_FOUND`
- **Cause**: Browser cache issue or service worker failure.
- **Solution**: Clear browser cache and hard refresh (Ctrl+F5 or Cmd+Shift+R).

### `INSTALL_PROMPT_DEFERRED`
- **Cause**: The browser is waiting for more user engagement before showing the "Install" button.
- **Solution**: Keep using the app for 30 seconds, then check the browser menu for "Install App" or "Add to Home Screen".

---
*Built for Sovereignty · Memory, Not Code.*
