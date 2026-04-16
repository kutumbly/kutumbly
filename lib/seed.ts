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

export function seedDatabase(db: any) {
  // Family members
  db.run(`INSERT OR IGNORE INTO family_members VALUES
    ('jm','Jawahar Mallah','Papa','1981-03-15','JM'),
    ('sm','Sunita Mallah','Maa','1984-07-22','SM'),
    ('pj','Priya Mallah','Beti','2012-05-12','PJ')`);

  // Staff
  db.run(`INSERT OR IGNORE INTO staff_members VALUES
    ('st1','Kamla Devi','Bai (Housekeeping)',4000,'2022-01-10',NULL),
    ('st2','Ramesh Kumar','Driver',12000,'2020-03-15',NULL)`);

  // Transactions (V2 — richer: Education added)
  db.run(`INSERT OR IGNORE INTO transactions VALUES
    ('t1','2026-04-01',95000,'income','Salary','Monthly salary — Jawahar','jm','2026-04-01'),
    ('t2','2026-04-09',3240,'expense','Grocery','D-Mart grocery','sm','2026-04-09'),
    ('t3','2026-04-07',1820,'expense','Utilities','MSEB electricity','jm','2026-04-07'),
    ('t4','2026-04-10',4500,'expense','Housing','Society maintenance','jm','2026-04-10'),
    ('t5','2026-04-08',1200,'expense','Education','School books — Priya','sm','2026-04-08'),
    ('t6','2026-04-05',6000,'expense','Staff','Kamla Devi salary','jm','2026-04-05'),
    ('t7','2026-04-05',12000,'expense','Staff','Ramesh Kumar salary','jm','2026-04-05')`);

  // Generic Events (V2 — birthdays, anniversaries, festivals)
  db.run(`INSERT OR IGNORE INTO events VALUES
    ('e1','Akshaya Tritiya','2026-04-30','Pooja','Auspicious — gold purchase',5000,NULL,1),
    ('e2','Priya ki Birthday','2026-05-12','Birthday','Gift + celebration at home',2000,'Sketch pad + art supplies',0),
    ('e3','Sunita-Jawahar Anniversary','2026-05-22','Anniversary','20th year — plan dinner',5000,'Dinner at Yauatcha',0),
    ('e4','Rakshabandhan','2026-08-09','Festival',NULL,3000,NULL,1)`);

  // Nevata seed
  db.run(`INSERT OR IGNORE INTO nevata_events VALUES
    ('ne1','Rahul ki Shaadi','shaadi','they_invited','Mallah Parivar','2026-04-22','Agra',4,'upcoming',NULL,'2026-04-13'),
    ('ne2','Chotu ka Mundan','mundan','they_invited','Verma Khaandaan','2026-02-02','Lucknow',3,'attended',NULL,'2026-02-03'),
    ('ne3','Hamari Beti ki Sagai','sagai','we_hosted','Agarwal Parivar','2026-03-10','Ghar',0,'attended',NULL,'2026-03-11')`);

  db.run(`INSERT OR IGNORE INTO nevata_shagun VALUES
    ('ns1','ne1','diya',21000,'Cash envelope','Jawahar Mallah',NULL,0,'2026-04-13'),
    ('ns2','ne2','diya',15000,'Silver bowl set + cash','Sunita Mallah',NULL,1,'2026-02-03'),
    ('ns3','ne3','mila',51000,'Cash + Saree Set',NULL,'Mallah Parivar',1,'2026-03-11')`);

  db.run(`INSERT OR IGNORE INTO nevata_family_ledger VALUES
    ('nl1','Mallah Parivar','ne3',21000,51000,30000,NULL,'2026-04-13'),
    ('nl2','Verma Khaandaan','ne2',15000,0,-15000,'Unka shagun abhi nahi aaya','2026-04-13')`);

  // Investments (V2 — Gold added)
  db.run(`INSERT OR IGNORE INTO investments VALUES
    ('i1','Parag Parikh Flexi Cap','Mutual Fund',240000,280000,NULL,5000,'2022-01-01',NULL,NULL),
    ('i2','SBI Nifty 50 Index','Mutual Fund',160000,190000,NULL,5000,'2022-06-01',NULL,NULL),
    ('i3','PPF Account','PPF',180000,210000,NULL,NULL,'2020-04-01',NULL,NULL),
    ('i4','SBI Fixed Deposit','FD',100000,107000,NULL,NULL,'2023-08-15','2026-08-15',NULL),
    ('i5','Gold Physical + SGB','Gold',160000,198000,NULL,NULL,'2021-11-01',NULL,'28g physical + SGBs')`);

  // Health (V2 — Priya added)
  db.run(`INSERT OR IGNORE INTO health_readings VALUES
    ('h1','jm','2026-04-12',118,76,98,72,NULL,NULL,'2026-04-12'),
    ('h2','sm','2026-04-12',138,88,112,78,NULL,'BP elevated — monitor','2026-04-12'),
    ('h3','pj','2026-04-12',108,70,88,68,NULL,NULL,'2026-04-12')`);

  // Diary (V2 — richer entry)
  db.run(`INSERT OR IGNORE INTO diary_entries (id, date, content, mood, mood_label, created_at) VALUES
    ('d1','2026-04-12','Aaj family ke saath nashta kiya. Priya ke exam results aye — 94% in Maths. Bahut khushi hui aaj. Shaam ko puja karni chahiye.',4,'Happy','2026-04-12')`);

  // Tasks (V2 — completed task added)
  db.run(`INSERT OR IGNORE INTO tasks (id, title, description, priority, status, category, assigned_to, due_date, created_at, completed_at) VALUES
    ('tk1','Renew car insurance','Expires May 1 — call agent','high','pending','Finance','jm','2026-04-28','2026-04-12',NULL),
    ('tk2','Book dentist for Mom',NULL,'medium','pending','Health','sm','2026-05-05','2026-04-12',NULL),
    ('tk3','File ITR FY 2025-26',NULL,'medium','pending','Legal','jm','2026-07-31','2026-04-12',NULL),
    ('tk4','Pay society maintenance',NULL,'high','done','Home','jm','2026-04-10','2026-04-10','2026-04-10')`);

  // Grocery (V2 — 8 items)
  db.run(`INSERT OR IGNORE INTO grocery_lists VALUES ('gl1','Kirana List','2026-04-12','active')`);
  db.run(`INSERT OR IGNORE INTO grocery_items VALUES
    ('gi1','gl1','Atta (whole wheat)','5','kg',210,0,'Grains & Dal'),
    ('gi2','gl1','Toor Dal','1','kg',140,0,'Grains & Dal'),
    ('gi3','gl1','Basmati Rice','5','kg',380,0,'Grains & Dal'),
    ('gi4','gl1','Amul Ghee','500','g',290,0,'Dairy'),
    ('gi5','gl1','Mustard Oil','1','L',180,0,'Oils & Spices'),
    ('gi6','gl1','Tomatoes','2','kg',80,1,'Vegetables'),
    ('gi7','gl1','Coriander + Mint','1','bunch',30,1,'Vegetables'),
    ('gi8','gl1','Mother Dairy Curd','500','g',65,0,'Dairy')`);

  // Vidya (Study Buddy) seed
  db.run(`INSERT OR IGNORE INTO vidya_learners VALUES
    ('vl1','Priya Mallah','pj','Delhi Public School','Class 8','CBSE','PJ','Score 90%+ in Board Exams','2028-03-31',1,'2026-04-01'),
    ('vl2','Jawahar Mallah','jm',NULL,'Self-Study','Self','JM','Clear SEBI Grade-A Officer exam','2027-12-31',1,'2026-04-01')`);

  db.run(`INSERT OR IGNORE INTO vidya_subjects VALUES
    ('vs1','vl1','Mathematics','Science','#6366f1','90%+',NULL,'2026-04-01'),
    ('vs2','vl1','Science','Science','#10b981','85%+',NULL,'2026-04-01'),
    ('vs3','vl1','English','Language','#f59e0b','85%+',NULL,'2026-04-01'),
    ('vs4','vl2','Economics & Finance','Commerce','#c9971c','Full Command',NULL,'2026-04-01'),
    ('vs5','vl2','Stock Market Analysis','Tech','#3b82f6','Practical Mastery',NULL,'2026-04-01')`);

  db.run(`INSERT OR IGNORE INTO vidya_resources VALUES
    ('vr1','vs1','vl1','Class 8 Maths Chapter 11 — Mensuration','youtube','https://www.youtube.com/watch?v=v2K5k1TW-zQ','https://img.youtube.com/vi/v2K5k1TW-zQ/mqdefault.jpg','NCERT Chapter 11 — Area, Surface Area & Volume','Chapter 11','Lesson 1 — Surface Area of Cube','ncert,mensuration,class8',1,0,'medium',18,'2026-04-01'),
    ('vr2','vs1','vl1','Vedantu Class 8 Algebra — Full Playlist','youtube','https://www.youtube.com/watch?v=L3LMbpZIKhQ','https://img.youtube.com/vi/L3LMbpZIKhQ/mqdefault.jpg','Complete Algebra revision for Class 8','Chapter 9','Lesson 1 — Variables and Expressions','algebra,class8,vedantu',0,0,'easy',22,'2026-04-01'),
    ('vr3','vs2','vl1','NCERT Science Class 8 Chapter 3 — Synthetic Fibres','article','https://ncert.nic.in/textbook/pdf/hesc108.pdf',NULL,'Official NCERT PDF — Synthetic Fibres and Plastics','Chapter 3','Lesson 1','ncert,science,fibres',0,0,'medium',NULL,'2026-04-01'),
    ('vr4','vs4','vl2','Zerodha Varsity — Option Trading Basics','article','https://zerodha.com/varsity/module/option-theory/',NULL,'Free comprehensive option trading course by Zerodha',NULL,'Module 3','finance,options,zerodha',1,0,'hard',NULL,'2026-04-01'),
    ('vr5','vs4','vl2','CA Rachana Ranade — Stock Market for Beginners','youtube','https://www.youtube.com/watch?v=GfxRHONcMZw','https://img.youtube.com/vi/GfxRHONcMZw/mqdefault.jpg','Complete stock market investing guide for Indians',NULL,NULL,'stocks,investing,beginner',1,0,'easy',45,'2026-04-01')`);

  db.run(`INSERT OR IGNORE INTO vidya_sessions VALUES
    ('vsn1','vl1','vs1',NULL,'2026-04-12',45,'Completed mensuration exercises from NCERT','focused','2026-04-12'),
    ('vsn2','vl1','vs2',NULL,'2026-04-12',30,'Read Chapter 3 — Synthetic Fibres','neutral','2026-04-12'),
    ('vsn3','vl2','vs4',NULL,'2026-04-13',60,'Read Varsity Options module + 2 mock tests','focused','2026-04-13')`);
}
