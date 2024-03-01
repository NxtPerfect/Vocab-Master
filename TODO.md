# Focus on Minimum Viable Product
express backend
react frontend
react-router
react-query
cookie-parser

# Frontend
- [x] max of 30 words per day
- [ ] write tests

# Backend
- [x] We only read last streak in home, but we should also see
    if user has valid streak, if no then we should show that
- [x] error message on login
- [ ] as cookie save secret token from database
    - [ ] Implement Secure Auth
        - [x] Create context, to pass in auth status
        - [ ] Create JWT - json web token, to authenticate
            from user id create hash
        - [ ] use token to know if user is logged in
            and use it to know which user is logged in
    - [x] Use .env
    - [ ] home page should call in auth as well, and then call for user_progress
    - [ ] flashcards should call auth before showing
- [ ] hash password
- [ ] save words for later
    - [ ] learn again pending words
- [ ] cleanup ternary operators
- [ ] count of how many words left on the bottom of flashcard
- [x] rate limiting

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
