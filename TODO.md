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
- [x] language section still shows button to learn more
- [x] /api/user uses username to get progress
- [x] disable register fields on registering
- [x] save words for later
    - [x] if word already in user_progress
    then update it
    else insert new entry
    - [x] learn again pending words
        - [x] now language-section doesn't show learn button
        when date due for each word is more than today
        return it as learnt
        currently we return due for the whole section
        we should try and return it for each word
        and then count how many there are per section

        there's an issue in /api/learnt, as we only get
        words after today's date?
    - [x] saving words and updating on progress is untested
    the due date might be wrong
- [x] userstreak needs to set to 0 if user didn't learn
    yesterday
- [ ] cleanup ternary operators
- [ ] count of how many words left on the bottom of flashcard
---
`Total tasks: 17/19`

# CSS
- [x] Home
    - [x] when folding, it doesn't change height
    - [x] maybe alter the colors for every 2nd item?
    - [x] progress bar
    - [x] add visible spacing between levels
- [/] Flashcard
- [ ] Error Page
- [ ] Confirm Exit Modal
- [/] Loading website placeholder
    - [x] Animated loading circle, rotates, changes it's width
    - [/] suspense
- [/] Login/register
    - [/] on disabled input gray out
- [ ] language section
    - [ ] when no words left for today, the text shifts down
    make it equal with text that has button to learn
---
`Total tasks: 1/6`
