/**
 * questions.js - Liar Hunt (English)
 *
 * 80 questions total
 *   10-29: Text      (type 1) - 20 questions
 *   30-49: Drawing   (type 2) - 20 questions
 *   50-69: Player Pick (type 3) - 20 questions
 *   70-89: Free Answer (type 4) - 20 questions
 */

window.questionDatabase = {

    // ===== Text (10-29) =====
    10: { main: "What is your favorite food?", fake: "What food do you hate the most?", mode: "Text", type: 1 },
    11: { main: "What is the most unusual emoji you use? (emoji only)", fake: "What emoji do you rarely use?", mode: "Text", type: 1 },
    12: { main: "What is the most memorable place you've traveled to?", fake: "Name a famous tourist spot", mode: "Text", type: 1 },
    13: { main: "What pet would you most like to own?", fake: "Name a scary animal", mode: "Text", type: 1 },
    14: { main: "What song do you listen to most often?", fake: "Name an old popular song", mode: "Text", type: 1 },
    15: { main: "What movie do you want to see but haven't yet?", fake: "Name a famous movie", mode: "Text", type: 1 },
    16: { main: "Name something that could be used to kill someone?", fake: "What tool do you use most when cooking?", mode: "Text", type: 1 },
    17: { main: "What is the most memorable teacher's name you had?", fake: "Type any name", mode: "Text", type: 1 },
    18: { main: "What is your favorite franchise restaurant?", fake: "Name the last restaurant you visited", mode: "Text", type: 1 },
    19: { main: "What is a book you've read?", fake: "Name a book that was made into a movie", mode: "Text", type: 1 },
    20: { main: "What is the most recent thing you bought?", fake: "What do you buy online most often?", mode: "Text", type: 1 },
    21: { main: "What image is on your phone lock screen?", fake: "What is on your phone home screen?", mode: "Text", type: 1 },
    22: { main: "What is the biggest regret of your life?", fake: "What is the best decision of your life?", mode: "Text", type: 1 },
    23: { main: "What is the scariest horror movie you've seen?", fake: "Name a comedy movie you enjoyed", mode: "Text", type: 1 },
    24: { main: "What food do you want to eat right now?", fake: "What did you eat yesterday?", mode: "Text", type: 1 },
    25: { main: "Who is your favorite YouTuber?", fake: "What type of YouTube channel do you watch most?", mode: "Text", type: 1 },
    26: { main: "Who is your oldest friend?", fake: "Describe a trait of your newest friend", mode: "Text", type: 1 },
    27: { main: "What was your childhood nickname?", fake: "What nickname do people still call you?", mode: "Text", type: 1 },
    28: { main: "What is your weirdest personal habit?", fake: "What is your best personal habit?", mode: "Text", type: 1 },
    29: { main: "What is one thing you must do before you die?", fake: "What is one thing you want to do this year?", mode: "Text", type: 1 },

    // ===== Drawing (30-49) =====
    30: { main: "Draw a pineapple", fake: "Draw any fruit", mode: "Drawing", type: 2 },
    31: { main: "Draw a house", fake: "Draw a pretty box", mode: "Drawing", type: 2 },
    32: { main: "Draw a dinosaur", fake: "Draw any animal", mode: "Drawing", type: 2 },
    33: { main: "Draw the Mona Lisa", fake: "Draw your own portrait", mode: "Drawing", type: 2 },
    34: { main: "Draw your own room", fake: "Draw your dream room", mode: "Drawing", type: 2 },
    35: { main: "Draw your favorite flower", fake: "Draw a poisonous plant", mode: "Drawing", type: 2 },
    36: { main: "Draw your car (or your dream car)", fake: "Draw a car from the future", mode: "Drawing", type: 2 },
    37: { main: "Draw your family members", fake: "Draw your ideal family", mode: "Drawing", type: 2 },
    38: { main: "Draw clothes you wear often", fake: "Draw clothes you want to wear", mode: "Drawing", type: 2 },
    39: { main: "Draw your favorite sport", fake: "Draw an extreme sport", mode: "Drawing", type: 2 },
    40: { main: "Draw your favorite food", fake: "Draw food that looks disgusting", mode: "Drawing", type: 2 },
    41: { main: "Draw a place that often appears in your dreams", fake: "Draw a scary place", mode: "Drawing", type: 2 },
    42: { main: "Draw perfect weather", fake: "Draw the worst weather", mode: "Drawing", type: 2 },
    43: { main: "Draw your ideal date location", fake: "Draw the worst possible date location", mode: "Drawing", type: 2 },
    44: { main: "Draw how you feel right now", fake: "Draw how you'll feel in a month", mode: "Drawing", type: 2 },
    45: { main: "Draw your favorite character", fake: "Draw a villain character", mode: "Drawing", type: 2 },
    46: { main: "Draw a sea creature", fake: "Draw an alien creature", mode: "Drawing", type: 2 },
    47: { main: "Draw the thing you like most in your room", fake: "Draw the most useless thing in your room", mode: "Drawing", type: 2 },
    48: { main: "Draw a hero", fake: "Draw a supervillain", mode: "Drawing", type: 2 },
    49: { main: "Draw your current facial expression", fake: "Draw the person next to you's expression", mode: "Drawing", type: 2 },

    // ===== Player Pick (50-69) =====
    50: { main: "Who is the funniest person here?", fake: "Who is the scariest person here?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    51: { main: "Who would be best at video games?", fake: "Who would be worst at video games?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    52: { main: "Who would be the best cook?", fake: "Who would be the worst cook?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    53: { main: "Who is the kindest person here?", fake: "Who is the most selfish person here?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    54: { main: "Who would be the best singer?", fake: "Who would be the worst singer?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    55: { main: "Who is the most popular person here?", fake: "Who is the most timid person here?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    56: { main: "Who would be the best athlete?", fake: "Who has the least stamina?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    57: { main: "Who has the most leadership?", fake: "Who is the quietest person here?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    58: { main: "Who has the best fashion sense?", fake: "Who would wear the most unique outfit?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    59: { main: "Who is the smartest person here?", fake: "Who is the quirkiest person here?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    60: { main: "Who is best at saving money?", fake: "Who is best at spending money?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    61: { main: "Who wakes up earliest?", fake: "Who sleeps in the latest?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    62: { main: "Who will live the longest?", fake: "Who cares least about their health?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    63: { main: "Who seems the most stressed right now?", fake: "Who looks the happiest right now?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    64: { main: "Who is best at foreign languages?", fake: "Who loves traveling abroad the most?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    65: { main: "Who likely has the most dark secrets?", fake: "Who is the most honest person here?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    66: { main: "Who will get married last?", fake: "Who would make the best spouse?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    67: { main: "Who would survive longest in a zombie apocalypse?", fake: "Who would be the first to go in a zombie apocalypse?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    68: { main: "Who would you bring to a deserted island?", fake: "Who would thrive alone on a deserted island?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },
    69: { main: "Who is most likely to become famous?", fake: "Who is most likely to live an ordinary life?", mode: "Player Pick", type: 3, placeholder: "Enter player name" },

    // ===== Free Answer (70-89) =====
    70: { main: "What is the biggest superpower you want to have?", fake: "What should you never do naked?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    71: { main: "What is your favorite outdoor activity?", fake: "What would be embarrassing to be caught doing when you die?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    72: { main: "What would you shout while making love?", fake: "What would you say in church?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    73: { main: "What did you dream of being when you were a child?", fake: "What job is most likely to be replaced by AI?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    74: { main: "What is the best way to end a date?", fake: "What should you never do on a first date?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    75: { main: "Give a line from a love song", fake: "What is the most cringe pickup line?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    76: { main: "What is your favorite foreign cuisine? (include country, not your own)", fake: "What country would you least like to visit?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    77: { main: "What is a weird pizza topping?", fake: "What do you always have in your fridge?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    78: { main: "What are you planning to do tonight?", fake: "What would you do if you won the lottery?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    79: { main: "Who is the most famous person you've met?", fake: "Who is your favorite celebrity?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    80: { main: "What is the weirdest food combination?", fake: "What is the most normal food combination?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    81: { main: "What would you do first if you got $1 million?", fake: "What would you do first if you got $1,000?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    82: { main: "What is your favorite season and why?", fake: "What is your least favorite season and why?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    83: { main: "What do you do alone at 3am?", fake: "What do you usually do before bed?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    84: { main: "If you have a secret you'd never tell a friend, give a hint", fake: "If you have a secret you'd never tell family, give a hint", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    85: { main: "What will you look like in 10 years?", fake: "What will you look like in 1 year?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    86: { main: "What is your biggest fear?", fake: "What fascinates you the most?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    87: { main: "What do you want most in this moment?", fake: "What do you want to eat right now?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    88: { main: "What is your unique talent?", fake: "What do others think your talent is?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
    89: { main: "What gift did you want on your last birthday?", fake: "What gift did you actually receive on your last birthday?", mode: "Free Answer", type: 4, placeholder: "Type freely" },
};

window.getQuestionByNumber = function (n) {
    return window.questionDatabase[n] || {
        main: "Question not found",
        fake: "Question not found",
        mode: "Text",
        type: 1
    };
};

window.isQuestionsLoaded = function () {
    return window.questionDatabase &&
        Object.keys(window.questionDatabase).length === 80;
};

window.getCurrentQuestion = function (inviteCode, gameNumber, round, isFaker) {
    try {
        const questionNumber = window.getQuestionForRound(inviteCode, gameNumber, round);
        const question = window.getQuestionByNumber(questionNumber);
        return {
            ...question,
            questionNumber,
            text: isFaker ? question.fake : question.main
        };
    } catch (e) {
        console.error('Error getting question:', e);
        return { main: "Default question", fake: "Default liar question", mode: "Text", type: 1, questionNumber: 10, text: "Default question" };
    }
};

console.log('Liar Hunt question database loaded - 80 questions total');
