import { Link } from "react-router-dom";

function EsqueciSenha() {
    

    return (
      <div className="grid-helper">
        
        <div className="password-miss">
            <h2>Esqueci minha senha e agora?</h2>
            <div className="password-body">
                <p>Em caso de você perder seu acesso ou o mesmo ser comprometido, favor entrar em contato com o <b>Rafael Ramalho Rosa</b> do setor de TI pelos 
                 seguintes meios:
                </p>
                <p> <b>Email:</b> <br />
                rafael.rosa@delp.com.br</p>
                <p><b>Telefone:</b> <br />
                Ramal 7577</p>
                <div className="forget-button-area">
                <Link to={'/Login'} className="btn-link"> Voltar</Link>
                </div>
            </div>
        </div>
      </div>
    );
  }
  
  export default EsqueciSenha;
  