
class Inscrit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id_personne : this.props.data[0],
            prenom : this.props.data[1],
            nom : this.props.data[2],
            type : this.props.data[3],
            paiement : this.props.data[4],
            courriel : this.props.data[5],
            promo : this.props.data[6]
        };
        this.togglePay = this.togglePay.bind(this);
    }

    togglePay () {
        fetch("/paiement/" + this.state.id_personne, {
                method: (this.state.paiement ? "DELETE" : "POST"),
                credentials: "same-origin",
                headers: {
                    "X-XSRFTOKEN": document.cookie.match("\\b" + name + "=([^;]*)\\b")[1]
                }
        }).then(response => response.json()).then(json => {
            this.setState(function(prevState) {
                return {
                    paiement: ! prevState.paiement
                };
            });
        });
    }

    render () {
        const id_personne = this.state.id_personne;
        const nom = this.state.nom;
        const prenom = this.state.prenom;
        const type = this.state.type;
        const paiement = this.state.paiement;
        const courriel = this.state.courriel;
        const promo = this.state.promo;
        return (
            <div className="card">
                <div className="card-content">
                    <p className="subtitle">
                        {prenom} {nom} ({type} { type === 'etudiant' && "promo " + promo })

                        { paiement &&
                            <span className="tag is-success is-medium">
                                Paiement valide
                            </span>
                        }
                        { !paiement &&
                            <span className="tag is-danger is-medium">
                                Paiement en attente
                            </span>
                        }
                    </p>
                </div>
                <footer className="card-footer">
                    <a className="card-footer-item" href={"mailto:" + courriel}>Contacter par mail</a>
                    <a className="card-footer-item" onClick={this.togglePay}>Basculer paiement</a>
                    <a className="card-footer-item" onClick={this.props.deleteInscrit}>Supprimer cette personne</a>
                </footer>
            </div>
        )
    }
}

class ListeInscrits extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            liste : [],
            filtervalide: this.props.filtervalide
        };
    }

    loadInscrits () {
        fetch("/liste/inscrits", {credentials: "same-origin"}).then(response => response.json()).then(json => {
            this.setState({
                liste: json,
            });
        });
    }

    componentDidMount() {
        this.loadInscrits();
    }

    deleteInscrit (deleted_id_personne) {
        fetch("/liste/inscrits/" + deleted_id_personne, {
                method: "DELETE",
                credentials: "same-origin",
                headers: {
                    "X-XSRFTOKEN": document.cookie.match("\\b" + name + "=([^;]*)\\b")[1]
                }
        }).then(response => response.json()).then(json => {
            this.setState(function(prevState) {
                return {
                    liste: prevState.liste.filter(function (el) { return el[0] != deleted_id_personne })
                };
            });
        });
    }

    render () {
        const liste = this.state.liste;
        const inscrits = liste.map((inscrit) => {
            if (this.state.filtervalide && inscrit[4]) {
                return
            }
            let deleteInscrit = this.deleteInscrit.bind(this, inscrit[0]);
            return <Inscrit key={inscrit[0]} data={inscrit} deleteInscrit={deleteInscrit} />
        });
        return (
            <div>
                {inscrits}
            </div>
        )
    }
}

class Accompagnant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id_personne : this.props.data[0],
            nom_inscrit : this.props.data[1],
            prenom : this.props.data[2],
            nom : this.props.data[3],
            paiement : this.props.data[5],
            validation : this.props.data[6] === "valide"
        };
        this.togglePay = this.togglePay.bind(this);
        this.toggleValide = this.toggleValide.bind(this);
    }

    togglePay () {
        fetch("/paiement/" + this.state.id_personne, {
                method: (this.state.paiement ? "DELETE" : "POST"),
                credentials: "same-origin",
                headers: {
                    "X-XSRFTOKEN": document.cookie.match("\\b" + name + "=([^;]*)\\b")[1]
                }
        }).then(response => response.json()).then(json => {
            this.setState(function(prevState) {
                return {
                    paiement: ! prevState.paiement
                };
            });
        });
    }

    toggleValide () {
        fetch("/validation/" + this.state.id_personne, {
                method: (this.state.paiement ? "DELETE" : "POST"),
                credentials: "same-origin",
                headers: {
                    "X-XSRFTOKEN": document.cookie.match("\\b" + name + "=([^;]*)\\b")[1]
                }
        }).then(response => response.json()).then(json => {
            this.setState(function(prevState) {
                return {
                    validation: ! prevState.validation
                };
            });
        });
    }

    render () {
        const id_personne = this.state.id_personne;
        const nom_inscrit = this.state.nom_inscrit;
        const prenom = this.state.prenom;
        const nom = this.state.nom;
        const paiement = this.state.paiement;
        const validation = this.state.validation;
        return (
            <div className="card">
                <div className="card-content">
                    <p className="subtitle">
                        {prenom} {nom} (accompagne "{nom_inscrit}")

                        { validation &&
                            <span className="tag is-success is-medium">
                                Valide
                            </span>
                        }
                        { !validation &&
                            <span className="tag is-danger is-medium">
                                Validation en attente
                            </span>
                        }

                        { paiement &&
                            <span className="tag is-success is-medium">
                                Paiement valide
                            </span>
                        }
                        { !paiement &&
                            <span className="tag is-danger is-medium">
                                Paiement en attente
                            </span>
                        }
                    </p>
                </div>
                <footer className="card-footer">
                    <a className="card-footer-item" onClick={this.togglePay}>Basculer paiement</a>
                    <a className="card-footer-item" onClick={this.toggleValide}>Basculer validation</a>
                    <a className="card-footer-item" onClick={this.props.deleteInscrit}>Supprimer cette personne</a>
                </footer>
            </div>
        )
    }
}

class ListeAccompagnants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            liste : [],
            filtervalide: this.props.filtervalide,
            filterpaye: this.props.filterpaye
        };
    }

    loadInscrits () {
        fetch("/liste/accompagnants", {credentials: "same-origin"}).then(response => response.json()).then(json => {
            this.setState({
                liste: json,
            });
        });
    }

    componentDidMount() {
        this.loadInscrits();
    }

    deleteAccompagnant (deleted_id_personne) {
        fetch("/liste/inscrits/" + deleted_id_personne, {
                method: "DELETE",
                credentials: "same-origin",
                headers: {
                    "X-XSRFTOKEN": document.cookie.match("\\b" + name + "=([^;]*)\\b")[1]
                }
        }).then(response => response.json()).then(json => {
            this.setState(function(prevState) {
                return {
                    liste: prevState.liste.filter(function (el) { return el[0] != deleted_id_personne })
                };
            });
        });
    }

    render () {
        const liste = this.state.liste;
        const inscrits = liste.map((inscrit) => {
            if ((this.state.filtervalide && inscrit[6] === "valide") || (this.state.filterpaye && inscrit[5])) {
                return
            }
            let deleteAccompagnant = this.deleteAccompagnant.bind(this, inscrit[0]);
            return <Accompagnant key={inscrit[0]} data={inscrit} deleteAccompagnant={deleteAccompagnant} />
        });
        return (
            <div>
                {inscrits}
            </div>
        )
    }
}

class TabMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showListe : 1
        };
        this.showListeInscrits = this.showListeInscrits.bind(this);
        this.showListeInscritsNonPaye = this.showListeInscritsNonPaye.bind(this);
        this.showListeAccompagnants = this.showListeAccompagnants.bind(this);
        this.showListeValidation = this.showListeValidation.bind(this);
        this.showListePaiement = this.showListePaiement.bind(this);
    }

    showListeInscrits () {
        this.setState({showListe: 1});
    }

    showListeInscritsNonPaye () {
        this.setState({showListe: 2});
    }

    showListeAccompagnants () {
        this.setState({showListe: 3});
    }

    showListeValidation () {
        this.setState({showListe: 4});
    }

    showListePaiement () {
        this.setState({showListe: 5});
    }

    render () {
        return (
            <div>
                <div className="tabs is-fullwidth">
                    <ul>
                        <li className={this.state.showListe === 1 && "is-active"} >
                            <a onClick={this.showListeInscrits} >
                                <span className="icon">
                                    <i className="fa fa-users"></i>
                                </span>
                                <span>Liste Inscrits</span>
                            </a>
                        </li>
                        <li className={this.state.showListe === 2 && "is-active"} >
                            <a onClick={this.showListeInscritsNonPaye} >
                                <span className="icon">
                                    <i className="fa fa-user-o"></i>
                                </span>
                                <span>Inscrits a payer</span>
                            </a>
                        </li>
                        <li className={this.state.showListe === 3 && "is-active"} >
                            <a onClick={this.showListeAccompagnants} >
                                <span className="icon">
                                    <i className="fa fa-users"></i>
                                </span>
                                <span>Liste Accompagnants</span>
                            </a>
                        </li>
                        <li className={this.state.showListe === 4 && "is-active"} >
                            <a onClick={this.showListeValidation} >
                                <span className="icon">
                                    <i className="fa fa-user-secret"></i>
                                </span>
                                <span>Accompagnants a valider</span>
                            </a>
                        </li>
                        <li className={this.state.showListe === 5 && "is-active"} >
                            <a onClick={this.showListePaiement} >
                                <span className="icon">
                                    <i className="fa fa-user-o"></i>
                                </span>
                                <span>Accompagnants a payer</span>
                            </a>
                        </li>
                    </ul>
                </div>
                { this.state.showListe === 1 &&
                    <ListeInscrits filtervalide={false}/>
                }
                { this.state.showListe === 2 &&
                    <ListeInscrits filtervalide={true}/>
                }
                { this.state.showListe === 3 &&
                    <ListeAccompagnants filtervalide={false} filterpaye={false}/>
                }
                { this.state.showListe === 4 &&
                    <ListeAccompagnants filtervalide={true} filterpaye={false}/>
                }
                { this.state.showListe === 5 &&
                    <ListeAccompagnants filtervalide={false} filterpaye={true}/>
                }
            </div>
        )
    }
}

class Dashboard extends React.Component {
    render () {
        return (
            <div className="container">
                <TabMenu />
            </div>
        )
    }
}

ReactDOM.render(
    <Dashboard />,
    document.getElementById('content')
);
