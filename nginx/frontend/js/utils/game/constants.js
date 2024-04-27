/* *************************** GAME CONSTANTS *************************** */
const GAME_WIDTH = 900;
const GAME_HEIGHT = 2100;

const PENDING = "pending";
const COUNTDOWN = "countdown";
const ONGOING = "ongoing";
const OVER = "over";

const AIMode = "ai";
const ONE_VS_ONE = "1v1";
const TWO_VS_TWO = "2v2";

/* *************************** BALL CONSTANTS *************************** */
const BALL_MAX_FRAME = 15;

const BALL_SIZE = 35;
const BALL_RADIUS = BALL_SIZE / 2;

const BALL_SPEED = 15;
const BALL_MAX_SPEED = 35;
const BALL_INCREASE_SPEED = 1;

const BALL_X = GAME_WIDTH / 2;
const BALL_Y = GAME_HEIGHT / 2;

/* *************************** PADDLE CONSTANTS *************************** */
const PADDLE_SPEED = 20;

const PADDLE_WIDTH = 160;
const PADDLE_HEIGHT = 80;

const PLAYER_PADDLE_X = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
const PLAYER_PADDLE_Y = GAME_HEIGHT - PADDLE_HEIGHT - GAME_HEIGHT * 0.15;

const PLAYER_PADDLE1_X = GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const PLAYER_PADDLE1_Y = GAME_HEIGHT - PADDLE_HEIGHT - GAME_HEIGHT * 0.15;

const PLAYER_PADDLE2_X = GAME_WIDTH - GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const PLAYER_PADDLE2_Y = GAME_HEIGHT - PADDLE_HEIGHT - GAME_HEIGHT * 0.30;

const OPPONENT_PADDLE_X = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
const OPPONENT_PADDLE_Y = GAME_HEIGHT * 0.15;

const OPPONENT_PADDLE1_X = GAME_WIDTH - GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const OPPONENT_PADDLE1_Y = GAME_HEIGHT * 0.15;

const OPPONENT_PADDLE2_X = GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const OPPONENT_PADDLE2_Y = GAME_HEIGHT * 0.30;

/* *************************** SCORE CONSTANTS *************************** */
const PLAYER_SCORE_X = 100;
const PLAYER_SCORE_Y = GAME_HEIGHT - 40;

const OPPONENT_SCORE_X = GAME_WIDTH - 100;
const OPPONENT_SCORE_Y = 200;

const WINNING_SCORE = 10;
const MAX_DIF_SCORE = 3;

/* *************************** AVATAR CONSTANTS *************************** */
const AVATAR_SIZE = 130;

const PLAYER1_AVATAR_X = GAME_WIDTH - GAME_WIDTH / 4;
const PLAYER1_AVATAR_Y = GAME_HEIGHT - 190;

const PLAYER2_AVATAR_X = GAME_WIDTH - GAME_WIDTH / 2 - AVATAR_SIZE / 2;
const PLAYER2_AVATAR_Y = GAME_HEIGHT - 190;

const OPPONENT1_AVATAR_X = GAME_WIDTH / 4 - AVATAR_SIZE;
const OPPONENT1_AVATAR_Y = 50;

const OPPONENT2_AVATAR_X = GAME_WIDTH / 2 - AVATAR_SIZE / 2;
const OPPONENT2_AVATAR_Y = 50;

const AVATAR_URL = "https://localhost/assets/images/game/ai_avatar.webp";
const PLAYER1_AVATAR_URL = "https://cdn.intra.42.fr/users/6e08f820a216e1a2a90e377609109946/aamajane.jpg";
const PLAYER2_AVATAR_URL = "https://cdn.intra.42.fr/users/c57fb67bd87763107a61aaf0ad1add71/ael-bekk.jpg";
const OPPONENT1_AVATAR_URL = "https://cdn.intra.42.fr/users/664d497ee11b0a6944ae13c8cb222edd/hel-mefe.jpg";
const OPPONENT2_AVATAR_URL = "https://cdn.intra.42.fr/users/b22ad49a1e9011b178a47008ba1ef162/amounadi.jpg";

/* *************************** NAME CONSTANTS *************************** */
const PLAYER1_NAME_X = PLAYER1_AVATAR_X + AVATAR_SIZE / 2;
const PLAYER1_NAME_Y = GAME_HEIGHT - 15;

const PLAYER2_NAME_X = PLAYER2_AVATAR_X + AVATAR_SIZE / 2;
const PLAYER2_NAME_Y = GAME_HEIGHT - 15;

const OPPONENT1_NAME_X = OPPONENT1_AVATAR_X + AVATAR_SIZE / 2;
const OPPONENT1_NAME_Y = 230;

const OPPONENT2_NAME_X = OPPONENT2_AVATAR_X + AVATAR_SIZE / 2;
const OPPONENT2_NAME_Y = 230;

/* *************************** MAP CONSTANTS *************************** */
const EGYPT_WAITING_FONT = "60px Horus";
const EGYPT_COUNTDOWN_FONT = "200px Horus";
const EGYPT_OVER_FONT = "120px Horus";
const EGYPT_SCORE_FONTS = "180px Horus";
const EGYPT_NICKNAME_FONT = "40px Horus";
const EGYPT_FILL_STYLE = "rgba(255, 127.5, 127.5, 0.7)";
const EGYPT_STROKE_STYLE = "rgba(56, 39, 26, 1)";
const EGYPT_SCORE_LINE_WIDTH = 15;
const EGYPT_NICKNAME_LINE_WIDTH = 10;

const FACTORY_WAITING_FONT = "60px DemonSker";
const FACTORY_COUNTDOWN_FONT = "200px DemonSker";
const FACTORY_OVER_FONT = "120px DemonSker";
const FACTORY_SCORE_FONTS = "180px DemonSker";
const FACTORY_NICKNAME_FONT = "40px DemonSker";
const FACTORY_FILL_STYLE = "rgba(255, 255, 255, 0.7)";
const FACTORY_STROKE_STYLE = "rgba(0, 0, 0, 1)";
const FACTORY_SCORE_LINE_WIDTH = 15;
const FACTORY_NICKNAME_LINE_WIDTH = 10;

const SPACE_WAITING_FONT = "60px AstroSpace";
const SPACE_COUNTDOWN_FONT = "200px AstroSpace";
const SPACE_OVER_FONT = "120px AstroSpace";
const SPACE_SCORE_FONTS = "160px AstroSpace";
const SPACE_NICKNAME_FONT = "30px AstroSpace";
const SPACE_FILL_STYLE = "rgba(0, 255, 255, 0.7)";
const SPACE_STROKE_STYLE = "rgba(0, 0, 0, 1)";
const SPACE_SCORE_LINE_WIDTH = 15;
const SPACE_NICKNAME_LINE_WIDTH = 10;

/* *************************** INPUT CONSTANTS *************************** */
const PLAYER_LEFT_KEY = "ArrowLeft";
const PLAYER_RIGHT_KEY = "ArrowRight";

const OPPONENT_LEFT_KEY = "A";
const OPPONENT_RIGHT_KEY = "D";

/* *************************** AI CONSTANTS *************************** */
const AI_TEMPERATURE = 1.0;
const AI_COOLING_RATE = 0.005;
