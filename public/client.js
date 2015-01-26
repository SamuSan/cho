var KEYS = {
  R: 114,
  S: 115,
  1: 49,
  2: 50,
};

var scoredPlayer = "";

var App = (function () { "use strict";
  var pub = {};
  var scores = {
    1: {
      name: 'Player 1',
      game: 0,
      match: 0,
      isServing: false,
    },

    2: {
      name: 'Player 2',
      game: 0,
      match: 0,
      isServing: false,
    },
  };

  function changePlayerName(id) {
    var newName = prompt('Change ' + scores[id].name + "'s name to:");
    socket.emit('changeName', id, newName);
  }

  function render() {
    React.unmountComponentAtNode(document.getElementById('scoreboard'));
    React.render(
        <ScoreBoard scores={scores} />,
        document.getElementById('scoreboard')
    );
  }

  pub.start = function () {
    $(document).on('keypress', function(e) {
      console.log(e.which);
      if (e.which == KEYS.R) {
        socket.emit('reset');
      }

      if (e.which == KEYS.S) {
        socket.emit('swapSides');
      }

      if (e.which == KEYS[1]) {
        changePlayerName(1);
      }

      if (e.which == KEYS[2]) {
        changePlayerName(2);
      }
    });

    socket.on('update scores', function (newScores) {
      scores[1].match == newScores[1].match ? scoredPlayer = "Player 2" : scoredPlayer = "Player 1"
      console.log("Player what scored the points" + scoredPlayer);

      document.getElementById('dingSound').play();
      scores = newScores;
      render();
    });

    render();
  };

  return pub;
})();

var PlayerScore = React.createClass({
  render: function () {
    var serving;
    var playerNumber = "";
    var scoredPlayerDigitClass = "game";

    this.props.score.name === "Player 1" ? playerNumber = "playerOne" : playerNumber = "playerTwo";
    var backgroundClassString = "player " + playerNumber;

    this.props.score.name === scoredPlayer ? scoredPlayerDigitClass += " flipInX animated" : scoredPlayerDigitClass += ""    

    if (this.props.score.isServing) {
      serving = '(Serving)';
    }

    return (
      <div className={ backgroundClassString }>
      <h2>
        <ServingIndicator isServing={this.props.score.isServing} />
        { this.props.score.name } { serving }
      </h2>
        <div className={ scoredPlayerDigitClass }>
          <Digit score={ this.props.score.match } />
        </div>
        <div className="match">
          { this.props.score.game } games
        </div>
      </div>
    )
  }
});

var ScoreBoard = React.createClass({
  render: function() {
    var message;

    if (!this.props.scores.server) {
      message = 'The winner of the rally should press their button first.';
    }

    return (
      <div>
        <PlayerScore score={this.props.scores[1]} />
        <PlayerScore score={this.props.scores[2]} />
        <div className="message">
          {message}
        </div>
      </div>
    );
  }
});

var ServingIndicator  = React.createClass({ 
  render: function(){
    var servingClass = "notServing";

    if (this.props.isServing) {
      servingClass = "servingIndicator";
    };

    return (         
      <svg width="60" height="60" className={ servingClass }>
        <g>
          <circle id="servingCircle" r="20" cy="20" cx="35" stroke-linecap="null" stroke-linejoin="bevel" stroke-dasharray="null" stroke="#000000" fill="#00bf00"/>
        </g>
      </svg>
    );
  }
});

var Digit = React.createClass({
    render: function(){
    var imageUrlLeft = "digitImages/digit_0.png";
    var imageUrlRight = imageUrlLeft;

    if (this.props.score < 10) {
      imageUrlRight = "digitImages/digit_"+ this.props.score +".png";
    } 
    else{
      var parsed = "" + this.props.score;
      imageUrlLeft = "digitImages/digit_" + parsed[0] + ".png";
      imageUrlRight = "digitImages/digit_"+ parsed[1] +".png";
    };  
    var dimension = "200";  

    return (
      <span>
        <img className="scoreDigit" src={ imageUrlLeft } width={ dimension } height={ dimension } />
        <img className="scoreDigit" src={ imageUrlRight } width={ dimension } height={ dimension } />
      </span> 
      );
  }
});
$(App.start);
