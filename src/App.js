import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './App.css';

const url = 'http://localhost:3000/api/users';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users:[],
      page:1,
      limit:10,
      hayMas: false,
      loading: true
    }
    
  }

  componentDidMount() {
    this.getAllUsers();
  }

  deleteUser(id){
    axios.delete(`${url}/${id}`)
      .then(res => {
        alert('Contacto borrado con éxito');
        this.getAllUsers();
      });
  }

  findByText(e){
    axios.get(`${url}?_page=1&_limit=${this.state.limit}&q=${e}`)
      .then(res => {
        const users = res.data.map(obj => obj);
        this.setState({ users });
      });
  }

  getAllUsers(op=''){
    //cada vez que se llame, se activa el loading state
    this.setState({loading:true});
    let newpage;
    //revisamos qué operación realizaremos, para poder manejar las páginas
    if(op==='suma'){
      newpage = this.state.page + 1;
    }else if(op==='resta'){
      if(this.state.page>0){ //esto es para que no vaya a la página -1
        newpage = this.state.page - 1;
      }
    }else{ //entra acá cuando se inicia la app.
      newpage = 1;
    }
    
    // Llamada a la api para que traiga todos los usuarios de la página NEWPAGE, y la cantidad especificada en limit
    axios.get(`${url}?_page=${newpage}&_limit=${this.state.limit}`)
      .then(res => {
        const users = res.data.map(obj => obj);
        //si el la cantidad devuelta es 10, es probable que existan más registros, entonces se deja TRUE el status HAYMAS
        //que se utiliza para condicionar la visualización de los botones siguiente/anterior 
        if(users.length>9){
          this.setState({ users, loading: false, page: newpage, hayMas: true });
        }else{
          this.setState({ users, loading: false, page: newpage, hayMas: false });
        }
      });
  }


  openModal(){
    let sabana = document.querySelector('.sabana');
    let modal = document.querySelector('.createModal');
    modal.style.display = 'block';
    sabana.style.display = 'block';
    modal.classList.add('animated');
    modal.classList.add('fadeInUp');
    sabana.classList.add('animated');
    sabana.classList.add('fadeIn');
  }

  closeModal(){
    let sabana = document.querySelector('.sabana');
    let modal = document.querySelector('.createModal');
    modal.classList.add('animated');
    modal.classList.add('fadeOutDown');
    sabana.classList.add('animated');
    sabana.classList.add('fadeOut');
    setTimeout(() => {
      modal.classList.remove('animated');
    modal.classList.remove('fadeOutDown');
    sabana.classList.remove('animated');
    sabana.classList.remove('fadeOut');
      modal.style.display = 'none';
      sabana.style.display = 'none';
    }, 700);
  }

  saveClient(){
    console.log(this);
    let photo  = document.getElementById('photo').value;
    let name = document.getElementById('name').value;
    let desc = document.getElementById('description').value;
    if(photo){
      if(name){
        if(desc){
          axios.post(url, {
            photo: photo,
            name: name,
            description: desc
          })
          .then( response => {
            alert('Contacto creado con éxito');
            this.closeModal();
          })
          .catch(error => {
            console.log('ocurrió un error al guardar el contacto',error);
          });
        }else{
          alert('ingresa una descripción');
        }
      }else{
        alert('ingresa un nombre');
      }
    }else{
      alert('ingresa una url para la imagen');
    }
  }
  render() {
    if(this.state.loading){
      return (
        <p>Cargando datos...</p>
      )
    }
    return (
      <div className="container">
          <h1 className="header-title">Test <strong>Beetrack</strong></h1>
          <div className="row">
            <div className="input-field col s6">
              <i className="material-icons prefix">search</i>
              <input id="buscar" type="text" className="validate" onChange={(e) => this.findByText(e.target.value)}/>
              <label htmlFor="buscar">Buscar...</label>
            </div>
            <div className="input-field col s6">
              <a className="waves-effect waves-light btn" onClick={this.openModal}><i className="material-icons left">send</i>Crear Nuevo</a>
            </div>
          </div>
          <div className="row">
            <div className="col s4 people">
              <div className="header">
                <h2>Nombre</h2>
              </div>
            </div>
            
            <div className="col s8 detail">
              <div className="header">
                <h2>Descripción</h2>
              </div>
            </div>
          </div>
          {
            this.state.users.map(user =>
            <div className="row peopleBox" key={user.id}>
              <div className="col s4 people">
                <div className="item">
                  <img src={user.photo} width='50' height='50' alt='people' />
                  <div className="info">
                    <h6>{user.name}</h6>
                    <a href="javascript:void(0);" onClick={() => this.deleteUser(user.id)}>Eliminar</a>
                  </div>
                </div>
              </div>
              <div className="col s8 detail">
                <div className="itemDetail">
                  <p>{user.description}</p>
                </div>
              </div>
            </div>
          )}
        
        <div className="row">
          <div className="col s12">
            <a className={"waves-effect waves-light btn " + (this.state.page<2 || this.state.hayMas ? 'show' : 'hidden')} onClick={ () => this.getAllUsers('suma') }>Página siguiente</a>
            <a className={"waves-effect waves-light btn " + (this.state.page>1 ? 'show' : 'hidden')} onClick={ () => this.getAllUsers('resta') }>Página Anterior</a>
          </div>
        </div>
    
        <div className="sabana" onClick={() => this.closeModal()}></div>
        <div id="createModal" className="createModal">
          <div className="modal-content">
            <h4>Agregar nuevo contacto</h4>
            <div className="input-field col s6">
              <input id="photo" type="text" className="validate" />
              <label htmlFor="photo">Url foto de perfil</label>
            </div>
            <div className="input-field col s6">
              <input id="name" type="text" className="validate" />
              <label htmlFor="name">Nombre</label>
            </div>
            <div className="input-field col s12">
              <textarea id="description" className="materialize-textarea"></textarea>
              <label htmlFor="description">Descripción</label>
            </div>
          </div>
          <div className="modal-footer">
            <a className="modal-action modal-close waves-effect waves-green btn-flat" onClick={() => this.saveClient()}>Guardar</a>
          </div>
        </div>

      </div>  
    );
  }
}



export default App;
