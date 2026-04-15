const levels = [
  // УРОВЕНЬ 1 — «Первое касание»
  {
    name: "Первое касание",
    worldW: 1600,
    bgColors: ["#6EC6F0", "#B8E4FF"],
    fogColor: "rgba(180,225,255,0.18)",
    start: { x: 70, y: 300 },

    checkpoints: [
      { x: 700, y: 210, w: 20, h: 40 }
    ],

    platforms: [
      // Земля
      { x: 0,    y: 360, w: 400,  h: 40, color: "#4a7c2f", top: "#6abf3e" },
      { x: 480,  y: 360, w: 300,  h: 40, color: "#4a7c2f", top: "#6abf3e" },
      { x: 860,  y: 360, w: 200,  h: 40, color: "#4a7c2f", top: "#6abf3e" },
      { x: 1300, y: 360, w: 300,  h: 40, color: "#4a7c2f", top: "#6abf3e" },

      // Платформы
      { x: 160,  y: 300, w: 90,   h: 16, color: "#5a9e35", top: "#7dcc48" },
      { x: 310,  y: 250, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48" },
      { x: 660,  y: 250, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48" },
      { x: 1080, y: 255, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48" },
      { x: 1180, y: 300, w: 80,   h: 16, color: "#5a9e35", top: "#7dcc48" },
      { x: 1310, y: 270, w: 100,  h: 16, color: "#5a9e35", top: "#7dcc48" },
      { x: 1450, y: 230, w: 100,  h: 16, color: "#5a9e35", top: "#7dcc48" },
    ],

    movingPlatforms: [
      { x: 860,  y: 270, w: 80, h: 16, color: "#8BC34A", top: "#AEE060", dx: 1.4, minX: 850, maxX: 1000 },
    ],

    springs: [
      { x: 552, y: 360 },
    ],

    enemies: [
      { x: 600, y: 330, w: 20, h: 20, dx: 0.8, minX: 480, maxX: 780, color: "#e05c5c", hp: 3, bump: false},
      { x: 1050, y: 330, w: 20, h: 20, dx: 1.0, minX: 860, maxX: 1060, color: "#e05c5c", hp: 3, bump: false },
      { x: 1350, y: 240, w: 20, h: 20, dx: 1.0, minX: 1310, maxX: 1410, color: "#e05c5c", hp: 3, bump: false },
    ],

    hearts: [
      { x: 190,  y: 272 },
      { x: 345,  y: 222 },
      { x: 670,  y: 222 },
      { x: 1020, y: 200 },
      { x: 1490, y: 125 },
    ],

    portal: { x: 1510, y: 310 },

    decorations: [
      { type: "cloud", x: 80,   y: 55,  s: 1.1 },
      { type: "cloud", x: 350,  y: 35,  s: 1.4 },
      { type: "cloud", x: 700,  y: 60,  s: 0.9 },
      { type: "cloud", x: 1050, y: 40,  s: 1.2 },
      { type: "cloud", x: 1400, y: 65,  s: 1.0 },
      { type: "tree",  x: 60,   y: 358 },
      { type: "tree",  x: 250,  y: 358 },
      { type: "tree",  x: 1350, y: 358 },
    ],
  },

  // УРОВЕНЬ 2 — «Закатная мелодия»
  {
    name: "Закатная мелодия",
    worldW: 1650,
    bgColors: ["#FF7043", "#FFD54F"],
    fogColor: "rgba(255,160,80,0.14)",
    start: { x: 240, y: 300 },

    checkpoints: [
      { x: 790, y: 110, w: 20, h: 40 }
    ],

    platforms: [
      // Земля
      { x: 0,    y: 360, w: 300,  h: 40, color: "#7B3F00", top: "#A0522D" },
      { x: 680,  y: 360, w: 40,  h: 40, color: "#7B3F00", top: "#A0522D" },
      { x: 1270, y: 360, w: 380,  h: 40, color: "#7B3F00", top: "#A0522D" },

      // Платформы
      { x: 130,  y: 300, w: 80,   h: 16, color: "#8B5A2B", top: "#C07040" },
      { x: 760,  y: 150, w: 80,   h: 16, color: "#8B5A2B", top: "#C07040" },

      //Потолок
      { x: 1270, y: 0, w: 50,  h: 300, color: "#7B3F00", top: "#A0522D" },
      { x: 1320, y: 240, w: 150,  h: 60, color: "#7B3F00", top: "#A0522D" },
      { x: 1320, y: 0, w: 380,  h: 120, color: "#7B3F00", top: "#A0522D" },
    ],

    movingPlatforms: [
      { x: 340, y: 270, w: 70, h: 16, color: "#D2691E", top: "#E8824A", dx: 1.6, minX: 280, maxX: 450 },
      { x: 500, y: 250, w: 70, h: 16, color: "#D2691E", top: "#E8824A", dx: 1.2, minX: 520, maxX: 670 },
      { x: 870, y: 260, w: 70, h: 16, color: "#D2691E", top: "#E8824A", dx: 2.0, minX: 860, maxX: 1000 },
      { x: 1100,  y: 290, w: 70, h: 16, color: "#D2691E", top: "#E8824A", dx: 0, dy: 1.2, minY: 150, maxY: 400 },
      { x: 1535,  y: 290, w: 70, h: 16, color: "#D2691E", top: "#E8824A", dx: 0, dy: 1.2, minY: 210, maxY: 320 },
    ],

    springs: [
      { x: 700, y: 360 },
    ],

    enemies: [
      { x: 1300, y: 330, w: 20, h: 20, dx: 1.2, minX: 1270, maxX: 1650, color: "#c0392b", hp: 3, bump: false },
      { x: 200, y: 271, w: 20, h: 20, dx: 1.2, minX: 130, maxX: 210, color: "#c0392b", hp: 3, bump: false },
    ],

    hearts: [
      { x: 160,  y: 272 },
      { x: 320,  y: 222 },
      { x: 540,  y: 212 },
      { x: 900,  y: 222 },
      { x: 1125, y: 50 },
      { x: 1370, y: 180 },
    ],

    portal: { x: 30, y: 310 },

    decorations: [
      { type: "sun",   x: 720, y: 70 },
      { type: "cloud", x: 100,  y: 50,  s: 1.0 },
      { type: "cloud", x: 500,  y: 30,  s: 1.3 },
      { type: "cloud", x: 1100, y: 55,  s: 0.9 },
    ],
  },

  // УРОВЕНЬ 3 — «Звёздная ночь»
  {
    name: "Звёздная ночь",
    worldW: 2200,
    bgColors: ["#050A20", "#0F1840"],
    fogColor: "rgba(30,20,80,0.10)",
    start: { x: 60, y: 300 },

    checkpoints: [
      { x: 994, y: 240, w: 20, h: 40 }
    ],

    platforms: [
      //ЗЕМЛЯ
      { x: 0,    y: 360, w: 360,  h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 450,  y: 360, w: 360,  h: 40, color: "#1e3050", top: "#2e4878" },  
      { x: 900,  y: 360, w: 320,  h: 40, color: "#1e3050", top: "#2e4878" },  
      { x: 1310, y: 360, w: 310,  h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 1700, y: 360, w: 500,  h: 40, color: "#1e3050", top: "#2e4878" },

      //ТРУБА 1
      { x: 305,  y: 292, w: 44,   h: 68, color: "#1a5e1a", top: "#28a028" },
      { x: 300,  y: 286, w: 54,   h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧНЫЕ БЛОКИ — секция 1
      { x: 100,  y: 290, w: 48,   h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 192,  y: 255, w: 32,   h: 16, color: "#5c3a10", top: "#d4a020" },

      // КИРПИЧНЫЕ БЛОКИ — секция 2
      { x: 468,  y: 285, w: 64,   h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 576,  y: 250, w: 48,   h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 676,  y: 285, w: 48,   h: 16, color: "#5c3a10", top: "#d4a020" },

      // ТРУБА 2
      { x: 758,  y: 290, w: 44,   h: 70, color: "#1a5e1a", top: "#28a028" },
      { x: 753,  y: 283, w: 54,   h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧНЫЕ БЛОКИ — секция 3
      { x: 916,  y: 285, w: 64,   h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 996,  y: 248, w: 48,   h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1076, y: 285, w: 48,   h: 16, color: "#5c3a10", top: "#d4a020" },

      // ТРУБА 3
      { x: 1155, y: 276, w: 44,   h: 84, color: "#1a5e1a", top: "#28a028" },
      { x: 1150, y: 268, w: 54,   h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧНЫЕ БЛОКИ — секция 4
      { x: 1325, y: 285, w: 64,   h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1408, y: 250, w: 64,   h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1508, y: 285, w: 64,   h: 16, color: "#5c3a10", top: "#d4a020" },

      //ЛЕСТНИЦА
      { x: 1725, y: 340, w: 50,   h: 20,  color: "#2e4878", top: "#4A6FA5" },
      { x: 1775, y: 310, w: 50,   h: 50,  color: "#2e4878", top: "#4A6FA5" },
      { x: 1825, y: 280, w: 50,   h: 80,  color: "#2e4878", top: "#4A6FA5" },
      { x: 1875, y: 250, w: 50,   h: 110, color: "#2e4878", top: "#4A6FA5" },
      { x: 1925, y: 220, w: 50,   h: 140, color: "#2e4878", top: "#4A6FA5" },  // вершина
      { x: 1975, y: 250, w: 50,   h: 110, color: "#2e4878", top: "#4A6FA5" },
      { x: 2025, y: 280, w: 50,   h: 80,  color: "#2e4878", top: "#4A6FA5" },
      { x: 2075, y: 310, w: 50,   h: 50,  color: "#2e4878", top: "#4A6FA5" },
    ],

    movingPlatforms: [
      { x: 362, y: 302, w: 72, h: 16, color: "#6C3483", top: "#9B59B6", dx: 1.6, minX: 355, maxX: 452 },
      { x: 1228, y: 295, w: 72, h: 16, color: "#6C3483", top: "#9B59B6", dx: 0, dy: 1.5, minY: 240, maxY: 352 },
    ],

    springs: [
      { x: 820, y: 360 },   
      { x: 1636, y: 360 }, 
    ],

    enemies: [
      { x: 175, y: 340, w: 20, h: 20, dx: 0.9,  minX: 0,    maxX: 295,  color: "#8e44ad", hp: 3, bump: false },
      { x: 545, y: 340, w: 20, h: 20, dx: 1.1,  minX: 450,  maxX: 750,  color: "#8e44ad", hp: 3, bump: false },
      { x: 955, y: 340, w: 20, h: 20, dx: 1.0,  minX: 900,  maxX: 1115, color: "#8e44ad", hp: 3, bump: false },
      { x: 1390,y: 340, w: 20, h: 20, dx: 1.2,  minX: 1310, maxX: 1610, color: "#8e44ad", hp: 3, bump: false },
    ],

    hearts: [
      { x: 118,  y: 263 },    
      { x: 204,  y: 228 },   
      { x: 592,  y: 223 },    
      { x: 1008, y: 221 },  
      { x: 1423, y: 223 },    
      { x: 1950, y: 193, special: true }, 
    ],

    portal: { x: 2130, y: 323 },

    decorations: [
      { type: "moon",  x: 680,  y: 55 },
      { type: "star",  x: 50,   y: 18 },
      { type: "star",  x: 150,  y: 8  },
      { type: "star",  x: 290,  y: 32 },
      { type: "star",  x: 430,  y: 14 },
      { type: "star",  x: 590,  y: 42 },
      { type: "star",  x: 760,  y: 7  },
      { type: "star",  x: 920,  y: 28 },
      { type: "star",  x: 1080, y: 16 },
      { type: "star",  x: 1260, y: 38 },
      { type: "star",  x: 1460, y: 11 },
      { type: "star",  x: 1680, y: 46 },
      { type: "star",  x: 1880, y: 22 },
      { type: "star",  x: 2080, y: 40 },
    ],
  },
];
