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
      { x: 600, y: 330, w: 20, h: 20, dx: 0.8, minX: 480, maxX: 780, color: "#e05c5c" },
      { x: 1050, y: 330, w: 20, h: 20, dx: 1.0, minX: 860, maxX: 1060, color: "#e05c5c" },
      { x: 1350, y: 240, w: 20, h: 20, dx: 1.0, minX: 1310, maxX: 1410, color: "#e05c5c" },
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
      { x: 1100,  y: 290, w: 70, h: 16, color: "#D2691E", top: "E8824A", dx: 0, dy: 1.2, minY: 150, maxY: 400 },
      { x: 1535,  y: 290, w: 70, h: 16, color: "#D2691E", top: "E8824A", dx: 0, dy: 1.2, minY: 210, maxY: 320 },
    ],

    springs: [
      { x: 700, y: 360 },
    ],

    enemies: [
      { x: 1300,y: 330, w: 20, h: 20, dx: 1.2, minX: 1270, maxX: 1650, color: "#c0392b" },
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
    worldW: 3000,
    bgColors: ["#0A0E2A", "#1C2556"],
    fogColor: "rgba(60,40,120,0.12)",
    start: { x: 70, y: 300 },

    checkpoints: [
      { x: 780, y: 320, w: 20, h: 40 }
    ],

    platforms: [
      // Земля
      { x: 0,    y: 360, w: 280,  h: 40, color: "#1e3050", top: "#2e4878" },
      { x: 360,  y: 360, w: 180,  h: 40, color: "#1e3050", top: "#2e4878" },
      { x: 660,  y: 360, w: 160,  h: 40, color: "#1e3050", top: "#2e4878" },
      { x: 960,  y: 360, w: 170,  h: 40, color: "#1e3050", top: "#2e4878" },
      { x: 1280, y: 360, w: 320,  h: 40, color: "#1e3050", top: "#2e4878" },

      // Платформы
      { x: 100,  y: 310, w: 80,   h: 16, color: "#2e4878", top: "#4A6FA5" },
      { x: 220,  y: 265, w: 80,   h: 16, color: "#2e4878", top: "#4A6FA5" },
      { x: 380,  y: 280, w: 70,   h: 16, color: "#2e4878", top: "#4A6FA5" },
      { x: 500,  y: 235, w: 70,   h: 16, color: "#2e4878", top: "#4A6FA5" },
      { x: 620,  y: 195, w: 70,   h: 16, color: "#2e4878", top: "#4A6FA5" },

      // Средняя секция
      { x: 720,  y: 250, w: 80,   h: 16, color: "#5B2C8D", top: "#7D3CB8" },
      { x: 840,  y: 200, w: 80,   h: 16, color: "#5B2C8D", top: "#7D3CB8" },
      { x: 980,  y: 240, w: 80,   h: 16, color: "#5B2C8D", top: "#7D3CB8" },
      { x: 1100, y: 290, w: 80,   h: 16, color: "#5B2C8D", top: "#7D3CB8" },

      // Финальная секция — тесные прыжки
      { x: 1290, y: 300, w: 70,   h: 16, color: "#1a3060", top: "#2e5590" },
      { x: 1400, y: 255, w: 70,   h: 16, color: "#1a3060", top: "#2e5590" },
      { x: 1490, y: 210, w: 90,   h: 16, color: "#1a3060", top: "#2e5590" },
    ],

    movingPlatforms: [
      { x: 310,  y: 290, w: 75, h: 16, color: "#6C3483", top: "#9B59B6", dx: 0, dy: 1.5, minY: 250, maxY: 340 },
      { x: 890,  y: 230, w: 75, h: 16, color: "#6C3483", top: "#9B59B6", dx: 1.8, minX: 830, maxX: 960 },
      { x: 1200, y: 250, w: 75, h: 16, color: "#6C3483", top: "#9B59B6", dx: 0, dy: -1.6, minY: 200, maxY: 310 },
    ],

    springs: [
      { x: 680, y: 344 },
      { x: 975, y: 344 },
    ],

    enemies: [
      { x: 240, y: 249, w: 20, h: 20, dx: 0.9, minX: 220, maxX: 285, color: "#8e44ad" },
      { x: 520, y: 219, w: 20, h: 20, dx: 1.2, minX: 500, maxX: 570, color: "#8e44ad" },
      { x: 860, y: 184, w: 20, h: 20, dx: 1.5, minX: 840, maxX: 900, color: "#8e44ad" },
      { x: 1110,y: 274, w: 20, h: 20, dx: 1.0, minX: 1060, maxX: 1170, color: "#8e44ad" },
    ],

    hearts: [
      { x: 135,  y: 282 },
      { x: 258,  y: 237 },
      { x: 540,  y: 207 },
      { x: 875,  y: 172 },
      { x: 1020, y: 212 },
      { x: 1440, y: 225, special: true }, // пульсирующее финальное ❤️
    ],

    portal: { x: 1510, y: 278 },

    decorations: [
      { type: "moon", x: 700, y: 55 },
      { type: "star", x: 50,   y: 20 },
      { type: "star", x: 180,  y: 10 },
      { type: "star", x: 320,  y: 35 },
      { type: "star", x: 470,  y: 15 },
      { type: "star", x: 600,  y: 45 },
      { type: "star", x: 750,  y: 8  },
      { type: "star", x: 900,  y: 30 },
      { type: "star", x: 1050, y: 18 },
      { type: "star", x: 1200, y: 42 },
      { type: "star", x: 1380, y: 12 },
      { type: "star", x: 1520, y: 55 },
    ],
  },
];