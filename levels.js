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
      { x: 600, y: 330, w: 20, h: 20, dx: 0.8, minX: 480, maxX: 780, color: "#e05c5c", hp: 3},
      { x: 1050, y: 330, w: 20, h: 20, dx: 1.0, minX: 860, maxX: 1060, color: "#e05c5c", hp: 3},
      { x: 1350, y: 240, w: 20, h: 20, dx: 1.0, minX: 1310, maxX: 1410, color: "#e05c5c", hp: 3},
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
      { x: 1300, y: 330, w: 20, h: 20, dx: 1.2, minX: 1270, maxX: 1650, color: "#c0392b", hp: 3},
      { x: 200, y: 271, w: 20, h: 20, dx: 1.2, minX: 130, maxX: 210, color: "#c0392b", hp: 3},
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
    worldW: 3800,
    bgColors: ["#050A20", "#0F1840"],
    fogColor: "rgba(30,20,80,0.10)",
    start: { x: 60, y: 300 },

    checkpoints: [
      { x: 1360, y: 320, w: 20, h: 40 },
      { x: 2560, y: 320, w: 20, h: 40 },
    ],

    platforms: [
      // Земля
      { x: 0,    y: 360, w: 390, h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 470,  y: 360, w: 370, h: 40, color: "#1e3050", top: "#2e4878" },
      { x: 920,  y: 360, w: 340, h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 1380, y: 360, w: 360, h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 1840, y: 360, w: 380, h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 2320, y: 360, w: 360, h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 2780, y: 360, w: 360, h: 40, color: "#1e3050", top: "#2e4878" }, 
      { x: 3200, y: 360, w: 600, h: 40, color: "#1e3050", top: "#2e4878" }, 

      // ТРУБА 1
      { x: 295, y: 292, w: 44, h: 68, color: "#1a5e1a", top: "#28a028" },
      { x: 290, y: 284, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧИ секции 1
      { x: 90,  y: 290, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 182, y: 254, w: 32, h: 16, color: "#5c3a10", top: "#d4a020" },

      // КИРПИЧИ секции 2
      { x: 490, y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 596, y: 248, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 696, y: 285, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },

      // ТРУБА 2
      { x: 768, y: 276, w: 44, h: 84, color: "#1a5e1a", top: "#28a028" },
      { x: 763, y: 268, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧИ секции 3
      { x: 938, y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1018,y: 248, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1110,y: 285, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },

      // ТРУБА 3
      { x: 1175,y: 268, w: 44, h: 92, color: "#1a5e1a", top: "#28a028" },
      { x: 1170,y: 260, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧИ секции 4
      { x: 1400,y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1488,y: 248, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1596,y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },

      // КИРПИЧИ секции 5
      { x: 1858,y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 1940,y: 248, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 2024,y: 210, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" }, 
      { x: 2100,y: 248, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 2170,y: 285, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },

      // ТРУБА 4
      { x: 2230,y: 280, w: 44, h: 80, color: "#1a5e1a", top: "#28a028" },
      { x: 2225,y: 272, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧИ секции 6
      { x: 2340,y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 2424,y: 248, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 2524,y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },

      // ТРУБА 5
      { x: 2620,y: 284, w: 44, h: 76, color: "#1a5e1a", top: "#28a028" },
      { x: 2615,y: 276, w: 56, h: 12, color: "#1a5e1a", top: "#32bb32" },

      // КИРПИЧИ секции 7
      { x: 2800,y: 285, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 2886,y: 248, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 2980,y: 210, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 3060,y: 248, w: 64, h: 16, color: "#5c3a10", top: "#d4a020" },
      { x: 3140,y: 285, w: 48, h: 16, color: "#5c3a10", top: "#d4a020" },

      // ЛЕСТНИЦА
      { x: 3210, y: 340, w: 50, h: 20,  color: "#2e4878", top: "#4A6FA5" },
      { x: 3260, y: 308, w: 50, h: 52,  color: "#2e4878", top: "#4A6FA5" },
      { x: 3310, y: 276, w: 50, h: 84,  color: "#2e4878", top: "#4A6FA5" },
      { x: 3360, y: 244, w: 50, h: 116, color: "#2e4878", top: "#4A6FA5" },
      { x: 3410, y: 212, w: 50, h: 148, color: "#2e4878", top: "#4A6FA5" },
      { x: 3460, y: 180, w: 50, h: 180, color: "#2e4878", top: "#4A6FA5" }, 
      { x: 3510, y: 148, w: 60, h: 212, color: "#2e4878", top: "#4A6FA5" },
      // ЛЕСТНИЦА ВНИЗ
      { x: 3570, y: 180, w: 50, h: 180, color: "#2e4878", top: "#4A6FA5" },
      { x: 3620, y: 212, w: 50, h: 148, color: "#2e4878", top: "#4A6FA5" },
      { x: 3670, y: 244, w: 50, h: 116, color: "#2e4878", top: "#4A6FA5" },
      { x: 3720, y: 276, w: 50, h: 84,  color: "#2e4878", top: "#4A6FA5" },

      // ЗАМКОВАЯ СТЕНА
      { x: 3770, y: 260, w: 30, h: 100, color: "#0e1830", top: "#1a2a50" },
      { x: 3770, y: 200, w: 30, h: 55,  color: "#0e1830", top: "#1a2a50" },
      // Зубцы замка
      { x: 3770, y: 185, w: 10, h: 18,  color: "#0e1830", top: "#1a2a50" },
      { x: 3787, y: 185, w: 10, h: 18,  color: "#0e1830", top: "#1a2a50" },
    ],

    movingPlatforms: [
      { x: 388, y: 304, w: 72, h: 16, color: "#6C3483", top: "#9B59B6",
        dx: 1.7, minX: 383, maxX: 472 },
      { x: 848, y: 295, w: 72, h: 16, color: "#6C3483", top: "#9B59B6",
        dx: 0, dy: 1.6, minY: 240, maxY: 352 },
      { x: 1264, y: 300, w: 72, h: 16, color: "#7D3C98", top: "#A569BD",
        dx: 2.2, minX: 1258, maxX: 1382 },
      { x: 1748, y: 290, w: 72, h: 16, color: "#6C3483", top: "#9B59B6",
        dx: 0, dy: -1.4, minY: 225, maxY: 352 },
      { x: 2224, y: 302, w: 72, h: 16, color: "#7D3C98", top: "#A569BD",
        dx: 1.9, minX: 2218, maxX: 2322 },
      { x: 2688, y: 285, w: 72, h: 16, color: "#6C3483", top: "#9B59B6",
        dx: 0, dy: 2.0, minY: 230, maxY: 352 },
    ],

    springs: [
      { x: 950, y: 360 },   
      { x: 1860, y: 360 },  
      { x: 2800, y: 360 },  
    ],

    enemies: [
      { x: 170,  y: 340, w: 20, h: 20, dx: 0.9,  minX: 0,    maxX: 282,  color: "#8e44ad", hp: 3 },
      { x: 560,  y: 340, w: 20, h: 20, dx: 1.15, minX: 470,  maxX: 762,  color: "#8e44ad", hp: 3 },
      { x: 1000, y: 340, w: 20, h: 20, dx: 1.0,  minX: 920,  maxX: 1168, color: "#8e44ad", hp: 3 },
      { x: 1520, y: 340, w: 20, h: 20, dx: 1.3,  minX: 1380, maxX: 1738, color: "#7D3C98", hp: 3 },
      { x: 1970, y: 340, w: 20, h: 20, dx: 1.2,  minX: 1840, maxX: 2090, color: "#7D3C98", hp: 3 },
      { x: 2440, y: 340, w: 20, h: 20, dx: 1.45, minX: 2320, maxX: 2674, color: "#7D3C98", hp: 3 },
      { x: 2870, y: 340, w: 20, h: 20, dx: 1.1,  minX: 2780, maxX: 3090, color: "#5B2C8D", hp: 3 },
      { x: 3280, y: 340, w: 20, h: 20, dx: 1.6,  minX: 3200, maxX: 3380, color: "#5B2C8D", hp: 3 },
    ],

    hearts: [
      { x: 100,  y: 263 },        
      { x: 192,  y: 227 },           
      { x: 604,  y: 221 },           
      { x: 1026, y: 221 },          
      { x: 1496, y: 221 },         
      { x: 2030, y: 183 },          
      { x: 2892, y: 221 },           
      { x: 3532, y: 121, special: true }, 
    ],

    portal: { x: 3772, y: 150 },

    decorations: [
      { type: "moon", x: 600,  y: 55 },
      { type: "star", x: 40,   y: 20 },
      { type: "star", x: 130,  y: 8  },
      { type: "star", x: 265,  y: 34 },
      { type: "star", x: 420,  y: 15 },
      { type: "star", x: 570,  y: 44 },
      { type: "star", x: 730,  y: 8  },
      { type: "star", x: 900,  y: 28 },
      { type: "star", x: 1080, y: 16 },
      { type: "star", x: 1270, y: 40 },
      { type: "star", x: 1470, y: 10 },
      { type: "star", x: 1680, y: 46 },
      { type: "star", x: 1900, y: 22 },
      { type: "star", x: 2120, y: 38 },
      { type: "star", x: 2340, y: 12 },
      { type: "star", x: 2560, y: 50 },
      { type: "star", x: 2790, y: 18 },
      { type: "star", x: 3020, y: 35 },
      { type: "star", x: 3260, y: 9  },
      { type: "star", x: 3520, y: 44 },
      { type: "star", x: 3740, y: 20 },
    ],
  },
];
