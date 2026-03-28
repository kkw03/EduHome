// Centralized dummy data for EduHome UI

export const SCHOOLS = [
  { school_id: 1, official_name: 'Raffles Girls\' Primary School', postal_code: '298981', lat: 1.3048, lng: 103.8198, vacancies: 30 },
  { school_id: 2, official_name: 'Nanyang Primary School', postal_code: '267923', lat: 1.3150, lng: 103.8050, vacancies: 45 },
  { school_id: 3, official_name: 'Tao Nan School', postal_code: '428903', lat: 1.3067, lng: 103.9020, vacancies: 60 },
  { school_id: 4, official_name: 'Henry Park Primary School', postal_code: '278120', lat: 1.3230, lng: 103.7850, vacancies: 25 },
  { school_id: 5, official_name: 'Ai Tong School', postal_code: '579646', lat: 1.3540, lng: 103.8380, vacancies: 50 },
  { school_id: 6, official_name: 'CHIJ St. Nicholas Girls\' School', postal_code: '571402', lat: 1.3530, lng: 103.8488, vacancies: 40 },
  { school_id: 7, official_name: 'Catholic High School (Primary)', postal_code: '579767', lat: 1.3559, lng: 103.8350, vacancies: 35 },
  { school_id: 8, official_name: 'Rosyth School', postal_code: '546417', lat: 1.3575, lng: 103.8810, vacancies: 55 },
  { school_id: 9, official_name: 'Pei Hwa Presbyterian Primary School', postal_code: '279747', lat: 1.3180, lng: 103.7990, vacancies: 38 },
  { school_id: 10, official_name: 'Red Swastika School', postal_code: '369117', lat: 1.3260, lng: 103.8830, vacancies: 42 },
];

// HDB blocks per school — Gold < 1km, Silver 1–2km from school
export const SCHOOL_BLOCKS = {
  // 1: Raffles Girls' Primary — 1.3048, 103.8198
  1: [
    { block_id: 101, street_name: 'Jalan Bukit Merah', block_num: '115', lat: 1.3020, lng: 103.8180, lease_start_year: 1985, total_units: 200, zone: 'GOLD_1KM', avg_psf: 620 },
    { block_id: 102, street_name: 'Jalan Bukit Merah', block_num: '117', lat: 1.3070, lng: 103.8210, lease_start_year: 1986, total_units: 180, zone: 'GOLD_1KM', avg_psf: 645 },
    { block_id: 103, street_name: 'Tiong Bahru Road', block_num: '51', lat: 1.3010, lng: 103.8220, lease_start_year: 1970, total_units: 120, zone: 'GOLD_1KM', avg_psf: 710 },
    { block_id: 104, street_name: 'Kim Tian Road', block_num: '136', lat: 1.3080, lng: 103.8170, lease_start_year: 1990, total_units: 240, zone: 'GOLD_1KM', avg_psf: 580 },
    { block_id: 105, street_name: 'Redhill Close', block_num: '75', lat: 1.3035, lng: 103.8250, lease_start_year: 2005, total_units: 300, zone: 'GOLD_1KM', avg_psf: 690 },
    { block_id: 106, street_name: 'Havelock Road', block_num: '22', lat: 1.2990, lng: 103.8190, lease_start_year: 1978, total_units: 150, zone: 'GOLD_1KM', avg_psf: 555 },
    { block_id: 107, street_name: 'Alexandra Road', block_num: '301', lat: 1.2960, lng: 103.8150, lease_start_year: 1995, total_units: 280, zone: 'SILVER_2KM', avg_psf: 510 },
    { block_id: 108, street_name: 'Queenstown Road', block_num: '48', lat: 1.3130, lng: 103.8250, lease_start_year: 2000, total_units: 220, zone: 'SILVER_2KM', avg_psf: 530 },
    { block_id: 109, street_name: 'Telok Blangah Drive', block_num: '79', lat: 1.2940, lng: 103.8280, lease_start_year: 1988, total_units: 190, zone: 'SILVER_2KM', avg_psf: 480 },
    { block_id: 110, street_name: 'Henderson Road', block_num: '93', lat: 1.3150, lng: 103.8120, lease_start_year: 2010, total_units: 350, zone: 'SILVER_2KM', avg_psf: 560 },
    { block_id: 111, street_name: 'Depot Road', block_num: '109', lat: 1.2920, lng: 103.8200, lease_start_year: 1982, total_units: 160, zone: 'SILVER_2KM', avg_psf: 445 },
    { block_id: 112, street_name: 'Stirling Road', block_num: '164', lat: 1.3170, lng: 103.8200, lease_start_year: 2015, total_units: 400, zone: 'SILVER_2KM', avg_psf: 610 },
    { block_id: 113, street_name: 'Tanglin Halt Road', block_num: '33', lat: 1.3000, lng: 103.8050, lease_start_year: 1968, total_units: 100, zone: 'SILVER_2KM', avg_psf: 395 },
    { block_id: 114, street_name: 'Commonwealth Ave', block_num: '88', lat: 1.3100, lng: 103.8340, lease_start_year: 1998, total_units: 260, zone: 'SILVER_2KM', avg_psf: 520 },
  ],
  // 2: Nanyang Primary — 1.3150, 103.8050
  2: [
    { block_id: 201, street_name: 'Farrer Road', block_num: '10', lat: 1.3170, lng: 103.8070, lease_start_year: 1992, total_units: 180, zone: 'GOLD_1KM', avg_psf: 680 },
    { block_id: 202, street_name: 'Queensway', block_num: '45', lat: 1.3130, lng: 103.8030, lease_start_year: 1988, total_units: 220, zone: 'GOLD_1KM', avg_psf: 640 },
    { block_id: 203, street_name: 'Holland Close', block_num: '8', lat: 1.3180, lng: 103.8040, lease_start_year: 2001, total_units: 300, zone: 'GOLD_1KM', avg_psf: 720 },
    { block_id: 204, street_name: 'Commonwealth Drive', block_num: '62', lat: 1.3120, lng: 103.8075, lease_start_year: 1975, total_units: 140, zone: 'GOLD_1KM', avg_psf: 560 },
    { block_id: 205, street_name: 'Tanglin Halt Road', block_num: '97', lat: 1.3155, lng: 103.8010, lease_start_year: 2008, total_units: 260, zone: 'GOLD_1KM', avg_psf: 695 },
    { block_id: 206, street_name: 'Ghim Moh Road', block_num: '15', lat: 1.3190, lng: 103.7990, lease_start_year: 1980, total_units: 200, zone: 'SILVER_2KM', avg_psf: 510 },
    { block_id: 207, street_name: 'Holland Ave', block_num: '31', lat: 1.3230, lng: 103.7960, lease_start_year: 1996, total_units: 250, zone: 'SILVER_2KM', avg_psf: 585 },
    { block_id: 208, street_name: 'Stirling Road', block_num: '170', lat: 1.3050, lng: 103.8010, lease_start_year: 2012, total_units: 380, zone: 'SILVER_2KM', avg_psf: 620 },
    { block_id: 209, street_name: 'Mei Ling Street', block_num: '124', lat: 1.3040, lng: 103.8110, lease_start_year: 1985, total_units: 190, zone: 'SILVER_2KM', avg_psf: 465 },
    { block_id: 210, street_name: 'Dover Road', block_num: '28', lat: 1.3260, lng: 103.7920, lease_start_year: 1990, total_units: 210, zone: 'SILVER_2KM', avg_psf: 530 },
    { block_id: 211, street_name: 'Portsdown Road', block_num: '5', lat: 1.3070, lng: 103.7940, lease_start_year: 1972, total_units: 110, zone: 'SILVER_2KM', avg_psf: 410 },
  ],
  // 3: Tao Nan School — 1.3067, 103.9020
  3: [
    { block_id: 301, street_name: 'Marine Parade Central', block_num: '82', lat: 1.3040, lng: 103.9010, lease_start_year: 1980, total_units: 200, zone: 'GOLD_1KM', avg_psf: 590 },
    { block_id: 302, street_name: 'Marine Terrace', block_num: '56', lat: 1.3085, lng: 103.9040, lease_start_year: 1994, total_units: 240, zone: 'GOLD_1KM', avg_psf: 650 },
    { block_id: 303, street_name: 'Marine Drive', block_num: '71', lat: 1.3050, lng: 103.9060, lease_start_year: 1978, total_units: 160, zone: 'GOLD_1KM', avg_psf: 540 },
    { block_id: 304, street_name: 'East Coast Road', block_num: '29', lat: 1.3095, lng: 103.8990, lease_start_year: 2003, total_units: 280, zone: 'GOLD_1KM', avg_psf: 710 },
    { block_id: 305, street_name: 'Joo Chiat Place', block_num: '14', lat: 1.3030, lng: 103.9035, lease_start_year: 1986, total_units: 190, zone: 'GOLD_1KM', avg_psf: 620 },
    { block_id: 306, street_name: 'Still Road', block_num: '43', lat: 1.3100, lng: 103.9070, lease_start_year: 1974, total_units: 130, zone: 'GOLD_1KM', avg_psf: 480 },
    { block_id: 307, street_name: 'Haig Road', block_num: '11', lat: 1.3130, lng: 103.8920, lease_start_year: 1990, total_units: 220, zone: 'SILVER_2KM', avg_psf: 520 },
    { block_id: 308, street_name: 'Tanjong Katong Road', block_num: '65', lat: 1.3000, lng: 103.8910, lease_start_year: 2010, total_units: 350, zone: 'SILVER_2KM', avg_psf: 580 },
    { block_id: 309, street_name: 'Telok Kurau Road', block_num: '38', lat: 1.3130, lng: 103.9130, lease_start_year: 1982, total_units: 170, zone: 'SILVER_2KM', avg_psf: 460 },
    { block_id: 310, street_name: 'Geylang Serai', block_num: '22', lat: 1.3170, lng: 103.8980, lease_start_year: 1968, total_units: 120, zone: 'SILVER_2KM', avg_psf: 390 },
    { block_id: 311, street_name: 'Sims Ave East', block_num: '99', lat: 1.3180, lng: 103.9060, lease_start_year: 2015, total_units: 400, zone: 'SILVER_2KM', avg_psf: 610 },
    { block_id: 312, street_name: 'Bedok South Road', block_num: '17', lat: 1.2960, lng: 103.9120, lease_start_year: 1995, total_units: 260, zone: 'SILVER_2KM', avg_psf: 505 },
  ],
  // 4: Henry Park Primary — 1.3230, 103.7850
  4: [
    { block_id: 401, street_name: 'Holland Ave', block_num: '12', lat: 1.3210, lng: 103.7870, lease_start_year: 1996, total_units: 200, zone: 'GOLD_1KM', avg_psf: 720 },
    { block_id: 402, street_name: 'Holland Drive', block_num: '40', lat: 1.3250, lng: 103.7830, lease_start_year: 2002, total_units: 280, zone: 'GOLD_1KM', avg_psf: 750 },
    { block_id: 403, street_name: 'Holland Close', block_num: '7', lat: 1.3215, lng: 103.7820, lease_start_year: 1976, total_units: 140, zone: 'GOLD_1KM', avg_psf: 580 },
    { block_id: 404, street_name: 'Chip Bee Gardens', block_num: '3', lat: 1.3260, lng: 103.7870, lease_start_year: 2010, total_units: 300, zone: 'GOLD_1KM', avg_psf: 810 },
    { block_id: 405, street_name: 'Ulu Pandan Road', block_num: '55', lat: 1.3240, lng: 103.7810, lease_start_year: 1988, total_units: 180, zone: 'GOLD_1KM', avg_psf: 650 },
    { block_id: 406, street_name: 'Dover Road', block_num: '29', lat: 1.3150, lng: 103.7830, lease_start_year: 1984, total_units: 210, zone: 'SILVER_2KM', avg_psf: 530 },
    { block_id: 407, street_name: 'Ghim Moh Link', block_num: '18', lat: 1.3120, lng: 103.7890, lease_start_year: 1972, total_units: 150, zone: 'SILVER_2KM', avg_psf: 440 },
    { block_id: 408, street_name: 'Clementi Ave 1', block_num: '312', lat: 1.3330, lng: 103.7760, lease_start_year: 2014, total_units: 420, zone: 'SILVER_2KM', avg_psf: 630 },
    { block_id: 409, street_name: 'Commonwealth Ave West', block_num: '78', lat: 1.3130, lng: 103.7950, lease_start_year: 1990, total_units: 240, zone: 'SILVER_2KM', avg_psf: 510 },
    { block_id: 410, street_name: 'Sunset Way', block_num: '22', lat: 1.3340, lng: 103.7810, lease_start_year: 1998, total_units: 190, zone: 'SILVER_2KM', avg_psf: 570 },
    { block_id: 411, street_name: 'Pandan Valley', block_num: '6', lat: 1.3310, lng: 103.7730, lease_start_year: 1968, total_units: 100, zone: 'SILVER_2KM', avg_psf: 380 },
  ],
  // 5: Ai Tong School — 1.3540, 103.8380
  5: [
    { block_id: 501, street_name: 'Lor Ah Soo', block_num: '114', lat: 1.3520, lng: 103.8400, lease_start_year: 1990, total_units: 220, zone: 'GOLD_1KM', avg_psf: 560 },
    { block_id: 502, street_name: 'Braddell Road', block_num: '231', lat: 1.3560, lng: 103.8360, lease_start_year: 1985, total_units: 200, zone: 'GOLD_1KM', avg_psf: 530 },
    { block_id: 503, street_name: 'Toa Payoh Lor 1', block_num: '143', lat: 1.3510, lng: 103.8370, lease_start_year: 1975, total_units: 160, zone: 'GOLD_1KM', avg_psf: 470 },
    { block_id: 504, street_name: 'Bishan Street 12', block_num: '185', lat: 1.3565, lng: 103.8410, lease_start_year: 2005, total_units: 320, zone: 'GOLD_1KM', avg_psf: 640 },
    { block_id: 505, street_name: 'Toa Payoh Lor 8', block_num: '59', lat: 1.3530, lng: 103.8345, lease_start_year: 1998, total_units: 260, zone: 'GOLD_1KM', avg_psf: 585 },
    { block_id: 506, street_name: 'Bishan Street 22', block_num: '288', lat: 1.3640, lng: 103.8400, lease_start_year: 2010, total_units: 380, zone: 'SILVER_2KM', avg_psf: 650 },
    { block_id: 507, street_name: 'Thomson Road', block_num: '170', lat: 1.3440, lng: 103.8360, lease_start_year: 1980, total_units: 180, zone: 'SILVER_2KM', avg_psf: 430 },
    { block_id: 508, street_name: 'Caldecott Hill', block_num: '15', lat: 1.3430, lng: 103.8290, lease_start_year: 1992, total_units: 210, zone: 'SILVER_2KM', avg_psf: 510 },
    { block_id: 509, street_name: 'Ang Mo Kio Ave 3', block_num: '522', lat: 1.3660, lng: 103.8350, lease_start_year: 1978, total_units: 200, zone: 'SILVER_2KM', avg_psf: 445 },
    { block_id: 510, street_name: 'Marymount Road', block_num: '27', lat: 1.3650, lng: 103.8440, lease_start_year: 2015, total_units: 400, zone: 'SILVER_2KM', avg_psf: 620 },
    { block_id: 511, street_name: 'Potong Pasir Ave 1', block_num: '99', lat: 1.3450, lng: 103.8470, lease_start_year: 1988, total_units: 230, zone: 'SILVER_2KM', avg_psf: 490 },
  ],
  // 6: CHIJ St. Nicholas — 1.3530, 103.8488
  6: [
    { block_id: 601, street_name: 'Toa Payoh Lor 6', block_num: '178', lat: 1.3510, lng: 103.8500, lease_start_year: 1988, total_units: 200, zone: 'GOLD_1KM', avg_psf: 550 },
    { block_id: 602, street_name: 'Toa Payoh Lor 4', block_num: '95', lat: 1.3545, lng: 103.8470, lease_start_year: 1994, total_units: 250, zone: 'GOLD_1KM', avg_psf: 590 },
    { block_id: 603, street_name: 'Toa Payoh Lor 7', block_num: '20', lat: 1.3505, lng: 103.8470, lease_start_year: 1976, total_units: 150, zone: 'GOLD_1KM', avg_psf: 480 },
    { block_id: 604, street_name: 'Toa Payoh Central', block_num: '211', lat: 1.3555, lng: 103.8510, lease_start_year: 2006, total_units: 300, zone: 'GOLD_1KM', avg_psf: 640 },
    { block_id: 605, street_name: 'Toa Payoh Lor 5', block_num: '47', lat: 1.3520, lng: 103.8530, lease_start_year: 1982, total_units: 170, zone: 'GOLD_1KM', avg_psf: 510 },
    { block_id: 606, street_name: 'Potong Pasir Ave 3', block_num: '131', lat: 1.3440, lng: 103.8520, lease_start_year: 1990, total_units: 220, zone: 'SILVER_2KM', avg_psf: 470 },
    { block_id: 607, street_name: 'Bidadari Park Dr', block_num: '66', lat: 1.3620, lng: 103.8550, lease_start_year: 2018, total_units: 450, zone: 'SILVER_2KM', avg_psf: 680 },
    { block_id: 608, street_name: 'Boon Keng Road', block_num: '8', lat: 1.3430, lng: 103.8580, lease_start_year: 1970, total_units: 130, zone: 'SILVER_2KM', avg_psf: 400 },
    { block_id: 609, street_name: 'Serangoon Ave 3', block_num: '254', lat: 1.3640, lng: 103.8450, lease_start_year: 1985, total_units: 200, zone: 'SILVER_2KM', avg_psf: 490 },
    { block_id: 610, street_name: 'MacPherson Lane', block_num: '73', lat: 1.3420, lng: 103.8470, lease_start_year: 1996, total_units: 240, zone: 'SILVER_2KM', avg_psf: 535 },
    { block_id: 611, street_name: 'Braddell Road', block_num: '340', lat: 1.3630, lng: 103.8390, lease_start_year: 2000, total_units: 280, zone: 'SILVER_2KM', avg_psf: 560 },
  ],
  // 7: Catholic High — 1.3559, 103.8350
  7: [
    { block_id: 701, street_name: 'Bishan Street 13', block_num: '196', lat: 1.3580, lng: 103.8340, lease_start_year: 1992, total_units: 240, zone: 'GOLD_1KM', avg_psf: 610 },
    { block_id: 702, street_name: 'Bishan Street 11', block_num: '150', lat: 1.3540, lng: 103.8365, lease_start_year: 1988, total_units: 200, zone: 'GOLD_1KM', avg_psf: 570 },
    { block_id: 703, street_name: 'Sin Ming Ave', block_num: '43', lat: 1.3585, lng: 103.8370, lease_start_year: 1980, total_units: 160, zone: 'GOLD_1KM', avg_psf: 490 },
    { block_id: 704, street_name: 'Bishan Street 24', block_num: '270', lat: 1.3535, lng: 103.8325, lease_start_year: 2008, total_units: 320, zone: 'GOLD_1KM', avg_psf: 680 },
    { block_id: 705, street_name: 'Shunfu Road', block_num: '32', lat: 1.3575, lng: 103.8310, lease_start_year: 1974, total_units: 140, zone: 'GOLD_1KM', avg_psf: 450 },
    { block_id: 706, street_name: 'Marymount Lane', block_num: '11', lat: 1.3660, lng: 103.8380, lease_start_year: 2012, total_units: 380, zone: 'SILVER_2KM', avg_psf: 650 },
    { block_id: 707, street_name: 'Thomson Road', block_num: '205', lat: 1.3460, lng: 103.8310, lease_start_year: 1986, total_units: 200, zone: 'SILVER_2KM', avg_psf: 500 },
    { block_id: 708, street_name: 'Toa Payoh Lor 1', block_num: '160', lat: 1.3460, lng: 103.8410, lease_start_year: 1978, total_units: 180, zone: 'SILVER_2KM', avg_psf: 440 },
    { block_id: 709, street_name: 'Ang Mo Kio Ave 1', block_num: '418', lat: 1.3680, lng: 103.8300, lease_start_year: 1995, total_units: 250, zone: 'SILVER_2KM', avg_psf: 530 },
    { block_id: 710, street_name: 'Upper Thomson Road', block_num: '88', lat: 1.3680, lng: 103.8400, lease_start_year: 2016, total_units: 400, zone: 'SILVER_2KM', avg_psf: 620 },
    { block_id: 711, street_name: 'Caldecott Close', block_num: '6', lat: 1.3450, lng: 103.8270, lease_start_year: 1970, total_units: 110, zone: 'SILVER_2KM', avg_psf: 390 },
  ],
  // 8: Rosyth School — 1.3575, 103.8810
  8: [
    { block_id: 801, street_name: 'Serangoon Ave 4', block_num: '318', lat: 1.3555, lng: 103.8830, lease_start_year: 1990, total_units: 220, zone: 'GOLD_1KM', avg_psf: 540 },
    { block_id: 802, street_name: 'Serangoon Central', block_num: '261', lat: 1.3595, lng: 103.8790, lease_start_year: 1996, total_units: 260, zone: 'GOLD_1KM', avg_psf: 580 },
    { block_id: 803, street_name: 'Serangoon North Ave 1', block_num: '143', lat: 1.3600, lng: 103.8835, lease_start_year: 1982, total_units: 180, zone: 'GOLD_1KM', avg_psf: 490 },
    { block_id: 804, street_name: 'Serangoon Ave 3', block_num: '209', lat: 1.3555, lng: 103.8775, lease_start_year: 2004, total_units: 300, zone: 'GOLD_1KM', avg_psf: 630 },
    { block_id: 805, street_name: 'Boundary Road', block_num: '55', lat: 1.3580, lng: 103.8855, lease_start_year: 1976, total_units: 150, zone: 'GOLD_1KM', avg_psf: 460 },
    { block_id: 806, street_name: 'Hougang Ave 2', block_num: '434', lat: 1.3680, lng: 103.8860, lease_start_year: 2010, total_units: 350, zone: 'SILVER_2KM', avg_psf: 590 },
    { block_id: 807, street_name: 'Kovan Road', block_num: '28', lat: 1.3480, lng: 103.8830, lease_start_year: 1988, total_units: 200, zone: 'SILVER_2KM', avg_psf: 480 },
    { block_id: 808, street_name: 'Hougang Street 21', block_num: '507', lat: 1.3670, lng: 103.8750, lease_start_year: 1972, total_units: 160, zone: 'SILVER_2KM', avg_psf: 410 },
    { block_id: 809, street_name: 'Bartley Road', block_num: '15', lat: 1.3470, lng: 103.8770, lease_start_year: 2014, total_units: 400, zone: 'SILVER_2KM', avg_psf: 640 },
    { block_id: 810, street_name: 'Upper Paya Lebar Rd', block_num: '71', lat: 1.3490, lng: 103.8900, lease_start_year: 1994, total_units: 230, zone: 'SILVER_2KM', avg_psf: 510 },
    { block_id: 811, street_name: 'Simon Road', block_num: '44', lat: 1.3680, lng: 103.8920, lease_start_year: 1986, total_units: 190, zone: 'SILVER_2KM', avg_psf: 470 },
  ],
  // 9: Pei Hwa Presbyterian — 1.3180, 103.7990
  9: [
    { block_id: 901, street_name: 'Queensway', block_num: '57', lat: 1.3160, lng: 103.8010, lease_start_year: 1994, total_units: 240, zone: 'GOLD_1KM', avg_psf: 600 },
    { block_id: 902, street_name: 'Tanglin Halt Road', block_num: '85', lat: 1.3200, lng: 103.7975, lease_start_year: 1986, total_units: 200, zone: 'GOLD_1KM', avg_psf: 560 },
    { block_id: 903, street_name: 'Commonwealth Close', block_num: '103', lat: 1.3165, lng: 103.7960, lease_start_year: 1970, total_units: 130, zone: 'GOLD_1KM', avg_psf: 480 },
    { block_id: 904, street_name: 'Mei Ling Street', block_num: '130', lat: 1.3195, lng: 103.8020, lease_start_year: 2006, total_units: 300, zone: 'GOLD_1KM', avg_psf: 680 },
    { block_id: 905, street_name: 'Stirling Road', block_num: '149', lat: 1.3150, lng: 103.8010, lease_start_year: 1998, total_units: 260, zone: 'GOLD_1KM', avg_psf: 620 },
    { block_id: 906, street_name: 'Ghim Moh Road', block_num: '24', lat: 1.3280, lng: 103.7930, lease_start_year: 1980, total_units: 180, zone: 'SILVER_2KM', avg_psf: 440 },
    { block_id: 907, street_name: 'Holland Drive', block_num: '53', lat: 1.3290, lng: 103.7980, lease_start_year: 2012, total_units: 380, zone: 'SILVER_2KM', avg_psf: 630 },
    { block_id: 908, street_name: 'Redhill Lane', block_num: '61', lat: 1.3080, lng: 103.8030, lease_start_year: 1974, total_units: 140, zone: 'SILVER_2KM', avg_psf: 400 },
    { block_id: 909, street_name: 'Alexandra Road', block_num: '315', lat: 1.3070, lng: 103.7960, lease_start_year: 1992, total_units: 220, zone: 'SILVER_2KM', avg_psf: 520 },
    { block_id: 910, street_name: 'Dover Crescent', block_num: '37', lat: 1.3080, lng: 103.7870, lease_start_year: 2000, total_units: 280, zone: 'SILVER_2KM', avg_psf: 550 },
    { block_id: 911, street_name: 'Buona Vista Street', block_num: '9', lat: 1.3100, lng: 103.7910, lease_start_year: 1968, total_units: 100, zone: 'SILVER_2KM', avg_psf: 370 },
  ],
  // 10: Red Swastika School — 1.3260, 103.8830
  10: [
    { block_id: 1001, street_name: 'Bedok North Road', block_num: '416', lat: 1.3240, lng: 103.8845, lease_start_year: 1992, total_units: 220, zone: 'GOLD_1KM', avg_psf: 530 },
    { block_id: 1002, street_name: 'Bedok North Ave 4', block_num: '503', lat: 1.3280, lng: 103.8815, lease_start_year: 1988, total_units: 200, zone: 'GOLD_1KM', avg_psf: 500 },
    { block_id: 1003, street_name: 'Bedok North Street 3', block_num: '539', lat: 1.3245, lng: 103.8800, lease_start_year: 1978, total_units: 160, zone: 'GOLD_1KM', avg_psf: 440 },
    { block_id: 1004, street_name: 'Bedok Reservoir Road', block_num: '625', lat: 1.3285, lng: 103.8855, lease_start_year: 2008, total_units: 320, zone: 'GOLD_1KM', avg_psf: 610 },
    { block_id: 1005, street_name: 'Bedok North Ave 2', block_num: '471', lat: 1.3250, lng: 103.8870, lease_start_year: 1984, total_units: 190, zone: 'GOLD_1KM', avg_psf: 480 },
    { block_id: 1006, street_name: 'Kaki Bukit Ave 3', block_num: '227', lat: 1.3360, lng: 103.8880, lease_start_year: 2014, total_units: 400, zone: 'SILVER_2KM', avg_psf: 600 },
    { block_id: 1007, street_name: 'Bedok South Road', block_num: '38', lat: 1.3160, lng: 103.8850, lease_start_year: 1986, total_units: 200, zone: 'SILVER_2KM', avg_psf: 470 },
    { block_id: 1008, street_name: 'Tampines Street 11', block_num: '134', lat: 1.3370, lng: 103.8940, lease_start_year: 1990, total_units: 250, zone: 'SILVER_2KM', avg_psf: 510 },
    { block_id: 1009, street_name: 'Ubi Ave 1', block_num: '310', lat: 1.3350, lng: 103.8760, lease_start_year: 1972, total_units: 140, zone: 'SILVER_2KM', avg_psf: 390 },
    { block_id: 1010, street_name: 'Chai Chee Road', block_num: '85', lat: 1.3170, lng: 103.8770, lease_start_year: 2002, total_units: 300, zone: 'SILVER_2KM', avg_psf: 550 },
    { block_id: 1011, street_name: 'Eunos Crescent', block_num: '61', lat: 1.3200, lng: 103.8720, lease_start_year: 1996, total_units: 230, zone: 'SILVER_2KM', avg_psf: 520 },
  ],
};

// Flat list for backward compat (school 1 default)
export const HDB_BLOCKS = SCHOOL_BLOCKS[1];

// 12-month trend data (monthly avg PSF) — keyed by block_id
const LABELS = ['Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25'];
export const TREND_DATA = {
  101: { labels: LABELS, prices: [590, 600, 595, 610, 615, 605, 620, 625, 630, 640, 635, 645], movingAvg: [null, null, 595, 602, 607, 610, 613, 617, 625, 632, 635, 640], momentum: 'Heating Up' },
  102: { labels: LABELS, prices: [660, 655, 650, 645, 640, 648, 642, 638, 635, 640, 643, 645], movingAvg: [null, null, 655, 653, 648, 644, 643, 639, 638, 638, 639, 643], momentum: 'Cooling Off' },
  103: { labels: LABELS, prices: [690, 700, 705, 710, 715, 720, 710, 708, 712, 718, 722, 710], movingAvg: [null, null, 698, 705, 710, 715, 715, 714, 710, 713, 717, 717], momentum: 'Heating Up' },
  201: { labels: LABELS, prices: [650, 660, 665, 670, 675, 680, 685, 690, 688, 692, 695, 700], movingAvg: [null, null, 658, 665, 670, 675, 680, 685, 688, 690, 692, 696], momentum: 'Heating Up' },
  202: { labels: LABELS, prices: [620, 618, 615, 610, 612, 608, 605, 610, 615, 612, 618, 620], movingAvg: [null, null, 618, 614, 612, 610, 608, 608, 610, 612, 615, 617], momentum: 'Stable' },
  301: { labels: LABELS, prices: [570, 575, 580, 578, 582, 585, 590, 588, 592, 595, 598, 600], movingAvg: [null, null, 575, 578, 580, 582, 586, 588, 590, 592, 595, 598], momentum: 'Heating Up' },
  302: { labels: LABELS, prices: [640, 635, 630, 632, 628, 625, 630, 635, 640, 638, 642, 645], movingAvg: [null, null, 635, 632, 630, 628, 628, 630, 635, 638, 640, 642], momentum: 'Stable' },
  401: { labels: LABELS, prices: [700, 710, 715, 720, 725, 730, 735, 740, 738, 742, 748, 750], movingAvg: [null, null, 708, 715, 720, 725, 730, 735, 738, 740, 743, 747], momentum: 'Heating Up' },
  402: { labels: LABELS, prices: [730, 735, 740, 745, 748, 750, 752, 755, 750, 748, 752, 755], movingAvg: [null, null, 735, 740, 744, 748, 750, 752, 752, 751, 750, 752], momentum: 'Stable' },
  501: { labels: LABELS, prices: [540, 545, 550, 548, 552, 555, 558, 560, 565, 562, 568, 570], movingAvg: [null, null, 545, 548, 550, 552, 555, 558, 561, 562, 565, 567], momentum: 'Heating Up' },
  601: { labels: LABELS, prices: [530, 535, 538, 540, 545, 542, 548, 550, 555, 552, 558, 560], movingAvg: [null, null, 534, 538, 541, 542, 545, 547, 551, 552, 555, 557], momentum: 'Heating Up' },
  701: { labels: LABELS, prices: [600, 605, 610, 608, 612, 615, 610, 608, 605, 610, 612, 615], movingAvg: [null, null, 605, 608, 610, 612, 612, 611, 608, 608, 609, 612], momentum: 'Stable' },
  801: { labels: LABELS, prices: [520, 525, 530, 535, 540, 538, 542, 545, 548, 550, 555, 558], movingAvg: [null, null, 525, 530, 535, 538, 540, 542, 545, 548, 551, 554], momentum: 'Heating Up' },
  901: { labels: LABELS, prices: [580, 585, 590, 588, 592, 595, 600, 598, 602, 605, 608, 610], movingAvg: [null, null, 585, 588, 590, 592, 595, 598, 600, 602, 605, 608], momentum: 'Heating Up' },
  1001: { labels: LABELS, prices: [510, 515, 512, 518, 520, 522, 525, 528, 530, 525, 528, 532], movingAvg: [null, null, 512, 515, 517, 520, 522, 525, 528, 528, 528, 528], momentum: 'Stable' },
};

// Transactions per block (recent 12 months)
export const TRANSACTIONS = {
  101: [
    { transaction_id: 101, resale_price: 520000, floor_area_sqm: 78, transaction_date: '2025-11-15', flat_type: '4-Room' },
    { transaction_id: 102, resale_price: 485000, floor_area_sqm: 68, transaction_date: '2025-10-22', flat_type: '3-Room' },
    { transaction_id: 103, resale_price: 540000, floor_area_sqm: 82, transaction_date: '2025-09-10', flat_type: '4-Room' },
  ],
  102: [
    { transaction_id: 201, resale_price: 560000, floor_area_sqm: 82, transaction_date: '2025-11-03', flat_type: '4-Room' },
    { transaction_id: 202, resale_price: 530000, floor_area_sqm: 78, transaction_date: '2025-09-27', flat_type: '4-Room' },
  ],
  103: [
    { transaction_id: 301, resale_price: 680000, floor_area_sqm: 92, transaction_date: '2025-10-30', flat_type: '5-Room' },
    { transaction_id: 302, resale_price: 650000, floor_area_sqm: 88, transaction_date: '2025-08-15', flat_type: '5-Room' },
  ],
};

// Heatmap PSF buckets
export const HEATMAP_LEGEND = [
  { label: '< $400/psf', color: '#16a34a', min: 0, max: 400 },
  { label: '$400-$500', color: '#65a30d', min: 400, max: 500 },
  { label: '$500-$600', color: '#d97706', min: 500, max: 600 },
  { label: '$600-$700', color: '#ea580c', min: 600, max: 700 },
  { label: '> $700/psf', color: '#dc2626', min: 700, max: 9999 },
];

// Hidden gems per school — blocks with PSF below zone average
export const HIDDEN_GEM_IDS = {
  1: [104, 106, 111, 113],
  2: [204, 206, 209, 211],
  3: [303, 306, 309, 310],
  4: [403, 406, 407, 411],
  5: [503, 507, 509],
  6: [603, 606, 608],
  7: [703, 705, 708, 711],
  8: [805, 807, 808],
  9: [903, 906, 908, 911],
  10: [1003, 1005, 1007, 1009],
};

// Ballot risk data — all 10 schools
export const BALLOT_RISK = {
  1: { risk: 'High', score: 85, units_1km: 1200, vacancies: 30, ratio: 40.0 },
  2: { risk: 'Medium', score: 55, units_1km: 800, vacancies: 45, ratio: 17.8 },
  3: { risk: 'Low', score: 25, units_1km: 400, vacancies: 60, ratio: 6.7 },
  4: { risk: 'High', score: 92, units_1km: 1500, vacancies: 25, ratio: 60.0 },
  5: { risk: 'Medium', score: 50, units_1km: 900, vacancies: 50, ratio: 18.0 },
  6: { risk: 'Medium', score: 58, units_1km: 850, vacancies: 40, ratio: 21.3 },
  7: { risk: 'High', score: 78, units_1km: 1100, vacancies: 35, ratio: 31.4 },
  8: { risk: 'Low', score: 30, units_1km: 500, vacancies: 55, ratio: 9.1 },
  9: { risk: 'Medium', score: 48, units_1km: 700, vacancies: 38, ratio: 18.4 },
  10: { risk: 'Low', score: 22, units_1km: 350, vacancies: 42, ratio: 8.3 },
};

// Lease guard per school — blocks with old leases (< 1980)
export const LEASE_FLAGGED_IDS = {
  1: [103, 106, 113],
  2: [204, 211],
  3: [303, 306, 310],
  4: [403, 407, 411],
  5: [503, 509],
  6: [603, 608],
  7: [705, 708, 711],
  8: [805, 808],
  9: [903, 908, 911],
  10: [1003, 1009],
};

// Commute optimizer results per school
export const COMMUTE_RESULTS = {
  1: [
    { block_id: 108, street_name: 'Queenstown Road', block_num: '48', travel_time_min: 12, distance_km: 3.2, route: 'Bus 33' },
    { block_id: 110, street_name: 'Henderson Road', block_num: '93', travel_time_min: 15, distance_km: 4.1, route: 'Bus 120' },
    { block_id: 112, street_name: 'Stirling Road', block_num: '164', travel_time_min: 18, distance_km: 5.0, route: 'Bus 51' },
  ],
  2: [
    { block_id: 208, street_name: 'Stirling Road', block_num: '170', travel_time_min: 10, distance_km: 2.8, route: 'Bus 33' },
    { block_id: 210, street_name: 'Dover Road', block_num: '28', travel_time_min: 14, distance_km: 3.9, route: 'Bus 74' },
    { block_id: 207, street_name: 'Holland Ave', block_num: '31', travel_time_min: 16, distance_km: 4.5, route: 'Bus 7' },
  ],
  3: [
    { block_id: 307, street_name: 'Haig Road', block_num: '11', travel_time_min: 8, distance_km: 2.1, route: 'Bus 16' },
    { block_id: 308, street_name: 'Tanjong Katong Road', block_num: '65', travel_time_min: 11, distance_km: 3.0, route: 'Bus 36' },
    { block_id: 312, street_name: 'Bedok South Road', block_num: '17', travel_time_min: 17, distance_km: 4.8, route: 'Bus 31' },
  ],
  4: [
    { block_id: 406, street_name: 'Dover Road', block_num: '29', travel_time_min: 9, distance_km: 2.5, route: 'Bus 74' },
    { block_id: 408, street_name: 'Clementi Ave 1', block_num: '312', travel_time_min: 13, distance_km: 3.6, route: 'Bus 96' },
    { block_id: 409, street_name: 'Commonwealth Ave West', block_num: '78', travel_time_min: 16, distance_km: 4.3, route: 'Bus 105' },
  ],
  5: [
    { block_id: 507, street_name: 'Thomson Road', block_num: '170', travel_time_min: 11, distance_km: 3.0, route: 'Bus 56' },
    { block_id: 508, street_name: 'Caldecott Hill', block_num: '15', travel_time_min: 14, distance_km: 3.8, route: 'Bus 132' },
    { block_id: 511, street_name: 'Potong Pasir Ave 1', block_num: '99', travel_time_min: 18, distance_km: 5.1, route: 'Bus 13' },
  ],
  6: [
    { block_id: 606, street_name: 'Potong Pasir Ave 3', block_num: '131', travel_time_min: 10, distance_km: 2.7, route: 'Bus 142' },
    { block_id: 609, street_name: 'Serangoon Ave 3', block_num: '254', travel_time_min: 13, distance_km: 3.5, route: 'Bus 130' },
    { block_id: 610, street_name: 'MacPherson Lane', block_num: '73', travel_time_min: 17, distance_km: 4.6, route: 'Bus 61' },
  ],
  7: [
    { block_id: 707, street_name: 'Thomson Road', block_num: '205', travel_time_min: 9, distance_km: 2.4, route: 'Bus 56' },
    { block_id: 709, street_name: 'Ang Mo Kio Ave 1', block_num: '418', travel_time_min: 14, distance_km: 3.9, route: 'Bus 410' },
    { block_id: 711, street_name: 'Caldecott Close', block_num: '6', travel_time_min: 16, distance_km: 4.4, route: 'Bus 132' },
  ],
  8: [
    { block_id: 807, street_name: 'Kovan Road', block_num: '28', travel_time_min: 8, distance_km: 2.2, route: 'Bus 113' },
    { block_id: 809, street_name: 'Bartley Road', block_num: '15', travel_time_min: 12, distance_km: 3.3, route: 'Bus 22' },
    { block_id: 810, street_name: 'Upper Paya Lebar Rd', block_num: '71', travel_time_min: 15, distance_km: 4.1, route: 'Bus 80' },
  ],
  9: [
    { block_id: 906, street_name: 'Ghim Moh Road', block_num: '24', travel_time_min: 10, distance_km: 2.8, route: 'Bus 7' },
    { block_id: 909, street_name: 'Alexandra Road', block_num: '315', travel_time_min: 13, distance_km: 3.5, route: 'Bus 33' },
    { block_id: 910, street_name: 'Dover Crescent', block_num: '37', travel_time_min: 17, distance_km: 4.7, route: 'Bus 74' },
  ],
  10: [
    { block_id: 1007, street_name: 'Bedok South Road', block_num: '38', travel_time_min: 9, distance_km: 2.5, route: 'Bus 31' },
    { block_id: 1010, street_name: 'Chai Chee Road', block_num: '85', travel_time_min: 13, distance_km: 3.6, route: 'Bus 229' },
    { block_id: 1011, street_name: 'Eunos Crescent', block_num: '61', travel_time_min: 16, distance_km: 4.3, route: 'Bus 60' },
  ],
};

// Watchlist items
export const WATCHLIST_ITEMS = [
  { watch_id: 1, school: SCHOOLS[0], min_budget: 400000, max_budget: 600000, is_active: true, created: '2025-09-15' },
  { watch_id: 2, school: SCHOOLS[2], min_budget: 350000, max_budget: 550000, is_active: true, created: '2025-10-02' },
  { watch_id: 3, school: SCHOOLS[4], min_budget: 450000, max_budget: 700000, is_active: false, created: '2025-08-20' },
];

export function getSchoolSuggestions(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return SCHOOLS.filter(s => s.official_name.toLowerCase().includes(q));
}

export function getBlocksForSchool(schoolId) {
  return SCHOOL_BLOCKS[schoolId] || SCHOOL_BLOCKS[1];
}

export function getTrendForBlock(blockId) {
  return TREND_DATA[blockId] || TREND_DATA[101];
}

export function getHiddenGemIds(schoolId) {
  return HIDDEN_GEM_IDS[schoolId] || [];
}

export function getLeaseFlaggedIds(schoolId) {
  return LEASE_FLAGGED_IDS[schoolId] || [];
}

export function getCommuteResults(schoolId) {
  return COMMUTE_RESULTS[schoolId] || COMMUTE_RESULTS[1];
}

export function getHeatmapColor(psf) {
  const bucket = HEATMAP_LEGEND.find(b => psf >= b.min && psf < b.max);
  return bucket ? bucket.color : '#9ca3af';
}

export function getRemainingLease(leaseStartYear) {
  const currentYear = new Date().getFullYear();
  return 99 - (currentYear - leaseStartYear);
}

export function calculatePSF(price, areaSqm) {
  const areaSqft = areaSqm * 10.764;
  return Math.round(price / areaSqft);
}
