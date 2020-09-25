import React, { useState, useEffect } from 'react';
import { FaHome, FaFolder, FaFile, FaUser } from 'react-icons/fa'

import PageTitle from '../template/PageTitle';
import Stat from './Stat';
import axios from 'axios';
import { baseApiUrl } from '../../global';

import './styles.css';

const Home = () => {

    const [stat, setStat] = useState({});


    // executa apenas uma vez no momento da montagem do componente
    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const mounted = () => {
            axios.get(`${baseApiUrl}/stats`, { cancelToken: source.token })
                .then(response => {
                    setStat(response.data);
                });
        }

        mounted();

        return () => {
            source.cancel();
        }

    }, []);


    return (
        <div className="home">
            <PageTitle icon={<FaHome />} main="Dashboard" sub="Base de Conhecimento" />
            <div className="stats">

                <Stat title="Categorias" value={stat.categories}
                    icon={<FaFolder color="#d54d50" />} />

                <Stat title="Artigos" value={stat.articles}
                    icon={<FaFile color="#3bc480" />} />

                <Stat title="Usuários" value={stat.users}
                    icon={<FaUser color="#3282cd" />} />

            </div>
        </div>
    );
}

export default Home;