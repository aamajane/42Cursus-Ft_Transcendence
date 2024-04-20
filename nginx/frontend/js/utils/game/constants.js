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
const PADDLE_SPEED = 15;

const PADDLE_WIDTH = 160;
const PADDLE_HEIGHT = 80;

const PLAYER_PADDLE_X = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
const PLAYER_PADDLE_Y = GAME_HEIGHT - PADDLE_HEIGHT - GAME_HEIGHT * 0.15;

const OPPONENT_PADDLE_X = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
const OPPONENT_PADDLE_Y = GAME_HEIGHT * 0.15;

const PLAYER_PADDLE1_X = GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const PLAYER_PADDLE1_Y = GAME_HEIGHT - PADDLE_HEIGHT - GAME_HEIGHT * 0.15;

const PLAYER_PADDLE2_X = GAME_WIDTH - GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const PLAYER_PADDLE2_Y = GAME_HEIGHT - PADDLE_HEIGHT - GAME_HEIGHT * 0.30;

const OPPONENT_PADDLE1_X = GAME_WIDTH - GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const OPPONENT_PADDLE1_Y = GAME_HEIGHT * 0.15;

const OPPONENT_PADDLE2_X = GAME_WIDTH / 4 - PADDLE_WIDTH / 2;
const OPPONENT_PADDLE2_Y = GAME_HEIGHT * 0.30;

/* *************************** SCORE CONSTANTS *************************** */
const PLAYER_SCORE_X = 100;
const PLAYER_SCORE_Y = GAME_HEIGHT - 40;

const OPPONENT_SCORE_X = GAME_WIDTH - 80;
const OPPONENT_SCORE_Y = 180;

const WINNING_SCORE = 10;

/* *************************** NAME CONSTANTS *************************** */
const PLAYER1_NAME_X = GAME_WIDTH - 110;
const PLAYER1_NAME_Y = GAME_HEIGHT - 20;

const OPPONENT1_NAME_X = 120;
const OPPONENT1_NAME_Y = 230;

const PLAYER2_NAME_X = GAME_WIDTH - GAME_WIDTH / 4;
const PLAYER2_NAME_Y = GAME_HEIGHT - 20;

const OPPONENT2_NAME_X = GAME_WIDTH / 4;
const OPPONENT2_NAME_Y = 230;

/* *************************** AVATAR CONSTANTS *************************** */
const AVATAR_SIZE = 140;

const PLAYER1_AVATAR_X = GAME_WIDTH - 180;
const PLAYER1_AVATAR_Y = GAME_HEIGHT - 200;

const OPPONENT1_AVATAR_X = 50;
const OPPONENT1_AVATAR_Y = 40;

const PLAYER2_AVATAR_X = GAME_WIDTH - GAME_WIDTH / 4;
const PLAYER2_AVATAR_Y = GAME_HEIGHT - 200;

const OPPONENT2_AVATAR_X = GAME_WIDTH / 4;
const OPPONENT2_AVATAR_Y = 40;

const AVATAR_URL = "../../app/assets/images/game/ai_avatar.webp";
const PLAYER1_AVATAR_URL = "https://cdn.intra.42.fr/users/6e08f820a216e1a2a90e377609109946/aamajane.jpg";
const PLAYER2_AVATAR_URL = "https://cdn.intra.42.fr/users/c57fb67bd87763107a61aaf0ad1add71/ael-bekk.jpg";
const OPPONENT1_AVATAR_URL = "https://cdn.intra.42.fr/users/664d497ee11b0a6944ae13c8cb222edd/hel-mefe.jpg";
const OPPONENT2_AVATAR_URL = "https://cdn.intra.42.fr/users/a9ffdbbe14c28c2f6bbc7ff28b7ce717/anamajan.jpeg";

/* *************************** INPUT CONSTANTS *************************** */
const PLAYER_LEFT_KEY = "ArrowLeft";
const PLAYER_RIGHT_KEY = "ArrowRight";

const OPPONENT_LEFT_KEY = "A";
const OPPONENT_RIGHT_KEY = "D";

/* *************************** AI CONSTANTS *************************** */
const AI_TEMPERATURE = 1.0;
const AI_COOLING_RATE = 0.005;
