import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApiUrl, showError, showSuccess } from '../../../global';
import { Form, Table, Row, Col, Button } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

import './styles.css';

const CategoryAdmin = (props) => {

    // variáveis de estados
    const [mode, setMode] = useState('save');
    const [category, setCategory] = useState({});
    const [categories, setCategories] = useState([]);


    //função que carrega as categorias
    async function loadCategories() {
        await axios.get(`${baseApiUrl}/categories`).then(response => {
            setCategories(response.data);
        });
    }


    //executa a função apenas uma vez na montagem do componente
    useEffect(() => {
        loadCategories();
    }, [])


    // função que salva e altera categoria
    async function save() {
        const method = category.id ? 'put' : 'post';
        const id = category.id ? `/${category.id}` : '';

        await axios[method](`${baseApiUrl}/categories${id}`, category)
            .then(() => {
                showSuccess();
                reset();
            })
            .catch(showError);
    }


    // função que remove categoria
    async function remove() {
        const id = category.id;
        await axios.delete(`${baseApiUrl}/categories/${id}`)
            .then(() => {
                showSuccess();
                reset();
            })
            .catch(showError);
    }


    // função que reset dados e formulário.
    function reset() {
        setMode('save');
        setCategory({});
        loadCategories();
    }


    // função que carrega dados da categoria selecionado no formlário, tanto para excluir, como para alterar
    function loadCategory(category, mode = 'save') {
        setMode(mode);
        setCategory(category);
    }


    // função que trata dos inputs do formulário
    function handleInputChange(event) {
        const { name, value } = event.target;

        setCategory({ ...category, [name]: value });
    }


    // variável com atribuição condicional para button salvar ou remover
    let buttonSaveOrRemove;
    if (mode === 'save') {
        buttonSaveOrRemove = <Button className="mb-3" variant="primary" onClick={save}>Salvar</Button>
    } else if (mode === 'remove') {
        buttonSaveOrRemove = <Button className="mb-3" variant="danger" onClick={remove}>Excluir</Button>
    }


    return (
        <div className="category-admin">

            <Form className="form mt-3">

                <Form.Control id="category-id" name="id" type="hidden" value={category.id || ''} />

                <Form.Group as={Row}>
                    <Col xs="12">
                        <Form.Label>Nome:</Form.Label>
                        <Form.Control id="category-name" name="name" type="text"
                            placeholder="Informe o Nome da Categoria" required readOnly={mode === 'remove'}
                            value={category.name || ''} onChange={handleInputChange} />
                    </Col>
                </Form.Group>

                {mode !== 'remove' &&
                    <Form.Group as={Row}>
                        <Col xs="12">
                            <Form.Label>Categoria Pai:</Form.Label>
                            <Form.Control as="select" name="parentId" id="category-parentId" onChange={handleInputChange}
                                value={category.parentId || '0'}>

                                <option value="0">Selecione:</option>

                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.path}</option>
                                ))}

                            </Form.Control>
                        </Col>
                    </Form.Group>
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
                        <th className="align-to-center">Código</th>
                        <th>Nome</th>
                        <th>Caminho</th>
                        <th className="align-to-center">Ações</th>
                    </tr>
                </thead>
                <tbody>

                    {categories.map(category => (
                        <tr key={category.id}>
                            <td className="align-to-center">{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.path}</td>
                            <td className="actions">
                                <Button variant="warning" onClick={() => loadCategory(category)} className="mr-2">
                                    <FaPen />
                                </Button>
                                <Button variant="danger" onClick={() => loadCategory(category, 'remove')}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </div>
    );
}

export default CategoryAdmin;