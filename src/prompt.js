let prompts =[
    {
        // 1
        prompt: "What kind of person would I be if I was someone I admired?",
        tags:"Thought Provoking"
    },
    {
        // 2
        prompt: "Imagine your perfect life 10 years from now, describe it. What's one thing holding you back from that vision?",
        tags:"Feel Good"
    },
    {
        // 3
        prompt: "How would you structure your day if you were excited about your future, grateful for your present, and unaffected by your past?",
        tags:"Gratitude"
    },
    {
        // 4
        prompt: "What's something you struggle to let go of? What is holding you back from healing?",
        tags:"Thought Provoking"

    },
    {
        // 5
        prompt: "What's one thing you would've appreciated more receiving as a child? How can you receive more of this as an adult?",
        tags: "Thought Provoking"
    },
    {
        // 6
        prompt: "What is one trait you really liked about yourself as a child? How could you re-integrate this now?",
        tags: "Thought Provoking"
    },
    {
        // 7
        prompt: "What's one area in your life you feel like you're lacking in? What are 5 things you can do to feel like you're not lacking in this?",
        tags:"Thought Provoking"
    },
    {
        // 8
        prompt: "If you somehow knew that that you only had 10 years left to live, what would change about your life? Would your beliefs change? How you spend your time?",
        tags:"Thought Provoking"
    },
    {
        // 9
        prompt: "What are three things to make life worth living to you? Despite the ups and downs.",
        tags:"Gratitude"
    },
    {
        // 10
        prompt: "Where do I see myself, so far as my goals, personal development, residence, or job, in five years, and do I have a plan to arrive at this destination?",
        tags:"Thought Provoking"
    },
    {
        // 11
        prompt: "Who would you most like to be like if you could change your personality?",
        tags:"Thought Provoking"
    },
    {
        // 12
        prompt: "If you were born in another time, what time would you choose and why?",
        tags:"Thought Provoking"
    },
    {
        // 13
        prompt: "Where would you most like to watch the sun come up? Why?",
        tags:"Feel Good"
    },
    {
        // 14
        prompt: "How do you think instant riches would affect your friendships and familial relationships?",
        tags:"Thought Provoking"
    },
    {
        // 15
        prompt: "Describe something you feel most passionate about to a complete stranger.",
        tags:"Gratitude"
    },
    {
        // 16
        prompt: "When were you the happiest this year?",
        tags:"Thought Provoking"
    },
    {
        // 17
        prompt: "What are you saving up for?",
        tags:"Feel Good"
    },
    {
        // 18
        prompt: "How do you feel when you stare at the stars?",
        tags:"Thought Provoking"
    },
    {
        // 19
        prompt: "What would you say to your loved ones if you could tell them absolutely anything?",
        tags:"Thought Provoking"
    },
    {
        // 20
        prompt: "What is your strongest memory, as a child, of your parents and what were you all doing at the time?",
        tags:"Gratitude"
    },
    {
        // 21
        prompt: "What makes your favorite song so special? How do you personally relate to it?",
        tags:"Feel Good"
    },
    {
        // 22
        prompt: "What is your fondest memory of an animal or pet you once had?",
        tags:"Feel Good"
    },
    {
        // 23
        prompt: "What is the best gift you've ever given someone? Why?",
        tags:"Gratitude"
    },
    {
        // 24
        prompt: "Which friend has had the greatest impact on your life and why?",
        tags:"Gratitude"
    },
    {
        // 25
        prompt: "Which photo of yourself do you hate the most, and why?",
        tags:"Thought Provoking"
    },
    {
        // 26
        prompt: "Who inspires you the most, and why?",
        tags:"Gratitude"
    },
    {
        // 27
        prompt: "Can you buy happiness?",
        tags:"Thought Provoking"
    },
    {
        // 28
        prompt: "If you could trade places with a famous person for a day, who would you like to be and why?",
        tags:"Thought Provoking"
    },
    {
        // 29
        prompt: "What do you wish you could tell someone, and who do you wish you could tell?",
        tags:"Thought Provoking"
    },
    {
        // 30
        prompt: "When you close your eyes and think of where you want to live, what comes to the surface? Specifically, what do you want your space to look like? And what do you think that reflects about you?",
        tags:"Feel Good"
    },
    {
        // 31
        prompt: "What are things that you wish people knew about you without your having to tell them?",
        tags:"Thought Provoking"
    },
    {
        // 32
        prompt: "What are a few qualities you dislike in other people, and why?",
        tags:"Thought Provoking"
    },
    {
        // 33
        prompt: "What music makes you want to get up and dance? Why don't you?",
        tags:"Feel Good"
    },
    {
        // 34
        prompt: "When do you think about your regrets the most often?",
        tags:"Thought Provoking"
    },
    {
        // 35
        prompt: "What family item has changed your view or ideas about a family member?",
        tags:"Thought Provoking"
    },
    {
        // 36
        prompt: "What is your favorite lie to tell?",
        tags:"Thought Provoking"
    },
    {
        // 37
        prompt: "Look at yourself in the mirror and describe what you see. Try to be as postive as possible.",
        tags:"Feel Good"
    },
    {
        // 38
        prompt: "What is one of your most personal hopes and dreams?",
        tags:"Feel Good"
    },
    {
        // 39
        prompt: "What’s one place that you would like to visit but never will? Why will you never go there?",
        tags:"Thought Provoking"
    },
    {
        // 40
        prompt: "What's the most difficult part about being you?",
        tags:"Thought Provoking"
    },
    {
        // 41
        prompt: "What's your favorite part of being you?",
        tags:"Feel Good"
    },
    {
        // 42
        prompt: "What would you do if you found an injured animal in the street?",
        tags:"Thought Provoking"
    },
    {
        // 43
        prompt: "When you were a child, how did you imagine your adult life? How is it similar or different to what you imagined?",
        tags:"Thought Provoking"
    },
    {
        // 44
        prompt: "What is one skill you wish you had and how would that make your life different?",
        tags:"Thought Provoking"
    },
    {
        // 45
        prompt: "What would you like to accomplish by the end of the year?",
        tags:"Thought Provoking"
    },
    {
        // 46
        prompt: "How do others see you?",
        tags:"Thought Provoking"
    },
    {
        // 47
        prompt: "Tell about a time when someone made you feel welcomed or accepted. What did they do and how did it make you feel?",
        tags:"Feel Good"
    },
    {
        // 48
        prompt: "Tell about a time when someone made you feel bad about yourself. What did they do and how did you react?",
        tags:"Thought Provoking"
    },
    {
        // 49
        prompt: "What one thing could you invent that would make your life easier?",
        tags:"Thought Provoking"
    },
    {
        // 50
        prompt: "Why is your best friend your best friend?",
        tags:"Gratitude"
    },
    {
        // 51
        prompt: "What is the biggest goal for your life?",
        tags:"Feel Good"
    },
    {
        // 52
        prompt: "What is your most embarrassing moment and why?",
        tags:"Thought Provoking"
    },
    {
        // 53
        prompt: "What is your greatest fear and how often do you think about it?",
        tags:"Thought Provoking"
    },
    {
        // 54
        prompt: "What gives you confidence and why?",
        tags:"Thought Provoking"
    },
    {
        // 55
        prompt: "Tell about a dream that you can remember.",
        tags:"Thought Provoking"
    },
    {
        // 56
        prompt: "Tell about a time you were given, or gave, flowers.",
        tags:"Thought Provoking"
    },
    {
        // 57
        prompt: "Where did you grow up? Describe what it was like?",
        tags:"Thought Provoking"
    },
    {
        // 58
        prompt: "What is a New Year's Eve you will never forget?",
        tags:"Thought Provoking"
    },
    {
        // 59
        prompt: "If money wasn't an issue, what kind of house would you have?",
        tags:"Feel Good"
    },
    {
        // 60
        prompt: "Have you had an experience that made you feel close to nature?",
        tags:"Gratitude"
    },
    {
        // 61
        prompt: "Describe a favorite letter you have received.",
        tags:"Feel Good"
    },
    {
        // 62
        prompt: "What is your opinion of people who are inconsiderate of others?",
        tags:"Thought Provoking"
    },
    {
        // 63
        prompt: "What things do you think are beautiful?",
        tags:"Feel Good"
    },
    {
        // 64
        prompt: "What do you consider your greatest achievement?",
        tags:"Feel Good"
    },
    {
        // 65
        prompt: "If you could change one thing about your family, what would it be?",
        tags:"Thought Provoking"
    },
    {
        // 66
        prompt: "What is the quality you like most in a woman?",
        tags:"Thought Provoking"
    },
    {
        // 66
        prompt: "What is the quality you like most in a man?",
        tags:"Thought Provoking"
    },
    {
        // 67
        prompt: "How loyal are you?",
        tags:"Thought Provoking"
    },
    {
        // 68
        prompt: "What is something you are optimistic about?",
        tags:"Feel Good"
    },
    {
        // 69
        prompt: "What is the best advice you ever received?",
        tags:"Feel Good"
    },
    {
        // 70
        prompt: "If you could give any gift in the world, what would you give and to whom?",
        tags:"Feel Good"
    },
    {
        // 71
        prompt: "What makes you feel safe?",
        tags:"Thought Provoking"
    },
    {
        // 72
        prompt: "What three words would describe you right now?",
        tags:"Thought Provoking"
    },
    {
        // 73
        prompt: "What quality do you like about yourself—creativity, personality, appearance—why?",
        tags:"Feel Good"
    },
    {
        // 74
        prompt: "How do you feel about your appearance?",
        tags:"Thought Provoking"
    },
    {
        // 75
        prompt: "How do you have the most fun—alone, with a large group, with a few friends—and why?",
        tags:"Thought Provoking"
    },
    {
        // 76
        prompt: "When are you happiest?",
        tags:"Feel Good"
    },
    {
        // 77
        prompt: "When have you felt lonely?",
        tags:"Thought Provoking"
    },
    {
        // 78
        prompt: "When might it be bad to be honest?",
        tags:"Thought Provoking"
    },
    {
        // 79
        prompt: "Which quality do you dislike most about yourself—laziness, selfishness, childishness—and why?",
        tags:"Thought Provoking"
    },
    {
        // 80
        prompt: "Which holiday has the most meaning for you-Canada Day, Thanksgiving, Valentines Day—and why?",
        tags:"Thought Provoking"
    },
    {
        // 81
        prompt: "Which is least important to you—money, power, fame—and why?",
        tags:"Thought Provoking"
    },
    {
        // 82
        prompt: "Who or what has had a strong influence in your life?",
        tags:"Gratitude"
    },
    {
        // 83
        prompt: "Why is it important to be honest?",
        tags:"Thought Provoking"
    },
    {
        // 84
        prompt: "Does it bother you to be around someone who has bad manners?",
        tags:"Thought Provoking"
    },
    {
        // 85
        prompt: "What can you do that makes people laugh?",
        tags:"Thought Provoking"
    },
    {
        // 86
        prompt: "What would happen if animals could talk? What are some of the questions you would like to ask animals?",
        tags:"Thought Provoking"
    },
    {
        // 87
        prompt: "If you were five years older you would...",
        tags:"Thought Provoking"
    },
    {
        // 88
        prompt: "What's your favorite place to escape from life temporarily? A park? A mall?",
        tags:"Feel Good"
    },
    {
        // 89
        prompt: "What is your favorite season and why?",
        tags:"Feel Good"
    },
    {
        // 90
        prompt: "What was your favorite thing to collect as a child, and why?",
        tags:"Feel Good"
    },
    {
        // 91
        prompt: "Imagine trading places with the first person you spoke to today.",
        tags:"Thought Provoking"
    },
    {
        // 92
        prompt: "What would you do to change the country and the world for the better if you were elected president?",
        tags:"Thought Provoking"
    },
    {
        // 93
        prompt: "Make a list of what you would like to do before you die.",
        tags:"Thought Provoking"
    },
    {
        // 94
        prompt: "Complete this sentence: Love is…",
        tags:"Thought Provoking"
    },
    {
        // 95
        prompt: "What is the best way to educate the world on lead and how it affects people, just one person at a time?",
        tags:"Thought Provoking"
    },
    {
        // 96
        prompt: "What is something that lowers your confidence?",
        tags:"Thought Provoking"
    },
    {
        // 97
        prompt: "Any stranger in your life that has made your day better? Describe the moment.",
        tags:"Feel Good"
    },
    {
        // 98
        prompt: "If your best friend came to you depressed and upset like you've never seen before, how would you react?",
        tags:"Thought Provoking"
    },
    {
        // 99
        prompt: "What type of parent do you think you will be?",
        tags:"Feel Good"
    },
    {
        // 100
        prompt: "Am I happy with my job, life, and situation? What parts are good? What parts are bad?",
        tags:"Thought Provoking"
    },



]

export { prompts }