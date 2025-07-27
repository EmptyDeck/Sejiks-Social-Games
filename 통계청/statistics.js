//Statistics/
//    ├── common.css
//    ├── common.js
//    ├── statistics.js - here
//    ├── abs-gen-game.js
//    ├── index.html
//    ├── index.css
//    ├── index.js
//    ├── relative.html
//    ├── relative.css
//    ├── relative.js
//    ├── absolute.html
//    ├── absolute.css
//    ├── absolute.js
//    ├── host.html
//    ├── host.css
//    ├── host.js
//    ├── join.html
//    ├── join.css
//    ├── join.js
//    ├── play.html
//    ├── play.css
//    ├── play.js

const statisticsData = [
    {
        question: "How many people sleep with dolls after 18?",
        source: "From a 2017, Build-A-Bear x Atomik Research (US) with over 2000 people",
        answer: 46
    },
    {
        question: "What percentage of people worldwide own a smartphone?",
        source: "Statista, 2023 - Global Smartphone Ownership Survey",
        answer: 84
    },
    {
        question: "What percentage of people have never changed a tire?",
        source: "AAA Foundation for Traffic Safety, 2022",
        answer: 73
    },
    {
        question: "How many adults still eat cereal for dinner?",
        source: "Kellogg's Consumer Habits Study, 2023",
        answer: 52
    },
    {
        question: "What percentage of people sing in the shower?",
        source: "Spotify Music Habits Survey, 2022",
        answer: 67
    },
    {
        question: "How many people have lied about reading a book they haven't?",
        source: "Penguin Random House Reading Survey, 2023",
        answer: 58
    },
    {
        question: "What percentage of people check their phone within 10 minutes of waking up?",
        source: "Digital Wellness Institute, 2023",
        answer: 81
    },
    {
        question: "How many people have googled themselves?",
        source: "Pew Research Center Digital Life Study, 2022",
        answer: 74
    },
    {
        question: "What percentage of people prefer cats over dogs?",
        source: "American Pet Products Association Survey, 2023",
        answer: 38
    },
    {
        question: "How many people have pretended to work while actually doing nothing?",
        source: "workplace productivity study by Harvard Business Review, 2022",
        answer: 89
    },
    {
        question: "What percentage of people have eaten pizza for breakfast?",
        source: "National Breakfast Research Institute, 2023",
        answer: 76
    },
    {
        question: "How many people talk to their plants?",
        source: "Royal Horticultural Society Gardening Survey, 2022",
        answer: 42
    },
    {
        question: "What percentage of people have kept a childhood stuffed animal into adulthood?",
        source: "Nostalgia Research Group, University of Southampton, 2023",
        answer: 63
    },
    {
        question: "How many people have used 'I'm almost there' when they haven't left yet?",
        source: "Social Behavior Institute Communication Study, 2022",
        answer: 92
    },
    {
        question: "What percentage of people have fallen asleep while watching a movie?",
        source: "Netflix Viewing Habits Report, 2023",
        answer: 85
    },
    {
        question: "How many people have pretended to understand a movie they didn't get?",
        source: "Film Psychology Research Center, 2022",
        answer: 71
    },
    {
        question: "What percentage of people have eaten food that fell on the floor (5-second rule)?",
        source: "Food Safety and Hygiene Study, Rutgers University, 2023",
        answer: 79
    },
    {
        question: "How many people have never been on a blind date?",
        source: "Modern Dating Trends Survey, Match.com, 2023",
        answer: 56
    },
    {
        question: "What percentage of people prefer to text rather than call?",
        source: "Communication Preferences Study, Gallup, 2023",
        answer: 68
    },
    {
        question: "How many people have cried during a Pixar movie?",
        source: "Emotional Response to Animation Study, UCLA, 2022",
        answer: 87
    },
    {
        question: "What percentage of people have never broken a bone?",
        source: "Orthopedic Health Survey, American Academy of Orthopedic Surgeons, 2023",
        answer: 74
    },
    {
        question: "How many people still use a physical alarm clock?",
        source: "Sleep Technology Research, National Sleep Foundation, 2023",
        answer: 23
    },
    {
        question: "What percentage of people have never been stung by a bee?",
        source: "Insect Encounter Survey, Entomological Society, 2022",
        answer: 45
    },
    {
        question: "How many people prefer morning showers over evening showers?",
        source: "Personal Hygiene Habits Study, Johnson & Johnson, 2023",
        answer: 62
    },
    {
        question: "What percentage of people have never gone camping?",
        source: "Outdoor Recreation Survey, National Park Service, 2023",
        answer: 51
    },
    {
        question: "How many people have lied about their age on social media?",
        source: "Digital Identity Research, Pew Research Center, 2022",
        answer: 34
    },
    {
        question: "What percentage of people prefer winter over summer?",
        source: "Seasonal Preference Study, Weather Channel, 2023",
        answer: 28
    },
    {
        question: "How many people have never been to a concert?",
        source: "Live Music Attendance Survey, Ticketmaster, 2023",
        answer: 37
    },
    {
        question: "What percentage of people can whistle?",
        source: "Musical Abilities Research, Berklee College of Music, 2022",
        answer: 67
    },
    {
        question: "How many people have never ridden a bicycle?",
        source: "Transportation Habits Survey, Department of Transportation, 2023",
        answer: 8
    },
    {
        question: "What percentage of people prefer chocolate over vanilla?",
        source: "Flavor Preference Study, International Ice Cream Association, 2023",
        answer: 71
    },
    {
        question: "How many people have never been on an airplane?",
        source: "Travel Experience Survey, Airlines for America, 2023",
        answer: 19
    },
    {
        question: "What percentage of people can touch their toes without bending their knees?",
        source: "Flexibility Assessment Study, American Council on Exercise, 2022",
        answer: 43
    },
    {
        question: "How many people prefer stairs over elevators when possible?",
        source: "Physical Activity Choices Research, CDC, 2023",
        answer: 31
    },
    {
        question: "What percentage of people have never been to a museum?",
        source: "Cultural Engagement Survey, National Museum Association, 2023",
        answer: 26
    },
    {
        question: "How many people prefer to read physical books over e-books?",
        source: "Reading Format Preferences, Publishers Weekly, 2023",
        answer: 58
    },
    {
        question: "What percentage of people have never played a musical instrument?",
        source: "Musical Education Survey, National Association of Music Merchants, 2022",
        answer: 47
    },
    {
        question: "How many people prefer coffee over tea?",
        source: "Beverage Preference Study, National Coffee Association, 2023",
        answer: 64
    },
    {
        question: "What percentage of people have never been to a therapist or counselor?",
        source: "Mental Health Service Usage, American Psychological Association, 2023",
        answer: 73
    },
    {
        question: "How many people can drive a manual transmission car?",
        source: "Driving Skills Survey, National Highway Traffic Safety Administration, 2023",
        answer: 18
    },
    {
        question: "What percentage of people prefer hot weather over cold weather?",
        source: "Climate Preference Research, National Weather Service, 2022",
        answer: 72
    },
    {
        question: "How many people have never gotten a professional massage?",
        source: "Wellness Services Usage Survey, American Massage Therapy Association, 2023",
        answer: 69
    },
    {
        question: "What percentage of people can swim competently?",
        source: "Aquatic Skills Assessment, American Red Cross, 2023",
        answer: 56
    },
    {
        question: "How many people prefer online shopping over in-store shopping?",
        source: "Retail Preferences Study, National Retail Federation, 2023",
        answer: 61
    },
    {
        question: "What percentage of people have never been in a physical fight?",
        source: "Conflict Experience Survey, Violence Prevention Institute, 2022",
        answer: 78
    },
    {
        question: "How many people prefer to work from home over going to an office?",
        source: "Remote Work Preferences Study, Bureau of Labor Statistics, 2023",
        answer: 73
    },
    {
        question: "What percentage of people have never been pulled over by police?",
        source: "Traffic Stop Experience Survey, Department of Justice, 2023",
        answer: 42
    },
    {
        question: "How many people prefer Netflix over traditional TV?",
        source: "Entertainment Consumption Study, Nielsen Media Research, 2023",
        answer: 67
    },
    {
        question: "What percentage of people have never been hospitalized overnight?",
        source: "Healthcare Experience Survey, Hospital Consumer Assessment, 2023",
        answer: 54
    },
    {
        question: "How many people prefer texting over talking on the phone with friends?",
        source: "Communication Methods Study, Communication Research Institute, 2022",
        answer: 79
    },
    {
        question: "What percentage of people have never been to a wedding?",
        source: "Social Event Participation Survey, Wedding Industry Association, 2023",
        answer: 12
    },
    {
        question: "How many people prefer dark mode over light mode on their devices?",
        source: "User Interface Preferences Study, UX Research Institute, 2023",
        answer: 58
    },
    {
        question: "What percentage of people have never been skiing or snowboarding?",
        source: "Winter Sports Participation Survey, National Ski Areas Association, 2023",
        answer: 76
    },
    {
        question: "How many people prefer Android over iPhone?",
        source: "Mobile Operating System Preferences, Consumer Technology Association, 2023",
        answer: 42
    },
    {
        question: "What percentage of people have never been on a cruise?",
        source: "Cruise Industry Participation Survey, Cruise Lines International Association, 2023",
        answer: 81
    },
    {
        question: "How many people prefer to exercise alone rather than with others?",
        source: "Fitness Habits Study, International Health & Fitness Alliance, 2022",
        answer: 64
    },
    {
        question: "What percentage of people have never been to a professional sports game?",
        source: "Sports Attendance Survey, Sports Marketing Research Institute, 2023",
        answer: 48
    },
    {
        question: "How many people prefer to eat breakfast at home rather than on-the-go?",
        source: "Morning Meal Habits Study, Breakfast Research Foundation, 2023",
        answer: 57
    },
    {
        question: "What percentage of people have never been scuba diving?",
        source: "Underwater Activity Survey, Professional Association of Diving Instructors, 2023",
        answer: 91
    },
    {
        question: "How many people prefer to pay with cash rather than cards?",
        source: "Payment Method Preferences, Federal Reserve Bank Payment Study, 2023",
        answer: 27
    },
    {
        question: "What percentage of people have never been to a comedy show?",
        source: "Live Entertainment Attendance Survey, Comedy Club Association, 2023",
        answer: 63
    },
    {
        question: "How many people prefer to cook at home rather than order takeout?",
        source: "Food Preparation Habits Study, Culinary Institute Research, 2022",
        answer: 68
    },
    {
        question: "What percentage of people have never been to a casino?",
        source: "Gaming Experience Survey, American Gaming Association, 2023",
        answer: 52
    },
    {
        question: "How many people prefer to shop alone rather than with friends?",
        source: "Shopping Behavior Study, Retail Psychology Institute, 2023",
        answer: 59
    },
    {
        question: "What percentage of people have never been horseback riding?",
        source: "Equestrian Activity Survey, American Horse Council, 2023",
        answer: 74
    },
    {
        question: "How many people prefer podcasts over music while commuting?",
        source: "Audio Entertainment Preferences, Edison Research, 2023",
        answer: 32
    },
    {
        question: "What percentage of people have never been to a farmer's market?",
        source: "Local Food Shopping Survey, Farmers Market Coalition, 2023",
        answer: 38
    },
    {
        question: "How many people prefer to learn through videos rather than reading?",
        source: "Learning Style Preferences Study, Educational Technology Institute, 2022",
        answer: 72
    },
    {
        question: "What percentage of people have never been rock climbing?",
        source: "Adventure Sport Participation Survey, Climbing Business Journal, 2023",
        answer: 88
    },
    {
        question: "How many people prefer to travel by car rather than plane for vacations?",
        source: "Travel Preferences Study, Travel Industry Association, 2023",
        answer: 54
    },
    {
        question: "What percentage of people have never been to a food truck?",
        source: "Mobile Food Consumption Survey, Food Truck Association, 2023",
        answer: 29
    },
    {
        question: "How many people prefer to watch movies at home rather than in theaters?",
        source: "Movie Viewing Preferences Study, Motion Picture Association, 2023",
        answer: 71
    },
    {
        question: "What percentage of people have never been to a spa?",
        source: "Wellness Service Usage Survey, International Spa Association, 2023",
        answer: 67
    },
    {
        question: "How many people prefer to exercise in the morning rather than evening?",
        source: "Workout Timing Preferences, Fitness Industry Research, 2022",
        answer: 45
    },
    {
        question: "What percentage of people have never been to a wine tasting?",
        source: "Wine Experience Survey, Wine Industry Network, 2023",
        answer: 79
    },
    {
        question: "How many people prefer to read news online rather than in print?",
        source: "News Consumption Habits Study, Pew Research Center, 2023",
        answer: 83
    },
    {
        question: "What percentage of people have never been bungee jumping?",
        source: "Extreme Sports Participation Survey, Adventure Sports Association, 2023",
        answer: 96
    },
    {
        question: "How many people prefer to work with music playing rather than in silence?",
        source: "Workplace Productivity Study, Occupational Psychology Institute, 2022",
        answer: 62
    },
    {
        question: "What percentage of people have never been to a yoga class?",
        source: "Mind-Body Exercise Survey, Yoga Alliance Research, 2023",
        answer: 58
    },
    {
        question: "How many people prefer to eat lunch at their desk rather than in a break room?",
        source: "Workplace Dining Habits Study, Corporate Wellness Institute, 2023",
        answer: 47
    },
    {
        question: "What percentage of people have never been to an escape room?",
        source: "Interactive Entertainment Survey, Escape Room Industry Association, 2023",
        answer: 72
    },
    {
        question: "How many people prefer to take baths rather than showers?",
        source: "Bathing Preferences Study, Bathroom Fixtures Research, 2022",
        answer: 23
    },
    {
        question: "What percentage of people have never been to a karaoke bar?",
        source: "Entertainment Venue Experience Survey, Karaoke Industry Report, 2023",
        answer: 51
    },
    {
        question: "How many people prefer to shop online for groceries rather than in-store?",
        source: "Grocery Shopping Habits Study, Food Marketing Institute, 2023",
        answer: 39
    },
    {
        question: "What percentage of people have never been to a drive-in movie theater?",
        source: "Nostalgic Entertainment Survey, Drive-In Theater Association, 2023",
        answer: 84
    },
    {
        question: "How many people prefer to learn new skills through practice rather than instruction?",
        source: "Learning Methodology Study, Adult Education Research Institute, 2022",
        answer: 66
    },
    {
        question: "What percentage of people have never been to a silent movie screening?",
        source: "Classic Cinema Experience Survey, Film Preservation Society, 2023",
        answer: 93
    },
    {
        question: "How many people prefer to work in a quiet environment rather than a busy one?",
        source: "Work Environment Preferences Study, Workplace Psychology Research, 2023",
        answer: 71
    },
    {
        question: "What percentage of people have never been to a food festival?",
        source: "Culinary Event Participation Survey, Food Festival Network, 2023",
        answer: 55
    },
    {
        question: "How many people prefer to communicate through emojis rather than words when texting?",
        source: "Digital Communication Study, Mobile Messaging Research Institute, 2022",
        answer: 34
    },
    {
        question: "What percentage of people have never been to a trivia night?",
        source: "Social Gaming Activity Survey, Bar Entertainment Association, 2023",
        answer: 64
    },
    {
        question: "How many people prefer to organize their digital photos rather than leave them unsorted?",
        source: "Digital Organization Habits Study, Cloud Storage Research, 2023",
        answer: 41
    },
    {
        question: "What percentage of people have never been to a midnight movie premiere?",
        source: "Movie Fan Behavior Survey, Cinema Industry Analytics, 2023",
        answer: 87
    },
    {
        question: "How many people prefer to handwrite notes rather than type them?",
        source: "Note-taking Preferences Study, Educational Method Research, 2022",
        answer: 28
    },
    {
        question: "What percentage of people have never been to a professional networking event?",
        source: "Career Development Activity Survey, Professional Development Institute, 2023",
        answer: 69
    },
    {
        question: "How many people prefer to clean their house on weekends rather than weekdays?",
        source: "Household Management Study, Home Organization Research, 2023",
        answer: 78
    },
    {
        question: "What percentage of people have never been to a book signing?",
        source: "Literary Event Participation Survey, Authors Guild Research, 2023",
        answer: 82
    },
    {
        question: "How many people prefer to meal prep on Sundays rather than daily cooking?",
        source: "Food Preparation Strategy Study, Nutrition Planning Institute, 2022",
        answer: 36
    },
    {
        question: "What percentage of people have never been to a flash mob?",
        source: "Public Performance Experience Survey, Street Art Research Center, 2023",
        answer: 91
    },
    {
        question: "How many people prefer to save money rather than spend it immediately?",
        source: "Financial Behavior Study, Personal Finance Research Institute, 2023",
        answer: 67
    },
    {
        question: "What percentage of people have never been to a midnight sale event?",
        source: "Retail Event Participation Survey, Shopping Behavior Institute, 2023",
        answer: 76
    },
    {
        question: "How many people prefer to wake up naturally rather than use an alarm?",
        source: "Sleep Pattern Preferences Study, Circadian Rhythm Research, 2022",
        answer: 31
    },
    {
        question: "What percentage of people have never been to a poetry reading?",
        source: "Literary Arts Participation Survey, Poetry Society Research, 2023",
        answer: 89
    },
    {
        question: "How many people prefer to plan their day the night before rather than morning of?",
        source: "Time Management Habits Study, Productivity Research Institute, 2023",
        answer: 44
    },
    {
        question: "What percentage of people have never been to a historical reenactment?",
        source: "Living History Participation Survey, Historical Society Research, 2023",
        answer: 94
    },
    {
        question: "How many people prefer to buy experiences rather than material things?",
        source: "Consumer Priority Study, Behavioral Economics Institute, 2022",
        answer: 52
    }
];

export function getStatisticByIndex(index) {
    if (index >= 0 && index < statisticsData.length) {
        return statisticsData[index];
    }
    return statisticsData[0]; // fallback to first question
}

export function getTotalQuestions() {
    return statisticsData.length;
}

export { statisticsData };
