import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApiUrl, showError } from '../../../global';
import { Form, Table, Row, Col, Button } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

import './styles.css';

const UserAdmin = (props) => {

    // Variáveis estados
    const [mode, setMode] = useState('save');
    const [user, setUser] = useState({ admin: false });
    const [users, setUsers] = useState([]);

    // função que realiza chamada à api
    async function loadUsers() {
        const url = `${baseApiUrl}/users`;
        await axios.get(url).then(response => {
            setUsers(response.data);
        });
    }

    //executa a função apenas uma vez na montagem do componente.
    useEffect(() => {
        loadUsers();
    }, [])

    // função que salva e atualiza usuário
   async function save() {
        const method = user.id ? 'put' : 'post'; // método irá depender do id setado ou não
        const id = user.id ? `/${user.id}` : ''; // caso id setado, método put, que precisa de id na requisição

       await axios[method](`${baseApiUrl}/users${id}`, user)
            .then(() => {
                alert('Processo realizado com sucesso!');
                reset();
            })
            .catch((e) => {
                const messageError = showError(e);
                alert(`Erro no processo: ${messageError}!`);
            })
    }

    // função que exclui usuário
   async function remove() {
        const id = user.id;
       await axios.delete(`${baseApiUrl}/users/${id}`)
            .then(() => {
                alert('Processo realizado com sucesso!');
                reset();
            })
            .catch((e) => {
                const messageError = showError(e);
                alert(`Erro no processo: ${messageError}!`);
            })
    }

    // função que invoca função de chamada à api resetando o formulário para estado inicial e mode para 'save'
    function reset() {
        setMode('save');
        setUser({ admin: false }); // retornando o user ao estado inicial. A propriedade admin inicialmente é sempre false.
        loadUsers();
    }

    // função que carrega dados do usuário selecionado no formulário; tanto para excluir, como para alterar
    function loadUser(user, mode = 'save') {
        setMode(mode);
        setUser(user);
    }

    // função que trata dos inputs do formulário
    function handleInputChange(event) {
        const { name, value } = event.target;

        // condição que captura checkbox, alterando individualmente user.admin
        if (name === 'admin') {
            const admin = !user.admin; // alterna entre verdadeiro e falso.

            setUser({ ...user, admin }); // seta estado user
            return; // O return sai da função, evitando que o input checkbox seja alterado mais abaixo
        }

        setUser({ ...user, [name]: value });
    }

    // variável com atribuição condicional para button salvar ou remover
    let buttonSaveOrRemove;
    if (mode === 'save') {
        buttonSaveOrRemove = <Button className="mb-3" variant="primary" onClick={save}>Salvar</Button>
    } else if (mode === 'remove') {
        buttonSaveOrRemove = <Button className="mb-3" variant="danger" onClick={remove}>Excluir</Button>
    }

    return (
        <div className="user-admin">

            <Form className="form mt-3">
                <Form.Control id="id" name="user-id" type="hidden" value={user.id || ''} />

                <Form.Group as={Row}>
                    <Col md="6" sm="12">
                        <Form.Label>Nome:</Form.Label>
                        <Form.Control name="name" id="user-name" type="text"
                            placeholder="Informe o Nome do Usuário" required readOnly={mode === 'remove'}
                            value={user.name || ''} onChange={handleInputChange} />
                    </Col>
                    <Col md="6" sm="12">
                        <Form.Label>E-mail:</Form.Label>
                        <Form.Control name="email" id="user-email" type="text"
                            placeholder="Informe o E-mail do Usuário" required readOnly={mode === 'remove'}
                            value={user.email || ''} onChange={handleInputChange} />
                    </Col>
                </Form.Group>

                {mode !== 'remove' &&
                    <div className="hide-half-form">
                        <Form.Check name="admin" id="user-admin" type="checkbox"
                            label="Administrador?" className="mt-3 mb-3"
                            checked={user.admin} onChange={handleInputChange} />

                        <Form.Group as={Row}>
                            <Col md="6" sm="12">
                                <Form.Label>Senha:</Form.Label>
                                <Form.Control name="password" id="user-password" type="password"
                                    placeholder="Informe a Senha do Usuário" required
                                    value={user.password} onChange={handleInputChange} />
                            </Col>
                            <Col md="6" sm="12">
                                <Form.Label>Confirmação de Senha:</Form.Label>
                                <Form.Control name="confirmPassword" id="user-confirmPassword" type="password"
                                    placeholder="Confirme a Senha do Usuário" required
                                    value={user.confirmPassword} onChange={handleInputChange} />
                            </Col>
                        </Form.Group>
                    </div>
                }
                <Form.Group as={Row}>
                    <Col xs="12">
                        {buttonSaveOrRemove}
                        <Button className="ml-2 mb-3" variant="secondary" onClick={reset}>Cancelar</Button>
                    </Col>
                </Form.Group>
            </Form>


            <Table bordered hover className="table">
                <thead>
                    <tr>
                        <th className="align-to-center">Id</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th className="align-to-center">Administrador</th>
                        <th className="align-to-center">Ações</th>
                    </tr>
                </thead>
                <tbody>

                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="align-to-center">{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className="align-to-center">{user.admin ? 'Sim' : 'Não'}</td>
                            <td className="actions">
                                <Button variant="warning" onClick={() => loadUser(user)} className="mr-2">
                                    <FaPen />
                                </Button>
                                <Button variant="danger" onClick={() => loadUser(user, 'remove')}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </div >
    );
}

export default UserAdmin;