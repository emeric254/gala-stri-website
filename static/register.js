'use strict';

const cout_sortant = 15;
const cout_acc = 15;

class Accompagnant extends React.Component {
    render() {
        return (
            <div className="field is-horizontal">
                <div className="field-label">
                    Accompagnateur {this.props.number}
                </div>
                <div className="field-body">
                    <div className="field is-grouped">
                        <p className="control is-expanded has-icons-left">
                            <input required name="accompagnateurs-prenom" className="input" type="text" placeholder="Prénom" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-user" />
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control is-expanded has-icons-left">
                            <input required name="accompagnateurs-nom" className="input" type="text" placeholder="Nom" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-user" />
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

class ListeAccompagnant extends React.Component {
    render() {
        const counter = this.props.counter;
        const map_array = Array.apply(null, {length: counter}).map(Number.call, Number);
        const liste =  map_array.map((number) =>
            <Accompagnant key={number} number={number + 1} />
        );
        return (
            <div>
                {liste}
                <div className="field is-horizontal">
                    <div className="field-label" />
                    <div className="field-body">
                        { counter < 10 &&
                            <div className="field">
                                <div className="control">
                                    <a href="#" className="button" onClick={this.props.ajoutAccompagnateur}>
                                        <span className="icon is-small">
                                            <i className="fa fa-plus" />
                                        </span>
                                        <span>
                                            Ajouter un accompagnateur
                                        </span>
                                    </a>
                                </div>
                            </div>
                        }
                        { counter > 0 &&
                            <div className="field">
                                <div className="control">
                                    <a href="#" className="button" onClick={this.props.enleverAccompagnateur}>
                                        <span className="icon is-small">
                                            <i className="fa fa-minus" />
                                        </span>
                                        <span>
                                            Enlever un accompagnateur
                                        </span>
                                    </a>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

class Validation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: false};
        this.inscription = this.inscription.bind(this);
    }
    inscription (e) {
        e.preventDefault();
        var form_data =  new FormData();
        var formulaire = document.getElementById("formulaire").elements;
        for (var i = 0, iLen = formulaire.length; i < iLen; i++) {
            form_data.append(formulaire[i].name, formulaire[i].value);
        }
        const courriel = document.getElementById("courriel").value

        fetch("/register", {
            method: "POST",
            body: form_data,
            credentials: 'same-origin'  // to send the xsrf cookie
        })
        .then((response) => response.json())
        .then((data) => {
            document.location.href = "/registered?courriel=" + courriel;
        })
        .catch((error) => {
            this.setState({error: true});
            console.error(error);
        });
    }
    render() {
        const error = this.state.error;
        return (
        <div className="field is-horizontal">
            <div className="field-label" />
            <div className="field-body">
                { error &&
                    <div className="field">
                        <div className="control">
                            <div className="notification is-danger">
                                Une erreur a été rencontrée, veuillez vérifier les champs du formulaire et réessayer.
                            </div>
                        </div>
                    </div>
                }
                <div className="field">
                    <div className="control">
                        <button className="button is-primary" onClick={this.inscription}>
                            S'inscrire
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

class Devis extends React.Component {
    render() {
        const sortant = this.props.sortant;
        console.log(sortant);
        const nb_acc = this.props.nb_acc;
        const total_acc = nb_acc * cout_acc;
        const total = total_acc + ((sortant)?15:0);
        return (
            <section className="section">
                <h2 className="subtitle">
                    Estimation du cout de la reservation
                </h2>
                <table>
                    <thead>
                        <tr>
                          <th>Description</th>
                          <th><abbr title="Quantite">Qt</abbr></th>
                          <th><abbr title="Prix Unitaire">Unitaire</abbr></th>
                          <th><abbr title="Prix Total">Total</abbr></th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <th></th>
                            <th></th>
                            <th>{total}</th>
                        </tr>
                    </tfoot>
                    <tbody>
                        { sortant &&
                            <tr>
                                <td>Etudiant Promotion sortante</td>
                                <td>1</td>
                                <td>{cout_sortant}</td>
                                <td>{cout_sortant}</td>
                            </tr>
                        }
                        { ! sortant &&
                            <tr>
                                <td>Inscription gratuite</td>
                                <td>1</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                        }
                        { nb_acc > 0 &&
                            <tr>
                                <td>Accompagnant{nb_acc > 1 && 's'}</td>
                                <td>{nb_acc}</td>
                                <td>{cout_acc}</td>
                                <td>{total_acc}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}

class Inscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: false, counter: 0, selected_type: 'etudiant', selected_year: '2017'};
        this.ajoutAccompagnateur = this.ajoutAccompagnateur.bind(this);
        this.enleverAccompagnateur = this.enleverAccompagnateur.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
    }
    ajoutAccompagnateur (e) {
        e.preventDefault();
        this.setState(function(prevState) {
            return {
                counter: (prevState.counter < 10) ? prevState.counter + 1 : 10
            };
        });
    }
    enleverAccompagnateur (e) {
        e.preventDefault();
        this.setState(function(prevState) {
            return {
                counter: (prevState.counter > 0) ? prevState.counter - 1 : 0
            };
        });
    }
    handleTypeChange (changeEvent) {
        this.setState({selected_type: changeEvent.target.value });
    }
    handleYearChange (changeEvent) {
        this.setState({selected_year: changeEvent.target.value });
    }
    render() {
        const error = this.state.error;
        return (
            <div className="content">
                <section className="section">
                    <h2 className="subtitle">
                        Informations personnelles
                    </h2>

                    <div className="field is-horizontal">
                        <div className="field-label">
                            Identité
                        </div>
                        <div className="field-body">
                            <div className="field is-grouped">
                                <p className="control is-expanded has-icons-left">
                                    <input required name="prenom" className="input" type="text" placeholder="Prénom" />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-user" />
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <p className="control is-expanded has-icons-left">
                                    <input required name="nom" className="input" type="text" placeholder="Nom" />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-user" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">
                        <div className="field-label">
                            Adresse
                        </div>
                        <div className="field-body">
                            <div className="field is-grouped">
                                <p className="control is-expanded has-icons-left">
                                    <input required name="courriel" className="input" type="email" id="courriel" placeholder="Courriel" />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-envelope" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">
                        <div className="field-label">
                            Vous êtes un
                        </div>
                        <div className="field-body">
                            <div className="field is-grouped">
                                <p className="control is-expanded">
                                    <label className="radio">
                                        <input required type="radio" name="genre" value="personnel" checked={this.state.selected_type === 'personnel'} onChange={this.handleTypeChange} />
                                        membre du personnel
                                    </label>
                                    <label className="radio">
                                        <input required type="radio" name="genre" value="professionnel" checked={this.state.selected_type === 'professionnel'} onChange={this.handleTypeChange} />
                                        professionnel
                                    </label>
                                    <label className="radio">
                                        <input required type="radio" name="genre" value="ancien" checked={this.state.selected_type === 'ancien'} onChange={this.handleTypeChange} />
                                        ancien étudiant STRI
                                    </label>
                                    <label className="radio">
                                        <input required type="radio" name="genre" value="etudiant" checked={this.state.selected_type === 'etudiant'} onChange={this.handleTypeChange} />
                                        étudiant STRI
                                    </label>
                                </p>
                            </div>
                        </div>
                    </div>
                    { this.state.selected_type === 'etudiant' &&
                        <div className="field is-horizontal">
                            <div className="field-label">
                                Année de promotion
                            </div>
                            <div className="field-body">
                                <div className="field is-grouped">
                                    <p className="control is-expanded">
                                        <span className="select">
                                            <select required name="promotion" value={this.state.selected_year} onChange={this.handleYearChange}>
                                                <option value="2017">
                                                    Promo 2017 (sortante)
                                                </option>
                                                <option value="2018">
                                                    Promo 2018
                                                </option>
                                                <option value="2019">
                                                    Promo 2019
                                                </option>
                                                <option value="2020">
                                                    Promo 2020
                                                </option>
                                            </select>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                </section>
                <section className="section">
                    <h2 className="subtitle">
                        Accompagnateur(s)
                    </h2>
                    <ListeAccompagnant ajoutAccompagnateur={this.ajoutAccompagnateur} enleverAccompagnateur={this.enleverAccompagnateur} counter={this.state.counter} />
                </section>
                <Devis nb_acc={this.state.counter} sortant={this.state.selected_type === 'etudiant' && this.state.selected_year === '2017'}/>
                <section className="section">
                    <Validation />
                </section>
            </div>
        );
    }
}

ReactDOM.render(
    <Inscription />,
    document.getElementById('form_content')
);
