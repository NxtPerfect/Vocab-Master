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
- [/] top nav bar with name, home, login, signup, logout
- [/] flashcard page
    - [x] correct/wrong button
    - [x] reveal button
    - [x] pick randomly words
    - [x] randomly pick numbers from 0 to n
    - [x] use that list of numbers to go through with index, to show that word
    - [x] words type, with english/translated field, as well as "guessed" bool
        - [x] if guessed once, set it to true, if already true, remove that number from list and go index -1
        - [/] if guessed wrong, reset that atribute
        - [ ] sometimes "All words learnt" gets rendered, and doesn't let flashcards to load
- [ ] login/register page
    - [ ] hash password
    - [ ] signup button

# Backend
- [ ] read words from sql database
- [ ] save user progress
- [ ] login/register backend
