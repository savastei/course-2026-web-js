import React from "react";
import Deck from "./Deck";
import Card from "./Card";

class App extends React.Component {
  state = {
    decks: [],
    activeDeckNumber: 0,
    front: "",
    back: "",
    editingIndex: null // Храним индекс редактируемой карты
  };

  componentDidMount() {
    const data = localStorage.getItem("decks");
    this.setState({ decks: data ? JSON.parse(data) : [new Deck("Default")] });
  }

  save = (decks) => {
    this.setState({ decks });
    localStorage.setItem("decks", JSON.stringify(decks));
  };

  // Изменение названия текущей колоды
  renameDeck = (newName) => {
    const newDecks = [...this.state.decks];
    newDecks[this.state.activeDeckNumber].name = newName;
    this.save(newDecks);
  };

  handleCardSubmit = () => {
    if (!this.state.front || !this.state.back) return;
    const newDecks = [...this.state.decks];
    const currentCards = newDecks[this.state.activeDeckNumber].cards;

    if (this.state.editingIndex !== null) {
      // Логика сохранения изменений
      currentCards[this.state.editingIndex] = new Card(this.state.front, this.state.back);
    } else {
      // Логика создания новой карты
      currentCards.push(new Card(this.state.front, this.state.back));
    }

    this.save(newDecks);
    this.setState({ front: "", back: "", editingIndex: null });
  };

  deleteCard = (index) => {
    const newDecks = [...this.state.decks];
    newDecks[this.state.activeDeckNumber].cards = newDecks[this.state.activeDeckNumber].cards.filter((_, i) => i !== index);
    this.save(newDecks);
  };

  toggleLearned = (index) => {
    const newDecks = [...this.state.decks];
    const card = newDecks[this.state.activeDeckNumber].cards[index];
    card.learned = !card.learned;
    this.save(newDecks);
  };

  render() {
    const activeDeck = this.state.decks[this.state.activeDeckNumber];

    return (
      <div className="container">
        <h3>Editor Mode</h3>
        
        <div className="tabs">
          {this.state.decks.map((deck, index) => (
            <button 
              key={index} 
              className={index === this.state.activeDeckNumber ? "tab-btn active" : "tab-btn"}
              onClick={() => this.setState({ activeDeckNumber: index, editingIndex: null, front: "", back: "" })}
            >
              {deck.name}
            </button>
          ))}
          <button onClick={() => this.save([...this.state.decks, new Deck("New Deck")])}>+ New Deck</button>
        </div>

        {activeDeck && (
          <div className="deck-settings">
            <label>Deck Name: </label>
            <input 
              value={activeDeck.name} 
              onChange={(e) => this.renameDeck(e.target.value)} 
            />
          </div>
        )}

        <div className="form">
          <h4>{this.state.editingIndex !== null ? "Edit Card" : "Create Card"}</h4>
          <input placeholder="Front" value={this.state.front} onChange={e => this.setState({ front: e.target.value })} />
          <input placeholder="Back" value={this.state.back} onChange={e => this.setState({ back: e.target.value })} />
          <button onClick={this.handleCardSubmit}>
            {this.state.editingIndex !== null ? "Save Changes" : "Add to Deck"}
          </button>
          {this.state.editingIndex !== null && (
            <button onClick={() => this.setState({ editingIndex: null, front: "", back: "" })}>Cancel</button>
          )}
        </div>

        <table className="card-table">
          <thead>
            <tr>
              <th>Front</th>
              <th>Back</th>
              <th>Learned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeDeck?.cards.map((card, i) => (
              <tr key={i}>
                <td>{card.frontSide}</td>
                <td>{card.backSide}</td>
                <td>
                  <input type="checkbox" checked={card.learned} onChange={() => this.toggleLearned(i)} />
                </td>
                <td>
                  <button onClick={() => this.setState({ front: card.frontSide, back: card.backSide, editingIndex: i })}>Edit</button>
                  <button onClick={() => this.deleteCard(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;