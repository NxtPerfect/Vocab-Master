# Focus on Minimum Viable Product
apparently i only need transition on the normal element
not on hover/active/focus

express backend
react frontend
react-router
react-query

# Frontend
- [x] home page
    - [x] more language sections
    - [x] footer
    - [x] folding language sections
- [x] top nav bar with name, home, login, signup, logout
- [x] flashcard page
    - [x] correct/wrong button
    - [x] reveal button
    - [x] pick randomly words
    - [x] randomly pick numbers from 0 to n
    - [x] use that list of numbers to go through with index, to show that word
    - [x] words type, with english/translated field, as well as "guessed" bool
        - [x] if guessed once, set it to true, if already true, remove that number from list and go index -1
        - [x] if guessed wrong, reset that atribute
        - [x] sometimes "All words learnt" gets rendered, and doesn't let flashcards to load
    - [x] max of 30 words per day
    - [x] check which ones are already learnt, don't select these
    - [x] modal window confirmation before exiting
    - [ ] progress bar for how many words learnt -> as gradient
- [/] login/register page
    - [x] validate password correct in database
    - [x] signup button
    - [x] set cookie with username + userid
    - [x] register new account
    - [x] regex if password, login and email are correct
    - [x] we're assuming there's only one user with that username
    validate that on registering, only unique email 
    - [x] check if password == confirm password
    - [x] return error message to show above the form, below the header
    - [x] use email for login
    - [ ] animated loading circle, rotates, changes it's width
    - [ ] react query for fetches
    - [ ] flashcards are literally cards, on press reveal them, give tooltip below the card that you need to press it, also on hover
    - [ ] minimal mode, where it's black/white, and has no animations
    - [ ] as cookie save secret token from database
    - [ ] write tests

# Backend
- [x] read words from sql database
- [x] login/register backend
- [x] save user progress
    - [x] currently the fetch runs instantly after render
    - [x] it throws an error anyway
    - [x] don't show words if in user_progress
- [/] show words learnt / total count of words
    -- SOLUTION
    fetch data conditionally, when a user has login cookie set
    then we do another fetch call, and set usestate for progress
    then we have to somehow insert that data into our list of languages

    Now we just have to merge this data into languages
    and use it in language sections
- [ ] show an indicator if we already lernt from that level

- [ ] add 24h timeout, before next study can be done, so that you don't spam it
- [ ] hash password

# CSS
- [x] Home
    - [x] when folding, it doesn't change height
    - [x] maybe alter the colors for every 2nd item?
    - [ ] gradient as progress bar
    - [x] add visible spacing between levels
- [x] Nav
- [x] Footer
- [ ] Flashcard
- [x] Login
- [x] Register
- [ ] Error Page
