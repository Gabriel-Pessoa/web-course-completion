import React from 'react';

import { FiCpu } from 'react-icons/fi';
import { Tabs, Tab } from 'react-bootstrap';

import PageTitle from '../template/PageTitle';
import ArticleAdmin from './ArticleAdmin';
import CategoryAdmin from './CategoryAdmin';
import UserAdmin from './UserAdmin';

import './styles.css';

const AdminPages = () => {

    return (
        <div className="admin-page">
            <PageTitle icon={<FiCpu />} main="Administração do Sistema"
                sub="Cadastros & Cia" />
            <div className="admin-pages-tabs">
                <Tabs defaultActiveKey="article" id="uncontrolled-tab">
                    <Tab eventKey="article" title="Artigos">
                        <ArticleAdmin />
                    </Tab>
                    <Tab eventKey="categories" title="Categorias">
                        <CategoryAdmin />
                    </Tab>
                    <Tab eventKey="users" title="Usuários">
                        <UserAdmin />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default AdminPages;