import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { baseApiUrl, showError } from '../../../global';
import { Form, Table, Row, Col, Button } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

//Editor
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './styles.css';

const ArticleAdmin = (props) => {

    // Variáveis estados 
    const [mode, setMode] = useState('save');
    const [article, setArticle] = useState({});
    const [articles, setArticles] = useState([]);
    const [editorContent, setEditorContent] = useState(''); //Conteúdo do editor em variavel separada
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(0);
    const [count, setCount] = useState(0);

    // objeto de configuração do editor de texto
    const editorConfiguration = {
        toolbar: [
            'heading',
            '|',
            'bold', 'italic',
            '|',
            'bulletedList', 'numberedList',
            '|',
            'indent', 'outdent',
            '|',
            'link', 'mediaEmbed',
            '|',
            'undo', 'redo'
        ],
        language: 'pt-br'
    };

    // função que carrega os artigos, setando também as variáveis count e limit, usadas para paginação
    async function loadArticles() {
        await axios.get(`${baseApiUrl}/articles`).then(response => {
            setArticles(response.data.data);
            setCount(response.data.count);
            setLimit(response.data.limit);
        });
    }

    // função que carrega as categorias
    async function loadCategories() {
        await axios.get(`${baseApiUrl}/categories`).then(response => {
            setCategories(response.data);
        });
    }

    // função que carrega os usuários, utilizado no formulário como autores.
    async function loadUsers() {
        await axios.get(`${baseApiUrl}/users`).then(response => {
            setUsers(response.data);
        });
    }

    // realiza a chamada apenas uma vez no momento da montagem do componente.
    useEffect(() => {
        loadArticles();
        loadCategories();
        loadUsers();
    }, []);

    // função que salva e altera artigo
    async function save() {
        const method = article.id ? 'put' : 'post';
        const id = article.id ? `/${article.id}` : '';

        const content = editorContent; // cópia do conteúdo do editor para ser enviado junto com o objeto article.

        await axios[method](`${baseApiUrl}/articles${id}`, { ...article, content })
            .then(() => {
                alert('Processo realizado com sucesso!');
                reset();
            })
            .catch((e) => {
                const messageError = showError(e);
                alert(`Erro no processo: ${messageError}!`);
            })
    }

    // função que remove artigo
    async function remove() {
        const id = article.id;
        await axios.delete(`${baseApiUrl}/articles/${id}`)
            .then(() => {
                alert('Processo realizado com sucesso!');
                reset();
            })
            .catch((e) => {
                const messageError = showError(e);
                alert(`Erro no processo: ${messageError}!`);
            })
    }

    // função que reset dados e formulário.
    function reset() {
        setMode('save');
        setEditorContent('');
        setArticle({});
        loadArticles();
    }

    // função que carrega dados do artigo selecionado no formulário, tanto para excluir, como para alterar
    async function loadArticle(article, mode = 'save') { // Atentar para essa função
        // seta a variável com o mode recebido como argumento
        setMode(mode)
        // realiza chamada à api, buscando pelo id do argumento recebido como parâmetro, pegando apenas o artigo
        await axios.get(`${baseApiUrl}/articles/${article.id}`)
            .then(response => {
                //desestrutura a resposta da api
                const { id, name, description, imageUrl, categoryId, userId, content } = response.data;

                // cria um objeto que é um cópia da resposta da api, excluindo o atributo content.
                const updateArticle = { id, name, description, imageUrl, categoryId, userId };

                // cria uma variável que é um cópia do atributo content, excluído do objeto acima
                const updateEditorContent = content;

                //atualiza o estado article, excluindo o content
                setArticle(updateArticle);

                //atualiza o estado EditorContent, apenas com o content
                setEditorContent(updateEditorContent);
            });
    }

    // função que trata dos inputs do formulário
    function handleInputChange(event) {
        const { name, value } = event.target;

        setArticle({ ...article, [name]: value });
    }

    // função que trata do dados inseridos no editor, guardando numa variável para ser persistido na api posteriormente.
    function handleEditorChange(event, editor) {
        const content = editor.getData();

        setEditorContent(content);
    }

    // variável com atribuição condicional para button salvar ou remover
    let buttonSaveOrRemove;
    if (mode === 'save') {
        buttonSaveOrRemove = <Button className="mb-3" variant="primary" onClick={save}>Salvar</Button>
    } else if (mode === 'remove') {
        buttonSaveOrRemove = <Button className="mb-3" variant="danger" onClick={remove}>Excluir</Button>
    }

    return (
        <div className="article-admin">
            <Form>
                <Form.Control name="id" id="article-id" type="hidden" value={article.id || ''} />

                <Form.Group as={Row}>
                    <Col xs="12">
                        <Form.Label className="mt-3">Nome:</Form.Label>
                        <Form.Control name="name" id="article-name" type="text"
                            value={article.name || ''} onChange={handleInputChange}
                            required readOnly={mode === 'remove'}
                            placeholder="Informe o Nome do Artigo..."
                        />

                        <Form.Label className="mt-3">Descrição:</Form.Label>
                        <Form.Control name="description" id="article-description" type="text"
                            value={article.description || ''} onChange={handleInputChange}
                            required readOnly={mode === 'remove'}
                            placeholder="Informe a Descrição do Artigo..."
                        />

                        <Form.Label className="mt-3">Imagem (URL):</Form.Label>
                        <Form.Control name="imageUrl" id="article-imageUrl" type="text"
                            value={article.imageUrl || ''} onChange={handleInputChange}
                            required readOnly={mode === 'remove'}
                            placeholder="Informe a URL da Imagem..."
                        />
                    </Col>
                </Form.Group>

                {mode !== 'remove' &&
                    <div className="toggle-content">
                        <Form.Group as={Row}>
                            <Col xs="12">
                                <Form.Label>Categoria:</Form.Label>
                                <Form.Control as="select" name="categoryId" id="article-categoryId"
                                    value={article.categoryId || '0'} onChange={handleInputChange}>

                                    <option value="0">Selecione:</option>

                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.path}</option>
                                    ))}

                                </Form.Control>
                                <Form.Label className="mt-3">Autor:</Form.Label>
                                <Form.Control as="select" name="userId" id="article-userId"
                                    value={article.userId || '0'} onChange={handleInputChange}>

                                    <option value="0">Selecione:</option>

                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{`${user.name} - ${user.email}`}</option>
                                    ))}

                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Col xs="12">
                                <Form.Label>Conteúdo:</Form.Label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfiguration}
                                    data={editorContent || ''}
                                    onChange={handleEditorChange}
                                />
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
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>

                    {articles.map(article => (
                        <tr key={article.id}>
                            <td>{article.id}</td>
                            <td>{article.name}</td>
                            <td>{article.description}</td>
                            <td>
                                <Button variant="warning" onClick={() => loadArticle(article)} className="mr-2">
                                    <FaPen />
                                </Button>
                                <Button variant="danger" onClick={() => loadArticle(article, 'remove')}>
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

export default ArticleAdmin;