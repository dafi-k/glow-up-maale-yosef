// ════════════════════════════════════════════════════════════
// Google Apps Script — GLOW UP מעלה יוסף 2026
// שולח כל הזמנה ל-3 כתובות מייל + רושם אותה בגיליון מרכזי
// ════════════════════════════════════════════════════════════
//
// הוראות פריסה:
//  1. צרו גיליון Google חדש (למשל "GLOW UP — ריכוז הזמנות").
//     העתיקו את ה-ID שלו מכתובת ה-URL:
//     docs.google.com/spreadsheets/d/[[[ ה-ID כאן ]]]/edit
//     והדביקו אותו ב-SHEET_ID למטה.
//  2. פתחו https://script.google.com → "פרויקט חדש"
//     → שנו שם ל-"GLOW UP Orders"
//  3. מחקו הכל → הדביקו את כל הקוד הזה
//  4. שמרו (Ctrl+S)
//  5. הריצו פעם אחת את הפונקציה setupSheet מהעורך —
//     זה יוצר את שלושת הטאבים ומאכלס את "ריכוז כמויות".
//     אשרו את בקשת ההרשאות שתופיע.
//  6. "פרוס" ← "פריסה חדשה"
//       - סוג פריסה: יישום אינטרנט
//       - הפעל כ: אני (Me)
//       - מי יכול לגשת: כל אחד (Anyone)
//  7. העתיקו את ה-Web App URL והדביקו אותו ב-index.html
//     במקום PLACEHOLDER_APPS_SCRIPT_URL
//
// ⚠️ אחרי כל שינוי בקוד יש לפרוס מחדש ("פריסה חדשה") כדי
//    שהאתר החי יקבל את הגרסה המעודכנת.
// ════════════════════════════════════════════════════════════

var SHEET_ID = '1td86Gbk3d9TpiAHQCmEfiCNiddjSA_S37RvMe8m0GkA';

var TAB_ORDERS  = 'הזמנות';
var TAB_TOTALS  = 'ריכוז כמויות';
var TAB_STUDIOS = 'סיכום לפי סטודיו';

var BUDGET = 9500;

// קטלוג הפריטים — חייב להישאר תואם ל-PRODUCTS שב-index.html.
// משמש לאכלוס טאב "ריכוז כמויות" ולנוסחאות ה-SUMIF.
var CATALOG = [
  ['M06710-C',    'A1',    'כורסא מסתובבת — אפור',                     2599],
  ['SP0352-VC',   'A3',    'כורסא — אפרפר',                            999],
  ['IL150-30406', 'A6',    'כורסא — מושב שחור / גב עץ',                699],
  ['M06715-G',    'A7',    'כורסא מסתובבת — אפור',                     799],
  ['M06715-S',    'A8',    "כורסא מסתובבת — בז'",                      799],
  ['M06715-R',    'A9',    'כורסא מסתובבת — ירוק',                     799],
  ['M06715-C',    'A10',   'כורסא מסתובבת — לבן',                      799],
  ['SP0317-VML',  'C2',    'כיסא דמוי עור / גב עץ — אפור כהה',         799],
  ['SP0317-VMS',  'C3',    'כיסא דמוי עור / גב עץ — שחור',             799],
  ['SP0316-DGF',  'C4',    'כיסא בד — אפור',                           699],
  ['150-36772-GR','C5',    'כיסא בד — אפור',                           699],
  ['150-36772-G', 'C6',    'כיסא בד — ירוק',                           699],
  ['15031604',    'C8',    'כיסא דמוי עור — אפור בהיר',                699],
  ['15031606',    'C9',    'כיסא דמוי עור — שחור',                     699],
  ['15031700',    'C10',   "כיסא דמוי עור — בז'",                      799],
  ['15031704',    'C11',   'כיסא דמוי עור — אפור בהיר',                799],
  ['15031707',    'C12',   'כיסא דמוי עור — קמל',                      799],
  ['SP0369-NO104','C17',   'כיסא בד — לבן',                            359],
  ['SP0370-BL',   'C18',   'כיסא פלסטיק — שחור',                       399],
  ['SP0373-O',    'C20',   'כיסא פלסטיק — חמרה (טרקוטה)',              399],
  ['SP0373-IV',   'C21',   'כיסא פלסטיק — לבן',                        399],
  ['SP0383-WG',   'C23',   "כיסא פלסטיק — בז'",                        399],
  ['SP0387-G',    'C24',   'כיסא פלסטיק — ירוק',                       399],
  ['SP0387-B',    'C25',   'כיסא פלסטיק — ורוד',                       399],
  ['SP0418-W8951','C26',   'כיסא פלסטיק מושב בד — לבן',                399],
  ['SP0418-O9168','C27',   'כיסא פלסטיק מושב בד — חמרה (טרקוטה)',      399],
  ['SP0418-G8343','C28',   'כיסא פלסטיק מושב בד — ירוק',               399],
  ['SP0419-W',    'T1',    'שולחן נירוסטה חוץ / פנים — לבן',           799],
  ['SP0419-G',    'T2',    'שולחן נירוסטה חוץ / פנים — ירוק',          799],
  ['SP0419-O',    'T3',    'שולחן נירוסטה חוץ / פנים — חמרה (טרקוטה)', 799],
  ['15550510',    'L2+P1', 'שולחן רגל ברזל + פלטת פורניר — אלון שחור', 2799],
  ['15550510',    'L2+P2', 'שולחן רגל ברזל + פלטת פורניר — אגוז',      2799],
  ['15550510',    'L2+P3', 'שולחן רגל ברזל + פלטת פורניר — אלון טבעי', 2799],
  ['M06665A',     'L7+P1', 'שולחן רגל ברזל + פלטת פורניר — אלון שחור', 2699],
  ['M06665A',     'L7+P2', 'שולחן רגל ברזל + פלטת פורניר — אגוז',      2699],
  ['M06665A',     'L7+P3', 'שולחן רגל ברזל + פלטת פורניר — אלון טבעי', 2699],
  ['M07388',      'L8',    "שולחן רגל ברזל + פלטת פורניר — בז'",       2899],
  ['ILB001',      'Q1',    'קונסולה ממתכת — שחור',                     1399],
  ['ILB002',      'Q2',    'קונסולה ממתכת — לבן',                      1399],
  ['M07306',      'LT1',   'סט שולחנות אלומיניום — שחור',              1599],
  ['M07303',      'LT2',   'שולחן אלומיניום — טבעי',                   999],
  ['SP0423W',     'LT3',   'שולחן פלסטיק — לבן',                       299],
  ['SP0423O',     'LT4',   'שולחן פלסטיק — חמרה (טרקוטה)',             299],
  ['SP0423BL',    'LT5',   'שולחן פלסטיק — שחור',                      299],
  ['IL0009',      'R1',    'שטיח עגול קוטר 160 — שמנת',                899],
  ['IL0006',      'R2',    'שטיח עגול קוטר 160 — אפור',                899],
  ['SP0248-BL',   'M1',    'מראה עגולה קוטר 90',                       649],
  ['M07086',      'M2',    'מראת מסגרת + תאורה 180×80',                1999],
  ['M07091',      'M3',    'מראת לד חצי עיגול 100×70',                 499],
  ['M07092',      'M4',    'מראה קפסולה לד 160×50',                    649],
  ['M07405-BL',   'M5',    'מראה אובלית 90×35 — מסגרת שחורה',          899],
  ['M07405-W',    'M6',    'מראה אובלית 90×35 — מסגרת לבנה',           899],
  ['M07399BL',    'M7',    'מראה אובלית 150×50',                       1099],
  ['BPK',         'BPK',   'חבילת ביוטי',                              1299],
  ['',            'PB',    'מתנה — 3 ואזות + 3 שרשראות חרוזי עץ',      0]
];

var ORDER_HEADERS = ['תאריך','סטודיו / קליניקה','איש קשר','נייד','אי-מייל',
                     'מק"ט','פריט','תיאור','צבע','קוטר נבחר','כמות','מחיר','סה"כ'];
var TOTAL_HEADERS = ['מק"ט','פריט','תיאור','מחיר','סה"כ יחידות שהוזמנו','שווי כולל'];
var STUDIO_HEADERS = ['תאריך','סטודיו / קליניקה','איש קשר','נייד','אי-מייל',
                      'מספר פריטים','סה"כ הזמנה','תקציב','יתרה לתשלום'];

// ════════════════════════════════════════════════════════════
// ENTRY POINT
// ════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var params = parsePostBody(e);

    var recipients = params.recipients || '';
    var customer   = params.customer   || params.email || '';
    var subject    = params.subject    || 'הזמנת GLOW UP — מעלה יוסף';
    var body       = params.body       || '';
    var studio     = params.studio     || '';
    var contact    = params.contact    || '';
    var phone      = params.phone      || '';
    var email      = params.email      || '';
    var total      = Number(params.total   || 0);
    var budget     = Number(params.budget  || BUDGET);
    var balance    = Number(params.balance || 0);
    var date       = params.date       || Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy');
    var xlsxB64    = params.xlsxBase64 || '';
    var xlsxName   = params.xlsxFilename || ('הזמנה_' + studio + '.xlsx');

    var items = [];
    try { items = JSON.parse(params.items || '[]'); } catch (parseErr) {
      Logger.log('items parse failed: ' + parseErr);
    }

    if (!recipients) {
      Logger.log('doPost: missing "recipients"');
      return ContentService.createTextOutput('error:missing-recipients');
    }

    // 1. רישום בגיליון המרכזי — קודם, כדי שההזמנה לא תאבד אם המייל נכשל
    try {
      logToSheet(studio, contact, phone, email, date, items, total, budget, balance);
    } catch (sheetErr) {
      Logger.log('Sheet logging failed: ' + sheetErr);
    }

    // 2. שליחת המייל לשלושת הנמענים + עותק למזמין/ה
    var mailOptions = {
      to:       recipients,
      cc:       customer,
      subject:  subject,
      body:     body,
      htmlBody: buildHtmlEmail(studio, contact, phone, email, items, total, budget, balance, date),
      replyTo:  customer || email
    };

    if (xlsxB64) {
      try {
        mailOptions.attachments = [Utilities.newBlob(
          Utilities.base64Decode(xlsxB64),
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          xlsxName
        )];
      } catch (attachErr) {
        Logger.log('Attachment creation failed: ' + attachErr);
      }
    }

    MailApp.sendEmail(mailOptions);
    Logger.log('Order sent — ' + studio + ' → ' + recipients);
    return ContentService.createTextOutput('OK');

  } catch (err) {
    Logger.log('doPost error: ' + err);
    return ContentService.createTextOutput('error:' + err);
  }
}

// ────────────────────────────────────────────
// פרסור ידני של גוף ה-POST — עוקף את מגבלת
// 8190 התווים של e.parameter (נדרש ל-xlsxBase64)
// ────────────────────────────────────────────
function parsePostBody(e) {
  var p = {};
  if (e && e.parameter) {
    for (var k in e.parameter) { p[k] = e.parameter[k]; }
  }
  if (e && e.postData && e.postData.contents) {
    e.postData.contents.split('&').forEach(function(pair) {
      var idx = pair.indexOf('=');
      if (idx > 0) {
        try {
          var key = decodeURIComponent(pair.substring(0, idx).replace(/\+/g, ' '));
          var val = decodeURIComponent(pair.substring(idx + 1).replace(/\+/g, ' '));
          p[key] = val;
        } catch (ex) {}
      }
    });
  }
  return p;
}

// ════════════════════════════════════════════════════════════
// גיליון מרכזי
// ════════════════════════════════════════════════════════════
function getSpreadsheet() {
  if (!SHEET_ID || SHEET_ID === 'PLACEHOLDER_SHEET_ID') {
    throw new Error('SHEET_ID לא הוגדר — ראו את הוראות הפריסה בראש הקובץ');
  }
  return SpreadsheetApp.openById(SHEET_ID);
}

function getOrCreateTab(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.setRightToLeft(true);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    var hdr = sh.getRange(1, 1, 1, headers.length);
    hdr.setBackground('#4E8C74').setFontColor('#FFFFFF').setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** מרחיב את הגיליון אם אין בו מספיק שורות פנויות.
 *  בלי זה setValues זורק שגיאה ברגע שההזמנות עוברות את 1000 השורות. */
function ensureRows(sh, needed) {
  var max = sh.getMaxRows();
  if (needed > max) sh.insertRowsAfter(max, needed - max + 100);
}

/**
 * הרצה חד-פעמית מהעורך: יוצרת את שלושת הטאבים
 * ומאכלסת את "ריכוז כמויות" בכל פריטי הקטלוג.
 * בטוח להריץ שוב — הריכוז נבנה מחדש, ההזמנות לא נמחקות.
 */
function setupSheet() {
  var ss = getSpreadsheet();
  getOrCreateTab(ss, TAB_ORDERS,  ORDER_HEADERS);
  getOrCreateTab(ss, TAB_STUDIOS, STUDIO_HEADERS);
  rebuildTotals(ss);
  Logger.log('setupSheet: הגיליון מוכן');
}

/**
 * בונה מחדש את טאב "ריכוז כמויות".
 * עמודת הכמות היא נוסחת SUMIF חיה על טאב "הזמנות",
 * כך שהיא מתעדכנת מעצמה עם כל הזמנה חדשה.
 */
function rebuildTotals(ss) {
  var sh = getOrCreateTab(ss, TAB_TOTALS, TOTAL_HEADERS);
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, TOTAL_HEADERS.length).clearContent();
  }
  var rows = CATALOG.map(function(item, i) {
    var r = i + 2;                                   // שורה בגיליון
    var idCell = "'" + TAB_TOTALS + "'!B" + r;       // עמודת "פריט"
    return [
      item[0], item[1], item[2], item[3],
      "=SUMIF('" + TAB_ORDERS + "'!G:G," + idCell + ",'" + TAB_ORDERS + "'!K:K)",
      '=D' + r + '*E' + r
    ];
  });
  ensureRows(sh, rows.length + 1);
  sh.getRange(2, 1, rows.length, TOTAL_HEADERS.length).setValues(rows);
  sh.getRange(2, 5, rows.length, 1).setFontWeight('bold');
}

function logToSheet(studio, contact, phone, email, date, items, total, budget, balance) {
  var ss = getSpreadsheet();

  // טאב "הזמנות" — שורה לכל פריט
  var orders = getOrCreateTab(ss, TAB_ORDERS, ORDER_HEADERS);
  if (items.length > 0) {
    var rows = items.map(function(it) {
      return [
        date, studio, contact, phone, email,
        it.sku || '', it.id || '', it.desc || '', it.color || '', it.variant || '',
        Number(it.qty) || 0,
        it.isGift ? 0 : (Number(it.price) || 0),
        it.isGift ? 0 : (Number(it.subtotal) || 0)
      ];
    });
    var start = orders.getLastRow() + 1;
    ensureRows(orders, start + rows.length);
    orders.getRange(start, 1, rows.length, ORDER_HEADERS.length).setValues(rows);
  }

  // טאב "סיכום לפי סטודיו" — שורה לכל הזמנה
  var studios = getOrCreateTab(ss, TAB_STUDIOS, STUDIO_HEADERS);
  var itemCount = items.reduce(function(s, it) {
    return s + (it.isGift ? 0 : (Number(it.qty) || 0));
  }, 0);
  studios.appendRow([date, studio, contact, phone, email, itemCount, total, budget, balance]);

  // ודא שטאב הריכוז קיים ומאוכלס (נוסחאות ה-SUMIF מתעדכנות לבד)
  if (!ss.getSheetByName(TAB_TOTALS)) rebuildTotals(ss);
}

// ════════════════════════════════════════════════════════════
// מייל HTML מעוצב
// ════════════════════════════════════════════════════════════
function buildHtmlEmail(studio, contact, phone, email, items, total, budget, balance, date) {
  var rows = items.map(function(it) {
    var gift  = !!it.isGift;
    var bg    = gift ? 'background:#F6E9EB;color:#A96D78;font-weight:600;' : '';
    var desc  = it.variant ? (it.desc + ' — ' + it.variant) : it.desc;
    if (it.color) desc = desc + ' (' + it.color + ')';
    if (it.note)  desc = desc + '<br><span style="font-size:0.78rem;color:#A96D78;">' + it.note + '</span>';
    var cell  = 'padding:7px 10px;border-bottom:1px solid #CFE3D8;font-size:0.88rem;' + bg;
    var num   = cell + 'text-align:center;direction:ltr;';
    return '<tr>' +
      '<td style="' + cell + '">' + (gift ? '🎁 ' : '') + (it.id || '') + '</td>' +
      '<td style="' + cell + '">' + (it.sku || '—') + '</td>' +
      '<td style="' + cell + '">' + desc + '</td>' +
      '<td style="' + num  + '">' + it.qty + '</td>' +
      '<td style="' + num  + '">' + (gift ? 'מתנה' : '₪' + Number(it.price).toLocaleString('he-IL')) + '</td>' +
      '<td style="' + num  + 'font-weight:600;">' + (gift ? 'מתנה' : '₪' + Number(it.subtotal).toLocaleString('he-IL')) + '</td>' +
      '</tr>';
  }).join('');

  var balanceHtml = balance > 0
    ? '<p style="color:#C0392B;font-weight:700;font-size:1rem;margin:8px 0 0;">יתרה לתשלום: ₪' +
      balance.toLocaleString('he-IL') + '</p>'
    : '';

  return [
    '<div dir="rtl" style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;background:#F1F7F3;padding:24px;border-radius:12px;">',

    '<div style="background:linear-gradient(135deg,#4E8C74,#74AE96);color:#fff;padding:24px;border-radius:8px;text-align:center;margin-bottom:20px;">',
    '<h2 style="margin:0 0 4px;font-size:1.5rem;letter-spacing:4px;">GLOW UP</h2>',
    '<p style="margin:0 0 6px;font-size:1rem;">קטלוג רענון סטודיו / קליניקה 2026</p>',
    '<p style="margin:0;opacity:0.85;font-size:0.85rem;">מועצה אזורית מעלה יוסף — גליל מערבי</p>',
    '</div>',

    '<div style="background:#fff;border-radius:8px;padding:16px 20px;margin-bottom:16px;border:1px solid #CFE3D8;">',
    '<table style="width:100%;border-collapse:collapse;">',
    '<tr><td style="padding:4px 0;color:#6E8279;font-size:0.83rem;width:130px;">סטודיו / קליניקה:</td><td style="font-weight:700;font-size:1rem;">' + studio + '</td></tr>',
    '<tr><td style="padding:4px 0;color:#6E8279;font-size:0.83rem;">איש קשר:</td><td>' + contact + '</td></tr>',
    '<tr><td style="padding:4px 0;color:#6E8279;font-size:0.83rem;">נייד:</td><td>' + phone + '</td></tr>',
    '<tr><td style="padding:4px 0;color:#6E8279;font-size:0.83rem;">אי-מייל:</td><td>' + email + '</td></tr>',
    '<tr><td style="padding:4px 0;color:#6E8279;font-size:0.83rem;">תאריך:</td><td>' + date + '</td></tr>',
    '</table></div>',

    '<div style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #CFE3D8;margin-bottom:16px;">',
    '<table style="width:100%;border-collapse:collapse;">',
    '<thead><tr style="background:#4E8C74;color:#fff;font-size:0.82rem;">',
    '<th style="padding:9px 10px;text-align:right;">פריט</th>',
    '<th style="padding:9px 10px;text-align:right;">מק"ט</th>',
    '<th style="padding:9px 10px;text-align:right;">תיאור</th>',
    '<th style="padding:9px 10px;text-align:center;">כמות</th>',
    '<th style="padding:9px 10px;text-align:center;">מחיר</th>',
    '<th style="padding:9px 10px;text-align:center;">סה"כ</th>',
    '</tr></thead><tbody>',
    rows || '<tr><td colspan="6" style="padding:14px;text-align:center;color:#999;">אין פריטים</td></tr>',
    '</tbody></table></div>',

    '<div style="background:#fff;border-radius:8px;padding:14px 20px;border:1px solid #CFE3D8;">',
    '<p style="font-size:1.1rem;font-weight:700;color:#4E8C74;margin:0 0 4px;">סה"כ הזמנה: ₪' + total.toLocaleString('he-IL') + '</p>',
    '<p style="color:#6E8279;font-size:0.88rem;margin:4px 0 0;">תקציב: ₪' + budget.toLocaleString('he-IL') + '</p>',
    balanceHtml,
    '</div>',

    '<p style="background:#F6E9EB;border:1px solid #E4C4C9;border-radius:8px;padding:10px 16px;margin-top:14px;color:#A96D78;font-size:0.88rem;text-align:center;">',
    '🎁 מתנה מאיתנו מצורפת להזמנה — 3 ואזות ו-3 שרשראות חרוזי עץ לנוי',
    '</p>',

    '<p style="color:#9BAEA5;font-size:0.75rem;margin-top:18px;text-align:center;">',
    'מייל זה נשלח אוטומטית ממערכת ההזמנות GLOW UP מעלה יוסף.<br>',
    'קובץ Excel של ההזמנה מצורף למייל זה.',
    '</p>',
    '</div>'
  ].join('');
}

// ════════════════════════════════════════════════════════════
// בדיקה — הריצו ידנית מהעורך אחרי setupSheet
// ════════════════════════════════════════════════════════════
function testDoPost() {
  var items = [
    {id:'A1',    sku:'M06710-C', cat:'כורסאות',            desc:'כורסא מסתובבת', color:'אפור', variant:'',              qty:2, price:2599, subtotal:5198, isGift:false},
    {id:'L2+P1', sku:'15550510', cat:'שולחן אירוח פנים',   desc:'שולחן רגל ברזל + פלטת פורניר', color:'אלון שחור', variant:'קוטר 70 ס״מ', qty:1, price:2799, subtotal:2799, isGift:false},
    {id:'PB',    sku:'',         cat:'מתנה',               desc:'מתנה מאיתנו — 3 ואזות ו-3 שרשראות חרוזי עץ לנוי', color:'', variant:'', qty:1, price:0, subtotal:0, isGift:true}
  ];
  var fakeE = {
    parameter: {
      recipients:   'dafioz@gmail.com',
      customer:     'dafioz@gmail.com',
      subject:      'בדיקה — הזמנת GLOW UP | סטודיו בדיקה',
      studio:       'סטודיו בדיקה',
      contact:      'ישראל ישראלי',
      phone:        '050-1234567',
      email:        'dafioz@gmail.com',
      total:        '7997',
      budget:       String(BUDGET),
      balance:      '0',
      date:         Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy'),
      items:        JSON.stringify(items),
      xlsxBase64:   '',
      xlsxFilename: 'הזמנה_בדיקה.xlsx',
      body:         'בדיקה — גוף מייל טקסט'
    }
  };
  Logger.log('Result: ' + doPost(fakeE).getContent());
}
