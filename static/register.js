'use strict';

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
                            <input name="accompagnateurs-prenom" className="input" type="text" placeholder="Prénom" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-user" />
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control is-expanded has-icons-left">
                            <input name="accompagnateurs-nom" className="input" type="text" placeholder="Nom" />
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
    constructor(props) {
        super(props);
        this.state = {counter: 0};
        this.ajoutAccompagnateur = this.ajoutAccompagnateur.bind(this);
        this.enleverAccompagnateur = this.enleverAccompagnateur.bind(this);
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
    render() {
        const counter = this.state.counter;
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
                                    <a href="#" className="button" onClick={this.ajoutAccompagnateur}>
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
                                    <a href="#" className="button" onClick={this.enleverAccompagnateur}>
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
        /*
            this.setState(function(prevState) {
                return {
                    counter: (prevState.counter < 10) ? prevState.counter + 1 : 10
                };
            });
        */
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
                                Une erreur a été rencontrée, veuillez réessayer.
                            </div>
                        </div>
                    </div>
                }
                <div className="field">
                    <div className="control">
                        <a href="#" className="button is-primary" onClick={this.inscription}>
                            S'inscire
                        </a>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

ReactDOM.render(
    <div>
        <h2 className="subtitle">
            Accompagnateur(s)
        </h2>
        <ListeAccompagnant />
    </div>,
    document.getElementById('accompagnateurs')
);

ReactDOM.render(
    <Validation />,
    document.getElementById('validation')
);

ReactDOM.render(
    <div>
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
                            <input required type="radio" name="genre" value="personnel" disabled />
                            membre du personnel
                        </label>
                        <label className="radio">
                            <input required type="radio" name="genre" value="professionnel" disabled />
                            professionnel
                        </label>
                        <label className="radio">
                            <input required type="radio" name="genre" value="ancien" disabled />
                            ancien étudiant STRI
                        </label>
                        <label className="radio">
                            <input required type="radio" name="genre" value="etudiant" defaultChecked />
                            étudiant STRI
                        </label>
                    </p>
                </div>
            </div>
        </div>

        <div className="field is-horizontal">
            <div className="field-label">
                Année de promotion
            </div>
            <div className="field-body">
                <div className="field is-grouped">
                    <p className="control is-expanded">
                        <span className="select">
                            <select required name="promotion">
                                <option value="2017" defaultValue>
                                    Promo 2017 (sortante)
                                </option>
                                <option value="2018" disabled>
                                    Promo 2018
                                </option>
                                <option value="2019" disabled>
                                    Promo 2019
                                </option>
                                <option value="2020" disabled>
                                    Promo 2020
                                </option>
                            </select>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>,
    document.getElementById('identite')
);
