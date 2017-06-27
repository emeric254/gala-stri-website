
class Inscrit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id_personne : this.props.data[0],
            nom : this.props.data[1],
            prenom : this.props.data[2],
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

class Accompagnant extends React.Component {
    render () {
        return (
            <div className="box">
                <article className="media">
                    <div className="media-left">
                        <span className="icon">
                            <i className="fa fa-male"></i>
                        </span>
                    </div>
                    <div className="media-content">
                        <div className="content">
                        </div>
                    </div>
                </article>
            </div>
        )
    }
}

class ListeInscrits extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            liste : []
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

class TabMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showListe : 1
        };
        this.showListeInscrits = this.showListeInscrits.bind(this);
    }

    showListeInscrits () {
        this.setState({showListe: 1});
    }

    showListeValidation () {
        this.setState({showListe: 2});
    }

    showListePaiement () {
        this.setState({showListe: 3});
    }

    render () {
        return (
            <div>
                <div className="tabs is-fullwidth">
                    <ul>
                        <li className={this.state.showListe === 1 && "is-active"} >
                            <a onClick={this.loadInscrits} >
                                <span className="icon">
                                    <i className="fa fa-users"></i>
                                </span>
                                <span>Liste Inscrits</span>
                            </a>
                        </li>
                        <li>
                            <a>
                                <span className="icon">
                                    <i className="fa fa-user-o"></i>
                                </span>
                                <span>Validation en attente</span>
                            </a>
                        </li>
                        <li>
                            <a>
                                <span className="icon">
                                    <i className="fa fa-user-secret"></i>
                                </span>
                                <span>Paiement en attente</span>
                            </a>
                        </li>
                    </ul>
                </div>
                { this.state.showListe === 1 &&
                    <ListeInscrits />
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
