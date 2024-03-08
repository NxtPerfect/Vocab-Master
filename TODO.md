# Focus on Minimum Viable Product
express backend
express-session
react frontend
react-router
react-query
cookie-parser
bcrypt

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
- [x] home page should call in auth as well, and then call for user_progress
- [x] flashcards should call auth before showing
- [x] rate limiting
- [x] verify token in auth-status
    - [x] now always returns false
    - [x] nav stopped showing user streak
        - [x] isAuthenticated was set to false
        token cookie doesn't get sent
        in the nav component
        - [x] auth-status return false, which sets isAuthenticated to false
        inside of layout, and that returns false because there's no token
        sent in the request
- [x] nav home page doesn't refetch
- [x] login/register not accessed if logged in
- [x] hash password

- [?] user progress returns 4,4/4, instead of 4/4
    most likely issue in query

- [ ] language section still shows button to learn more
- [ ] /api/user uses username to get progress
- [ ] disable register fields on registering
- [ ] save words for later
    - [ ] learn again pending words
- [ ] cleanup ternary operators
- [ ] count of how many words left on the bottom of flashcard
---
`Total tasks: 12/17`

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
- [ ] Login/register
    - [ ] on disabled input gray out
---
`Total tasks: 1/5`
