import React from 'react';
import { IonContent, IonPage, IonHeader } from '@ionic/react';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Simulación de Registro exitosa! Redirigiendo al login...');
    navigate('/login');
  };

  return (
    <IonPage>
      <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">

        <div className="register-container">
          <div className="register-card">
            
            <div className="register-header">
              <h1>Crear Cuenta</h1>
              <p>Únete a TCGStore y gestiona tus pedidos fácilmente.</p>
            </div>

            <form className="register-form" onSubmit={handleRegister}>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input type="text" id="nombre" placeholder="Juan" required />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input type="text" id="apellido" placeholder="Pérez" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" placeholder="ejemplo@correo.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" placeholder="••••••••" required />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input type="password" id="confirmPassword" placeholder="••••••••" required />
              </div>

              <div className="terms-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  He leído y acepto los <Link to="/coming-soon">Términos de Servicio</Link> y la <Link to="/coming-soon">Política de Privacidad</Link> de TCGStore.
                </label>
              </div>

              <button type="submit" className="btn-register">Crear mi cuenta</button>

            </form>

            <div className="login-link">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </div>

          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Register;

