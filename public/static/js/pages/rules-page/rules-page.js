'use strict';

(function () {

	class RulesPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'rules'}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <p>The game is played on four grids, two for each player. The grids are typically square – usually 10×10 – and
		            the
		            individual squares in the grid are identified by letter and number. On one grid the player arranges ships
		            and records the shots by the opponent. On the other grid the player records their own shots.</p>
		        <p>Before play begins, each player secretly arranges their ships on their primary grid. Each ship occupies a
		            number
		            of consecutive squares on the grid, arranged either horizontally or vertically. The number of squares for
		            each ship is determined by the type of the ship. The ships cannot overlap (i.e., only one ship can occupy
		            any given square in the grid). The types and numbers of ships allowed are the same for each player. These
		            may vary depending on the rules.</p>
		        <p>The 1990 Milton Bradley version of the rules specify the following ships:</p>
		        <table>
		            <tbody>
		            <tr>
		                <th>#</th>
		                <th>Class of ship</th>
		                <th>Size</th>
		            </tr>
		            <tr>
		                <td>1</td>
		                <td>Carrier</td>
		                <td>5</td>
		            </tr>
		            <tr>
		                <td>2</td>
		                <td>Battleship</td>
		                <td>4</td>
		            </tr>
		            <tr>
		                <td>3</td>
		                <td>Cruiser</td>
		                <td>3</td>
		            </tr>
		            <tr>
		                <td>4</td>
		                <td>Submarine</td>
		                <td>3</td>
		            </tr>
		            <tr>
		                <td>5</td>
		                <td>Destroyer</td>
		                <td>2</td>
		            </tr>
		
		            </tbody>
		        </table>
		        <p>After the ships have been positioned, the game proceeds in a series of rounds. In each round, each player
		            takes
		            a turn to announce a target square in the opponent's grid which is to be shot at. The opponent announces
		            whether or not the square is occupied by a ship, and if it is a "miss", the opponent player marks their
		            primary
		            grid with a white peg; if a "hit" they mark this on their own primary grid with a red peg. The attacking
		            player notes the hit or miss on their own "tracking" grid with the appropriate color peg (red for "hit",
		            white for "miss"), in order to build up a picture of the opponent's fleet.</p>
		        <p>When all of the squares of a ship have been hit, the ship is sunk, and the ship's owner announces this (e.g.
		            "You sank my battleship!"). If all of a player's ships have been sunk, the game is over and their opponent
		            wins.
		        </p>
		    </section>
			`
		}
	}

	window.RulesPage = RulesPage;
})();