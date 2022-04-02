import React, { useEffect } from 'react';

import './CompanyDiagrams.scss';

import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { GET_COMPANY_DIAGRAMS } from '../../services/graphQL/dashboardApiHelper';

import TreeList from '../tree-list/treeList';

function CompanyDiagrams(props) {


    const { data, error, refetch } = useQuery(GET_COMPANY_DIAGRAMS, { pollInterval: 10000 });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div className="company-diagrams">
            <h1 className="company-diagrams__header">Company Diagrams</h1>
            <hr />
            <TreeList company={true} treeList={data?.getPublicDiagrams} treeStatus="published" />
        </div>
    );
}

export default CompanyDiagrams;