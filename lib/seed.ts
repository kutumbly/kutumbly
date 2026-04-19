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
  // 1. Family members
  db.run(`INSERT OR IGNORE INTO family_members VALUES
    ('jm','Jawahar R. M.','System Architect','1981-03-15','JM'),
    ('sm','Sunita Mallah','Co-Founder','1984-07-22','SM'),
    ('pj','Priya Mallah','Beti','2012-05-12','PJ')`);

  // 2. Sewak Hub (Kutumb Sewak)
  db.run(`INSERT OR IGNORE INTO sewak_members VALUES
    ('st1','Kamla Devi','Housekeeping',4000,'2022-01-10','+91 98765 43210',0,2,'VERIFIED','1234-5678-9012'),
    ('st2','Ramesh Kumar','Driver',12500,'2020-03-15','+91 98234 56789',500,1,'VERIFIED','9876-5432-1098')`);

  // 3. Cash Hub (Transactions & Budget)
  db.run(`INSERT OR IGNORE INTO cash_transactions VALUES
    ('t1','2026-04-01',125000,'income','Sovereign Salary','Monthly earnings — Jawahar','jm','2026-04-01'),
    ('t2','2026-04-09',3240,'expense','Saman','D-Mart grocery','sm','2026-04-09'),
    ('t3','2026-04-07',1820,'expense','Suvidha','MSEB electricity','jm','2026-04-07'),
    ('t4','2026-04-10',4500,'expense','Nivas','Society maintenance','jm','2026-04-10'),
    ('t5','2026-04-08',1200,'expense','Vidya','School books — Priya','sm','2026-04-08'),
    ('t6','2026-04-05',6000,'expense','Sewak','Kamla Devi salary + bonus','jm','2026-04-05'),
    ('t7','2026-04-05',12500,'expense','Sewak','Ramesh Kumar salary','jm','2026-04-05')`);

  db.run(`INSERT OR IGNORE INTO cash_budgets VALUES
    ('b1','Saman',15000,'2026-04'),
    ('b2','Suvidha',5000,'2026-04'),
    ('b3','Sewak',20000,'2026-04')`);

  // 4. Utsav Hub (Social & Events)
  db.run(`INSERT OR IGNORE INTO utsav_internal_events VALUES
    ('e1','Akshaya Tritiya','2026-04-30','Pooja','Auspicious — gold purchase',5000,'Gold Coin',1),
    ('e2','Priya ki Birthday','2026-05-12','Birthday','Gift + celebration at home',2000,'Sketch pad + art supplies',0)`);

  db.run(`INSERT OR IGNORE INTO utsav_events VALUES
    ('ne1','Rahul ki Shaadi','shaadi','they_invited','Mallah Parivar','2026-04-22','Agra',4,'upcoming',NULL,'2026-04-13'),
    ('ne2','Chotu ka Mundan','mundan','they_invited','Verma Khaandaan','2026-02-02','Lucknow',3,'attended',NULL,'2026-02-03')`);

  db.run(`INSERT OR IGNORE INTO utsav_shagun VALUES
    ('ns1','ne1','diya',21000,'Cash envelope','Jawahar Mallah',NULL,0,'2026-04-13'),
    ('ns2','ne2','diya',15000,'Silver bowl set + cash','Sunita Mallah',NULL,1,'2026-02-03')`);

  // 5. Cash Hub (Wealth & Investments)
  db.run(`INSERT OR IGNORE INTO cash_investments VALUES
    ('i1','jm',NULL,'Parag Parikh Flexi Cap','Mutual Fund',240000,285000,NULL,5000,'2022-01-01',NULL,'Main retirement fund'),
    ('i2','jm',NULL,'Gold Physical (Vault)','Gold',160000,205000,NULL,NULL,'2021-11-01',NULL,'28g physical + SGBs'),
    ('i3','pj',NULL,'Sukanya Samriddhi (SSY)','SSY',150000,175000,NULL,12500,'2023-01-01','2044-01-01','Priya higher education')`);

  // 6. Health Hub
  db.run(`INSERT OR IGNORE INTO health_readings VALUES
    ('h1','jm','2026-04-12',118,76,98,72,74.5,NULL,'2026-04-12'),
    ('h2','sm','2026-04-12',138,88,112,78,62.0,'BP elevated — avoid salt','2026-04-12')`);

  db.run(`INSERT OR IGNORE INTO health_profiles (id, member_id, blood_group, allergies) VALUES
    ('hp1','jm','O+','None'),
    ('hp2','sm','B+','Dust, Pollen')`);

  // 7. Sovereign Diary & Tasks
  db.run(`INSERT OR IGNORE INTO diary_entries (id, date, content, mood, mood_label, title, created_at) VALUES
    ('d1','2026-04-12','Aaj family ke saath nashta kiya. Priya ke exam results aye — 94% in Maths. Bahut khushi hui aaj.','4','Happy','Khushi ka Din','2026-04-12')`);

  db.run(`INSERT OR IGNORE INTO tasks (id, title, description, priority, status, category, assigned_to, due_date, created_at) VALUES
    ('tk1','Renew Car Insurance','Expires May 1 — call agent','high','pending','Finance','jm','2026-04-28','2026-04-12'),
    ('tk2','Book Dentist for Priya','Regular checkup','medium','pending','Health','sm','2026-05-05','2026-04-12')`);

  // 8. Saman Hub (Kirana)
  db.run(`INSERT OR IGNORE INTO saman_lists VALUES ('gl1','Kirana List','2026-04-12','active')`);
  db.run(`INSERT OR IGNORE INTO saman_items VALUES
    ('gi1','gl1','Atta (Organic)','10','kg',450,0,'Grains',8,2,NULL,'2026-04-10'),
    ('gi2','gl1','Amul Ghee','1','L',650,0,'Dairy',0.5,0.2,NULL,'2026-04-05'),
    ('gi3','gl1','Toor Dal','2','kg',280,0,'Grains',1.5,0.5,NULL,'2026-04-09')`);

  // 9. Vidya Hub (Study Buddy)
  db.run(`INSERT OR IGNORE INTO vidya_learners VALUES
    ('vl1','Priya Mallah','pj','DPS Delhi','Class 8','CBSE','PJ','Score 90%+ in Boards','2028-03-31',1,'2026-04-01')`);

  db.run(`INSERT OR IGNORE INTO vidya_subjects VALUES
    ('vs1','vl1','Mathematics','Science','#6366f1','90%+',NULL,'2026-04-01')`);

  // 10. Suvidha Hub (Daily Delivery)
  db.run(`INSERT OR IGNORE INTO suvidha_vendors VALUES
    ('sv1','Amul Mother Dairy','milk',68,1,'jm',1,'2026-04-01'),
    ('sv2','Pure Water Supplies','water',40,1,'sm',1,'2026-04-01')`);

  db.run(`INSERT OR IGNORE INTO suvidha_logs VALUES
    ('sl1','sv1','2026-04-12',2,5,'Regular delivery','2026-04-12'),
    ('sl2','sv1','2026-04-13',2,5,NULL,'2026-04-13')`);

  // 11. Sanskriti Hub (Heritage)
  db.run(`INSERT OR IGNORE INTO sanskriti_dharma_profile (id, gotra, kuldevta, veda) VALUES
    ('dp1','Kashyap','Lord Shiva','Rigveda')`);

  db.run(`INSERT OR IGNORE INTO sanskriti_village_roots (id, village_name, district, state) VALUES
    ('vr1','Mallah Pur','Varanasi','Uttar Pradesh')`);
}
