# Focus on Minimum Viable Product
express backend
express-session
react frontend
react-router
react-query
cookie-parser

# Frontend
- [x] max of 30 words per day
- [ ] write tests
---
`Total tasks: 1/2`

# Backend
- [x] We only read last streak in home, but we should also see
    if user has valid streak, if no then we should show that
- [x] error message on login
- [x] as cookie save secret token from database
    - [x] Implement Secure Auth
        - [x] Create context, to pass in auth status
        - [x] Send jwt
            - [x] generate unique uuid for user
            - [x] send token to backend when user_progress
        - [x] authenticate actions on frontend
- [x] handle errors on query
- [x] Use .env
- [ ] nav stopped showing user streak
- [ ] home page should call in auth as well, and then call for user_progress
- [ ] flashcards should call auth before showing
- [ ] nav home page doesn't refetch
- [ ] hash password
- [ ] save words for later
    - [ ] learn again pending words
- [ ] cleanup ternary operators
- [ ] count of how many words left on the bottom of flashcard
- [x] rate limiting
---
`Total tasks: 6/14`

# CSS
- [x] Home
    - [x] when folding, it doesn't change height
    - [x] maybe alter the colors for every 2nd item?
    - [x] progress bar
    - [x] add visible spacing between levels
    - [ ] minimal mode, where it's black/white, and has no animations
- [ ] Flashcard
    - [ ] flashcards are literally cards, on press reveal them, give tooltip below the card that you need to press it, also on hover
- [ ] Error Page
- [ ] Confirm Exit Modal
- [ ] Loading website placeholder
    - [x] Animated loading circle, rotates, changes it's width
    - [ ] suspense
---
`Total tasks: 1/5`
