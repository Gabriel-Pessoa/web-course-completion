import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu } from '../../../config/actions';

import { makeStyles } from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import { ExpandMore, ChevronRight } from '@material-ui/icons';

import { FaSearch } from 'react-icons/fa'

import { useHistory } from 'react-router-dom';

import { baseApiUrl } from '../../../global';
import axios from 'axios';

import { useMediaQuery } from 'react-responsive'; // media-query, react-responsive

import './styles.css'


//estilo do material-icon
const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});

const Menu = (props) => {
    //redux
    const isMenuVisible = useSelector(state => state.isMenuVisible); // dados recebidos do redux
    const dispatch = useDispatch(); // redux, para disparar ações


    //variáveis estados
    const classes = useStyles(); // instancia do objeto makeStyles
    const [treeData, setTreeData] = useState([]);
    const treeRef = useRef();

    //variavél estado do input de pesquisa
    const [treeFilter, setTreeFilter] = useState('');

    //instanciando da função do router-dom, que servirá para encaminhar para o artigo selecionado na árvore.
    let history = useHistory();


    // realiza a chamada à api no momento da montagem do componente, apenas uma vez
    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const mounted = () => {
            const url = `${baseApiUrl}/categories/tree`;
            axios.get(url, { cancelToken: source.token })
                .then(response => setTreeData(response.data));
        }

        mounted();

        return () => {
            source.cancel();
        };

    }, []);


    // parâmetros de media query
    const xs = useMediaQuery({ maxWidth: 576 });
    const sm = useMediaQuery({ maxWidth: 768 });


    // função que carrega a rota do artigo baseado no item selecionado na árvore.
    function onNodeSelect(id) {
        history.push(`/categories/${id}/articles`, { from: props.location }); // direciona para o artigo selecionado, passando o id como params

        if (xs || sm) {
            dispatch(toggleMenu(false))
        }
    }


    //Função recursiva para montagem da árvore de componentes
    const loop = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeItem key={item.id} nodeId={String(item.id)} label={item.name} onClick={() => onNodeSelect(item.id)} >
                        {loop(item.children)}
                    </TreeItem>
                );
            }
            return <TreeItem nodeId={String(item.id)} label={item.name} onClick={() => onNodeSelect(item.id)} />
        });
    let treeNodes = loop(treeData);


    /* função que trata do input de pesquisa de itens na árvore,
       limitando caracteres especiais */
    function handleInputChange(event) {
        const { value } = event.target;

        const captureSpecialCharacter = /[^\w\s\][^,]/gi;
        const parserInput = value.replace(captureSpecialCharacter, '');

        setTreeFilter(parserInput);
    }


    // função que  converte para letras minúsculas e compara string.
    function compareFn(value1, value2) {
        return value1.toLowerCase() === value2.toLowerCase();
    }


    // função recursiva que percorre árvore adicionando item comparado ao array
    let filteredItems = [];
    const filterTreeNode = (data, value) =>
        data.forEach(item => {
            if (compareFn(item.props.label, value)) filteredItems.push(item);

            if (item.props.children) {
                filterTreeNode(item.props.children, value);
            }
        });
    filterTreeNode(treeNodes, treeFilter)
    

    return (
        <>
            {isMenuVisible &&

                <aside className="menu">
                    <div className="menu-filter">
                        <i>
                            <FaSearch />
                        </i>
                        <input className="filter-field" type="text"
                            placeholder="Digite para filtrar...."
                            onChange={handleInputChange}
                            //pattern="[a-zA-Z0-9]+"
                            value={treeFilter}
                        />
                    </div>

                    <TreeView
                        className={classes.root}
                        defaultCollapseIcon={<ExpandMore />}
                        defaultExpandIcon={<ChevronRight />}
                        ref={treeRef}

                    >
                        {filteredItems.length > 0 ? filteredItems : treeNodes}
                    </TreeView>

                </aside>

            }
        </>
    );
}

export default Menu;