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
      scores[1].match == newScores[1].match ? scoredPlayer = "Player 2" : scoredPlayer = "Player 1";
      !scores[1].isServing && !scores[2].isServing ? scoredPlayer = "X" : scoredPlayer = scoredPlayer; 

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
    var playerID = "";
    var scoredPlayerDigitClass = "game";

    this.props.score.ID === 1 ? playerID = "playerOne" : playerID = "playerTwo";
    var backgroundClassString = "player " + playerID;

    this.props.score.name === scoredPlayer ? scoredPlayerDigitClass += " flipInX animated" : scoredPlayerDigitClass += ""    

    if (this.props.score.isServing) {
      serving = '(Serving)';
    }

    return (
      <div className={ backgroundClassString }>
      <h2>
        <ServingIndicator isServing={this.props.score.isServing} />
        { this.props.score.name } 
      </h2>
        <div className={ scoredPlayerDigitClass }>
          <Digit score={ this.props.score.match } />
        </div>
        <div className="match">
          <WinNumber wins={ this.props.score.game } />
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
    var dimension = 80;
    if (this.props.isServing) {
      servingClass = "servingIndicator";
    };

    return (     
      // <span className={servingClass}>
      //   <img src="digitImages/serve_indicator.png" width={ dimension } height={ dimension } />
      // </span>    
      <svg width="60" height="60" className={ servingClass }>
        <g>
          <circle id="servingCircle" r="30" cy="30" cx="30" stroke-linecap="null" stroke-linejoin="bevel" stroke-dasharray="null" stroke="#000000" fill="#00bf00"/>
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

var WinNumber = React.createClass({
  render: function(){
    var dimension = 40;
    var imageUrl = "digitImages/digit_" + this.props.wins + ".png";

    return(
      <span>
        <img className="winsDigit" src={ imageUrl } width={ dimension } height={ dimension } />
      </span>
      );
  }
});
$(App.start);
