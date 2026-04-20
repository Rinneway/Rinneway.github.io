const levels = [
  // УРОВЕНЬ 1 — «Дневная поляна»
  {
    name: "Дневная поляна",
    worldW: 1600,
    bgColors: ["#6EC6F0", "#B8E4FF"],
    fogColor: "rgba(180,225,255,0.18)",
    start: {x: 70, y: 300},

    checkpoints: [
      {x: 700, y: 210, w: 20, h: 40}
    ],

    platforms: [
      // Земля
      {x: 0,    y: 360, w: 400,  h: 40, color: "#4a7c2f", top: "#6abf3e"},
      {x: 480,  y: 360, w: 300,  h: 40, color: "#4a7c2f", top: "#6abf3e"},
      {x: 860,  y: 360, w: 200,  h: 40, color: "#4a7c2f", top: "#6abf3e"},
      {x: 1300, y: 360, w: 300,  h: 40, color: "#4a7c2f", top: "#6abf3e"},

      // Платформы
      {x: 160,  y: 300, w: 90,   h: 16, color: "#5a9e35", top: "#7dcc48"},
      {x: 310,  y: 250, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48"},
      {x: 660,  y: 250, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48"},
      {x: 1080, y: 255, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48"},
      {x: 1180, y: 300, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48"},
      {x: 1310, y: 270, w: 100,  h: 16, color: "#5a9e35", top: "#7dcc48"},
      {x: 1450, y: 230, w: 100,  h: 16, color: "#5a9e35", top: "#7dcc48"},
    ],

    movingPlatforms: [
      {x: 860,  y: 270, w: 80, h: 16,
         color: "#8BC34A", top: "#AEE060", dx: 1.4, minX: 850, maxX: 1000},
    ],

    springs: [
      {x: 552, y: 360},
    ],

    enemies: [
      {x: 600, y: 335, w: 20, h: 20,
         dx: 0.8, minX: 480, maxX: 780, color: "#e05c5c", hp: 3},
      {x: 1050, y: 335, w: 20, h: 20,
         dx: 1.0, minX: 860, maxX: 1060, color: "#e05c5c", hp: 3},
      {x: 1350, y: 245, w: 20, h: 20,
         dx: 1.0, minX: 1310, maxX: 1410, color: "#e05c5c", hp: 3},
    ],

    hearts: [
      {x: 190,  y: 272},
      {x: 345,  y: 222},
      {x: 670,  y: 222},
      {x: 1020, y: 200},
      {x: 1490, y: 125},
    ],

    portal: {x: 1510, y: 315},

    decorations: [
      {type: "cloud", x: 80,   y: 55,  s: 1.1},
      {type: "cloud", x: 350,  y: 35,  s: 1.4},
      {type: "cloud", x: 700,  y: 60,  s: 0.9},
      {type: "cloud", x: 1050, y: 40,  s: 1.2},
      {type: "cloud", x: 1400, y: 65,  s: 1.0},
      {type: "tree",  x: 60,   y: 358},
      {type: "tree",  x: 250,  y: 358},
      {type: "tree",  x: 1350, y: 358},
    ],
  },

  // УРОВЕНЬ 2 — «Закатная мелодия»
  {
    name: "Закатная мелодия",
    worldW: 1650,
    bgColors: ["#FF7043", "#FFD54F"],
    fogColor: "rgba(255,160,80,0.14)",
    start: {x: 240, y: 300},

    checkpoints: [
      {x: 790, y: 110, w: 20, h: 40}
    ],

    platforms: [
      // Земля
      {x: 0,    y: 360, w: 300,  h: 40, color: "#7B3F00", top: "#A0522D"},
      {x: 680,  y: 360, w: 40,  h: 40, color: "#7B3F00", top: "#A0522D"},
      {x: 1270, y: 360, w: 380,  h: 40, color: "#7B3F00", top: "#A0522D"},

      // Платформы
      {x: 130,  y: 300, w: 80,   h: 16, color: "#8B5A2B", top: "#C07040"},
      {x: 760,  y: 150, w: 80,   h: 16, color: "#8B5A2B", top: "#C07040"},

      //Потолок
      {x: 1270, y: 0, w: 50,  h: 300, color: "#7B3F00", top: "#A0522D"},
      {x: 1320, y: 240, w: 150,  h: 60, color: "#7B3F00", top: "#A0522D"},
      {x: 1320, y: 0, w: 380,  h: 120, color: "#7B3F00", top: "#A0522D"},
    ],

    movingPlatforms: [
      {x: 340, y: 270, w: 70, h: 16,
         color: "#D2691E", top: "#E8824A", dx: 1.6, minX: 280, maxX: 450},
      {x: 500, y: 250, w: 70, h: 16,
         color: "#D2691E", top: "#E8824A", dx: 1.2, minX: 520, maxX: 670},
      {x: 870, y: 260, w: 70, h: 16,
         color: "#D2691E", top: "#E8824A", dx: 2.0, minX: 860, maxX: 1000},
      {x: 1100,  y: 290, w: 70, h: 16,
         color: "#D2691E", top: "#E8824A", dx: 0, dy: 1.2, minY: 150, maxY: 400},
      {x: 1535,  y: 290, w: 70, h: 16,
         color: "#D2691E", top: "#E8824A", dx: 0, dy: 1.2, minY: 210, maxY: 320},
    ],

    springs: [
      {x: 700, y: 360},
    ],

    enemies: [
      {x: 200, y: 276, w: 20, h: 20,
         dx: 0.9, minX: 130, maxX: 210, color: "#c0392b", hp: 3},
      {x: 1300, y: 335, w: 20, h: 20,
         dx: 1.4, minX: 1270, maxX: 1650, color: "#c0392b", hp: 3},
    ],

    hearts: [
      {x: 160,  y: 272},
      {x: 320,  y: 222},
      {x: 540,  y: 212},
      {x: 900,  y: 222},
      {x: 1125, y: 50},
      {x: 1370, y: 180},
    ],

    portal: {x: 30, y: 315},

    decorations: [
      {type: "sun",   x: 720, y: 70},
      {type: "cloud", x: 100,  y: 50,  s: 1.0},
      {type: "cloud", x: 500,  y: 30,  s: 1.3},
      {type: "cloud", x: 1100, y: 55,  s: 0.9},
    ],
  },

  
  // УРОВЕНЬ 3 — «Звёздная ночь»
  {
    name: "Звёздная ночь",
    worldW: 6022,
    bgColors: ["#050A20", "#0F1840"],
    fogColor: "rgba(30,20,80,0.10)",
    start: {x: 60, y: 300},
    
    checkpoints: [
      {x: 1750, y: 320, w: 20, h: 40},
      {x: 4045, y: 320, w: 20, h: 40},
    ],

    platforms: [
      // Земля
      {x: 0, y: 360, w: 500, h: 40, color: "#1e3050", top: "#2e4878"}, 
      {x: 700, y: 360, w: 500, h: 40, color: "#1e3050", top: "#2e4878"}, 
      {x: 1200, y: 360, w: 600, h: 40, color: "#1e3050", top: "#2e4878"}, 
      {x: 2000, y: 360, w: 450, h: 40, color: "#1e3050", top: "#2e4878"}, 
      {x: 3960, y: 360, w: 500, h: 40, color: "#1e3050", top: "#2e4878"}, 
      {x: 4690, y: 360, w: 50, h: 40, color: "#1e3050", top: "#2e4878"},
      {x: 5026, y: 360, w: 278, h: 40, color: "#1e3050", top: "#2e4878"},
      {x: 5742, y: 360, w: 280, h: 40, color: "#1e3050", top: "#2e4878"},

      // Платформы
      {x: 142, y: 302, w: 88,  h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 284, y: 264, w: 78,  h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 518, y: 298, w: 68,  h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 652, y: 302, w: 88,  h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 812, y: 264, w: 78,  h: 16, color: "#2e4878", top: "#4A6FA5"}, 

      {x: 1300, y: 180, w: 54, h: 16, color: "#5c3a10", top: "#d4a020"},
      {x: 1446, y: 200, w: 54, h: 16, color: "#5c3a10", top: "#d4a020"},

      {x: 1970, y: 290, w: 82, h: 16, color: "#2e4878", top: "#4A6FA5"},
      {x: 2282, y: 296, w: 76, h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 2422, y: 260, w: 70, h: 16, color: "#2e4878", top: "#4A6FA5"},
      {x: 2980, y: 200, w: 68, h: 16, color: "#2e4878", top: "#4A6FA5"},
      {x: 3406.25, y: 265, w: 142, h: 16, color: "#2e4878", top: "#4A6FA5"},
      {x: 4302, y: 222, w: 65, h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 4438, y: 260, w: 70, h: 16, color: "#2e4878", top: "#4A6FA5"},
      {x: 4690, y: 130, w: 50, h: 16, color: "#2e4878", top: "#4A6FA5"},
      {x: 4872, y: 100, w: 70, h: 16, color: "#2e4878", top: "#4A6FA5"},
      
      {x: 5026, y: 246, w: 278, h: 14, color: "#5c3a10", top: "#d4a020"},

      {x: 5372, y: 296, w: 78, h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 5512, y: 258, w: 72, h: 16, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 5642, y: 296, w: 76, h: 16, color: "#2e4878", top: "#4A6FA5"},

      // трубы
      {x: 1258, y: 250, w: 44, h: 110, color: "#1a5e1a", top: "#28a028"},
      {x: 1253, y: 250, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32"}, 

      {x: 1426, y: 300, w: 44, h: 60, color: "#1a5e1a", top: "#28a028"},
      {x: 1421, y: 300, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32"},

      {x: 1618, y: 220, w: 44, h: 140, color: "#1a5e1a", top: "#28a028"},
      {x: 1613, y: 220, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32"},

      {x: 2122, y: 278, w: 44, h: 82, color: "#1a5e1a", top: "#28a028"},
      {x: 2117, y: 278, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32"},

      {x: 3460, y: 0, w: 33, h: 220, color: "#1a5e1a", top: "#28a028"},
      {x: 3456.25, y: 220, w: 42, h: 12, color: "#32bb32", top: "#1a5e1a"}, 

      {x: 5048, y: 292, w: 44, h: 68, color: "#1a5e1a", top: "#28a028"}, 
      {x: 5043, y: 292, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32"},
      
      {x: 5142, y: 292, w: 44, h: 68, color: "#1a5e1a", top: "#28a028"}, 
      {x: 5137, y: 292, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32"},
      
      {x: 5236, y: 292, w: 44, h: 68, color: "#1a5e1a", top: "#28a028"},
      {x: 5231, y: 292, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32"}, 

      // Лесница
      {x: 5742, y: 340, w: 48, h: 20, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 5790, y: 308, w: 48, h: 52, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 5838, y: 276, w: 48, h: 84, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 5886, y: 244, w: 48, h: 116, color: "#2e4878", top: "#4A6FA5"}, 
      {x: 5934, y: 212, w: 56, h: 148, color: "#2e4878", top: "#4A6FA5"}, 

      // Замковая стена
      {x: 5990, y: 148, w: 32, h: 212, color: "#0e1830", top: "#1a2a50"},
      {x: 5990, y: 132, w: 12, h: 18, color: "#0e1830", top: "#1a2a50"}, // зубец
      {x: 6007, y: 132, w: 12, h: 18, color: "#0e1830", top: "#1a2a50"}, // зубец
    ],

    movingPlatforms: [
      {x: 1104, y: 296, w: 68, h: 16, color: "#6C3483", top: "#9B59B6",
        dx: 1.6, minX: 1000, maxX: 1200},
      {x: 1762, y: 220, w: 70, h: 16, color: "#6C3483", top: "#9B59B6",
        dx: 1.7, minX: 1756, maxX: 1882},
      {x: 2500, y: 295, w: 68, h: 16, color: "#7D3C98", top: "#A569BD",
        dx: 1.3, minX: 2580, maxX: 2730},
      {x: 2800, y: 295, w: 68, h: 16, color: "#7D3C98", top: "#A569BD",
        dy: 1.2, minY: 200, maxY: 340},
      {x: 3122, y: 200, w: 70, h: 16, color: "#7D3C98", top: "#A569BD",
        dx: 2.4, minX: 3120, maxX: 3850},
    ],
  
    springs: [
      {x: 1700, y: 360},
      {x: 4200, y: 360}, 
      {x: 4714, y: 360}, 
    ],

    
    enemies: [
      {x: 800, y: 335, w: 20, h: 20,
         dx: 0.9,  minX: 800,  maxX: 1250,  color: "#8e44ad", hp: 3},
      {x: 1310, y: 335, w: 20, h: 20,
         dx: 1.0,  minX: 1310,  maxX: 1610,  color: "#8e44ad", hp: 3},
      
      {x: 2170, y: 330, w: 20, h: 20,
         dx: 1.1,  minX: 2170,  maxX: 2440,  color: "#7D3C98", hp: 3},

      {x: 5210, y: 335, w: 20, h: 20,
         dx: 0.6,  minX: 5190,  maxX: 5232,  color: "#4a0080", hp: 100},
      {x: 5512, y: 233, w: 20, h: 20,
         dx: 0.9,  minX: 5512,  maxX: 5584,  color: "#4a0080", hp: 3},
    ],

    
    hearts: [
      {x: 315, y: 236},           
      {x: 835, y: 236},          
      {x: 1545, y: 320},           
      {x: 2220, y: 200},          
      {x: 2825, y: 100},          
      {x: 3470, y: 243},          
      {x: 4325, y: 194},
      {x: 5110, y: 320},         
      {x: 5900, y: 215, special: true}, 
    ],

    portal: {x: 5958, y: 165},

    decorations: [
      {type: "moon", x: 560, y: 50},
      {type: "star", x: 48, y: 20},
      {type: "star", x: 158, y: 8},
      {type: "star", x: 310, y: 36},
      {type: "star", x: 480, y: 14},
      {type: "star", x: 660, y: 46},
      {type: "star", x: 840, y: 10},
      {type: "star", x: 1020, y: 32},
      {type: "star", x: 1210, y: 18},
      {type: "star", x: 1430, y: 44},
      {type: "star", x: 1660, y: 8},
      {type: "star", x: 1900, y: 36},
      {type: "star", x: 2140, y: 16},
      {type: "star", x: 2400, y: 50},
      {type: "star", x: 2640, y: 12},
      {type: "star", x: 2900, y: 40},
      {type: "star", x: 3150, y: 22},
      {type: "star", x: 3420, y: 54},
      {type: "star", x: 3660, y: 16},
      {type: "star", x: 3920, y: 44},
      {type: "star", x: 4190, y: 8},
      {type: "star", x: 4470, y: 38},
      {type: "star", x: 4740, y: 20},
      {type: "star", x: 5020, y: 52},
      {type: "star", x: 5300, y: 14},
      {type: "star", x: 5580, y: 44},
      {type: "star", x: 5860, y: 24},
      {type: "star", x: 6060, y: 52},
    ],
  },
]; 
