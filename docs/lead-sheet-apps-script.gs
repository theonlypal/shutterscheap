// ShuttersCheap website lead log.
// Paste this into Extensions > Apps Script of the Google Sheet that should hold the leads,
// then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
// The web app URL goes into LEAD_SHEET_URL in assets/js/main.js.

// Who gets the alert when a lead could not be emailed. Blank = the account that owns this script.
const ALERT_EMAIL = '';

const SHEET_NAME = 'Leads';
const COLUMNS = ['Received', 'Source', 'Name', 'Phone', 'Email', 'Interested In', 'Page',
  'From Google Ad', 'Ad Click ID', 'Lead Email Sent', 'Other Details'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow([
      new Date(),
      clean_(p.source), clean_(p.name), clean_(p.phone), clean_(p.email), clean_(p.interest),
      clean_(p.page), clean_(p.fromAd), clean_(p.adClickId), clean_(p.emailSent), clean_(p.details)
    ]);
  } finally {
    lock.releaseLock();
  }
  if (p.emailSent === 'no') sendFailureAlert_(p);
  return ContentService.createTextOutput('ok');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

// Caps length and stops a submitted value from being run as a spreadsheet formula.
function clean_(value) {
  const text = String(value || '').slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function sendFailureAlert_(p) {
  const to = ALERT_EMAIL || Session.getEffectiveUser().getEmail();
  MailApp.sendEmail(to,
    'Website lead NOT emailed - ' + (p.name || 'unknown name'),
    'A lead came in on the website but the FormSubmit email failed, so it did not reach the inbox.\n' +
    'It is saved in the Leads sheet. If this keeps happening, FormSubmit probably needs to be re-activated.\n\n' +
    'Name: ' + (p.name || '') + '\n' +
    'Phone: ' + (p.phone || '') + '\n' +
    'Email: ' + (p.email || '') + '\n' +
    'Interested in: ' + (p.interest || '') + '\n' +
    'Page: ' + (p.page || '') + '\n' +
    'Details: ' + (p.details || '') + '\n' +
    'From Google Ad: ' + (p.fromAd || ''));
}
