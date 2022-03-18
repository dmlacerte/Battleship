# BATTLESHIP

Include: Your User stories – who are your users, what do they want, and why?, 
Your Wireframes – sketches of major views/interfaces in your application, Descriptions of any Unsolved problems or major hurdles you had to overcome,
A link to your hosted project in the URL section of your Github repo.

<img width="1511" alt="image" src="https://user-images.githubusercontent.com/97196460/159019487-39d40ccf-25f3-4116-803b-4756ab6c0696.png">

**## Technologies Used**
- HTML5
- CSS3
- JavaScript

**## User Stories**
- As a player, I want to be able to read the rules of Battleship, so that I can understand how to play.
- As a player, I want to be able to have a way to set my ships on the board, so that I can strategize my game.
- As a player, I want to be able to have a way to start and reset the game, so that I can begin to play.
- As a player, I want to be able to select a space on the computer board to make my move, so that I can take my turn. 
- As a player, I want to be able to clearly see the current status of the game (computer moves, hits, misses, remaining boats), so that I can strategize my next move.
- As a player, I want to be able to see who wins the game, so that I can finish my game or start a new game. 

/*Game Rules:

Objective: 
Be the first to sink all of your opponent's ships.

Contents: 
3 ships each (6 total), 
1 opponent board (hits - red, misses - gray, hidden ships - no color), 
1 player board (blue - ships, hits - red, misses - gray)

Rules:
1. Each player places their ships on the board horizontally or vertically
(this position cannot be changed once placed). <Add Figure with Example>
< Stretch - Start with randomly generated ships, but later add ability to select ship, 
and then select position using an arrow. >
2. First player selects a spot on the opponent's board. If the shot is a hit,
the spot will turn red. If it is a miss, the spot will turn gray.
< Stretch - hits yellow until full ship is sunk, then turns red. >
< Stretch - indicate which ship was hit, and change that ship in the DOM. >
3. After the player goes, the computer takes a turn. 
< Stretch - computer will act strategically instead of selecting a random open spot. >

*/

/*Layout:

Boards: 
5x5 boards 
< Stretch - customizable board size >  
Left border has letters, top border has numbers 
Under / Above boards - three ships, names of ship underneath 
< Stretch - bottom is buttons for setting ships >
< Stretch - ships has dots representing number of spaces, will change colors when hit > 
< Stretch - adding animations when a ship is hit > 
Right side of boards - start game button, reset button
< Stretch - arrows for setting ships >
*/
  
  **## Project Choice (Tell us which project you're doing!)**
Battleship

**## Project Description** 
Battleship is a game of two players (in this case, one player and one computer), in which each player tries to sink the other player's ships. At the beginning of the game, each player secretly sets their own ships on a board (must be placed horizontally or vertically). Every turn, each player selects a space on the other player's board. If the other player has a ship placed on that spot, it is marked a hit. If the other player did not have a ship placed on that spot, it is marked a miss. The game ends when one player sinks all of the other player's ships. 

**## Wire Frames**
![image](https://media.git.generalassemb.ly/user/41174/files/3ad0fe80-9baf-11ec-8943-9cc7e04a6629)

**### MVP Goals**
Ship boards are randomly generated for both the player and computer. 
Player has buttons to start and reset the game. 
Have the computer randomly select an open space during its turn. 
Change the colors of the board spaces as shots / hits are made. 
End the game once one player has sunk all of the other player's ships. 

**### Stretch Goals**
When a ship is hit, indicate which ship was hit on the DOM. 
The player is able to place their own boats. 
Add animations for hits / sunk ships. 
Have the computer play strategically.
Have the board size be customizable (current plan is 5x5 space board). 
Maintain a cumulative count of wins / losses. 
Maintain game status even if user navigates away from the page.

