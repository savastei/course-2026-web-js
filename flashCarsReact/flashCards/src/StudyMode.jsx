import React from "react";

class Study extends React.Component {
  state = {
    decks: [],
    activeDeckNumber: 0,
    nowCard: 0,
    isBack: false
  };

  componentDidMount() {
    const data = localStorage.getItem("decks");
    this.setState({ decks: data ? JSON.parse(data) : [] });
  }

  render() {
    const activeDeck = this.state.decks[this.state.activeDeckNumber];
    const cardsToStudy = activeDeck?.cards.filter(c => !c.learned) || [];
    const currentCard = cardsToStudy[this.state.nowCard];

    return (
      <div className="container">
        <div className="tabs">
          {this.state.decks.map((deck, index) => (
            <button 
              key={index}
              className={index === this.state.activeDeckNumber ? "tab-btn active" : "tab-btn"}
              onClick={() => this.setState({ activeDeckNumber: index, nowCard: 0, isBack: false })}
            >
              {deck.name}
            </button>
          ))}
        </div>

        {currentCard ? (
          <div className="study-area">
            <p>Card {this.state.nowCard + 1} of {cardsToStudy.length}</p>
            <div className="big-card" onClick={() => this.setState({ isBack: !this.state.isBack })}>
              {this.state.isBack ? currentCard.backSide : currentCard.frontSide}
            </div>
            <div className="controls">
              <button onClick={() => this.setState({ 
                nowCard: (this.state.nowCard - 1 + cardsToStudy.length) % cardsToStudy.length,
                isBack: false 
              })}>Prev</button>
              
              <button onClick={() => this.setState({ 
                nowCard: (this.state.nowCard + 1) % cardsToStudy.length, 
                isBack: false 
              })}>Next</button>
            </div>
          </div>
        ) : <p>All cards learned!</p>}
      </div>
    );
  }
}

export default Study;