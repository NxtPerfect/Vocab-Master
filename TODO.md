# Focus on Minimum Viable Product
do css later, first make it functional
focus on flashcard
and login/register

express backend
react frontend
react-router

# Frontend
- [/] home page
    - [/] language section
    - [ ] folding language sections
- [x] top nav bar with name, home, login, signup, logout
- [/] flashcard page
    - [x] correct/wrong button
    - [x] reveal button
    - [x] pick randomly words
    - [x] randomly pick numbers from 0 to n
    - [x] use that list of numbers to go through with index, to show that word
    - [x] words type, with english/translated field, as well as "guessed" bool
        - [x] if guessed once, set it to true, if already true, remove that number from list and go index -1
        - [x] if guessed wrong, reset that atribute
        - [?] sometimes "All words learnt" gets rendered, and doesn't let flashcards to load
    - [ ] max of 20 or 50 words per day
    - [ ] check which ones are already learnt, don't select these
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
    - [ ] hash password

# Backend
- [x] read words from sql database
- [x] login/register backend
- [/] save user progress
    - [ ] currently the fetch runs instantly after render
    - [ ] it throws an error anyway
