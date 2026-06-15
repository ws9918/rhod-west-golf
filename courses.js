/* Rhod + West Golf Adventures — course dataset
   Coordinates are approximate (course/facility level) for mapping.
   top100 = on Golf Digest "America's 100 Greatest" (best-effort defaults; editable in-app).
   Edit freely: each entry is { n: name, s: state, lat, lng, t100: true/false }
*/
window.COURSES = [
  // ---------- UTAH ----------
  { n: "Promontory – Dye", s: "Utah", lat: 40.691, lng: -111.432 },
  { n: "Promontory – Nicklaus", s: "Utah", lat: 40.701, lng: -111.413 },
  { n: "Promontory – Hills", s: "Utah", lat: 40.696, lng: -111.423 },
  { n: "Canyons", s: "Utah", lat: 40.687, lng: -111.556 },
  { n: "Park Meadows", s: "Utah", lat: 40.687, lng: -111.508 },
  { n: "Park City Municipal", s: "Utah", lat: 40.652, lng: -111.508 },
  { n: "Wasatch State Park – Mountain", s: "Utah", lat: 40.531, lng: -111.481 },
  { n: "Wasatch State Park – Lakes", s: "Utah", lat: 40.526, lng: -111.487 },
  { n: "Soldier Hollow – Championship", s: "Utah", lat: 40.378, lng: -111.503 },
  { n: "Soldier Hollow – Valley", s: "Utah", lat: 40.381, lng: -111.499 },
  { n: "Glenwild", s: "Utah", lat: 40.730, lng: -111.545 },
  { n: "Sand Hollow", s: "Utah", lat: 37.131, lng: -113.379 },
  { n: "Coral Canyon", s: "Utah", lat: 37.158, lng: -113.486 },
  { n: "Ledges", s: "Utah", lat: 37.179, lng: -113.611 },
  { n: "Red Ledges", s: "Utah", lat: 40.512, lng: -111.380 },
  { n: "Wohali", s: "Utah", lat: 40.918, lng: -111.399 },
  { n: "Salt Lake CC", s: "Utah", lat: 40.717, lng: -111.815 },
  { n: "Entrada", s: "Utah", lat: 37.144, lng: -113.640 },
  { n: "Thunderbird", s: "Utah", lat: 40.700, lng: -111.900 },

  // ---------- VIRGINIA ----------
  { n: "Belle Haven CC", s: "Virginia", lat: 38.775, lng: -77.060 },
  { n: "Mount Vernon CC", s: "Virginia", lat: 38.735, lng: -77.090 },
  { n: "Annandale CC", s: "Virginia", lat: 38.830, lng: -77.196 },
  { n: "Fort Belvoir GC", s: "Virginia", lat: 38.717, lng: -77.150 },
  { n: "Army Navy – Fairfax", s: "Virginia", lat: 38.846, lng: -77.230 },
  { n: "Army Navy – Arlington", s: "Virginia", lat: 38.867, lng: -77.090 },
  { n: "Washington Golf", s: "Virginia", lat: 38.895, lng: -77.130 },
  { n: "Chantilly National", s: "Virginia", lat: 38.884, lng: -77.470 },
  { n: "Herndon Centennial", s: "Virginia", lat: 38.985, lng: -77.385 },
  { n: "Lansdowne", s: "Virginia", lat: 39.090, lng: -77.480 },
  { n: "1757", s: "Virginia", lat: 38.970, lng: -77.430 },
  { n: "Williamsburg Golden Horseshoe", s: "Virginia", lat: 37.270, lng: -76.706 },
  { n: "Kingsmill", s: "Virginia", lat: 37.235, lng: -76.660 },
  { n: "Fauquier Springs", s: "Virginia", lat: 38.680, lng: -77.800 },
  { n: "Augustine", s: "Virginia", lat: 38.430, lng: -77.430 },
  { n: "Algonkian", s: "Virginia", lat: 39.050, lng: -77.380 },
  { n: "Bristow Manor", s: "Virginia", lat: 38.730, lng: -77.560 },
  { n: "Bay Creek", s: "Virginia", lat: 37.250, lng: -76.010 },
  { n: "Bull Run", s: "Virginia", lat: 38.840, lng: -77.640 },
  { n: "Brambleton Regional", s: "Virginia", lat: 38.990, lng: -77.530 },
  { n: "Birdwood", s: "Virginia", lat: 38.060, lng: -78.560 },
  { n: "Farmington", s: "Virginia", lat: 38.050, lng: -78.560 },
  { n: "The Crossings", s: "Virginia", lat: 37.660, lng: -77.430 },
  { n: "Fairfax CC", s: "Virginia", lat: 38.840, lng: -77.270 },
  { n: "Foundry", s: "Virginia", lat: 37.560, lng: -77.870 },
  { n: "Dominion Valley", s: "Virginia", lat: 38.870, lng: -77.660 },
  { n: "Independence", s: "Virginia", lat: 39.020, lng: -77.500 },
  { n: "Virginia Oaks", s: "Virginia", lat: 38.800, lng: -77.620 },
  { n: "Robert Trent Jones GC", s: "Virginia", lat: 38.810, lng: -77.620 },
  { n: "Fairfax National", s: "Virginia", lat: 38.880, lng: -77.490 },
  { n: "Greendale", s: "Virginia", lat: 38.780, lng: -77.110 },
  { n: "Wintergreen – Devils Knob", s: "Virginia", lat: 37.920, lng: -78.920 },
  { n: "Wintergreen – Shamokin", s: "Virginia", lat: 37.910, lng: -78.930 },
  { n: "Wintergreen – Monocan", s: "Virginia", lat: 37.870, lng: -78.960 },
  { n: "Wintergreen – Tuckahoe", s: "Virginia", lat: 37.870, lng: -78.955 },
  { n: "Hanover CC", s: "Virginia", lat: 37.760, lng: -77.480 },
  { n: "Hidden Valley", s: "Virginia", lat: 37.250, lng: -80.050 },
  { n: "Hermitage", s: "Virginia", lat: 37.660, lng: -77.700 },
  { n: "Kinloch", s: "Virginia", lat: 37.660, lng: -77.690, t100: true },
  { n: "Laurel Hill", s: "Virginia", lat: 38.700, lng: -77.230 },
  { n: "Potomac Shores", s: "Virginia", lat: 38.580, lng: -77.300 },
  { n: "Royal New Kent", s: "Virginia", lat: 37.470, lng: -76.880 },
  { n: "Manor Golf Club (VA)", s: "Virginia", lat: 38.970, lng: -77.730 },
  { n: "Old Trail", s: "Virginia", lat: 38.060, lng: -78.700 },
  { n: "Old Hickory GC", s: "Virginia", lat: 38.610, lng: -77.310 },
  { n: "Pete Dye River Course", s: "Virginia", lat: 37.140, lng: -80.560 },
  { n: "Pohick Bay", s: "Virginia", lat: 38.670, lng: -77.180 },
  { n: "Pinecrest GC", s: "Virginia", lat: 38.820, lng: -77.150 },
  { n: "Penderbrook GC", s: "Virginia", lat: 38.880, lng: -77.370 },
  { n: "Raspberry Falls", s: "Virginia", lat: 39.150, lng: -77.560 },
  { n: "Reston National", s: "Virginia", lat: 38.940, lng: -77.350 },
  { n: "Shenandoah Crossing", s: "Virginia", lat: 38.150, lng: -78.140 },
  { n: "Stonewall Golf Club", s: "Virginia", lat: 38.790, lng: -77.610 },
  { n: "Stoneleigh Golf Club", s: "Virginia", lat: 39.130, lng: -77.770 },
  { n: "Creighton Farms", s: "Virginia", lat: 38.970, lng: -77.640 },
  { n: "The Gauntlet", s: "Virginia", lat: 38.350, lng: -77.520 },
  { n: "The Homestead (Cascades)", s: "Virginia", lat: 38.000, lng: -79.840 },
  { n: "Westfields GC", s: "Virginia", lat: 38.870, lng: -77.400 },

  // ---------- MARYLAND ----------
  { n: "PB Dye", s: "Maryland", lat: 39.330, lng: -77.340 },
  { n: "Bulle Rock", s: "Maryland", lat: 39.530, lng: -76.130 },
  { n: "Queenstown Harbor", s: "Maryland", lat: 38.990, lng: -76.160 },
  { n: "Baltimore CC", s: "Maryland", lat: 39.420, lng: -76.620 },
  { n: "Congressional – Blue", s: "Maryland", lat: 39.000, lng: -77.170 },
  { n: "Congressional – Gold", s: "Maryland", lat: 39.005, lng: -77.165 },
  { n: "Bethesda CC", s: "Maryland", lat: 38.990, lng: -77.130 },
  { n: "Columbia CC", s: "Maryland", lat: 39.000, lng: -77.080 },
  { n: "Chevy Chase CC", s: "Maryland", lat: 38.970, lng: -77.080 },
  { n: "Woodmont", s: "Maryland", lat: 39.060, lng: -77.140 },
  { n: "Woodmore", s: "Maryland", lat: 38.910, lng: -76.790 },
  { n: "Falls Road GC", s: "Maryland", lat: 39.030, lng: -77.180 },
  { n: "Manor Golf Club (MD)", s: "Maryland", lat: 39.150, lng: -77.080 },
  { n: "Navy Golf Course", s: "Maryland", lat: 39.000, lng: -76.560 },
  { n: "Blue Mash", s: "Maryland", lat: 39.180, lng: -77.130 },
  { n: "Bretton Woods", s: "Maryland", lat: 39.130, lng: -77.260 },
  { n: "Burning Tree", s: "Maryland", lat: 38.990, lng: -77.150 },
  { n: "Bay Hills Golf Club", s: "Maryland", lat: 39.040, lng: -76.510 },
  { n: "Cattail Creek CC", s: "Maryland", lat: 39.290, lng: -77.020 },
  { n: "Compass Pointe", s: "Maryland", lat: 39.110, lng: -76.520 },
  { n: "Caves Valley", s: "Maryland", lat: 39.430, lng: -76.790 },
  { n: "Four Streams", s: "Maryland", lat: 39.180, lng: -77.420 },
  { n: "Gibson Island", s: "Maryland", lat: 39.070, lng: -76.430 },
  { n: "Harbourtowne", s: "Maryland", lat: 38.720, lng: -76.150 },
  { n: "Fountainhead", s: "Maryland", lat: 39.160, lng: -77.180 },
  { n: "Kenwood G&CC", s: "Maryland", lat: 38.980, lng: -77.130 },
  { n: "Laytonsville GC", s: "Maryland", lat: 39.210, lng: -77.140 },
  { n: "Lake Presidential", s: "Maryland", lat: 38.850, lng: -76.770 },
  { n: "Lakewood CC", s: "Maryland", lat: 39.040, lng: -77.110 },
  { n: "University of Maryland GC", s: "Maryland", lat: 38.990, lng: -76.950 },
  { n: "Needwood GC", s: "Maryland", lat: 39.130, lng: -77.140 },
  { n: "Renditions", s: "Maryland", lat: 38.930, lng: -76.620 },
  { n: "TPC Potomac", s: "Maryland", lat: 39.030, lng: -77.200 },
  { n: "Worthington Manor", s: "Maryland", lat: 39.300, lng: -77.380 },
  { n: "Whiskey Creek", s: "Maryland", lat: 39.350, lng: -77.330 },

  // ---------- WEST VIRGINIA ----------
  { n: "Greenbrier – Old White", s: "West Virginia", lat: 37.785, lng: -80.305 },
  { n: "Greenbrier – Snead", s: "West Virginia", lat: 37.787, lng: -80.300 },

  // ---------- PENNSYLVANIA ----------
  { n: "Latrobe", s: "Pennsylvania", lat: 40.300, lng: -79.380 },
  { n: "Merion", s: "Pennsylvania", lat: 39.995, lng: -75.310, t100: true },
  { n: "Penn State Blue Course", s: "Pennsylvania", lat: 40.800, lng: -77.860 },
  { n: "Lancaster CC", s: "Pennsylvania", lat: 40.060, lng: -76.310 },
  { n: "Hershey GC", s: "Pennsylvania", lat: 40.290, lng: -76.650 },
  { n: "Nemacolin – Mystic Rock", s: "Pennsylvania", lat: 39.790, lng: -79.580 },
  { n: "Nemacolin – Shepherd's Rock", s: "Pennsylvania", lat: 39.795, lng: -79.575 },

  // ---------- NEW JERSEY ----------
  { n: "Pine Valley", s: "New Jersey", lat: 39.785, lng: -74.970, t100: true },
  { n: "High Bridge Hills", s: "New Jersey", lat: 40.660, lng: -74.890 },
  { n: "Roxiticus Golf Club", s: "New Jersey", lat: 40.770, lng: -74.620 },

  // ---------- NORTH CAROLINA ----------
  { n: "Pinehurst No. 2", s: "North Carolina", lat: 35.190, lng: -79.470, t100: true },
  { n: "Pinehurst No. 8", s: "North Carolina", lat: 35.210, lng: -79.430 },
  { n: "Pinehurst No. 7", s: "North Carolina", lat: 35.205, lng: -79.450 },
  { n: "Tobacco Road", s: "North Carolina", lat: 35.440, lng: -79.110 },
  { n: "Old Town CC", s: "North Carolina", lat: 36.110, lng: -80.300 },

  // ---------- SOUTH CAROLINA ----------
  { n: "Kiawah – Ocean Course", s: "South Carolina", lat: 32.610, lng: -80.040, t100: true },
  { n: "Kiawah – Cougar Point", s: "South Carolina", lat: 32.615, lng: -80.085 },
  { n: "Kiawah – Osprey Point", s: "South Carolina", lat: 32.610, lng: -80.075 },
  { n: "Kiawah – Turtle Point", s: "South Carolina", lat: 32.620, lng: -80.060 },
  { n: "Harbour Town", s: "South Carolina", lat: 32.140, lng: -80.810 },
  { n: "Hilton Head (HHI)", s: "South Carolina", lat: 32.190, lng: -80.740 },

  // ---------- GEORGIA ----------
  { n: "Sea Island – Seaside", s: "Georgia", lat: 31.220, lng: -81.380 },
  { n: "Sea Island – Plantation", s: "Georgia", lat: 31.215, lng: -81.385 },
  { n: "Sea Island – Retreat", s: "Georgia", lat: 31.210, lng: -81.390 },
  { n: "Reynolds Plantation", s: "Georgia", lat: 33.510, lng: -83.200 },
  { n: "Ocean Forest", s: "Georgia", lat: 31.230, lng: -81.350, t100: true },
  { n: "UGA Golf Course", s: "Georgia", lat: 33.920, lng: -83.430 },
  { n: "Jekyll Island GC", s: "Georgia", lat: 31.060, lng: -81.420 },

  // ---------- FLORIDA ----------
  { n: "Biltmore Coral Gables", s: "Florida", lat: 25.730, lng: -80.280 },
  { n: "Doral – Blue Monster", s: "Florida", lat: 25.815, lng: -80.340 },
  { n: "Cove Cay", s: "Florida", lat: 27.910, lng: -82.700 },
  { n: "The Bull", s: "Florida", lat: 28.500, lng: -81.400 },
  { n: "TPC Sawgrass – Stadium", s: "Florida", lat: 30.200, lng: -81.395 },
  { n: "TPC Sawgrass – Dye's Valley", s: "Florida", lat: 30.195, lng: -81.400 },
  { n: "The King", s: "Florida", lat: 28.310, lng: -81.620 },
  { n: "The Bear", s: "Florida", lat: 28.315, lng: -81.625 },
  { n: "The Knight", s: "Florida", lat: 28.312, lng: -81.618 },
  { n: "Lake Jovita", s: "Florida", lat: 28.380, lng: -82.180 },
  { n: "World Woods", s: "Florida", lat: 28.620, lng: -82.350 },
  { n: "Royal Poinciana", s: "Florida", lat: 26.190, lng: -81.790 },
  { n: "Disney – The Palm", s: "Florida", lat: 28.380, lng: -81.560 },
  { n: "Disney – Lake Buena Vista", s: "Florida", lat: 28.385, lng: -81.555 },
  { n: "Disney – Magnolia (Championship)", s: "Florida", lat: 28.375, lng: -81.565 },
  { n: "Streamsong – Red", s: "Florida", lat: 27.680, lng: -81.870, t100: true },
  { n: "Streamsong – Blue", s: "Florida", lat: 27.685, lng: -81.865 },
  { n: "Streamsong – Black", s: "Florida", lat: 27.690, lng: -81.880, t100: true },
  { n: "Tiburon", s: "Florida", lat: 26.260, lng: -81.760 },
  { n: "Crandon Golf – Key Biscayne", s: "Florida", lat: 25.700, lng: -80.155 },
  { n: "Waldorf Astoria Orlando", s: "Florida", lat: 28.350, lng: -81.560 },
  { n: "Innisbrook – Osprey", s: "Florida", lat: 28.110, lng: -82.700 },
  { n: "Innisbrook – Copperhead", s: "Florida", lat: 28.115, lng: -82.695 },
  { n: "Innisbrook – Island", s: "Florida", lat: 28.105, lng: -82.705 },
  { n: "TPC Tampa Bay", s: "Florida", lat: 28.150, lng: -82.480 },
  { n: "Rocky Point", s: "Florida", lat: 28.000, lng: -82.580 },
  { n: "Windswept Dunes", s: "Florida", lat: 30.500, lng: -86.150 },
  { n: "Kelly Plantation", s: "Florida", lat: 30.420, lng: -86.450 },

  // ---------- ALABAMA ----------
  { n: "RTJ – Ross Bridge", s: "Alabama", lat: 33.380, lng: -86.880 },
  { n: "RTJ – The Judge", s: "Alabama", lat: 32.500, lng: -86.430 },
  { n: "RTJ – Legislator", s: "Alabama", lat: 32.505, lng: -86.435 },
  { n: "RTJ – Senator", s: "Alabama", lat: 32.510, lng: -86.440 },

  // ---------- LOUISIANA ----------
  { n: "Southern Trace CC", s: "Louisiana", lat: 32.420, lng: -93.770 },

  // ---------- TEXAS ----------
  { n: "Pecan Valley", s: "Texas", lat: 29.380, lng: -98.380 },
  { n: "Rockwood GC", s: "Texas", lat: 32.790, lng: -97.330 },
  { n: "Bridlewood GC", s: "Texas", lat: 33.030, lng: -97.080 },
  { n: "Frisco Lakes", s: "Texas", lat: 33.180, lng: -96.880 },
  { n: "Dallas Golf Club", s: "Texas", lat: 32.700, lng: -96.960 },
  { n: "PGA Frisco – Fields Ranch", s: "Texas", lat: 33.220, lng: -96.790 },
  { n: "Waterchase GC", s: "Texas", lat: 32.800, lng: -97.190 },
  { n: "Barton Creek (Austin)", s: "Texas", lat: 30.270, lng: -97.880 },
  { n: "Northwood CC", s: "Texas", lat: 32.880, lng: -96.790 },
  { n: "Cowboys GC", s: "Texas", lat: 32.930, lng: -97.080 },
  { n: "Tenison Park", s: "Texas", lat: 32.790, lng: -96.730 },
  { n: "Trophy Club", s: "Texas", lat: 32.990, lng: -97.190 },
  { n: "Diamondback GC", s: "Texas", lat: 32.450, lng: -99.730 },
  { n: "Abilene CC", s: "Texas", lat: 32.430, lng: -99.760 },
  { n: "The Rawls Course (TTU)", s: "Texas", lat: 33.580, lng: -101.900 },
  { n: "Hill Country GC", s: "Texas", lat: 29.600, lng: -98.620 },
  { n: "The Star (Frisco)", s: "Texas", lat: 33.095, lng: -96.835 },

  // ---------- OKLAHOMA ----------
  { n: "Southern Hills CC", s: "Oklahoma", lat: 36.090, lng: -95.940 },

  // ---------- MICHIGAN ----------
  { n: "U of Michigan GC", s: "Michigan", lat: 42.270, lng: -83.740 },
  { n: "TPC Michigan", s: "Michigan", lat: 42.300, lng: -83.270 },

  // ---------- OHIO ----------
  { n: "Firestone – North", s: "Ohio", lat: 41.000, lng: -81.532 },
  { n: "Firestone – South", s: "Ohio", lat: 41.000, lng: -81.530 },
  { n: "Firestone – West", s: "Ohio", lat: 41.000, lng: -81.528 },

  // ---------- CALIFORNIA ----------
  { n: "Pebble Beach", s: "California", lat: 36.568, lng: -121.949, t100: true },
  { n: "Spanish Bay", s: "California", lat: 36.610, lng: -121.940 },
  { n: "Pasatiempo", s: "California", lat: 37.000, lng: -122.030, t100: true },
  { n: "Silverado", s: "California", lat: 38.350, lng: -122.260 },
  { n: "La Quinta", s: "California", lat: 33.680, lng: -116.290 },
  { n: "PGA West", s: "California", lat: 33.660, lng: -116.270 },

  // ---------- OREGON ----------
  { n: "Crosswater", s: "Oregon", lat: 43.870, lng: -121.470 },
  { n: "Sunriver", s: "Oregon", lat: 43.880, lng: -121.450 },
  { n: "Tetherow", s: "Oregon", lat: 44.020, lng: -121.350 },
  { n: "Aspen Lakes", s: "Oregon", lat: 44.300, lng: -121.530 },
  { n: "Bandon – Trails", s: "Oregon", lat: 43.180, lng: -124.390, t100: true },
  { n: "Bandon – Pacific Dunes", s: "Oregon", lat: 43.190, lng: -124.400, t100: true },
  { n: "Bandon – Old Macdonald", s: "Oregon", lat: 43.195, lng: -124.405, t100: true },
  { n: "Bandon Dunes", s: "Oregon", lat: 43.185, lng: -124.395, t100: true },
  { n: "Bandon – Preserve", s: "Oregon", lat: 43.175, lng: -124.395 },
  { n: "Bandon – Sheep Ranch", s: "Oregon", lat: 43.200, lng: -124.408, t100: true },

  // ---------- COLORADO ----------
  { n: "Vail GC", s: "Colorado", lat: 39.640, lng: -106.360 },
  { n: "Broadmoor – East (Championship)", s: "Colorado", lat: 38.790, lng: -104.850 },
  { n: "Broadmoor – West", s: "Colorado", lat: 38.788, lng: -104.852 },
  { n: "Colorado Golf Club", s: "Colorado", lat: 39.470, lng: -104.700 },

  // ---------- NEW MEXICO ----------
  { n: "Paa-Ko Ridge", s: "New Mexico", lat: 35.180, lng: -106.330 },
  { n: "Black Mesa", s: "New Mexico", lat: 36.000, lng: -106.060 },

  // ---------- ARIZONA ----------
  { n: "Wigwam – Red", s: "Arizona", lat: 33.490, lng: -112.360 },
  { n: "Wigwam – White", s: "Arizona", lat: 33.492, lng: -112.358 },
  { n: "Boulders", s: "Arizona", lat: 33.820, lng: -111.920 },
  { n: "Grayhawk", s: "Arizona", lat: 33.690, lng: -111.910 },
  { n: "Grayhawk – Raptor", s: "Arizona", lat: 33.692, lng: -111.908 },
  { n: "Troon North", s: "Arizona", lat: 33.760, lng: -111.860 },
  { n: "Southern Dunes", s: "Arizona", lat: 33.100, lng: -112.000 },
  { n: "Starr Pass", s: "Arizona", lat: 32.200, lng: -111.060 },
  { n: "TPC Scottsdale – Stadium", s: "Arizona", lat: 33.640, lng: -111.910 },
  { n: "TPC Scottsdale – Champions", s: "Arizona", lat: 33.642, lng: -111.912 },

  // ---------- NEVADA ----------
  { n: "Wolf Creek", s: "Nevada", lat: 36.830, lng: -114.130 },
  { n: "TPC Summerlin", s: "Nevada", lat: 36.160, lng: -115.330 },
  { n: "Bali Hai", s: "Nevada", lat: 36.080, lng: -115.170 },

  // ---------- TENNESSEE ----------
  { n: "Sewanee GC", s: "Tennessee", lat: 35.200, lng: -85.920 },
  { n: "The Honors Course", s: "Tennessee", lat: 35.080, lng: -85.080, t100: true },

  // ---------- NEW YORK ----------
  { n: "Oak Hill", s: "New York", lat: 43.120, lng: -77.580, t100: true },

  // ---------- WISCONSIN ----------
  { n: "Whistling Straits – Irish", s: "Wisconsin", lat: 43.850, lng: -87.730 },
  { n: "Whistling Straits – Straits", s: "Wisconsin", lat: 43.855, lng: -87.720, t100: true },
  { n: "Blackwolf Run – River", s: "Wisconsin", lat: 43.730, lng: -87.780 },
  { n: "Blackwolf Run – Meadows", s: "Wisconsin", lat: 43.732, lng: -87.782 },
  { n: "Erin Hills", s: "Wisconsin", lat: 43.250, lng: -88.350, t100: true },
  { n: "Sand Valley", s: "Wisconsin", lat: 44.300, lng: -89.880, t100: true },
  { n: "Mammoth Dunes", s: "Wisconsin", lat: 44.305, lng: -89.885, t100: true },
  { n: "The Bull at Pinehurst Farms", s: "Wisconsin", lat: 43.580, lng: -89.760 },
  { n: "Tripoli CC", s: "Wisconsin", lat: 43.100, lng: -88.000 },

  // ---------- WASHINGTON ----------
  { n: "Chambers Bay", s: "Washington", lat: 47.200, lng: -122.580 },
  { n: "Gold Mountain", s: "Washington", lat: 47.560, lng: -122.770 },
  { n: "Newcastle – China Creek", s: "Washington", lat: 47.530, lng: -122.160 },
  { n: "Newcastle – Coal Creek", s: "Washington", lat: 47.532, lng: -122.162 },

  // ---------- DC ----------
  { n: "East Potomac – Blue", s: "DC", lat: 38.870, lng: -77.020 },
  { n: "East Potomac – White", s: "DC", lat: 38.868, lng: -77.022 },

  // ---------- MONTANA ----------
  { n: "Spanish Peaks", s: "Montana", lat: 45.250, lng: -111.420 },
  { n: "Yellowstone Club", s: "Montana", lat: 45.260, lng: -111.450 },
  { n: "Rock Creek Cattle Company", s: "Montana", lat: 46.400, lng: -112.730, t100: true },
  { n: "Big Sky", s: "Montana", lat: 45.280, lng: -111.400 },
  { n: "Moonlight Basin", s: "Montana", lat: 45.290, lng: -111.450 },

  // ---------- INTERNATIONAL ----------
  { n: "Royal Westmoreland", s: "Barbados", lat: 13.230, lng: -59.640 },
  { n: "Apes Hill", s: "Barbados", lat: 13.200, lng: -59.580 },
  { n: "Sandy Lane", s: "Barbados", lat: 13.180, lng: -59.640 },
  { n: "Barbados Golf Club", s: "Barbados", lat: 13.080, lng: -59.560 },

  { n: "Leven", s: "Scotland", lat: 56.200, lng: -2.990 },
  { n: "The Old Course (St Andrews)", s: "Scotland", lat: 56.343, lng: -2.803 },
  { n: "The New Course (St Andrews)", s: "Scotland", lat: 56.345, lng: -2.795 },
  { n: "Kingsbarns", s: "Scotland", lat: 56.290, lng: -2.660 },
  { n: "Carnoustie", s: "Scotland", lat: 56.500, lng: -2.710 },
  { n: "Drumoig", s: "Scotland", lat: 56.380, lng: -2.870 },
  { n: "Scotscraig", s: "Scotland", lat: 56.430, lng: -2.890 },

  { n: "Chamonix Golf Course", s: "France", lat: 45.930, lng: 6.860 },
  { n: "Pont Royal", s: "France", lat: 43.720, lng: 5.180 },
  { n: "Barbaroux", s: "France", lat: 43.430, lng: 6.080 },

  { n: "Querencia", s: "Mexico", lat: 22.930, lng: -109.770 },

  { n: "Cabot Links", s: "Canada", lat: 46.200, lng: -61.110 },
  { n: "Cabot Cliffs", s: "Canada", lat: 46.220, lng: -61.120 },
  { n: "Westmorland", s: "Canada", lat: 46.100, lng: -64.790 },
  { n: "Horseshoe Bay", s: "Canada", lat: 44.480, lng: -79.770 },
  { n: "Ghost", s: "Canada", lat: 51.200, lng: -114.470 }
];
