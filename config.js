const gameConfig = {
  levelCodes: ["0", "6", "7"],

  finalMessage: "Ты прошла все уровни.\nСобрала все сердца.\nТы у меня самая классная!\nПоэтому хочу кое-что сказать:\nЯ тебя люблю. ❤️",

  // Физика
  gravity:        0.52,
  jumpPower:     -9.0,
  playerSpeed:    4.5,
  groundFriction: 0.70,
  airFriction:    0.86,
  maxFallSpeed:   18,

  // Coyote time (можно прыгнуть N тиков после ухода с края)
  coyoteFrames:    9,
  // Jump buffer (прыжок засчитывается если нажат за N тиков до приземления)
  jumpBufferFrames: 10,

  // Звуки
  soundEnabled: true,

  // Размер Canvas
  canvasWidth:  800,
  canvasHeight: 400,
};