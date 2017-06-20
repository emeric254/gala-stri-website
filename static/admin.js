
class Inscrit extends React.Component {
    render () {
        const data = this.props.data;
        const id_personne = data[0];
        const nom = data[1];
        const prenom = data[2];
        const type = data[3];
        const paiement = data[4];
        const courriel = data[5];
        const promo = data[6];
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
                    <a className="card-footer-item">Basculer paiement</a>
                    <a className="card-footer-item">Supprimer cette personne</a>
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

    render () {
        const liste = this.state.liste;
        const inscrits = liste.map((inscrit) =>
            <Inscrit key={inscrit[0]} data={inscrit} />
        );
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
