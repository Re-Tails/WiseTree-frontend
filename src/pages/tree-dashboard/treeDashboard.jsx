import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { useHistory, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'; 
import { gql } from 'apollo-boost';

import './treeDashboard.scss';
import NavBar from '../../components/nav-bar/navbar';
import DashboardNavBar from '../../components/dashboard-nav-bar/dashboardNavbar.jsx';
import ErrorLayout from '../../components/error-layout/errorLayout.jsx';
import LoadingLayout from '../../components/loading-layout/loadingLayout.jsx';
import { useUser, useUserAuth } from '../../services/AuthenticationContextProvider.jsx';

import TreeList from '../tree-list/treeList.jsx';
import ModManagement from '../moderator-management/moderatorManagement';
import TeamManagement from '../team-management/teamManagement';
import UserManagement from '../user-management/userManagement';

import CompanyDiagrams from '../company-diagrams/CompanyDiagrams';
import TeamDiagrams from '../team-diagrams/TeamDiagrams';
import ViewTeams from '../view-teams/ViewTeams';

export default function TreeDashboard(props) {
    const history = useHistory()
    const match = useRouteMatch();

    const user = useUser();
    const userAuth = useUserAuth();
    
    useEffect(() => {
        if(!user) history.push("/login");
    }, [user]);

    const { data: queryData, error: queryError, refetch } = useQuery(
        gql`
            {
                getUser {
                    _id
                }
            }
        `,
        {
            pollInterval: 10000,
        }
    );

    if(queryError){
        userAuth.isUserAuth();
    }

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (queryError) {
        return (
            <div className="tree-dashboard">
                <DashboardNavBar />
                <NavBar />
                <ErrorLayout />
            </div>
        );
    } else if (queryData) {
        return (
            <div className="tree-dashboard">
                <DashboardNavBar />

                <NavBar />
                <div className="tree-dashboard__content">
                    <Switch>
                        {/* <Route path={`${match.path}/published`}>
                            <TreeList treeStatus="published" treeList={queryData?.getUserDiagrams} />
                        </Route>
                        <Route path={`${match.path}/drafts`}>
                            <TreeList treeStatus="draft" treeList={queryData?.getUserDiagrams} />
                        </Route> */}

                        <Route path={`${match.path}/my-teams`}>
                            <ViewTeams />
                        </Route>

                        <Route path={`${match.path}/company-diagrams`}>
                            <CompanyDiagrams />
                        </Route>

                        <Route path={`${match.path}/team-published`}>
                            <TeamDiagrams treeStatus="published" />
                        </Route>

                        <Route path={`${match.path}/team-drafts`}>
                            <TeamDiagrams treeStatus="draft" />
                        </Route>

                        <Route path={`${match.path}/moderator/team-access`}>
                            <ModManagement />
                        </Route>

                        <Route path={`${match.path}/admin/team-management`}>
                            <TeamManagement />
                        </Route>

                        <Route path={`${match.path}/admin/user-management`}>
                            <UserManagement />
                        </Route>

                        <Route path={`${match.path}`}>
                            <Redirect to={`${match.path}/company-diagrams`} />
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }

    return (
        <div className="tree-dashboard">
            <DashboardNavBar />
            <NavBar />
            <LoadingLayout />;
        </div>
    );
}

TreeDashboard.propTypes = {
    treeStatus: PropTypes.string,
};
